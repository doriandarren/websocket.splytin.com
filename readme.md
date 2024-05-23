## Websocket


### Arrancar el servidor
Primero verificar los token de accesos. Para ejecutar esto se consigue primero el src/js/generateToken.js

```sh
node src/js/generateToken.js
```

Luego para arrancar el servidor:

```sh
nodemon server.js
```









### Script

```sh
# Creamos las carpetas src y subcarpetas
mkdir -p src/{assets,js,css}

# Creamos los ficheros HTML, CSS y Javascript
touch src/index.html
touch src/js/index.js
touch src/css/index.css


Only dev:
npm install -g nodemon


npm install express http ws     // Servidor
npm install jsonwebtoken        // TOKEN
npm install mysql2              // MYSQL
npm install dotenv              // .env




npm install tailwindcss postcss autoprefixer postcss-cli



nodemon server.js


```




Para ejecutar siempre el comando usar pm2:

```sh

// Instalar:
npm install -g pm2

// Start
pm2 start server.js


// Gestión:
pm2 list
pm2 stop <app-name-or-id>
pm2 restart <app-name-or-id>
pm2 logs <app-name-or-id>


```
