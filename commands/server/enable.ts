import {type ChatInputCommandInteraction, InteractionContextType, PermissionFlagsBits, SlashCommandBuilder} from "discord.js";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    data: new SlashCommandBuilder()
        .setName('enable')
        .setDescription('Enable a command in this server')
        .addStringOption(option =>
            option
                .setName('command')
                .setDescription('The command to enable')
                .setRequired(true)
        )
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({})
        const disabledPath = path.join(__dirname, '..', '..', 'data', 'disabled.json');
        const disabled = JSON.parse(fs.readFileSync(disabledPath, 'utf8'));
        const server = interaction.guildId;

        const command = interaction.options.getString('command');

        if (!command) return await interaction.editReply('Command not found');
        if (!server) return await interaction.editReply('Guild not found');

        if (!disabled[server]) disabled[server] = [];

        if (disabled[server].includes(command)) {
            disabled[server] = disabled[server].filter((cmd: string) => cmd !== command);

            const updatedJson = JSON.stringify(disabled, null, 2);
            fs.writeFileSync(disabledPath, updatedJson);

            return await interaction.editReply(`Successfully enabled ${command}`);
        } else {
            return interaction.editReply('Command is not disabled.');
        }

    }
}