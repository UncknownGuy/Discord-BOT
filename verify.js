const imageUrl = 'https://telegra.ph/file/29ac7e512d1316cb7b2da.gif';

const createVerifyMessage = () => {
  return {
    content: 'Click Button Below For Get NSFW Role ',
    embeds: [
      {
        title: 'Access Adult Content In Server',
        description: 'Top Advance Adult Contents',
        image: { url: imageUrl },
        footer: { text: '⚠️  Access 100GB + Nudes   ⚠️' },
        color: 0xc2185b, // Hex color for pink
      },
    ],
    components: [
      {
        type: 1, // ActionRow type
        components: [
          {
            type: 2, // Button type
            custom_id: 'getRoleButton',
            label: 'Verify 🔞',
            style: 1, // Primary style
          },
          {
            type: 2, // Button type
            custom_id: 'removeRoleButton',
            label: 'Remove Role ❌',
            style: 2, // Danger style
          },
        ],
      },
    ],
  };
};


const handleButtonInteractions = async (interaction, nsfwVerifyRoleId, destinationChannel) => {
  if (interaction.customId === 'getRoleButton') {
    // Handle logic to get the role using role ID
    const role = interaction.guild.roles.cache.get(nsfwVerifyRoleId);
    if (role) {
      await interaction.member.roles.add(role);

      // Mention the user in another channel
      const mentionMessage = await destinationChannel.send(`User ${interaction.user} has been verified!`);

      await interaction.reply(`Verified For NSFW Role! ✅`);

      // Delete the mention message after 5 seconds
      setTimeout(() => {
        mentionMessage.delete().catch(console.error);
      }, 5000);
    } else {
      console.error(`Role with ID ${nsfwVerifyRoleId} not found.`);
    }

    // Delete the "Role added" message after 3 seconds
    setTimeout(() => {
      interaction.deleteReply().catch(console.error);
    }, 3000);
  } else if (interaction.customId === 'removeRoleButton') {
    // Handle logic to remove the role using role ID
    const role = interaction.guild.roles.cache.get(nsfwVerifyRoleId);
    if (role) {
      await interaction.member.roles.remove(role);

      // Mention the user in another channel
      const mentionMessage = await destinationChannel.send(`User ${interaction.user} has removed the role.`);

      await interaction.reply(`Removed The NSFW Role! ❌`);

      // Delete the mention message after 5 seconds
      setTimeout(() => {
        mentionMessage.delete().catch(console.error);
      }, 5000);
    } else {
      console.error(`Role with ID ${nsfwVerifyRoleId} not found.`);
    }

    // Delete the "Role removed" message after 3 seconds
    setTimeout(() => {
      interaction.deleteReply().catch(console.error);
    }, 3000);
  }
};

const setupVerification = async (client, targetChannelId, destinationChannelId, nsfwVerifyRoleId) => {
  try {
    const targetChannel = client.channels.cache.get(targetChannelId);
    const destinationChannel = client.channels.cache.get(destinationChannelId);

    if (targetChannel && destinationChannel) {
      // Check if the message already exists in the target channel
      const existingMessage = await targetChannel.messages.fetch({ limit: 1 });

      if (existingMessage.size > 0) {
        // If the message exists, edit it
        const existingMsg = existingMessage.first();
        const verifyMessage = createVerifyMessage();
        await existingMsg.edit({ content: verifyMessage.content, embeds: verifyMessage.embeds, components: verifyMessage.components });
        console.log('Verification message edited successfully with buttons and hidden image link.');
      } else {
        // If the message doesn't exist, send a new one
        const verifyMessage = createVerifyMessage();
        const verifyMsg = await targetChannel.send(verifyMessage);
        console.log('Verification message sent successfully with buttons and hidden image link.');
      }

      // Handle button interactions for the verification message
      client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;
        handleButtonInteractions(interaction, nsfwVerifyRoleId, destinationChannel);
      });
    } else {
      console.error(`Channel with ID ${targetChannelId} or ${destinationChannelId} not found.`);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  setupVerification,
};