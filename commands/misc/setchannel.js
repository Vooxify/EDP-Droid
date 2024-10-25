const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "setchannel",
    description: "set channel id",
    options: [
        {
            name: "token",
            description: "Your secret token",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "id",
            description: "id desc",
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],
    callback: async (client, interaction) => {
        const statChannelId = interaction.options._hoistedOptions[1].value; // get channel id param
        const statChannel = await client.channels.fetch(statChannelId);
        const token = interaction.options._hoistedOptions[0].value;
        try {
            const response = await fetch(
                `http://localhost:3000/api/discord/stat_channel?id=${statChannelId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        commandMethod: "set",
                    }),
                }
            );
            const json = await response.json();

            if (!response.ok) {
                return interaction.reply({
                    content: `:x: An error was occured: ${json.error}`,
                });
            }
            return interaction.reply({
                content: `:white_check_mark: ${json.message
                    .replace(`${statChannelId}`, `${statChannel}`)
                    .replace(/"/g, "")}`,
            });
        } catch (error) {
            return interaction.reply({
                content: `:x: There was an error: ${error}`,
            });
        }
        // .then((response) => {
        //     if (!response.ok) {
        //         interaction.reply({
        //             content: `:x: ERROR : ${response.json}`,
        //             ephemeral: true,
        //         });
        //     }
        //     return response.json();
        // })
        // .then((data) => {
        //     console.log(data);
        //     interaction.reply({
        //         content: `:white_check_mark: ${JSON.stringify(data.message)
        //             .replace(`${statChannelId}`, `${statChannel}`)
        //             .replace(/"/g, "")}`, // remove this -> ""
        //         ephemeral: true,
        //     });
        // })
        // .catch((error) => {
        //     interaction.reply({
        //         content: `:x: There was an error : ${error}`,
        //         ephemeral: true,
        //     });
        // });
    },
};

/**
 * .......
  version: 1,
  appPermissions: PermissionsBitField { bitfield: 2251799813685247n },
  memberPermissions: PermissionsBitField { bitfield: 2251799813685247n },
  locale: 'en-US',
  guildLocale: 'en-US',
  entitlements: Collection(0) [Map] {},
  commandId: '1284469773673173053',
  commandName: 'set',
  commandType: 1,
  commandGuildId: '1242563383195340812',
  deferred: false,
  replied: false,
  ephemeral: null,
  webhook: InteractionWebhook { id: '1242564291056373770' },
  options: CommandInteractionOptionResolver {
    _group: null,
    _subcommand: null,
    _hoistedOptions: [
    {
      name: 'id',
      type: 7,
      value: '1260689987620442195',<-- This contain the value of the parameter
      channel: [TextChannel]
    }
    ]
  } 
  }
}
 */
