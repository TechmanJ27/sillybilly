import { Events, MessageFlags, Collection, type Interaction } from "discord.js";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const disabledPath = path.join(__dirname, "..", "data", "disabled.json");

type DisabledMap = Record<string, string[]>;

let disabledCache: DisabledMap = {};
let disabledMtimeMs = -1;

async function loadDisabled(): Promise<DisabledMap> {
    let mtimeMs: number;
    try {
        ({ mtimeMs } = await fs.stat(disabledPath));
    } catch (error: any) {
        if (error?.code !== "ENOENT") {
            console.error("Failed to stat disabled commands file:", error);
        }
        disabledCache = {};
        disabledMtimeMs = -1;
        return disabledCache;
    }

    if (mtimeMs === disabledMtimeMs) return disabledCache;

    disabledMtimeMs = mtimeMs;
    try {
        const parsed = JSON.parse(await fs.readFile(disabledPath, "utf8"));
        disabledCache = parsed !== null && typeof parsed === "object" ? parsed : {};
    } catch (error) {
        console.error("Failed to read disabled commands file:", error);
    }
    return disabledCache;
}

async function isCommandDisabled(guildId: string | null, commandName: string): Promise<boolean> {
    if (guildId === null) return false;
    const list = (await loadDisabled())[guildId];
    return Array.isArray(list) && list.includes(commandName);
}

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {

        if (interaction.isAutocomplete()) {
            try {
                const command = interaction.client.commands.get(interaction.commandName);

                if (await isCommandDisabled(interaction.guildId, interaction.commandName)) {
                    await interaction.respond([]);
                    return;
                }

                await command?.autocomplete?.(interaction);
            } catch (error) {
                console.error(`Autocomplete failed for ${interaction.commandName}:`, error);
            }
            return;
        }

        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        if (await isCommandDisabled(interaction.guildId, command.data.name)) {
            return await interaction.reply({
                content: "This command has been disabled in this guild",
                flags: MessageFlags.Ephemeral,
            });
        }

        const { cooldowns } = interaction.client;
        const cooldownAmount = (command.cooldown ?? 0) * 1_000;
        const userId = interaction.user.id;
        const now = Date.now();
        let timestamps: Collection<string, number> | undefined;

        if (cooldownAmount > 0) {
            timestamps = cooldowns.get(command.data.name);
            if (!timestamps) {
                timestamps = new Collection<string, number>();
                cooldowns.set(command.data.name, timestamps);
            }

            const lastUsed = timestamps.get(userId);
            if (lastUsed !== undefined) {
                const expirationTime = lastUsed + cooldownAmount;

                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1_000);
                    return interaction.reply({
                        content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
                        flags: MessageFlags.Ephemeral,
                    });
                }
            }

            const activeTimestamps = timestamps;
            activeTimestamps.set(userId, now);
            setTimeout(() => {
                if (activeTimestamps.get(userId) === now) activeTimestamps.delete(userId);
            }, cooldownAmount);
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing command ${interaction.commandName}:`, error);

            if (timestamps?.get(userId) === now) timestamps.delete(userId);

            const errorPayload = {
                content: "There was an error while executing this command!",
                flags: MessageFlags.Ephemeral,
            } as const;

            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorPayload);
                } else {
                    await interaction.reply(errorPayload);
                }
            } catch (apiError: any) {
                console.error("Failed to send error message back to Discord channel:", apiError.message);
            }
        }
    },
};