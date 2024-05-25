require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { join } = require('path');
const jwt = require('jsonwebtoken');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const db = require('./db');

// Configurar archivos estáticos
app.use('/static', express.static(join(process.cwd(), "public")));

// Middleware para parsear JSON
app.use(express.json());

// Importar y usar rutas
const roomRoutes = require('./routes/rooms');
app.use('/rooms', roomRoutes);

// PORT
const PORT = process.env.PORT || 4000;

// Secret key para firmar y verificar tokens
const SECRET_KEY = process.env.SECRET_KEY || 'default-secret-key';

// Estructura de datos para almacenar salas y usuarios
const rooms = {};

// Crear salas automáticamente
const initializeRooms = () => {
  const defaultRooms = ['General', 'Sports', 'Technology'];
  defaultRooms.forEach(roomName => {
    if (!rooms[roomName]) {
      rooms[roomName] = { users: new Set() };
    }
  });
};

// Inicializar las salas
initializeRooms();

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
  const params = new URLSearchParams(req.url.slice(1));
  const token = params.get('token');
  const roomName = params.get('room');

  if (!roomName) {
    ws.send('Server: Room name is required.');
    ws.close();
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (!rooms[roomName]) {
      rooms[roomName] = { users: new Set() }; // Crear la sala si no existe
    }

    rooms[roomName].users.add(decoded.username);
    ws.roomName = roomName;  // Asignar la sala al WebSocket
    ws.username = decoded.username;  // Asignar el nombre de usuario al WebSocket
    console.log(`Cliente ${decoded.username} conectado a la sala ${roomName}`);

    ws.on('message', (message) => {
      console.log(`Mensaje recibido en sala ${roomName}: ${message}`);

      // Guardar mensaje en la base de datos
      const query = 'INSERT INTO chatapp (username, room, message) VALUES (?, ?, ?)';
      db.query(query, [decoded.username, roomName, message], (err, result) => {
        if (err) {
          console.error('Error al guardar el mensaje:', err);
          return;
        }
      });

      // Enviar el mensaje a todos los clientes en la misma sala, incluido el remitente
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.roomName === roomName) {
          client.send(`Usuario (${decoded.username}): ${message}`);
        }
      });
    });

    // Manejar cierre de conexión
    ws.on('close', () => {
      console.log(`Cliente ${decoded.username} desconectado de la sala ${roomName}`);
      rooms[roomName].users.delete(decoded.username);
      // No eliminar la sala aunque no haya usuarios conectados
    });

    ws.on('error', (error) => {
      console.error(`Error en el WebSocket en sala ${roomName}: ${error}`);
    });

  } catch (err) {
    console.log('Server: Token invalid. Closing connection.');
    ws.send('Server: Token invalid. Closing connection.');
    ws.close();
  }
});

// Ruta de prueba para mostrar un HTML con cliente WebSocket
app.get('/', validateToken, (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
