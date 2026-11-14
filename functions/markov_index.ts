import { Collection, GuildMember, PermissionFlagsBits, type GuildTextBasedChannel} from "discord.js";

export type MarkovEntry = {dateTime: number; weights: Map<string, string[]>; };

export const globalWeights = new Collection<string, Collection<string, MarkovEntry>>();

async function fetchInChannel(
    channel: GuildTextBasedChannel,
    authorId: string,
    maxMessagesToScan: number,
    collected: string[],
    maxTotalMessages: number,
): Promise<void> {
    let before: string | undefined;
    let scanned = 0;

    while (scanned < maxMessagesToScan && collected.length < maxTotalMessages) {
        const limit = Math.min(100, maxMessagesToScan - scanned);
        const batch = await channel.messages.fetch({
            limit,
            ...(before ? { before } : {}),
        });

        if (batch.size === 0) break;

        for (const message of batch.values()) {
            if (collected.length >= maxTotalMessages) break;

            if (message.author.id === authorId && message.content) {
                collected.push(message.content);
            }
        }

        scanned += batch.size;
        before = batch.lastKey();

        if (!before || batch.size < limit) break;
    }
}

export async function indexMessages(
    user: GuildMember,
    maxMessagesPerChannel: number,
    maxTotalMessages = 1500,
    concurrency = 4,
): Promise<string[]> {
    const me = user.guild.members.me;
    if (!me) return [];

    const neededBotPerms = [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.ReadMessageHistory,
    ];

    const readableChannels = [...user.guild.channels.cache.values()].filter(
        (channel): channel is GuildTextBasedChannel => {
            if (!channel.isTextBased() || channel.isDMBased()) return false;
            if (!channel.lastMessageId) return false;

            const botPerms = channel.permissionsFor(me);
            const userPerms = channel.permissionsFor(user);
            return Boolean(
                botPerms?.has(neededBotPerms) &&
                userPerms?.has(PermissionFlagsBits.ViewChannel),
            );
        },
    );

    const messages: string[] = [];
    let cursor = 0;

    async function worker() {
        while (
            cursor < readableChannels.length &&
            messages.length < maxTotalMessages
            ) {
            const channel = readableChannels[cursor++]!;
            try {
                await fetchInChannel(
                    channel,
                    user.id,
                    maxMessagesPerChannel,
                    messages,
                    maxTotalMessages,
                );
            } catch (err) {
                console.error(`Failed to read #${channel.name}:`, err);
            }
        }
    }

    const workers = Array.from(
        { length: Math.min(concurrency, readableChannels.length) },
        () => worker(),
    );

    await Promise.all(workers);
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
            const followers = weights.get(current);

            if (followers) {
                followers.push(next);
            } else {
                weights.set(current, [next]);
            }
        }
    }

    const guildWeights = globalWeights.ensure(user.guild.id, () => new Collection());
    guildWeights.set(user.id, {
        dateTime: Math.floor(Date.now() / 1000),
        weights,
    });

    return weights;
}
