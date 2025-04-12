import express from 'express';
import cors from 'cors';
import { Server } from "socket.io";
import { createServer } from 'http';



export class MyServer {
    
    constructor() {

        this.app = express();
        this.port = process.env.PORT;


        this.server = createServer(this.app);
        this.io = new Server(this.server, {
            transports: ["websocket"], // 👈 Forzamos el uso exclusivo de WebSocket
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });

        
        
        this.paths = {};

        // Midlewares
        this.midlewares();

        // Rutas app
        this.routes();


        // Sockets
        this.sockets();
    }



    midlewares(){

        //Cors
        this.app.use( cors() ) 


        // Directorio publico
        this.app.use( express.static('public') );

    }


    routes(){
        
        //this.app.use( this.userPath , userRoutes)
        
    }

    sockets(){

        this.io.on('connection', socket => {

            socket.on('disconnect', () => {
                console.log('Cliente desconectado', socket.id);
            });


            socket.on('enviar-mensaje', ( payload ) => {

                this.io.emit('enviar-mensaje', payload)

            })


        });


    }


    listen(){
        this.server.listen( this.port, ()=> {
            console.log(`Servidor ejecutandose en el puerto: ${ this.port }`);
        });
    }

}