const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const {join} = require('path');



const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ 
  server
});


// // Crear un servidor HTTP
// const server = http.createServer((req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Servidor HTTP en ejecución');
// });

app.use('/static', express.static(join(process.cwd(), "public")));


// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado al WebSocket');

  // Manejar mensajes del cliente
  ws.on('message', (message) => {
    console.log(`Mensaje recibido: ${message}`);

    // Enviar un mensaje de vuelta al cliente
    ws.send(`Servidor: Recibí tu mensaje - ${message}`);

    // Enviar el mensaje a todos los clientes excepto al remitente
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`Usuario: ${message}`);
      }
    });

  });

  // Manejar cierre de conexión
  ws.on('close', () => {
    console.log('Cliente desconectado del WebSocket');
  });
});

// Ruta de prueba para mostrar un HTML con cliente WebSocket
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
