import {SlashCommandBuilder, InteractionContextType, type ChatInputCommandInteraction} from "discord.js";
import {messages} from "../../functions/messages.js";

export default {
    data: new SlashCommandBuilder()
        .setName("explode")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
        .setDescription("Make something or someone blow up")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Oh no")
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const target = interaction.options.getUser("user");
        if (target === null) return;
        await messages('explode', interaction, target, interaction.user);
    }
}