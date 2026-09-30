import {SlashCommandBuilder, InteractionContextType, type ChatInputCommandInteraction, EmbedBuilder} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("drop")
        .setDescription("Drop something from your pockets")
        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("What are you giving away?")
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const item = interaction.options.getString("item");
        const dropEmbed = new EmbedBuilder()
            .setTitle(`${interaction.user.displayName} dropped something!`)
            .setDescription(`${interaction.user} dropped ${item}`)
        await interaction.editReply({embeds: [dropEmbed]});
    }
}