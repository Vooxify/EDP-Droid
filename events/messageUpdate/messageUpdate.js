const { handleWebSocket } = require("../../utils/webServer");
const { setDroidStatus } = require("../../handlers/setDroidStatus");
const { ActivityType } = require("discord.js");

const statisticsMessage = async (
    client,
    oldMessage,
    newMessage,
    targetChannelId
) => {
    // const targetChannelId = "1300721930105786409";
    if (newMessage.channelId !== targetChannelId) return;

    const response = await handleWebSocket();

    const handleVisitorsDate = (obj) => {
        const todayAndYesterday = [];
        for (const [key, value] of Object.entries(obj)) {
            if (todayAndYesterday.length !== 2) {
                todayAndYesterday.push({ [key]: value });
            } else {
                return todayAndYesterday;
            }
        }
        return todayAndYesterday;
    };

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
        let result = "\n";

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

**Nombre de visiteurs :**
    Aujourd'hui : ${Object.values(handleVisitorsDate(response.visitors)[0])}
    Hier : ${Object.values(handleVisitorsDate(response.visitors)[1])}

**Liens les plus visités :**
${response.top_visited_routes
    .map((route) => {
        return `- ${route}`;
    })
    .join("\n")}

${buildMostUsedOSString(response)}

`;

    const embed = {
        color: 0x0099ff,
        title: "Statistiques EcoleDirecte Plus",

        description: "Les statisiques du site d'EcoleDirecte Plus",
        fields: [
            {
                name: "**Infos :**",
                value: `
                        Démarrage du log : ${response.general.start_logging_date}
                        Fin du log : ${response.general.end_logging_date}
                        `,
            },

            {
                name: "**Statistiques générales :**",
                value: `Total des requêtes : ${response.general.total_requests}
                        Requêtes valides : ${response.general.valid_requests}
                        Requêtes invalides : ${response.general.invalid_requests}
                        Requêtes non trouvées : ${response.general.not_found_requests}
                        Temps de génération : ${response.general.generation_time_ms}`,
            },

            {
                name: "**Nombre de visiteurs :**",
                value: `
                Aujourd'hui : ${Object.values(handleVisitorsDate(response.visitors)[0])}
                        Hier : ${Object.values(handleVisitorsDate(response.visitors)[1])}`,
                inline: false,
            },

            {
                name: "**Liens les plus visités :**",
                value: `
                ${response.top_visited_routes
                    .map((route) => {
                        return `- ${route}`;
                    })
                    .join("\n")}
                `,
                inline: false,
            },

            {
                name: "**Systèmes d'exploitation les plus utilisés :**",
                value: `
                ${buildMostUsedOSString(response)}`,
                inline: false,
            },
        ],

        timestamp: new Date().toISOString(),
    };

    // console.dir(JSON.stringify(response), { depth: null });
    oldMessage.edit({ embeds: [embed] });
    setDroidStatus(
        client,
        `Visites aujourd'hui : ${Object.values(handleVisitorsDate(response.visitors)[0])}`,
        ActivityType.Custom
    );
};

module.exports = async (client, oldMessage, newMessage) => {
    statisticsMessage(client, oldMessage, newMessage, "1302546910007263303");
};
