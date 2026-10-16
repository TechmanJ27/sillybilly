import {Message, Client} from 'discord.js';
export const dev = '1049795757978435625';

export function reactionsRegister(client: Client) {
    client.on('messageCreate', (message: Message) => {
        const raw = message.content.toLowerCase();
        if (message.author.bot) return;
        if (raw.includes('silly') || raw.includes('billy')) {
            // message.react('123456789012345678');
            return message.reply('What a sillybilly');
        }
    });
}
