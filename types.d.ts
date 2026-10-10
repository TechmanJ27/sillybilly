import type {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Collection,
    SlashCommandBuilder,
} from "discord.js";

declare module 'j27-lib';

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, {
            data: Pick<SlashCommandBuilder, 'name' | 'description' | 'toJSON'>;
            execute: (interaction: ChatInputCommandInteraction) => Promise<unknown>;
            autocomplete?: (interaction: AutocompleteInteraction) => Promise<unknown>;
            cooldown?: number;
        }>;
        cooldowns: Collection<string, Collection<string, number>>;
    }
}