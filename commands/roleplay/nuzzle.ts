import {SlashCommandBuilder, InteractionContextType, type ChatInputCommandInteraction} from "discord.js";
import {messages} from "../../functions/messages.js";

export default {
    data: new SlashCommandBuilder()
        .setName("nuzzle")
        .setDescription("Nuzzle somebody")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("They better be a femboy")
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const target = interaction.options.getUser("user");
        if (target === null) return;
        await messages('nuzzle', interaction, target, interaction.user);
    }
}