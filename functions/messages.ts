import type { User, ChatInputCommandInteraction } from "discord.js";
import { responses } from "./responses.js";

export function pickRandom (arr: string[]): string {
    const index: number = Math.floor(Math.random() * arr.length);
    if (arr[index] === undefined) {
        throw new Error(`Index ${index} is out of bounds for array of length ${arr.length}`);
    }
    return arr[index];
}

function format(str: string, user: User, star: User) {
    return str.replace(/{user}/g, user.toString()).replace(/{star}/g, star.toString());
}

export async function messages(command: string, interaction: ChatInputCommandInteraction, star: User, user: User) {
    const entry = responses[command];
    if (!entry) {
        return await interaction.editReply(`Unknown command: ${command}`);
    }

    let raw = pickRandom(entry.options);

    return await interaction.editReply(format(raw, user, star));
}
