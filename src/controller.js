const Player = require('./player')
const Table = require('./table')

const tables = []

function createPlayer (socket) {
  const player = new Player(socket.id, socket)
  allocatePlayer(player)
  if (player.table.match) player.table.match.sendState()
  return player
}

function allocatePlayer (player) {
  let table
  for (const t of tables) {
    if (t.waitingOpponents) {
      table = t
      break
    }
  }
  if (!table) {
    table = new Table()
    tables.push(table)
  }
  table.addPlayer(player)
}

function handleDisconnect (player) {
  player.leave()
}

function handleClick (player, pos) {
  if (player.table.match) player.table.match.update(player, pos)
}

function handleClear (player) {
  player.table.tryToStartGame()
}

function handleStart (player) {
  player.message('You asked to start a game... Nice.')
}

module.exports.createPlayer = createPlayer
module.exports.handleClear = handleClear
module.exports.handleStart = handleStart
module.exports.handleClick = handleClick
module.exports.handleDisconnect = handleDisconnect
