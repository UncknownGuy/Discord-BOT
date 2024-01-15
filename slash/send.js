const { Client, GatewayIntentBits } = require('discord.js');

async function handleSendCommand(client, interaction) {
  const { options, user, mentions } = interaction;

  const ownerId = '857692627873169438'; // Replace with your user ID
  const owner = await client.users.fetch(ownerId);

  const message = options.getString('message');

  try {
    const mentionedUser = mentions?.users?.first();
    const mentionedUserMention = mentionedUser ? `<@${mentionedUser.id}>` : '';
    const mentionedUserTag = mentionedUser ? `[@${mentionedUser.username}](${mentionedUser.displayAvatarURL({ dynamic: true })})` : '';

    const messageContent = `**Aɴᴏɴʏᴍᴏᴜs Mᴇssᴀɢᴇ**\n\n**From:** ${user.username}\n**To:** ${owner.username}\n\n${mentionedUserMention} ${mentionedUserTag}\nHey, ${message}`;

    // Sending the plain text message
    await owner.send(messageContent);

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

async function handleDirectMessage(client, message) {
  // Check if the sender is the bot owner
  if (message.author.id === '857692627873169438') {
    // Extract the user ID from the message content
    const userId = message.content.split(' ')[0];
    // Find the user
    const user = await client.users.fetch(userId);

    // Extract the message content excluding the user ID
    const replyContent = message.content.substring(userId.length + 1);

    // Send the reply to the user
    await user.send(`**Reply from Bot Owner:**\n${replyContent}`);
  }
}

module.exports = { handleSendCommand, handleDirectMessage };
