const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const path = require('path')
const controller = require('./controller')

// Server setup
const app = express()
app.disable('x-powered-by')

const server = http.createServer(app)
const sioServer = socketIo(server)
let config

const sioServerTTT = sioServer.of('/tictactoe')
const sioServerBlackJack = sioServer.of('/blackjack')
const sioServerIndex = sioServer.of('/index')

function start (configurations) {
  config = configurations
  server.listen(config.port, () =>
    console.log(`Express server listening on port ${config.port}...`))
  setupRoutes()
  setupSockets()

  return server
}

function setupRoutes () {
  app.use(express.static(config.publicDir))

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', config.publicDir, 'index.html'))
  })

  app.get('/tic-tac-toe/\\d+', (req, res) => {
    res.redirect('/tic-tac-toe')
  })

  app.get('/tic-tac-toe', (req, res) => {
    res.sendFile(path.join(__dirname, '..', config.publicDir, 'ttt.html'))
  })

  app.get('/blackjack', (req, res) => {
    res.sendFile(path.join(__dirname, '..', config.publicDir, 'bj.html'))
  })

  app.get('/js/config.js', (req, res) => {
    res.set('Content-Type', 'application/javascript')
    res.send(`const PORT = ${config.port};`)
  })

  app.get('*', (req, res) => {
    console.log('Requested URL: ', req.url)
    res.status(404).send('Error 404: Not found.')
  })
}

function handleGameConnection (gameName) {
  return (socket) => {
    console.log(`Client ${socket.id} connected.`)
    const player = controller.createPlayer(socket, gameName)
    updateTables()

    socket.on('disconnect', () => {
      console.log(`Client ${socket.id} has disconnected.`)
      controller.handleDisconnect(player)
      updateTables()
    })

    socket.on('click', (pos) => controller.handleClick(player, pos))
    socket.on('clear', () => controller.handleClear(player))
    socket.on('start', () => controller.handleStart(player))
  }
}

function setupSockets () {
  sioServerTTT.on('connection', handleGameConnection('tic-tac-toe'))
  // sioServerBlackJack.on('connection', handleGameConnection(BlackJackGame));
  sioServerBlackJack.on('connection', (socket) => {
    console.log('someone wants to play black jack')
  })
  sioServer.on('connection', (socket) => {
    console.log('new connection')
  })
  sioServerIndex.on('connection', (socket) => {
    socket.join('indexRoom')
    console.log('someone joined the main page')
    socket.emit('updateTables', controller.getTables())
  })
}

function updateTables () {
  sioServerIndex.to('indexRoom').emit('updateTables', controller.getTables())
}

module.exports.start = start
