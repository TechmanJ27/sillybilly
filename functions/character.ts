import { JSDOM } from 'jsdom';
import { type ChatInputCommandInteraction } from "discord.js";
import { fetchSection, readSection, WikiEmbed } from "./wikiHelpers.js";

const INFOBOX_FIELDS = ['Age', 'Debut', 'Gender', 'Relationships'];

export default async function characterInfo(interaction: ChatInputCommandInteraction) {
    const character = interaction.options.getString("character", true);
    const field = interaction.options.getString("field", true);

    const wikiHTML = await fetchSection(character);
    const wikiDom = new JSDOM(wikiHTML);
    const doc = wikiDom.window.document;

    try {
        let content: string | undefined;
        let url: string | null = null;

        const imageElement = doc.querySelector('[data-source="image"] a');
        if (imageElement) {
            url = imageElement.getAttribute("href");
        }

        if (INFOBOX_FIELDS.includes(field)) {
            const dataSourceKey = field.toLowerCase();
            const wikiElement = doc.querySelector(`[data-source='${dataSourceKey}'] .pi-data-value`);

            if (!wikiElement) {
                await interaction.editReply(`${character} is missing the ${field} section.`);
                return;
            }

            const elementList = wikiElement.querySelectorAll('li');
            if (elementList.length > 0) {
                const listArray = Array.from(elementList);
                const mappedList = listArray.map((item) => `- ${item.textContent?.trim() ?? ''}`);
                content = mappedList.join('\n');
            } else {
                content = wikiElement?.textContent?.trim();
            }
        } else if (field === 'Image') {
            if (!url) {
                await interaction.editReply(`No image was found for ${character}.`);
                return;
            }
            content = 'image';
        } else {
            const span = doc.getElementById(field);
            const heading = span?.parentElement;

            if (!heading) {
                await interaction.editReply(`${character} is missing the ${field} section.`);
                return;
            }

            content = readSection(heading);
        }

        if (!content) {
            await interaction.editReply(`${character} is missing the ${field} information.`);
            return;
        }

        const embed = new WikiEmbed()
            .header(character, field);

        if (url) {
            if (field === 'Image') {
                embed.setImage(url);
            } else {
                embed.setThumbnail(url);
            }
        }

        if (field !== 'Image') {
            embed.setDescription(content.slice(0, 4000));
        }

        if (interaction.appPermissions?.has('EmbedLinks')) {
            await interaction.editReply({ embeds: [embed] });
        } else {
            const fields = (embed.data.fields ?? [])
                .map(f => `**${f.name}:** ${f.value}`)
                .join('\n');
            await interaction.editReply({
                content: `**${embed.data.title ?? ''}**\n${embed.data.description ?? ''}\n${fields}`,
            });
        }
    } finally {
        wikiDom.window.close();
    }
}