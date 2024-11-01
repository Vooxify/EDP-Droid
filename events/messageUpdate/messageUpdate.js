const { handleWebSocket } = require("../../utils/webServer");

const statisticsMessage = async (
    client,
    oldMessage,
    newMessage,
    targetChannelId
) => {
    // const targetChannelId = "1300721930105786409";
    if (newMessage.channelId !== targetChannelId) return;

    const response = await handleWebSocket();

    const buildOSAndNumbersString = (data) => {
        // future in vocal salons
        const osData = data.os;
        let result = "Systèmes d'exploitation :\n";

        for (const [osType, osList] of Object.entries(osData)) {
            result += `${osType} :\n`;
            osList.forEach((item) => {
                for (const [os, num] of Object.entries(item)) {
                    result += `- ${os} avec ${num} utilisateurs\n`;
                }
            });
        }

        return result;
    };

    const buildBrowsersString = (data) => {
        const browsersData = data.browsers;
        let result = "Navigateurs :\n";

        for (const [browserType, browserList] of Object.entries(browsersData)) {
            result += `${browserType} :\n`;
            browserList.forEach((item) => {
                for (const [browser, num] of Object.entries(item)) {
                    result += `- ${browser} avec ${num} utilisateurs\n`;
                }
            });
        }

        return result;
    };
    const buildMostUsedOSString = (data) => {
        const mostUsedOSData = data.mostUsedOS;
        let result = "**Systèmes d'exploitation les plus utilisés :**\n";

        mostUsedOSData.forEach((item) => {
            result += `- ${item.name} avec ${item.visitors} utilisateurs\n`;
        });

        return result;
    };

    const finalMessage = `
Démarrage du log : ${response.general.start_logging_date}
Fin du log : ${response.general.end_logging_date}

**Statistiques générales :**
    Total des requêtes : ${response.general.total_requests}
    Requêtes valides : ${response.general.valid_requests}
    Requêtes invalides : ${response.general.invalid_requests}
    Requêtes non trouvées : ${response.general.not_found_requests}
    Temps de génération : ${response.general.generation_time_ms}

**Liens les plus visités :**
${response.top_visited_routes
    .map((route) => {
        return `- ${route}`;
    })
    .join("\n")}

**Liens les plus non trouvés :**
    ${response.top_not_found_routes
        .map((route) => {
            return `- ${route}`;
        })
        .join("\n")}

${buildMostUsedOSString(response)}

`;

    // console.dir(JSON.stringify(response), { depth: null });
    oldMessage.edit(finalMessage);
};

module.exports = async (client, oldMessage, newMessage) => {
    statisticsMessage(client, oldMessage, newMessage, "1301816896269717546");
};
