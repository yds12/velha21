const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const Player = require('./player.js');
const Table = require('./table.js');

let table;
let socketPlayer = {};

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
    player = new Player(socket.id, socket);
    alocatePlayer(player);
    socketPlayer[socket.id] = player;

    socket.on('disconnect', () => {
      console.log(`Client ${socket.id} has disconnected.`);
      socketPlayer[socket.id].leave();
      delete socketPlayer[socket.id];
    });

    socket.on('click', pos => {
      player = socketPlayer[socket.id];
      console.log(`Player ${socket.id} clicked on quadrant ${pos.x}, ${pos.y}`);
      player.table.match.update(player, pos);
    });
    socket.on('clear', () => {
      player.table.match.reset();
    });

    // Handle other socket events:
    // ...
  });
}

function alocatePlayer(player){
  if (!table){
   table = new Table();
  }
  table.addPlayer(player);
}

module.exports.start = start;
