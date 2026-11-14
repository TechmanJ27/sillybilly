import {
    ChatInputCommandInteraction,
    InteractionContextType,
    MessageFlags,
    SlashCommandBuilder,
    Collection,
} from "discord.js";
import {
    generateMarkovWeights,
    globalWeights,
    type MarkovEntry,
} from "../../functions/markov_index.js";
import { generateMarkovstr } from "../../functions/markov_engine.js";

const activeGenerations = new Set<string>();

export default {
    data: new SlashCommandBuilder()
        .setName("markovstr")
        .setDescription("Generate a Markov string based on a user's messages")
        .setContexts(InteractionContextType.Guild)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to train on")
                .setRequired(true),
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.inCachedGuild()) {
            await interaction.reply({
                content: "This command only works in servers that the bot is in.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        const member = interaction.options.getMember("user");
        if (!member) {
            await interaction.reply({
                content: "User not found in this server.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        const lockKey = `${interaction.guildId}:${member.id}`;
        if (activeGenerations.has(lockKey)) {
            await interaction.reply({
                content: "Already generating a Markov string for that user. Please wait a moment and try again.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        await interaction.reply({
            content: `Generating Markov string... User: <@${member.id}>`,
            allowedMentions: { parse: [] },
        });

        activeGenerations.add(lockKey);

        try {
            const guildEntry = globalWeights.ensure(
                interaction.guildId,
                () => new Collection<string, MarkovEntry>(),
            );

            const userEntry = guildEntry.get(member.id);
            const now = Math.floor(Date.now() / 1000);

            if (!userEntry || now - userEntry.dateTime > 86400) {
                await generateMarkovWeights(member);
            }

            const text = generateMarkovstr(interaction.guildId, member.id).slice(0, 2000);
            if (!text) {
                await interaction.followUp({
                    content: "I couldn't find any messages from that user to learn from.",
                });
                return;
            }

            await interaction.followUp({
                content: text,
                allowedMentions: { parse: [] },
            });
        } catch (err) {
            console.error(err);
            await interaction
                .followUp({
                    content: "Something went wrong",
                })
                .catch(() => {});
        } finally {
            activeGenerations.delete(lockKey);
        }
    },
};