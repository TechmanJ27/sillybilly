import {
    type ChatInputCommandInteraction,
    EmbedBuilder, InteractionContextType, SlashCommandBuilder
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("e")
        .setDescription('e')
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
        .addStringOption(option =>
            option
                .setName("t")
                .setDescription('t')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("d")
                .setDescription('d')
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        if (interaction.user.id !== '1049795757978435625') return await interaction.editReply('Only the bot creator can use this command!');
        const t = interaction.options.getString('t');
        const d = interaction.options.getString('d');

        if (!t || !d) return;

        const embed = new EmbedBuilder()
            .setColor('#4EBDED')
            .setTitle(t)
            .setDescription(d);

        await interaction.editReply({embeds: [embed]});
    }
}