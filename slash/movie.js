const axios = require('axios');

// Replace '1194727691723751465' with your desired channel ID for the /movie command
const allowedChannelId = '1194727691723751465';

async function handleMovieCommand(interaction) {
  const { options, channelId } = interaction;

  // Check if the command is used in the correct channel
  if (channelId !== allowedChannelId) {
    const errorMessage = await interaction.reply({ content: 'Please use the command in the movies channel.', ephemeral: true });

    // Delete the error message after 3 seconds
    setTimeout(() => {
      errorMessage.delete().catch(console.error);
    }, 3000);

    return;
  }

  const query = options.getString('query');

  try {
    // Make a request to YTS API
    const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${query}`);
    const movies = response.data.data.movies;

    if (movies && movies.length > 0) {
      // Prepare search results
      const results = movies.map((movie, index) => {
        return {
          label: `${index + 1}. ${movie.title_long}`,
          value: index.toString(),
        };
      });

      // Send an initial response with search results
      interaction.reply({
        content: 'Please choose a movie:',
        components: [
          {
            type: 1, // ActionRow
            components: [
              {
                type: 3, // SelectMenu
                customId: 'movieSelect',
                placeholder: 'Select a movie',
                options: results,
              },
            ],
          },
        ],
        ephemeral: true, // Set interaction to ephemeral
      });

      // Handle user selection
      const filter = (interaction) => interaction.customId === 'movieSelect';
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

      collector.on('collect', async (interaction) => {
        const selectedMovieIndex = parseInt(interaction.values[0]);
        const selectedMovie = movies[selectedMovieIndex];

        // Create and send embed with selected movie details
    
        const embed = {
          title: selectedMovie.title_long,
          description: selectedMovie.description_full,
          image: { url: selectedMovie.large_cover_image },
          color: 0xc2185b,// pink color
          author: {
            name: selectedMovie.title_long,
          },
          url: selectedMovie.torrents[0].url, // Assuming the first torrent in the list, adjust accordingly
        };

        // Accessing the username from the user property of the interaction
  const username = interaction.user.username;
        
        try {
          await interaction.deferReply({ ephemeral: false });
            // Assuming 'user' is a property in the interaction object
          const user = interaction.user;
          await interaction.editReply({ content: `<@${user.id}> selected this movie `, embeds: [embed], components: [] });
        } catch (error) {
          console.error(error);
          interaction.followUp('An error occurred while sending the movie details.');
        }

        // Stop the collector after user selection
        collector.stop();
      });

      collector.on('end', (collected) => {
        if (collected.size === 0) {
          const timeoutMessage = 'Movie selection timed out. Please Try Again';
          interaction.followUp(timeoutMessage)
      .then((message) => {
        // Delete the message after 5 seconds
        setTimeout(() => {
          message.delete().catch(console.error);
        }, 5000);
      })
      .catch(console.error);
  }
    });
    } else {
      interaction.reply('No movies found.');
    }
  } catch (error) {
    console.error(error);
    interaction.reply('An error occurred while fetching movie details.');
  }
}

module.exports = { handleMovieCommand };