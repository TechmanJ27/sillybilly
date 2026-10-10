import {EmbedBuilder} from "discord.js";

export const ues = {
    guildId: '1508235768735207584',
    ownerId: '1209252634754809879',
    modIds: ['1352492429865128039', '1097035791412236328', '1065167792678121472', '616789075646480384', '1475552096865751202'],
}

export async function fetchSection(page: string) {
    const response = await fetch(`https://ues.fandom.com/api.php?action=parse&page=${page}&format=json&formatversion=2`);
    if (!response.ok) return null;

    const wikiJSON = await response.json();
    if (!wikiJSON.parse) return null;

    return wikiJSON.parse.text;
}

export class WikiEmbed extends EmbedBuilder {
    constructor() {
        super();
        return this.setColor('#4EBDED');
    }
    header(page: string, selector: string) {
        return this.setTitle(page + "'s " + selector);
    }
}

export function formatList(list: Element, depth = 0): string[] {
    const lines: string[] = [];

    for (const li of Array.from(list.children)) {
        if (li.tagName !== 'LI') continue;

        let text = '';
        const nestedLists: Element[] = [];

        for (const node of Array.from(li.childNodes)) {
            if (node.nodeType === 1 && (node as Element).tagName === 'UL') {
                nestedLists.push(node as Element);
            } else {
                text += node.textContent ?? '';
            }
        }

        text = text.trim().replace(/\s+/g, ' ');
        if (text) lines.push('  '.repeat(depth) + '- ' + text);

        for (const nested of nestedLists) {
            lines.push(...formatList(nested, depth + 1));
        }
    }

    return lines;
}

export function readSection(heading: Element): string {
    const level = Number(heading.tagName.slice(1));
    const parts: string[] = [];
    let current = heading.nextElementSibling;

    while (current) {
        const tag = current.tagName;

        if (/^H[1-6]$/.test(tag) && Number(tag.slice(1)) <= level) break;
        if (tag === 'TABLE') break;

        if (/^H[1-6]$/.test(tag)) {
            const title = current.querySelector('.mw-headline')?.textContent?.trim();
            if (title) parts.push(`**${title}**`);
        } else if (tag === 'UL') {
            parts.push(formatList(current).join('\n'));
        } else if (tag === 'P') {
            const text = current.textContent?.trim();
            if (text) parts.push(text);
        }

        current = current.nextElementSibling;
    }

    return parts.join('\n\n').replaceAll(/^\[*]$/, '');
}