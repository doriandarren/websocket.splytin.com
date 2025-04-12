# Project


## Installation

```sh

npm init -y

npm i cors

npm i dotenv        // Hay que importar app.js: import 'dotenv/config'

npm i express       // Express


```


## Run Server

```sh

node app.js

nodemon app.js




```




## Para plesk

```sh

npm install -g pm2




pm2 start app.js --name websocket-server                // Start
pm2 start app.js --name websocket-server --watch        // Con Watch
pm2 list                                                // Listar


// Gestion:
pm2 stop websocket-server
pm2 restart websocket-server
pm2 delete websocket-server



// Guardar los procesos para que arranquen al reiniciar el servidor:
pm2 save
pm2 startup

```





## Sockey io


```sh

npm i socket.io


// Si todo va bien entrar al navegador: http://localhost:8080/socket.io/socket.io.js

```




