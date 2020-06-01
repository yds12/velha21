const Player = require('./player')
const Table = require('./table')

const tables = []

function createPlayer (socket, gameType, tableId, playerName) {
  const player = new Player(playerName, socket)
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
  const table = player.table
  player.leaveTable()
  if (table.empty())
    tables.splice(table, 1)
}

function handleClick (player, pos) {
  player.table.game.update(player, pos)
}

function handleClear (player) {
  if (!player.isObserver) player.table.clear()
  else player.message("Nice try, but you cannot restart other people's games!")
}

function handleStart (player) {
    const gameStarted = player.table.game.start()
  if (gameStarted) { player.table.waitingOpponents = false } else { player.table.messagePlayers('could not start game') }
}

function getTables () {
  return tables
    .map(table => ({
      id: table.id,
      game: table.game.type,
      status: (table.waitingOpponents) ? 'waiting for opponents...' : 'full'
    }))
}

function getNewTableId () {
  return Math.floor(Math.random() * 10000)
}

function isValidGame (type) {
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
