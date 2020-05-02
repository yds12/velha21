const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Server setup
const app = express();
app.disable('x-powered-by');

const server = http.createServer(app);
const sioServer = socketIo(server);
let config;

function start(configurations){
  config = configurations;
  server.listen(config.port, () =>
    console.log(`Express server listening on port ${config.port}...`));
  setupRoutes();
  setupSockets();
}

function setupRoutes(){
  app.use(express.static(config.publicDir));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, config.publicDir, 'index.html'));
  });
}

function setupSockets(){
  sioServer.on('connection', (socket) => {
    console.log(`Client ${socket.id} connected.`);
  });
}

module.exports.start = start;
