const handleStatus = require("../../handlers/setDroidStatus.js");
const { setDroidStatus } = require("../../handlers/setDroidStatus.js");

module.exports = (client) => {
    setDroidStatus(client);
    console.log(`${client.user.tag} is online`);
};
