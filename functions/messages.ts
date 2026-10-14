import type { User, ChatInputCommandInteraction } from "discord.js";
import { responses } from "./responses.js";

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

    return await interaction.editReply(format(raw, user, target));
}