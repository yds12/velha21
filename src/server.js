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

  app.get('/js/config.js', (req, res) => {
    res.set('Content-Type', 'application/javascript')
    res.send(`const PORT = ${config.port};`)
  })

  app.get('/:gameType/:tableId', (req, res) => {
    const gameType = req.params.gameType
    const tableId = req.params.tableId

    if (controller.isValidGame(gameType)) {
      res.redirect(`/${gameType}?tableId=${tableId}`)
    } else {
      res.status(404).send('Error 404: Not found.')
    }
  })

  app.get('/:gameType', (req, res) => {
    const gameType = req.params.gameType
    res.sendFile(
      path.join(__dirname, '..', config.publicDir, gameType + '.html'))
  })

  app.get('*', (req, res) => {
    console.log('Requested URL: ', req.url)
    res.status(404).send('Error 404: Not found.')
  })
}

function setupSockets () {
  sioServerTTT.on('connection', (socket) =>
    handleGameConnection(socket, 'tictactoe'))

  sioServerBlackJack.on('connection', (socket) =>
    handleGameConnection(socket, 'blackjack'))

  sioServer.on('connection', (socket) => {
    console.log('new connection')
  })
  sioServerIndex.on('connection', (socket) => {
    socket.join('indexRoom')
    console.log('someone joined the main page')
    socket.emit('updateTables', controller.getTables())
  })
}

function handleGameConnection (socket, gameName) {
  const tableId = getTableId(socket)
  console.log('tableId: ' + tableId)
  socket.join(tableId)

  console.log(`Client ${socket.id} connected.`)
  const player = controller.createPlayer(socket, gameName, tableId)
  updateTables()
  updatePlayers(gameName, player.table)

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} has disconnected.`)
    controller.handleDisconnect(player)
    updatePlayers(gameName, player.table)
    updateTables()
  })

  socket.on('click', (pos) => controller.handleClick(player, pos))
  socket.on('clear', () => {
    controller.handleClear(player)
    updateTables()
    updatePlayers(gameName, player.table)
  })
  socket.on('start', () => {
    controller.handleStart(player)
    updateTables()
    updatePlayers(gameName, player.table)
  })
  socket.on('enterTable', (data) => {
    console.log("data", data)
    if (player.name !== '') {
      player.name = data['playerName']
      updatePlayers(gameName, player.table)
      socket.emit('enterTableResponse', true)
    }
    else {
      socket.emit('enterTableResponse', false)
    }
  })
}

function getTableId (socket) {
  try {
    return socket.handshake.query.tableId
  } catch (e) {
    return 42
  }
}

function updateTables () {
  sioServerIndex.to('indexRoom').emit('updateTables', controller.getTables())
}

function updatePlayers (gameName, table) {
  if (gameName === 'tictactoe') {
    sioServerTTT.to(table.id).emit('updatePlayers', table.getPlayers())
  } else if (gameName === 'blackjack') {
    sioServerBlackJack.to(table.id).emit('updatePlayers', table.getPlayers())
  }
}

module.exports.start = start
