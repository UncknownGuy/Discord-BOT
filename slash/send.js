const { Client } = require('discord.js');

async function handleSendCommand(client, interaction) {
  const { options, user } = interaction;

  const ownerId = '857692627873169438'; // Replace with your user ID
  const owner = await client.users.fetch(ownerId);

  const message = options.getString('message');

    try {
      const user = interaction.user;
    await owner.send(`Aɴᴏɴʏᴍᴏᴜs Mᴇssᴀɢᴇ ғʀᴏᴍ  <@${user.id}>  \n\nHey, ${message}`);
    interaction.reply('Your message has been sent to the bot owner.');

    // Delete the reply after 3 seconds
    setTimeout(() => {
      interaction.deleteReply().catch(console.error);
    }, 3000);
  } catch (error) {
    console.error(error);
    interaction.reply('An error occurred while sending the message.');
  }
}

module.exports = { handleSendCommand };
