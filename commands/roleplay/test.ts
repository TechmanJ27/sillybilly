import {messages} from "../../functions/messages.js";
import {SlashCommandBuilder, InteractionContextType, type ChatInputCommandInteraction} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test star")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const user = await interaction.client.users.fetch('1098753730263912528');
        if (user === null) return;
        await messages('test', interaction, user, interaction.user);
    }
}