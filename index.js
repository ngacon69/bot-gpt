require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const config = {
  channel: null,
  style: "neutral",
};

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "channelset") {
    const channel = interaction.options.getChannel("channel");
    config.channel = channel.id;
    await interaction.reply(`✅ Bot will now respond in: <#${channel.id}>`);
  }

  if (interaction.commandName === "style") {
    const style = interaction.options.getString("style");
    config.style = style;
    await interaction.reply(`✅ Response style set to: **${style}**`);
  }
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!config.channel || message.channel.id !== config.channel) return;

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Reply to the following message in the style of "${config.style}":\n\n"${message.content}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    message.reply(response);
  } catch (err) {
    console.error(err);
    message.reply("❌ Error occurred while calling Gemini API.");
  }
});

client.login(process.env.DISCORD_TOKEN);
