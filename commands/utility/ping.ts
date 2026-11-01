import { type ChatInputCommandInteraction, SlashCommandBuilder, InteractionContextType } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Test the bot's ping")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel),

    async execute(interaction: ChatInputCommandInteraction) {
        const startTime = Date.now();

        await interaction.reply('Testing Ping...',);

        const latency = Date.now() - startTime;
        const rawApiPing = interaction.client.ws.ping;
        const apiLatency = rawApiPing < 0 ? "Calculating..." : `${Math.round(rawApiPing)}ms`;

        await interaction.followUp(`Pong!\nLatency: ${latency}ms\nAPI Latency: ${apiLatency}`);
    }
}