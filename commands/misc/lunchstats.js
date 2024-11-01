module.exports = {
    name: "lunchstats",
    description: "Lunch statistics",
    callback: async (client, interaction) => {
        await interaction.reply("Start lunching statistics");
        await interaction.editReply("Lunching...");
    },
};
