const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "getchannel",
    description: "Get the last set channel ID",
    options: [
        {
            name: "token",
            description: "Your secret token",
            type: ApplicationCommandOptionType.String,
            requied: true,
        },
    ],
    callback: async (client, interaction) => {
        const token = interaction.options._hoistedOptions[0].value;

        try {
            const response = await fetch(
                "http://localhost:3000/api/discord/stat_channel/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        commandMethod: "get",
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return interaction.reply({
                    content: `:x: ERROR : ${data.error}`,
                    ephemeral: true,
                });
            }

            const channelId = data.channelId.replace(/"/g, ""); // remove ""
            const channelLink = await client.channels.fetch(channelId);

            if (!channelLink) {
                return interaction.reply({
                    content:
                        ":x: Could not find the channel. Set it with /setchannel <channel>",
                    ephemeral: true,
                });
            }

            return interaction.reply({
                content: `:white_check_mark: Statistics channel is : ${channelLink}`,
                ephemeral: true,
            });
        } catch (error) {
            return interaction.reply({
                content: `:x: There was an error: ${error.message}`,
                ephemeral: true,
            });
        }
    },
};
