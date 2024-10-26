const WebSocket = require("ws");
require("dotenv").config({ path: "../.env" });

const handleWebSocket = (url = process.env.SOCKET_URL) => {
    return new Promise((resolve, reject) => {
        const socket = new WebSocket(url);

        // socket.addEventListener("open", (event) => {
        //     console.log(`[#] Successfully connected to "${url}"`);

        // });

        socket.addEventListener("message", (event) => {
            try {
                const data = JSON.parse(event.data);
                resolve(data); // Resolve the promise with the received data
                socket.close(); // Close the connection after receiving the message
            } catch (error) {
                reject(
                    new Error("Failed to parse message data: " + error.message)
                );
            }
        });

        socket.addEventListener("close", (event) => {
            // console.log("[*] Connection to socket was aborted");
            reject(new Error("Connection to socket was aborted"));
        });

        socket.addEventListener("error", (error) => {
            console.error("[!] WebSocket error: ", error);
            reject(new Error("WebSocket error: " + error.message));
        });
    });
};

module.exports = { handleWebSocket };
