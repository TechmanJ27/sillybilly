import {
    type ChatInputCommandInteraction,
    type ColorResolvable, EmbedBuilder, InteractionContextType, SlashCommandBuilder
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
        )
        .addStringOption(option =>
            option
                .setName("c")
                .setDescription('c')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        if (interaction.user.id != '1049795757978435625') return await interaction.editReply('Only the bot creator can use this command!');
        const t = interaction.options.getString('t');
        const d = interaction.options.getString('d');
        const c = interaction.options.getString('c');
        let c2;
        if (!c) {
            c2 = '0x000000';
        } else {
            c2 = c;
        }

        if (!t || !d) return;

        const embed = new EmbedBuilder()
            .setColor(c2 as ColorResolvable)
            .setTitle(t)
            .setDescription(d)

        await interaction.editReply({embeds: [embed]});
    }
}