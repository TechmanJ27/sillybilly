import {type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("about")
        .setDescription('Who am I?'),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const about = new EmbedBuilder()
            .setTitle("About Me")
            .setDescription('Hey~\nI\'m Sillybilly, a fun roleplay/action bot developed solely by MikuBerry (@techmanj27)\n' +
                'Originally created for users in the UES server and inspired by Goober Bot, people all across the platform have begun using me!\n' +
                'In addition to rp commands, I also have some fun and useful features :3')
            .setColor('#4EBDED');

        await interaction.editReply({embeds: [about]});
    }
}