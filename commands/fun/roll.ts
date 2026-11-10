import {SlashCommandBuilder, type ChatInputCommandInteraction} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a dice - Or, flip a coin")
    .addIntegerOption(option =>
      option
        .setName("sides")
        .setDescription("How many sides the dice should have")
        .setMinValue(2)
        .setRequired(true)
    ),

  async execute (interaction: ChatInputCommandInteraction) {
    const sides = interaction.options.getInteger("sides", true);
    
    if (sides == 2) {
      const result = Math.floor(Math.random() * 2) + 1;
      switch (result) {
        case 1:
          return await interaction.reply("Heads\n-# Coinflip");
        case 2:
          return await interaction.reply("Tails\n-# Coinflip" );
      }
    }

    const result = Math.floor(Math.random() * sides) + 1;

    const footer = (result: number, sides: number) => {
      switch (sides) {
        case 4:
          return "\n-# d4";
        case 6:
          return "\n-# d6";
        case 8:
          return "\n-# d8";
        case 10:
          return "\n-# d10";
        case 12:
          return "\n-# d12";
        case 20:
          return result == 1 ? " - Nat1\n-# d20" : (result == 20 ? " - Nat20\n-# d20" : "\n-# d20")
        case 100:
          return "\n-# d100";
        default:
          return `\n-# ${sides}-sided die`;
      }
    }

    await interaction.reply(`You rolled a ${result}!` + footer(result, sides));
  }
}
