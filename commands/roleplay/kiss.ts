import {SlashCommandBuilder, InteractionContextType, type ChatInputCommandInteraction} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("kiss")
        .setDescription("Give someone a kiss")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Who's the special someone?")
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName("cheek")
                .setDescription("Only on the cheek")
        )
        .addBooleanOption(option =>
            option
                .setName("blown")
                .setDescription("Blow them a kiss instead")
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const bot = await interaction.client.users.fetch("1551408953865539666");

        function getRandomInt(min: number, max: number): number {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const user = interaction.user;
        const target = interaction.options.getUser("user");
        if (!target) return;
        const cheek = interaction.options.getBoolean("cheek");
        const blown = interaction.options.getBoolean("blown");

        const kiss: string[] = [
            `${user} pulls ${target} close and kisses them ^^`,
            `${user} gives ${target} a kiss. I'm jealous`,
        ]
        
        if (user === target) {
            return await interaction.editReply(`${user}’s gives themselves a kiss... somehow...`);
        }
        if (bot.id === target.id) {
            return await interaction.editReply(`You're giving me a kiss?! YAY`);
        }
        if (blown) return await interaction.reply(`${user} blows a kiss at ${target} ♡`);
        if (cheek) return await interaction.reply(`${user} gives ${target} a peck on the cheek`);
        const reply = kiss[getRandomInt(0, kiss.length - 1)]!;
        return interaction.editReply(reply);
    }
}