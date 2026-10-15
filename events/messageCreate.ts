import {Message, Client} from 'discord.js';

export function reactionsRegister(client: Client) {
    client.on('messageCreate', (message: Message) => {
        const raw = message.content.toLowerCase();
        if (raw.includes('silly') || raw.includes('billy')){
            // message.react('123456789012345678'); 
            message.reply('What a sillybilly');
        }
        if (message.channel.isDMBased()) {
            console.log(`<@${message.author.username}> ${message.content}`);
        }
    });
}
