import {messages} from "../../functions/messages.js";
import {SlashCommandBuilder, InteractionContextType, type ChatInputCommandInteraction} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("arson")
        .setDescription("Burn stuff")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Partner in crime")
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const target = interaction.options.getUser("user");
        if (target === null) return;
        await messages('arson', interaction, target, interaction.user);
    }
}