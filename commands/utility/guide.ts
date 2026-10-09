import {type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("guide")
        .setDescription('Sillybilly response guide'),

    async execute(interaction: ChatInputCommandInteraction) {
        const guide = new EmbedBuilder()
            .setTitle("For every command...")
            .setDescription('- One response is needed for when you target yourself\n' +
                '- One is needed for when you target the bot\n' +
                '- The rest are for when you use the command on someone\n' +
                '- Format as follows:\n' +
                '  - Use `{user}` for the user who ran the command\n' +
                '  - Use `{target}` for the target of the command\n' +
                '  - You **can** use emoticons/emojis')
            .setColor('#4EBDED');

        await interaction.reply({embeds: [guide]});
    }
}