import {ActionRowBuilder, ButtonBuilder, type ChatInputCommandInteraction, EmbedBuilder, ButtonStyle} from "discord.js";
import getChannelMetrics from "./youtube.js";

export default async function zeeInfo(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder().setColor('#4EBDED');
        const metrics = await getChannelMetrics({handle: '@ChaoZBusterZ'});
        embed
            .setTitle('Zee (@ChaoZBusterZ)')
            .setDescription(metrics?.[1] || null)
            .setThumbnail(metrics?.[2] || null)
            .addFields(
                {name: 'Subscribers', value: `${metrics?.[3] || null}`},
                {name: 'Views', value: `${metrics?.[4] || null}`},
                {name: 'Videos', value: `${metrics?.[5] || null}`}
            )
    const youtubeButton = new ButtonBuilder()
        .setURL(`https://www.youtube.com/@ChaoZBusterZ`)
        .setLabel('Channel')
        .setStyle(ButtonStyle.Link);
    const row= new ActionRowBuilder<ButtonBuilder>().addComponents(youtubeButton);
    await interaction.editReply({embeds: [embed], components: [row]});
    return;
}