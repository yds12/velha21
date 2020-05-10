const Player = require('./player')
const Table = require('./table')

const tables = []

function createPlayer (socket, gameName) {
  const player = new Player(socket.id, socket)
  allocatePlayer(player, gameName)
  player.table.game.sendState()
  return player
}

function allocatePlayer (player, gameName) {
  let table
  for (const t of tables) {
    if (t.waitingOpponents && (t.game.name === gameName)) {
      table = t
      break
    }
  }
  if (!table) {
    table = new Table(gameName)
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
    .filter(table => table.waitingOpponents)
    .map(table => ({
      id: table.id,
      game: table.game.name,
      status: "status"
    }))
}

module.exports.createPlayer = createPlayer
module.exports.handleClear = handleClear
module.exports.handleStart = handleStart
module.exports.handleClick = handleClick
module.exports.handleDisconnect = handleDisconnect
module.exports.getTables = getTables
