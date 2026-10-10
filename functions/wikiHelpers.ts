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

const HEADING = /^H[1-6]$/;

function headingOf(el: Element): Element | null {
    if (HEADING.test(el.tagName)) return el;
    if (el.classList.contains('mw-heading')) return el.querySelector('h1,h2,h3,h4,h5,h6');
    return null;
}

function renderBlock(el: Element): string {
    switch (el.tagName) {
        case 'UL':
        case 'OL':
            return formatList(el).join('\n');
        case 'P':
        case 'DL':
        case 'BLOCKQUOTE':
            return el.textContent?.trim() ?? '';
        case 'DIV':
            if (el.children.length === 0) return el.textContent?.trim() ?? '';
            return Array.from(el.children).map(renderBlock).filter(Boolean).join('\n');
        default:
            return '';
    }
}

export function readSection(heading: Element): string {
    const startHeading = headingOf(heading) ?? heading;
    const level = Number(startHeading.tagName.slice(1)) || 6;
    const anchor = startHeading.parentElement?.classList.contains('mw-heading')
        ? startHeading.parentElement
        : startHeading;

    const parts: string[] = [];
    let current = anchor.nextElementSibling;

    while (current) {
        const h = headingOf(current);
        if (h) {
            if (Number(h.tagName.slice(1)) <= level) break;
            const title = (h.querySelector('.mw-headline') ?? h).textContent?.trim();
            if (title) parts.push(`**${title}**`);
        } else if (!current.matches('.toc, .navbox, aside, table')) {
            const text = renderBlock(current);
            if (text) parts.push(text);
        }
        current = current.nextElementSibling;
    }

    return parts.join('\n\n').replaceAll(/\[[0-9]{1,3}\]/g, '');
}