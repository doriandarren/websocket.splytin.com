import express from 'express';
import cors from 'cors';
import { Server } from "socket.io";
import { createServer } from 'http';
import { send } from '../helpers/messageChannel.js';

export class MyServer {
    
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 4000;

        this.server = createServer(this.app);
        this.io = new Server(this.server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });

        this.paths = {
            test: '/api/test',
        };

        // Middlewares
        this.middlewares();

        // Rutas HTTP
        this.routes();

        // Sockets
        this.sockets();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json()); // 👈 por si hacés POST
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.get(this.paths.test, (req, res) => {

            send('Controlador Test');

            res.json({
                ok: true,
                mensaje: 'Servidor funcionando correctamente ✅'
            });
        });

        // podés agregar más rutas aquí

        this.app.post('/api/mensaje', (req, res) => {
            const mensaje = req.body.mensaje || 'Sin contenido';
            this.io.emit('enviar-mensaje', {
                mensaje,
                fecha: new Date().getTime(),
                origen: 'POSTMAN'
            });

            send('Controlador Mensaje');

            res.json({ ok: true, mensaje: 'Mensaje enviado por POST' });
        });


    }

    sockets() {
        this.io.on('connection', socket => {
            console.log('Cliente conectado:', socket.id);

            socket.on('disconnect', () => {
                console.log('Cliente desconectado:', socket.id);
            });

            socket.on('enviar-mensaje', payload => {
                console.log('Mensaje recibido:', payload);
                this.io.emit('enviar-mensaje', payload);
            });
        });
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor ejecutándose en el puerto: ${this.port}`);
        });
    }
}
