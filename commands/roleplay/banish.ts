import {SlashCommandBuilder, InteractionContextType, type ChatInputCommandInteraction} from "discord.js";
import {messages} from "../../functions/messages.js" ;

export default {
    data: new SlashCommandBuilder()
        .setName("banish")
        .setDescription("To the shadow realm you go")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("They've been naughty")
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const target = interaction.options.getUser("user");
        if (target === null) return;
        await messages('banish', interaction, target, interaction.user);
    }
}