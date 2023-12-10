## Websocket


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


npm install express http ws
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
