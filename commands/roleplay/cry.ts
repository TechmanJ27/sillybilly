import {SlashCommandBuilder, InteractionContextType, type ChatInputCommandInteraction} from "discord.js";
import {messages} from "../../functions/messages.js";

export default {
    data: new SlashCommandBuilder()
        .setName("cry")
        .setDescription("Why so sad?")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const bot = await interaction.client.users.fetch("155149108183695360");
        await messages('cry', interaction, bot, interaction.user);
    }
}