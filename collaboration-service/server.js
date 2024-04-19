import http from 'http';
import { WebSocketServer } from 'ws'; // Import the WebSocket module

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '8084';

const server = http.createServer((request, response) => {
    if (request.url === '/') {
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end('okay');
    } else {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('Not Found');
    }
});


// const wss = new WebSocket.Server({ server }); // Create WebSocket server using the HTTP server
const wss = new WebSocketServer({ server });

let sharedValue = "";

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send the current shared value to the newly connected client
    ws.send(sharedValue);

    // Handle messages from client
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);

        // Update the shared value with the received message
        sharedValue = message;

        // Broadcast the updated value to all connected clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === 1) {
                client.send(sharedValue);
            }
        });
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, host, () => {
    console.log(`running at '${host}' on port ${port}`);
});
