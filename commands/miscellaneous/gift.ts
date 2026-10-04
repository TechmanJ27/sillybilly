import {SlashCommandBuilder, InteractionContextType, type ChatInputCommandInteraction, EmbedBuilder} from "discord.js";
import color from "../../functions/colors.js";

export default {
    data: new SlashCommandBuilder()
        .setName("give")
        .setDescription("Give a user something special")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
        .addUserOption(option =>
            option
                .setName("recipient")
                .setDescription("Who are you giving the gift to?")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("What are you giving away?")
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const target = interaction.options.getUser("recipient");
        const item = interaction.options.getString("item");
        if (target === null || item === null) return await interaction.editReply(`Target (${target}) and/or Item (${item}) are null`);
        const giveEmbed = new EmbedBuilder()
            .setTitle(`${interaction.user.displayName}'s gift!`)
            .setDescription(`${interaction.user} gives ${target} ${item}`)
            .setColor(color())
        await interaction.editReply({embeds: [giveEmbed]});
    }
}