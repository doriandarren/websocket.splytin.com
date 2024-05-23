require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { join } = require('path');
const jwt = require('jsonwebtoken'); // Asegúrate de instalar jsonwebtoken

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const db = require('./db');  // Importa la conexión a la base de datos




// Configurar archivos estáticos
app.use('/static', express.static(join(process.cwd(), "public")));



// PORT
const PORT = process.env.PORT || 5000;

// Secret key para firmar y verificar tokens
const SECRET_KEY = 'token-public-123';



// Middleware para validar token
const validateToken = (req, res, next) => {
  
  const token = req.query.token;
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).send('Invalid token.');
  }
};



// Manejar conexiones WebSocket
wss.on('connection', (ws, req) => {

  const token = req.url.split('=')[1];

  try {

    console.log("TOKENNN:", token);
    console.log(process.env.PORT);

    const decoded = jwt.verify(token, SECRET_KEY);

    console.log('Cliente conectado al WebSocket');

    ws.on('message', (message) => {

      console.log(`Mensaje recibido: ${message}`);


      //Guardar mensaje en la base de datos
      const query = 'INSERT INTO messages (username, message) VALUES (?, ?)';
      db.query(query, [decoded.username, message], (err, result) => {
        if (err) {
          console.error('Error al guardar el mensaje:', err);
          return;
        }
        //console.log('Mensaje guardado en la base de datos');
      });




      // Enviar un mensaje de vuelta al cliente
      ws.send(`Servidor: ${message}`);

      // Enviar el mensaje a todos los clientes excepto al remitente
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(`Usuario (${decoded.username}): ${message}`);
        }
      });
    });

    // Manejar cierre de conexión
    ws.on('close', () => {
      console.log('Cliente desconectado del WebSocket');
    });

    ws.on('error', (error) => {
      console.error(`Error en el WebSocket: ${error}`);
    });

  } catch (err) {
    console.log('Server: Token invalid. Closing connection.');
    ws.send('Server: Token invalid. Closing connection.');
    ws.close();
  }
});

// Ruta de prueba para mostrar un HTML con cliente WebSocket
app.get('/', validateToken, (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
