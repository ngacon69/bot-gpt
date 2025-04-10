require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("channelset")
    .setDescription("Set the channel where the bot will respond")
    .addChannelOption(option => option.setName("channel").setDescription("Pick a channel").setRequired(true)),

  new SlashCommandBuilder()
    .setName("style")
    .setDescription("Set the reply style")
    .addStringOption(option => option.setName("style").setDescription("e.g., serious, funny, sarcastic...").setRequired(true))
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("🔁 Registering slash commands...");
    await rest.put(Routes.applicationCommands("YOUR_BOT_CLIENT_ID"), { body: commands });
    console.log("✅ Slash commands registered!");
  } catch (error) {
    console.error(error);
  }
})();
