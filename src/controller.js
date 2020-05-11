const Player = require('./player')
const Table = require('./table')

const tables = []

function createPlayer (socket, gameType, tableId) {
  const player = new Player(socket.id, socket)
  allocatePlayer(player, gameType, tableId)
  player.table.game.sendState()
  return player
}

function allocatePlayer (player, gameType, tableId) {
  let table
  for (const t of tables) {
    if (t.id === tableId && (t.game.type === gameType)) {
      table = t
      break
    }
  }
  if (!table) {
    table = new Table(gameType, tableId)
    tables.push(table)
  }
  table.addPlayer(player)
}

function handleDisconnect (player) {
  player.table.removePlayer(player)
  if (player.table.empty()) {
    tables.splice(player.table, 1)
  }
}

function handleClick (player, pos) {
  player.table.game.update(player, pos)
}

function handleClear (player) {
  player.table.tryToStartGame()
}

function handleStart (player) {
  player.message('You asked to start a game... Nice.')
}

function getTables () {
  return tables
    .map(table => ({
      id: table.id,
      game: table.game.type,
      status: (table.waitingOpponents) ? 'waitingOpponents' : 'full'
    }))
}

function getNewTableId() {
  return Math.floor(Math.random() * 10000)
}

function isValidGame(type) {
  return ['tictactoe', 'blackjack'].indexOf(type) >= 0
}

module.exports.createPlayer = createPlayer
module.exports.handleClear = handleClear
module.exports.handleStart = handleStart
module.exports.handleClick = handleClick
module.exports.handleDisconnect = handleDisconnect
module.exports.getTables = getTables
module.exports.getNewTableId = getNewTableId
module.exports.isValidGame = isValidGame
