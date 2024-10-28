const Table = require("cli-table3");

function createStyledTable(data, options = {}) {
    const tableData = options.headers ? [options.headers, ...data] : data;

    const colWidths = tableData[0].map((_, colIndex) => {
        return (
            Math.max(...tableData.map((row) => String(row[colIndex]).length)) +
            2
        );
    });

    const defaultOptions = {
        chars: {
            top: "─",
            "top-mid": "┬",
            "top-left": "┌",
            "top-right": "┐",
            bottom: "─",
            "bottom-mid": "┴",
            "bottom-left": "└",
            "bottom-right": "┘",
            left: "│",
            "left-mid": "├",
            mid: "─",
            "mid-mid": "┼",
            right: "│",
            "right-mid": "┤",
            middle: "│",
        },
        style: {
            compact: false,
            "padding-left": 1,
            "padding-right": 1,
        },
        colWidths,
        wordWrap: options.wordWrap || false,
    };

    const tableOptions = { ...defaultOptions, ...options };
    const table = new Table(tableOptions);

    if (options.headers) {
        table.push(options.headers);
    }

    data.forEach((row) => table.push(row));

    console.log(table.toString());
}

const data = [
    ["Alice", "25", "Développeuse"],
    ["Bob", "30", "Designer"],
    ["Charlie", "35", "Manager"],
];

const options = {
    headers: ["Nom", "Âge", "Profession"],
};

module.exports = { createStyledTable };
