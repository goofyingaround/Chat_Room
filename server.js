const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('message', (message) => {
        const parsedMessage = JSON.parse(message);

        const outgoingMessage = JSON.stringify({
            user: parsedMessage.user,
            text: parsedMessage.text,
            timestamp: new Date().toISOString(),
        });

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(outgoingMessage);
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('HTTP server and WebSocket running on http://localhost:3000');
});
