import { type ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { generateMarkovWeights } from "../../functions/markov_index.js";

export default {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("User utilities and management commands")
        .addSubcommandGroup(subcommandGroup => subcommandGroup
            .setName("markov")
            .setDescription("Markov chain related dev commands")
            .addSubcommand(subcommand => subcommand
                .setName("train")
                .setDescription("Train on a user's messages and cache the weights")
                .addUserOption(option => option
                    .setName("user")
                    .setDescription("The user to train on")
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName("train-all")
                .setDescription("Train on all messages of users in the guild")
            )
        ),

    async interaction(interaction: ChatInputCommandInteraction) {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        if (!subcommandGroup) return;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const subcommand = interaction.options.getSubcommand();

        switch (subcommandGroup) {
            case "markov": {
                if (!interaction.guild) {
                    await interaction.editReply('This command must be run in a guild');
                    return;
                }

                switch (subcommand) {
                    case "train": {
                        const user = interaction.options.getUser("user");
                        if (!user) {
                            await interaction.editReply('The specified user option could not be resolved');
                            return;
                        }

                        try {
                            const guildMember = await interaction.guild.members.fetch(user.id);
                            await generateMarkovWeights(guildMember);
                            await interaction.editReply(`Successfully generated weights for ${user.tag}`);
                        } catch (error) {
                            await interaction.editReply('The specified user could not be found in the guild');
                        }
                        break;
                    }
                    case "train-all": {
                        const allMembers = await interaction.guild.members.fetch();

                        for (const [, member] of allMembers) {
                            await generateMarkovWeights(member);
                        }

                        await interaction.editReply(`Successfully generated weights for all users`);
                        break;
                    }
                }
                break;
            }
        }
    }
};