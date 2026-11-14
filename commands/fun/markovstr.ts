import {ChatInputCommandInteraction, InteractionContextType, MessageFlags, SlashCommandBuilder, Collection} from "discord.js";
import { generateMarkovWeights, globalWeights, type MarkovEntry } from "../../functions/markov_index.js";
import { generateMarkovstr } from "../../functions/markov_engine.js";

export default {
    data: new SlashCommandBuilder()
        .setName("markovstr")
        .setDescription("Generate a Markov string based on a users messages")
        .setContexts(InteractionContextType.Guild)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to train on")
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.inCachedGuild()) {
            await interaction.reply({
                content: "This command only works in servers that the bot is in.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        try {
            const member = interaction.options.getMember("user");
            if (!member) {
                await interaction.reply({
                    content: "User not found in this server.",
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }

            await interaction.reply({
                content: `Generating Markov string... User: <@${member.id}>`,
                allowedMentions: { parse: [] },
            });

            let guildEntry = globalWeights.get(interaction.guildId);
            if (!guildEntry) {
                globalWeights.set(interaction.guildId, new Collection<string, MarkovEntry>());
                guildEntry = globalWeights.get(interaction.guildId);
            }

            const userEntry = guildEntry?.get(member.id);
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

            await interaction.followUp({ content: text, allowedMentions: { parse: [] } });
        } catch (err: any) {
            console.log(err);
            await interaction.followUp({
                content: "Something went wrong",
            }).catch(() => {});
        }
    },
};
