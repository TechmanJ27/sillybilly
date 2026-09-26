import {SlashCommandBuilder, InteractionContextType, type ChatInputCommandInteraction} from "discord.js";
import {messages} from "../../functions/messages.js";

export default {
    data: new SlashCommandBuilder()
        .setName("scream")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
        .setDescription("I have no mouth...")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("...and I must scream")
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const target = interaction.options.getUser("user");
        if (target === null) return;
        await messages('scream', interaction, target, interaction.user);
    }
}