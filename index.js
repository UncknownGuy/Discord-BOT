require('dotenv').config();
const axios = require('axios');
const uploader = require('./uploader');
const { setupVerification } = require('./verify');
const TelegramBot = require('node-telegram-bot-api');
const { Client, GatewayIntentBits } = require('discord.js');

const os = require('os');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
//testing

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

app.get('/', (req, res) => res.send('Bot is alive!'));

app.listen(port, () => console.log(`Keep-alive server running on port ${port}`));


const token = process.env.DB_TOKEN;
const statusChannelId = process.env.SERVER_STATUS; // Replace with your status channel ID

// Handle photo events from Telegram
client.on('message', async (message) => {
  if (message.photo) {
    await sendPhotoToDiscord(message);
  }
});

// Handle video events from Telegram
client.on('message', async (message) => {
  if (message.video) {
    await sendVideoToDiscord(message);
  }
});

let statusMessageId; // Store the ID of the status message
let botStartTime;
const pink = '\x1b[35;1m';
const reset = '\x1b[0m';
client.on('ready', () => {
  console.log(`${pink}${client.user.username}${reset}`);
  botStartTime = new Date();
  initializeStatusMessage();
});

async function initializeStatusMessage() {
  const channel = client.channels.cache.get(statusChannelId);
  if (!channel) {
    console.error(`Channel with ID ${statusChannelId} not found.`);
    return;
  }

  const existingMessages = await channel.messages.fetch({ limit: 1 }).catch(() => null);

  if (existingMessages && existingMessages.size > 0) {
    // If there are existing messages, use the first one as the status message
    const existingMessage = existingMessages.first();
    statusMessageId = existingMessage.id;
    console.log('Existing status message found.');
  } else {
    // If there are no existing messages, send a new one and store its ID
    const newMessage = await channel.send('Initializing...');
    statusMessageId = newMessage.id;
    console.log('New status message sent and stored.');
  }

  // Update status every 5 seconds
  setInterval(updateStatus, 15 * 2000);
}

async function updateStatus() {
  const channel = client.channels.cache.get(statusChannelId);
  if (!channel) {
    console.error(`Channel with ID ${statusChannelId} not found.`);
    return;
  }

  const existingMessage = statusMessageId ? await channel.messages.fetch(statusMessageId).catch(() => null) : null;

  const memoryUsage = (os.totalmem() - os.freemem()) / os.totalmem() * 100; // Calculate RAM usage percentage

  // Calculate bot uptime
  const uptime = calculateUptime();

  const statusContent = `\n\n🖥️ Server Status 🖥️\n\n` +
    `:bar_chart: RAM Usage: **${memoryUsage.toFixed(2)}%**\n` +
    `:gear: CPU: **${os.cpus()[0].model}**\n` +
    `:chart_with_upwards_trend: CPU Usage: **${getCPUUsage().toFixed(2)}%**\n` +
    `:alarm_clock: Integration Time Delay: **${getShortDelay()}ms**\n` +
    `:clock: Uptime: **${uptime}**`;

const reset = '\x1b[0m';
const pink = '\x1b[35;1m';
  if (existingMessage) {
    // If the status message already exists, edit its content
    existingMessage.edit(statusContent)
      .then(() => console.log(`${pink}---------------------------------------------${reset}`))
      .catch(error => console.error(`Error updating status: ${error.message}`));
  } else {
    console.error('Status message not found. This should not happen.');
  }
}

function getCPUUsage() {
  const cpus = os.cpus();
  const usagePerCore = cpus.reduce((total, cpu) => total + cpu.times.user, 0) / cpus.length;
  return (usagePerCore / os.cpus()[0].times.user) * 100;
}

function getShortDelay() {
  // Your logic to measure integration time delay and format it shorter
  const delay = Math.random() * 100; // Placeholder value, replace with your implementation
  return delay.toFixed(0); // Round to the nearest integer
}

function calculateUptime() {
  const currentTime = new Date();
  const uptimeMilliseconds = currentTime - botStartTime;

  const seconds = Math.floor(uptimeMilliseconds / 1000) % 60;
  const minutes = Math.floor(uptimeMilliseconds / (1000 * 60)) % 60;
  const hours = Math.floor(uptimeMilliseconds / (1000 * 60 * 60)) % 24;
  const days = Math.floor(uptimeMilliseconds / (1000 * 60 * 60 * 24));

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

const targetChannelId = process.env.NSFW_VERIFY;
const nsfwVerifyRoleId = process.env.ROLE_ID;

const destinationChannelId = process.env.MENTION_CHANNEL;
// Destination channel for user mention

const green = '\x1b[92m';
client.on('ready', () => {
  console.log('')
  console.log(`${green}          Logged in as ${client.user.tag}${reset}`);
  console.log('')
  botStartTime = new Date();
  initializeStatusMessage();
  setupVerification(client, targetChannelId, destinationChannelId, nsfwVerifyRoleId); // Add this line
});

const { handleSendCommand } = require('./slash/send')
const { handleMovieCommand } = require('./slash/movie');

const clientId = process.env.CLIENT_ID; // Replace with your bot's client ID
const guildId = process.env.GUILD_ID;  // Replace with your bot token
const ownerId = process.env.OWNER_ID; // Replace with your user ID

const commands = [
  {
    name: 'movie',
    description: 'Get details about a movie',
    type: 1, // CHAT_INPUT
    options: [
      {
        name: 'query',
        description: 'Name, year, or category of the movie',
        type: 3, // STRING
        required: true,
      },
    ],
  },
  {
    name: 'send',
    description: 'Send an anonymous message to the bot owner',
    type: 1, // CHAT_INPUT
    options: [
      {
        name: 'message',
        description: 'The message you want to send',
        type: 3, // STRING
        required: true,
      },
    ],
  },
];



client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'movie') {
    // Call the movie-related functionality
    handleMovieCommand(interaction);
  } else if (commandName === 'send') {
    // ... (rest of the existing /send command handler)
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'send') {
    // Call the send-related functionality
    handleSendCommand(client, interaction);
  }
});
                                  

client.login(token);