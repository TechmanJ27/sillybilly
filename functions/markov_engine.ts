import { markovWeights } from "./markov_index.js";

function pickRandom<T>(items: T[]): T | undefined {
    if (items.length === 0) return undefined;
    return items[Math.floor(Math.random() * items.length)];
}

export function generateMarkovstr(guildId: string, userId: string): string {
    const weights = markovWeights.get(guildId)?.get(userId)?.weights;
    if (!weights) return '';

    const words: string[] = [];
    let current = '<START>';

    for (let i = 0; i < 2; i++) {
        while (words.length < 50) {
            const next = pickRandom(weights.get(current) ?? []);
            if (!next || next === '<END>') break;

            words.push(next);
            current = next;
        }

        current = '<START>';
        if (words.length >= 50) break;
    }

    return words.join(' ');
}