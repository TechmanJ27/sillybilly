import {SlashCommandBuilder, InteractionContextType, type ChatInputCommandInteraction} from "discord.js";
import {messages} from "../../functions/messages.js";

export default {
    data: new SlashCommandBuilder()
        .setName("basement")
        .setDescription("It's dark down here")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Good luck")
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const target = interaction.options.getUser("user");
        if (target === null) return;
        await messages('basement', interaction, target, interaction.user);
    }
}