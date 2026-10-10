import type { User, ChatInputCommandInteraction } from "discord.js";
import { responses } from "./responses.js";

const PLACEHOLDERS = /({user}|{target})/;
const nums = '1234567890';
const upperCase = 'QWERTYUIOPASDFGHJKLZXCVBNM';
const lowerCase = 'qwertyuiopasdfghjklzxcvbnm';
const symbols = '~!@#$%^&*?_';

export const chars = [nums, upperCase, lowerCase, symbols, nums, symbols];

const LEET: Record<string, string> = {
    A: "4",
    S: "5",
    o: "0",
    O: "0",
    l: "1",
    L: "1",
    B: "8",
};

export function pickRandom<T>(arr: T[]): T {
    const index: number = Math.floor(Math.random() * arr.length);
    if (arr[index] === undefined) {
        throw new Error(`Index ${index} is out of bounds for array of length ${arr.length}`);
    }
    return arr[index];
}

export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function format(str: string, user: User, target: User) {
    return str.replace(/{user}/g, user.toString()).replace(/{target}/g, target.toString());
}

function leetspeak(text: string): string {
    return text
        .split(PLACEHOLDERS)
        .map((seg, i) =>
            i % 2 === 0
                ? seg
                    .replace(/[ASoOlLB]/g, (c) => LEET[c]!)
                    .replace(/f/g, "F")
                    .replace(/m/g, "M")
                : seg
        )
        .join("");
}

export async function messages(
    command: string,
    interaction: ChatInputCommandInteraction,
    target: User,
    user: User,
) {
    const entry = responses[command];
    if (!entry) {
        return await interaction.editReply(`Unknown command: ${command}`);
    }

    let raw: string;
    if (user.id === target.id) {
        raw = entry.self || pickRandom(entry.options);
    } else if (target.id === interaction.client.user.id) {
        raw = entry.bot || pickRandom(entry.options);
    } else {
        raw = pickRandom(entry.options);
    }

    if (Math.random() < 0.025) {
        if (Math.random() < 0.5) {
            raw = leetspeak(raw);
        } else {
            raw = insertRandomChars(raw, getRandomInt(1, 10), pickRandom(chars));
        }
        if (Math.random() > 0.5) {
            raw = '**Y0u th0ught y0u cou1d 3sCaPe *M3*?**';
        }
    }

    return await interaction.editReply(format(raw, user, target));
}

export function insertRandomChars(
    text: string,
    count = 1,
    chars: string = '1234567890',
): string {
    const segments = text.split(PLACEHOLDERS);

    for (let n = 0; n < count; n++) {
        const weights = segments.map((seg, i) => (i % 2 === 0 ? seg.length + 1 : 0));
        const total = weights.reduce((sum, w) => sum + w, 0);

        let pick = Math.floor(Math.random() * total);

        for (let i = 0; i < segments.length; i++) {
            if (pick < weights[i]!) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                segments[i] = segments[i]!.slice(0, pick) + char + segments[i]!.slice(pick);
                break;
            }
            pick -= weights[i]!;
        }
    }

    return segments.join('');
}