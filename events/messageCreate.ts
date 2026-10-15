
export function reactionsRegister {
    client.on('messageCreate', (message) => {
        const raw = message.content.toLowerCase();
        if (raw.includes('silly') || raw.includes('billy')){
            message.react('123456789012345678'); 
        }
    });
}
