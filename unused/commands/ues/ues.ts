import {
    type ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import characterInfo from "../../functions/character.js";
import { ues } from "../../functions/wikiHelpers.js";
import zeeInfo from "../../functions/zee.js";
import loreInfo from "../../functions/lore.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ues")
        .setDescription('UES Discord server commands')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('character')
                .setDescription('Get info on a specific character from UES')
                .addStringOption((option) =>
                    option
                        .setName('character')
                        .setDescription('The character to look up')
                        .addChoices(
                            {name: "Eevee", value: "Eevee"},
                            {name: "Vaporeon", value: "Vaporeon"},
                            {name: "Jolteon", value: "Jolteon"},
                            {name: "Flareon", value: "Flareon"},
                            {name: "Espeon", value: "Espeon"},
                            {name: "Umbreon", value: "Umbreon"},
                            {name: "Leafeon", value: "Leafeon"},
                            {name: "Glaceon", value: "Glaceon"},
                            {name: "Sylveon", value: "Sylveon"}
                        )
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('field')
                        .setDescription('The info field to fetch from')
                        .addChoices(
                            {name: "Age", value: "Age"},
                            {name: "Appearance", value: "Appearance"},
                            {name: "Debut", value: "Debut"},
                            {name: "Gender", value: "Gender"},
                            {name: "Relationships", value: "Relationships"},
                            {name: "Trivia", value: "Trivia"},
                            {name: "Image", value: "Image"},
                            {name: "Personality", value: "Personality"},
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("zee")
                .setDescription("Zee  info,,, I think")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('lore')
                .setDescription("Bonus lore")
                .addStringOption((option) =>
                    option
                        .setName('field')
                        .setDescription('The field to look up')
                        .addChoices(
                            {name: "Eevee", value: "Eevee"},
                            {name: "Vaporeon", value: "Vaporeon"},
                            {name: "Jolteon", value: "Jolteon"},
                            {name: "Flareon", value: "Flareon"},
                            {name: "Espeon", value: "Espeon"},
                            {name: "Umbreon", value: "Umbreon"},
                            {name: "Leafeon", value: "Leafeon"},
                            {name: "Glaceon", value: "Glaceon"},
                            {name: "Sylveon", value: "Sylveon"},
                            {name: "World", value: "World"}
                        )
                        .setRequired(true)
                )
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()

        if (interaction.guildId !== ues.guildId) return interaction.editReply('This command can only be run in the UES server.')

        switch (interaction.options.getSubcommand()) {
            case 'character':
                await characterInfo(interaction);
                break;
            case 'zee':
                await zeeInfo(interaction);
                break;
            case 'lore':
                await loreInfo(interaction);
                break;
        }
    }
}