import {type ChatInputCommandInteraction, EmbedBuilder, InteractionContextType, SlashCommandBuilder} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("guide")
        .setDescription('Sillybilly response guide')
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const guide = new EmbedBuilder()
            .setTitle("For every command...")
            .setDescription('- One response is needed for when you target yourself,\n' +
                '- One is needed for when you target me,\n' +
                '- The rest are for when you use the command on someone~\n' +
                '- Format as follows:\n' +
                '  - Use `{user}` for the user who ran the command\n' +
                '  - Use `{target}` for the target of the command\n' +
                '  - You **can** use emoticons/emojis')
            .setColor('#4EBDED');

        await interaction.editReply({embeds: [guide]});
    }
}