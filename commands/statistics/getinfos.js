const transformDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    const date = new Date(`20${year}`, month - 1, day); // month - 1 because months are indexed from 0

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return new Intl.DateTimeFormat("fr-FR", options).format(date);
};

const createVisitsTable = (visits) => {
    const columnWidths = [
        Math.max(
            ...visits.map((visit) => visit.createdAt.length),
            "Date".length
        ),
        Math.max(
            ...visits.map((visit) => visit.count.toString().length),
            "Nb de Visites".length
        ),
    ];

    const drawLine = (char = "═") => {
        return (
            "╔" +
            columnWidths.map((width) => char.repeat(width + 2)).join("╦") +
            "╗"
        );
    };

    const drawMiddleLine = () => {
        return (
            "╠" +
            columnWidths.map((width) => "═".repeat(width + 2)).join("╬") +
            "╣"
        );
    };

    const drawBottomLine = () => {
        return (
            "╚" +
            columnWidths.map((width) => "═".repeat(width + 2)).join("╩") +
            "╝"
        );
    };

    const drawHeader = () => {
        return (
            "║" +
            ` ${"Date".padEnd(columnWidths[0])} ` +
            "║" +
            ` ${"Nb de Visites".padEnd(columnWidths[1])} ` +
            "║"
        );
    };

    const drawRow = (visit) => {
        return (
            "║" +
            ` ${visit.createdAt.padEnd(columnWidths[0])} ` +
            "║" +
            ` ${visit.count.toString().padEnd(columnWidths[1])} ` +
            "║"
        );
    };

    const table = [
        drawLine(),
        drawHeader(),
        drawMiddleLine(),
        ...visits.map(drawRow),
        drawBottomLine(),
    ];

    return "```\n" + table.join("\n") + "\n```";
};

module.exports = {
    name: "getinfos",
    description: "Get Statistics",

    callback: async (client, interaction) => {
        const response = await fetch(
            "http://localhost:3000/api/discord/get_database_stats/"
        );
        const json = await response.json();

        if (!response.ok) {
            return interaction.reply({
                content: `An error was occured: ${json.error}`,
            });
        }
        const message = json.message;
        const formatedMessage = [];

        message.forEach((element) => {
            delete element.id;
            element.createdAt = transformDate(element.createdAt);
            formatedMessage.push(element);
        });

        const returnedMessage = `
:heavy_division_sign: Voici les statistiques sauvegardées dans la base de donnée :

${createVisitsTable(formatedMessage)}`;
        return interaction.reply({
            content: `${returnedMessage}`,
        });
    },
};
