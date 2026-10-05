import {type ChatInputCommandInteraction, InteractionContextType, MessageFlags, SlashCommandBuilder} from "discord.js";
import { pickRandom } from '../../functions/messages.js';

export default {
    data: new SlashCommandBuilder()
        .setName("fruit")
        .setDescription('Fruit somebody')
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
        .addStringOption(option =>
            option
                .setName("fruit")
                .setDescription('The fruit to fruit somebody with')
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const fruit = interaction.options.getString("fruit")?.toLowerCase();
        if (!fruit) return;
        const fruits = ['avocado', 'lemon', 'tomato'];
        const fruitEmojis = ['🥑', '🍋', '🍅'];
        if (!fruits.includes(fruit)) return interaction.reply({content: `${fruit} is not a valid fruit`, flags: MessageFlags.Ephemeral});
        const answers = [`${interaction.user} casts ${fruit}!`];
        await interaction.reply(pickRandom(answers));
        await interaction.followUp(fruitEmojis[fruits.indexOf(fruit)]!);
    }
}