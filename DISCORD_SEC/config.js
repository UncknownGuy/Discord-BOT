// config.js
require('dotenv').config();

DB_TOKEN =  process.env.DB_TOKEN
TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
CLIENT_ID = process.env.CLIENT_ID
GUILD_ID =  process.env.GUILD_ID
OWNER_ID = process.env.OWNER_ID
NSFW_VERIFY = process.env.NSFW_VERIFY
ROLE_ID = process.env.ROLE_ID
MENTION_CHANNEL = process.env.MENTION_CHANNEL
SERVER_STATUS = process.env.SERVER_STATUS

module.exports = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    DB_TOKEN: process.env.DB_TOKEN,
    CLIENT_ID: process.env.CLIENT_ID,
    GUILD_ID:  process.env.GUILD_ID,
    OWNER_ID: process.env.OWNER_ID,
    NSFW_VERIFY: process.env.NSFW_VERIFY,
    ROLE_ID: process.env.ROLE_ID,
    MENTION_CHANNEL: process.env.MENTION_CHANNEL,
    SERVER_STATUS: process.env.SERVER_STATUS,
    // Add other variables as needed
  };