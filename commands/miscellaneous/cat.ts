import {type ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("cat")
        .setDescription('Send a cat'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('_  _╱|、\n' +
            '(˚ˎ 。7  \n' +
            ' |、˜〵          \n' +
            'じしˍ,)ノ')
    }
}