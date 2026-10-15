import {Message} from 'discord.js';

export function reactionsRegister(client) {
    client.on('messageCreate', (message: Message) => {
        const raw = message.content.toLowerCase();
        if (raw.includes('silly') || raw.includes('billy')){
            message.react('123456789012345678'); 
        }
    });
}
