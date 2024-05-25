const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Estructura de datos para almacenar salas y usuarios
const rooms = {};

// Middleware para validar token
const validateToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'default-secret-key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).send('Invalid token.');
  }
};

// Ruta para crear una nueva sala
router.post('/create-room', validateToken, (req, res) => {
  const roomName = req.body.roomName;
  if (!roomName) {
    return res.status(400).send('Room name is required.');
  }
  if (rooms[roomName]) {
    return res.status(400).send('Room already exists.');
  }
  rooms[roomName] = { users: new Set() };
  res.status(201).send('Room created successfully.');
});

// Ruta para obtener las salas y los usuarios conectados
router.get('/', validateToken, (req, res) => {
  const response = Object.keys(rooms).map(roomName => ({
    room: roomName,
    users: Array.from(rooms[roomName].users)
  }));
  res.json(response);
});

module.exports = router;
