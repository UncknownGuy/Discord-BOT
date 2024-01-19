const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const clientId = process.env.CLIENT_ID; // Replace with your bot's client ID
const guildId = process.env.GUILD_ID;  // Replace with your server (guild) ID
const token = process.env.DB_TOKEN; // Replace with your bot token

const rest = new REST({ version: '9' }).setToken(token);

module.exports = async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    // Get existing commands
    const existingCommands = await rest.get(
      Routes.applicationGuildCommands(clientId, guildId),
    );

    // Delete existing commands
    if (existingCommands.length) {
      await Promise.all(
        existingCommands.map(command =>
          rest.delete(
            Routes.applicationGuildCommand(clientId, guildId, command.id),
          ),
        ),
      );
      console.log('Successfully deleted existing commands.');
    }

    // Register new commands
    const commands = [
      new SlashCommandBuilder()
        .setName('movie')
        .setDescription('Get details about a movie')
        .addStringOption(option =>
          option.setName('query')
            .setDescription('Name, year, or category of the movie')
            .setRequired(true)
        ),
      new SlashCommandBuilder()
        .setName('send')
        .setDescription('Send an anonymous message to the bot owner')
        .addStringOption(option =>
          option.setName('message')
            .setDescription('The message you want to send')
            .setRequired(true)
        ),
    ].map(command => command.toJSON());

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};
