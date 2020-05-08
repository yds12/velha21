const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const controller = require('./controller');

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
    res.sendFile(path.join(__dirname, '..', config.publicDir, 'index.html'));
  });

  app.get('/tictactoe', (req, res) => {
    res.sendFile(path.join(__dirname, '..', config.publicDir, 'ttt.html'));
  });

  app.get('/blackjack', (req, res) => {
    res.sendFile(path.join(__dirname, '..', config.publicDir, 'bj.html'));
  });

  app.get('/js/config.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.send(`const PORT = ${config.port};`);
  });

  app.get('*', (req, res) => {
    console.log('Requested URL: ', req.url);
    res.status(404).send('Error 404: Not found.');
  });
}

function setupSockets(){
  sioServer.on('connection', (socket) => {
    console.log(`Client ${socket.id} connected.`);
    let player = controller.createPlayer(socket);

    socket.on('disconnect', () => {
      console.log(`Client ${socket.id} has disconnected.`);
      controller.handleDisconnect(player);
    });

    socket.on('click', (pos) => controller.handleClick(player, pos));
    socket.on('clear', () => controller.handleClear(player));
    socket.on('start', () => controller.handleStart(player));
  });
}

module.exports.start = start;
