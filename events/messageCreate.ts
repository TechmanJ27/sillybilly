import {Message, Client} from 'discord.js';
export const dev = '1049795757978435625';

export function reactionsRegister(client: Client) {
    client.on('messageCreate', (message: Message) => {
        const raw = message.content.toLowerCase();
        if (message.author.bot) return;
        if (message.author.id === dev) {
            if (raw.includes('i love you sillybilly') || raw.includes('i love you silly billy') || raw.includes('ily silly billy') || raw.includes('ily sillybilly')) {
                return message.reply('I love you too ♡');
            }
        }
        if (raw.includes('silly') || raw.includes('billy')) {
            // message.react('123456789012345678');
            if (message.author.id !== dev) {
                return message.reply('What a sillybilly');
            }
        }
    });
}
