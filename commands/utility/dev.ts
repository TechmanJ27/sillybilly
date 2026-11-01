import { type ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { generateMarkovWeights } from "../../functions/markov_index.js";

export default {
    data: new SlashCommandBuilder()
        .setName("dev")
        .setDescription("Dev commands")
        .addSubcommandGroup(subcommandGroup =>
            subcommandGroup
                .setName("markov")
                .setDescription("Markov chain related dev commands")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("train")
                        .setDescription("Train on a user's messages and cache the weights")
                        .addUserOption(option =>
                            option
                                .setName("user")
                                .setDescription("The user to train on")
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("train-all")
                        .setDescription("Train on all messages of users in the guild")
                )
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            switch (subcommandGroup) {
                case "markov": {
                    if (!interaction.guild) {
                        await interaction.editReply("This command must be run inside a server.");
                        return;
                    }

                    switch (subcommand) {
                        case "train": {
                            const user = interaction.options.getUser("user", true);
                            const guildMember = await interaction.guild.members.fetch(user.id);

                            await generateMarkovWeights(guildMember);
                            await interaction.editReply(`Successfully generated weights for **${user.tag}**`);
                            break;
                        }

                        case "train-all": {
                            const allMembers = await interaction.guild.members.fetch();

                            await Promise.all(
                                Array.from(allMembers.values()).map(member => generateMarkovWeights(member))
                            );

                            await interaction.editReply(`Successfully generated weights for all **${allMembers.size}** users.`);
                            break;
                        }
                    }
                    break;
                }
            }
        } catch (error) {
            console.error(`Error executing command (${subcommandGroup}/${subcommand}):`, error);
            await interaction.editReply("An unexpected error occurred while processing this command.");
        }
    }
};
