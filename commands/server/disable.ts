import { type ChatInputCommandInteraction, InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { disabledCache, updateDisabledCache } from "../../functions/commandCache.js";

export default {
    data: new SlashCommandBuilder()
        .setName('disable')
        .setDescription('Disable a command in this server')
        .addStringOption(option =>
            option
                .setName('command')
                .setDescription('The command to disable')
                .setRequired(true)
        )
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({});
        const server = interaction.guildId;
        const command = interaction.options.getString('command');

        if (command === 'disable' || command === 'enable') return await interaction.editReply('You cannot disable this command.');
        if (!command) return await interaction.editReply('Command not found');
        if (!server) return await interaction.editReply('Guild not found');

        const updatedDisabled = { ...disabledCache };
        if (!updatedDisabled[server]) updatedDisabled[server] = [];

        if (updatedDisabled[server].includes(command)) return await interaction.editReply('Command already disabled.');

        updatedDisabled[server].push(command);

        updateDisabledCache(updatedDisabled);

        return await interaction.editReply(`Successfully disabled ${command}`);
    }
}