const { handleWebSocket } = require("../../utils/webServer");
const { createStyledTable } = require("../../utils/createStyledTable");

const sortJSON = (parsedJSON) => {
    const general = parsedJSON.general;
    const visitors = parsedJSON.visitors;
    const requests = parsedJSON.requests;
    // const staticRequests = parsedJSON.static_requests;
    const notFound = parsedJSON.not_found;
    // const hosts = parsedJSON.hosts;
    const os = parsedJSON.os;
    const browsers = parsedJSON.browsers;
    const visitTime = parsedJSON.visit_time;
    const referringSites = parsedJSON.referring_sites;
    const statusCodes = parsedJSON.status_codes;

    // console.log(os.data[6].hits);
    // const getDayInterval = (startDate, endDate) => {
    //     const start = new Date(startDate); // for some obscure reason the start date has an extra index that doesn't match any data
    //     const end = new Date(endDate);
    //     const dates = [];
    //     if (end >= start) {
    //         for (
    //             let date = start;
    //             date <= end;
    //             date.setDate(date.getDate() + 1)
    //         ) {
    //             dates.push(date.toISOString().split("T")[0]);
    //         }
    //     }
    //     return {
    //         cleanDates: dates
    //             .map((date) => {
    //                 const [y, m, d] = date.split("-");
    //                 return `${d}-${m}-${y}`;
    //             })
    //             .reverse(),
    //         jsonDates: dates
    //             .map((date) => {
    //                 return date.replace(/-/g, "");
    //             })
    //             .reverse(),
    //         dateNumber: dates.length - 1, // so here, we removed the useless index
    //     };
    // };

    // console.log(getDayInterval(general.start_date, general.end_date));
    const handleGeneral = () => {
        return {
            general: {
                start_logging_date: general.start_date,
                end_logging_date: general.end_date,
                total_requests: general.total_requests,
                valid_requests: general.valid_requests,
                invalid_requests: general.failed_requests,
                generation_time_ms: general.generation_time,
                unique_visitors: general.unique_visitors,
                requested_files: general.unique_files,
                not_found_requests: general.unique_not_found,
            },
        };
    };
    const handleVisitors = () => {
        const metadata = visitors.metadata;

        const sortMetadata = {
            visitors: {
                total: metadata.visitors.total.value,
                avg: metadata.visitors.avg.value,
                max: metadata.visitors.max.value,
                min: metadata.visitors.min.value,
            },
            hits: {
                total: metadata.hits.total.value,
                avg: metadata.hits.avg.value,
                max: metadata.hits.max.value,
                min: metadata.hits.min.value,
            },
        };
        return sortMetadata;
    };
    const handleRequests = () => {
        const metadata = requests.metadata;
        const data = requests.data;
        const topVistedRoutes = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].data.startsWith("/app/")) {
                topVistedRoutes.push(data[i].data);
            }
        }

        const sortMetadata = {
            visitors: {
                total: metadata.visitors.total.value,
                avg: metadata.visitors.avg.value,
                max: metadata.visitors.max.value,
                min: metadata.visitors.min.value,
            },
            hits: {
                total: metadata.hits.total.value,
                avg: metadata.hits.avg.value,
                max: metadata.hits.max.value,
                min: metadata.hits.min.value,
            },
            top_visited_routes: [
                topVistedRoutes[0],
                topVistedRoutes[1],
                topVistedRoutes[2],
            ],
        };

        return sortMetadata;
    };
    const handleNotFound = () => {
        const metadata = notFound.metadata;
        const data = notFound.data;
        const topNotFoundRoutes = [];

        for (let i = 0; i < 3; i++) {
            topNotFoundRoutes.push(data[i].data);
        }
        const sortMetadata = {
            hits: {
                total: metadata.hits.total.value,
                avg: metadata.hits.avg.value,
                max: metadata.hits.max.value,
                min: metadata.hits.min.value,
            },
            top_not_found_routes: topNotFoundRoutes,
        };
        return sortMetadata;
    };

    const handleOS = () => {
        const data = os.data;
        const mostUsedOS = [];
        const sortMetadata = {};

        data.forEach((system) => {
            sortMetadata[system.data] = system.items
                .slice(0, 3)
                .map((version) => ({
                    [version.data]: version.visitors.count,
                }));

            mostUsedOS.push({
                name: system.data,
                visitors: system.visitors.count,
            });
        });

        mostUsedOS.sort((a, b) => b.visitors - a.visitors);
        const topUsedOS = mostUsedOS.slice(0, 3);

        return {
            os: sortMetadata,
            mostUsedOS: topUsedOS,
        };
    };
    const handleBrowsers = () => {
        const data = browsers.data;
        const mostUsedOS = [];
        const sortMetadata = {};

        data.forEach((system) => {
            sortMetadata[system.data] = system.items
                .slice(0, 3)
                .map((version) => ({
                    [version.data]: version.visitors.count,
                }));

            mostUsedOS.push({
                name: system.data,
                visitors: system.visitors.count,
            });
        });

        mostUsedOS.sort((a, b) => b.visitors - a.visitors);
        const topUsedOS = mostUsedOS.slice(0, 3);

        return {
            browsers: sortMetadata,
            mostUsedOS: topUsedOS,
        };
    };

    const handleReferringSites = () => {
        const data = referringSites.data;

        const websites = [];

        data.forEach((website) => {
            if (!website.data.includes("ecole-directe.plus")) {
                websites.push({
                    name: website.data,
                    visitors: website.visitors.count,
                });
            }
        });

        websites.sort((a, b) => b.visitors - a.visitors);
        const topWebsites = websites.slice(0, 10);
        const sortMetadata = {};
        topWebsites.forEach((website) => {
            sortMetadata[website.name] = website.visitors;
        });

        return {
            referringSites: sortMetadata,
        };
    };

    return {
        ...handleGeneral(),
        ...handleVisitors(),
        ...handleRequests(),
        ...handleNotFound(),
        ...handleOS(),
        ...handleBrowsers(),
        ...handleReferringSites(),
    };
    // console.dir(handleReferringSites(), { depth: null });
    // console.dir(handleBrowsers(), { depth: null });
    // console.dir(handleOS(), { depth: null });
    // console.log(handleNotFound());
    // console.log(sortRequests());
    // console.log(sortGeneral());
};

const handleResponse = (parsedJSON) => {};

module.exports = {
    name: "getrawstatistics",
    description: "GRST",
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();
            try {
                const data = await handleWebSocket();
                console.dir(sortJSON(data), { depth: null });

                interaction.editReply(
                    `Message received: ${JSON.stringify(data.general.total_requests)}`
                );
            } catch (err) {
                interaction.editReply(
                    `[!] An error occurred while retrieving the statistics. ${err}`
                );
            }
        } catch (error) {
            await interaction.editReply(
                `[!] An error occurred while retrieving the statistics. ${error}`
            );
        }
    },
};
