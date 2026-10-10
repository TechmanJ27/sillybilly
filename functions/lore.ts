import { JSDOM } from 'jsdom';
import { type ChatInputCommandInteraction } from "discord.js";
import {fetchSection, formatList, WikiEmbed} from "./wikiHelpers.js";

export default async function loreInfo(interaction: ChatInputCommandInteraction) {
    const character = interaction.options.getString("character", true);

    const wikiHTML = await fetchSection('Misc_lore_bits');
    const wikiDom = new JSDOM(wikiHTML);
    const doc = wikiDom.window.document;

    let wikiElement: Element | null = null;

    let content: string | undefined;

    const span = doc.getElementById(character);
    if (!span) {
        await interaction.editReply(`${character} is missing a lore section.`);
        return;
    }

    wikiElement = span.parentElement?.nextElementSibling ?? null;
    if (!wikiElement) {
        await interaction.editReply(`${character} is missing a lore section.`);
        return;
    }

    content = formatList(wikiElement).join('\n');


    if (!content) {
        await interaction.editReply(`${character} is missing a lore section.`);
        return;
    }

    const embed = new WikiEmbed()
        .setTitle(character ?? '' + 'Miscellaneous lore')
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