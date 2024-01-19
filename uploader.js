const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const { Extra, Markup } = require('node-telegram-bot-api');


const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const DISCORD_BOT_TOKEN = process.env.DB_TOKEN;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
const discordBot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

discordBot.login(DISCORD_BOT_TOKEN);

let currentChannelIdIndex = 0; // Set a default index

const getDiscordChannels = () => {
  const channelsJson = fs.readFileSync('./channels.json', 'utf8');
  const channelData = JSON.parse(channelsJson).channels;
  return channelData.map((channel) => ({ id: channel.id, title: channel.title }));
};

const getCurrentDiscordChannel = () => {
  const channels = getDiscordChannels();
  return channels[currentChannelIdIndex];
};

const pink = '\x1b[35;1m';
const green = '\x1b[92m';
const reset = '\x1b[0m';

bot.on('photo', async (msg) => {
  await sendPhotoToDiscord(msg);
});

bot.on('video', async (msg) => {
  await sendVideoToDiscord(msg);
  console.log('');
  
  console.log('');
});

const sendPhotoToDiscord = async (msg, channelIdIndex = currentChannelIdIndex) => {
  const selectedChannel = getDiscordChannels()[channelIdIndex];
  const chatId = msg.chat.id;
  const userId = msg.from.id; // Extract the user's ID

  if (userId === 6063227604) {
    // Owner's ID, proceed with sending the photo and description to Discord
    try {
      const photoId = msg.photo[msg.photo.length - 1].file_id;

  const channelTitle = selectedChannel.title; // Get channel title
      console.log('');
      console.log(`${pink}Img Uploaded To Discord ${channelTitle}${reset}`);
      console.log(`${pink}${green}----${pink}+++++++++++++++++++++${green}----${reset}`);
      console.log('');
      
      const file = await bot.getFile(photoId);
      const photoUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const description = msg.caption || ''; // Extract description from caption, if available

      const response = await axios.get(photoUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');

      discordBot.channels.cache.get(selectedChannel.id).send({
        content: description, // Send the description as content
        files: [
          {
            attachment: buffer,
            name: 'photo.jpg',
          },
        ],
      });
    } catch (error) {
      console.error('Error sending photo:', error.message);
    }
  } else {
    // Non-owner, log an "Unauthorized user" message
    const reset = '\x1b[0m';
    const red = '\x1b[31m';
    console.log(`${red}Unauthorized user${reset}`);
  }
};

const sendVideoToDiscord = async (msg, channelIdIndex = currentChannelIdIndex) => {
  const selectedChannel = getDiscordChannels()[channelIdIndex];
  const chatId = msg.chat.id;
  const userId = msg.from.id; // Extract the user's ID

  if (userId === 6063227604) {
    // Owner's ID, proceed with sending the video and description to Discord
    try {
      const videoId = msg.video.file_id;
        const channelTitle = selectedChannel.title; 
      console.log('');
      console.log(`${pink}Vid Uploaded To Discord ${channelTitle}${reset}  |${reset}`);
  console.log(`${pink}${green}----${pink}+++++++++++++++++++++${green}----${reset}`);
      console.log('');
      const file = await bot.getFile(videoId);
      const videoUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const description = msg.caption || ''; // Extract description from caption, if available

      const response = await axios.get(videoUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');

      discordBot.channels.cache.get(selectedChannel.id).send({
        content: description, // Send the description as content
        files: [
          {
            attachment: buffer,
            name: 'video.mp4',
          },
        ],
      });
    } catch (error) {
      console.error('Error sending video:', error.message);
    }
  } else {
    // Non-owner, log an "Unauthorized user" message
        const reset = '\x1b[0m';
        const red = '\x1b[31m';
    console.log(`${red}Unauthorized user${reset}`);
  }
};



bot.onText(/\/setchannel/, (msg) => {
  const channels = getDiscordChannels();
  const imageUrl = 'https://telegra.ph/file/4e756043f1bd29ea87a0b.png';

    const inlineKeyboard = {
  reply_markup: {
    inline_keyboard: channels.reduce((acc, channel, index) => {
      if (index % 2 === 0) {
        // Create a new row for every even index
        acc.push([]);
      }
      acc[acc.length - 1].push({ text: channel.title, callback_data: `setChannel_${index}` });
      return acc;
    }, []),
  },
};

  


  bot.sendPhoto(msg.chat.id, imageUrl, {
    caption: 'Select a channel:',
    ...inlineKeyboard,
  });
});


bot.on('callback_query', (query) => {
  const [action, index] = query.data.split('_');

  if (action === 'setChannel') {
    const channelIndex = parseInt(index, 10);
    setDiscordChannelIndex(channelIndex);

    bot.answerCallbackQuery(query.id, { text: `Discord channel set to ${getDiscordChannels()[channelIndex].title}` });
  }
});


const setDiscordChannelIndex = (index) => {
  currentChannelIdIndex = index;
};

module.exports = {
  sendPhotoToDiscord,
  sendVideoToDiscord,
};

  