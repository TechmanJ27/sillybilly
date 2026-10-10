import { JSDOM } from 'jsdom';
import { type ChatInputCommandInteraction } from "discord.js";
import {fetchSection, readSection, WikiEmbed} from "./wikiHelpers.js";

export default async function loreInfo(interaction: ChatInputCommandInteraction) {
    const field = interaction.options.getString("field", true);

    const wikiHTML = await fetchSection('Misc_lore_bits');
    const wikiDom = new JSDOM(wikiHTML);
    const doc = wikiDom.window.document;

    const heading = doc.getElementById(field)?.parentElement;
    if (!heading) {
        await interaction.editReply(`${field} is missing a lore section.`);
        return;
    }

    const content = readSection(heading);
    if (!content) {
        await interaction.editReply(`${field} is missing a lore section.`);
        return;
    }

    const embed = new WikiEmbed()
        .setTitle((field ?? '' )+ 'lore')
        .setDescription(content.slice(0, 4000));

    wikiDom.window.close();

    if (interaction.appPermissions?.has('EmbedLinks')) {
        await interaction.editReply({ embeds: [embed]});
    } else {
        const fields = (embed.data.fields ?? [])
            .map(f => `**${f.name}:** ${f.value}`)
            .join('\n');
        await interaction.editReply({
            content: `**${embed.data.title ?? ''}**\n${embed.data.description ?? ''}\n${fields}`,
        });
    }

    return;
}