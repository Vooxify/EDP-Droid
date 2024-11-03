module.exports = {
    name: "launchstats",
    description: "launch statistics",
    callback: async (client, interaction) => {
        await interaction.reply("Start launching statistics");
        await interaction.editReply("launching...");
    },
};
