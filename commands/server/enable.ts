import { type ChatInputCommandInteraction, InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { disabledCache, updateDisabledCache } from "../../functions/commandCache.js";

export default {
    data: new SlashCommandBuilder()
        .setName('enable')
        .setDescription('Enable a command in this server')
        .addStringOption(option =>
            option
                .setName('command')
                .setDescription('The command to enable')
                .setRequired(true)
        )
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({});
        const server = interaction.guildId;
        const command = interaction.options.getString('command');

        if (!command) return await interaction.editReply('Command not found');
        if (!server) return await interaction.editReply('Guild not found');

        const updatedDisabled = { ...disabledCache };
        if (!updatedDisabled[server]) updatedDisabled[server] = [];

        if (updatedDisabled[server].includes(command)) {
            updatedDisabled[server] = updatedDisabled[server].filter((cmd: string) => cmd !== command);

            updateDisabledCache(updatedDisabled);

            return await interaction.editReply(`Successfully enabled ${command}`);
        } else {
            return interaction.editReply('Command is not disabled.');
        }
    }
}