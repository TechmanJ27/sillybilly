import {SlashCommandBuilder, InteractionContextType, type ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("drop")
        .setDescription("Drop something from your pockets")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("What are you giving away?")
                .setRequired(true)
        ),

    execute: async function (interaction: ChatInputCommandInteraction) {
        const message = await interaction.deferReply();
        const item = interaction.options.getString("item");
        const dropEmbed = new EmbedBuilder()
            .setTitle(`${interaction.user.displayName} dropped something!`)
            .setDescription(`${interaction.user} dropped ${item}`);
        const grabButton = new ButtonBuilder()
            .setCustomId(`${interaction.user.id}-${message.id}`)
            .setLabel(`Grab`)
            .setStyle(ButtonStyle.Primary)
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(grabButton);
        await interaction.editReply({embeds: [dropEmbed], components: [row]});
    }
}