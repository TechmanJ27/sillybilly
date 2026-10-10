import {type ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder} from "discord.js";
import {chars, getRandomInt, insertRandomChars, pickRandom} from "../../functions/messages.js";

export default {
    data: new SlashCommandBuilder()
        .setName("s")
        .setDescription('s')
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
        .addStringOption(option =>
            option
                .setName("c")
                .setDescription('c')
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        if (interaction.user.id !== '1049795757978435625') return interaction.editReply('Only the bot creator can use this command!');
        let s = interaction.options.getString('c');
        if (!s) return;
        if (Math.random() < 0.05) {
            if (Math.random() < 0.5) {
                s = s.replace('f', 'F');
                s = s.replace('m', 'M');
                s = s.replace('A', '4');
                s = s.replace('S', '5');
                s = s.replace('o', '0');
                s = s.replace('O', '0');
                s = s.replace('o', '0');
                s = s.replace('O', '0');
                s = s.replace('l', '1');
                s = s.replace('L', '1');
                s = s.replace('B', '8');
            } else {
                s = insertRandomChars(s, getRandomInt(1, 10), pickRandom(chars));
            }
            if (Math.random() > 0.5) {
                s = '**Y0u th0ught y0u cou1d 3sCaPe *M3*?**'
            }
        }
        await interaction.editReply(s);
    }
}