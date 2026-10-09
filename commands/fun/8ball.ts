import {type ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder} from "discord.js";
import { pickRandom } from '../../functions/messages.js';

export default {
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription('Send the magical all-seeing orb a strange query')
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
        .addStringOption(option =>
            option
                .setName("question")
                .setDescription('What a thoughtful question! ^^')
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const answers = ['Yes', 'No', 'Perhaps', 'Unclear', 'Come back later :3', 'Maybe~', 'No shot'];
        await interaction.reply(`🎱 ${pickRandom(answers)}`)
    }
}