import {ChatInputCommandInteraction, EmbedBuilder, InteractionContextType, SlashCommandBuilder} from "discord.js";

export default{
    data: new SlashCommandBuilder()
        .setName("dog")
        .setDescription("Get a random dog image")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel),

    async execute(interaction: ChatInputCommandInteraction)
    {
        await interaction.deferReply();
        interface DogApiResponse {
            message: string;
            status: string;
        }

        const response = await fetch('https://dog.ceo/api/breeds/image/random');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = (await response.json()) as DogApiResponse;

        console.log(data.message);

        const breed = new URL(data.message).pathname.split('/')[2];

        const embed = new EmbedBuilder()
            .setImage(data.message)
            .setColor('#4EBDED')
            .setFooter({text: 'Powered by dog.ceo/api'});
        if (breed) embed.setTitle(breed);

        if (interaction.appPermissions?.has('EmbedLinks')) {
            await interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply({ content: data.message });
        }
    }
}