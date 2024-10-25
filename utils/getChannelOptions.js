/* 

This function get the channel id and return the js object,
after, you can just use it without type always the same command, just call the function.

*/

function getChannelOptions(client, interaction, channelId) {
    statChannel = client.channels.cache.get(channelId);
    return statChannel;
}

module.exports = {
    getChannelOptions: getChannelOptions,
};
