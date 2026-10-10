import {type ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("cat-art")
        .setDescription('Send a cat')
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('_  _╱|、\n' +
            '(˚ˎ 。7  \n' +
            ' |、˜〵          \n' +
            'じしˍ,)ノ');
    }
}