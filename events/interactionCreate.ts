import { Events, MessageFlags, Collection, type Interaction } from "discord.js";
import { disabledCache } from "../functions/commandCache.js";

function isCommandDisabledSync(guildId: string | null, commandName: string): boolean {
    if (!guildId) return false;
    const list = disabledCache[guildId];
    return Array.isArray(list) && list.includes(commandName);
}

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {

        if (interaction.isAutocomplete()) {
            try {
                const command = interaction.client.commands.get(interaction.commandName);
                if (isCommandDisabledSync(interaction.guildId, interaction.commandName)) {
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

        if (isCommandDisabledSync(interaction.guildId, command.data.name)) {
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

            if (error instanceof Error && error.message.includes("Unknown interaction")) {
                console.warn("Could not alert user: The Discord interaction context has already expired.");
                return;
            }

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