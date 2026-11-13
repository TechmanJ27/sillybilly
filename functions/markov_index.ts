import { Collection, GuildMember, PermissionFlagsBits, type GuildTextBasedChannel, type Snowflake} from "discord.js";

export type MarkovEntry = { guildId: Snowflake, dateTime: number; weights: Map<string, string[]>; };

export const markovWeights = new Collection<string, MarkovEntry>();

async function fetchInChannel(
    channel: GuildTextBasedChannel,
    authorId: string,
    maxMessages: number,
): Promise<string[]> {
    const found: string[] = [];
    let before: string | undefined;
    let scanned = 0;

    while (scanned < maxMessages) {
        const limit = Math.min(100, maxMessages - scanned);
        const batch = await channel.messages.fetch({
            limit,
            ...(before ? { before } : {}),
        });
        if (batch.size === 0) break;

        for (const message of batch.values()) {
            if (message.author.id === authorId && message.content) {
                found.push(message.content);
            }
        }

        scanned += batch.size;
        before = batch.lastKey();
        if (!before || batch.size < limit) break;
    }

    return found;
}

export async function indexMessages(
    user: GuildMember,
    maxMessagesPerChannel: number,
): Promise<string[]> {
    const me = user.guild.members.me;
    const messages: string[] = [];

    for (const channel of user.guild.channels.cache.values()) {
        if (!channel.isTextBased()) continue;

        const botPerms = me ? channel.permissionsFor(me) : null;
        const userPerms = channel.permissionsFor(user);
        const needed = [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory];

        if (!botPerms?.has(needed) || !userPerms?.has(PermissionFlagsBits.ViewChannel)) continue;

        try {
            messages.push(...await fetchInChannel(channel, user.id, maxMessagesPerChannel));
        } catch (err) {
            console.error(`Failed to read #${channel.name}:`, err);
        }
    }

    return messages;
}

export async function generateMarkovWeights(user: GuildMember) {
    const messages = await indexMessages(user, 500);
    if (messages.length === 0) return undefined;

    const weights = new Map<string, string[]>();

    for (const message of messages) {
        const words = message.split(/\s+/).filter((word) => word !== '');
        if (words.length === 0) continue;

        const tokens = ['<START>', ...words, '<END>'];

        for (let i = 0; i < tokens.length - 1; i++) {
            const current = tokens[i]!;
            const next = tokens[i + 1]!;
            const nexts = weights.get(current);

            if (nexts) {
                nexts.push(next);
            } else {
                weights.set(current, [next]);
            }
        }
    }

    markovWeights.set(user.id, {
        dateTime: Math.floor(Date.now() / 1000),
        weights,
    });

    return weights;
}
