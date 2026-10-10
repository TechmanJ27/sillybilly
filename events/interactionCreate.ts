import { Events, MessageFlags, Collection, type Interaction } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);
            await command?.autocomplete?.(interaction);
            return;
        }

        if (!interaction.isChatInputCommand()) return;
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(
                interaction.commandName,
            );

            if (!command) {
                console.error(
                    `No command matching ${interaction.commandName} was found.`,
                );
                return;
            }

            const disabledPath = path.join(__dirname, '..', 'data', 'disabled.json');
            const disabled = JSON.parse(fs.readFileSync(disabledPath, 'utf8'));
            if (interaction.guildId !== null) {
                if ((disabled[interaction.guildId] ?? []).includes(command.data.name)) return await interaction.reply({content: 'This command has been disabled in this guild'});
            }

            const { cooldowns } = interaction.client;

            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldownDuration = 0;
            const cooldownAmount =
                (command.cooldown ?? defaultCooldownDuration) * 1_000;

            if (timestamps!.has(interaction.user.id)) {
                const expirationTime =
                    timestamps!.get(interaction.user.id)! + cooldownAmount;

                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1_000);
                    return interaction.reply({
                        content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
                        flags: MessageFlags.Ephemeral,
                    });
                }
            }

            timestamps!.set(interaction.user.id, now);
            setTimeout(
                () => timestamps!.delete(interaction.user.id),
                cooldownAmount,
            );

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: "There was an error while executing this command!",
                        flags: MessageFlags.Ephemeral,
                    });
                } else {
                    await interaction.reply({
                        content: "There was an error while executing this command!",
                        flags: MessageFlags.Ephemeral,
                    });
                }
            }
        }
    },
};
