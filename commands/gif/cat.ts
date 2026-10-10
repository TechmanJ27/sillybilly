import {ChatInputCommandInteraction, EmbedBuilder, InteractionContextType, SlashCommandBuilder} from "discord.js";
import('dotenv');

export default{
    data: new SlashCommandBuilder()
        .setName("cat")
        .setDescription("Get a random cat image")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel),

    async execute(interaction: ChatInputCommandInteraction)
    {
        await interaction.deferReply();
        interface CatImage {
            id: string;
            url: string;
            width: number;
            height: number;
        }

        const response = await fetch('https://beta-api.thecatapi.com/v1/images/search', {
            headers: {
                'x-api-key': process.env.CAT_API_KEY!,
            }
        });

        if (!response.ok) {
            console.log(new Error(`HTTP error! Status: ${response.status}`));
            return interaction.editReply('Could not fetch a cat right now.')
        }

        const data = (await response.json()) as CatImage[];

        console.log(data[0]!.url);
        const embed = new EmbedBuilder()
            .setImage(data[0]!.url)
            .setColor('#4EBDED')
            .setFooter({text: 'Powered by thecatapi.com'});

        if (interaction.appPermissions?.has('EmbedLinks')) {
            await interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply({ content: data[0]!.url });
        }
    }
}

