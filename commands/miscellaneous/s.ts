import {type ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("s")
        .setDescription('s')
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
        .addStringOption(option =>
            option
                .setName("c")
                .setDescription('c')
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        if (interaction.user.id != '1049795757978435625') return interaction.editReply('Only the bot creator can use this command!');
        const s = interaction.options.getString('c');
        if (!s) return;
        await interaction.editReply(s);
    }
}