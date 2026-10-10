import {
    type AutocompleteInteraction,
    ApplicationCommandOptionType,
    type ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
} from 'discord.js';

type Opt = {
    type: number;
    name: string;
    description: string;
    required?: boolean | undefined;
    options?: readonly Opt[] | undefined;
};

const isSub = (o: Opt) =>
    o.type === ApplicationCommandOptionType.Subcommand ||
    o.type === ApplicationCommandOptionType.SubcommandGroup;

function describe(path: string, description: string, options: readonly Opt[]): string[] {
    const subs = options.filter(isSub);
    if (subs.length) {
        return subs.flatMap(s => describe(`${path} ${s.name}`, s.description, s.options ?? []));
    }

    const usage = options.map(o => (o.required ? `<${o.name}>` : `[${o.name}]`)).join(' ');
    const header = `**/${path}${usage ? ` ${usage}` : ''}** - ${description}`;
    const params = options.map(
        o => `  • \`${o.name}\` (${o.required ? 'required' : 'optional'}) - ${o.description}`
    );
    return [header, ...params];
}

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get information about a command')
        .addStringOption(o =>
            o.setName('command')
                .setDescription('The command to look up')
                .setAutocomplete(true)),

    async autocomplete(interaction: AutocompleteInteraction) {
        const focused = interaction.options.getFocused().toLowerCase();
        const matches = interaction.client.commands
            .filter(c => c.data.name.includes(focused))
            .first(25)
            .map(c => ({ name: c.data.name, value: c.data.name }));
        await interaction.respond(matches);
    },

    async execute(interaction: ChatInputCommandInteraction) {
        const name = interaction.options.getString('command');

        if (!name) {
            const lines = interaction.client.commands.map(
                c => `**/${c.data.name}** - ${c.data.description}`
            );
            lines.push('\nUse `/help command:<name>` to see a command\'s parameters.');
            return interaction.reply({ content: lines.join('\n'), flags: MessageFlags.Ephemeral });
        }

        const cmd = interaction.client.commands.get(name);
        if (!cmd) {
            return interaction.reply({ content: `No command named \`${name}\`.`, flags: MessageFlags.Ephemeral });
        }

        const json = cmd.data.toJSON();
        let text = describe(cmd.data.name, cmd.data.description, json.options ?? []).join('\n');
        if (text.length > 2000) text = text.slice(0, 1990) + '\n…';

        await interaction.reply({ content: text, flags: MessageFlags.Ephemeral });
    },
};