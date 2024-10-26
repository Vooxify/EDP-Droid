const { handleWebSocket } = require("../../utils/webServer");

module.exports = {
    name: "getrawstatistics",
    description: "GRST",
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();
            handleWebSocket()
                .then((data) => {
                    interaction.editReply(
                        `Message received: ${JSON.stringify(data.general.total_requests)}`
                    );
                })
                .catch((err) => {
                    interaction.editReply(
                        `[!] An error occurred while retrieving the statistics. ${err}`
                    );
                });
        } catch (error) {
            await interaction.editReply(
                `[!] An error occurred while retrieving the statistics. ${error}`
            );
        }
    },
};
