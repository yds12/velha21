const Player = require('./player')
const Table = require('./table')
const Tictactoe = require('./tictactoe')

const tables = []
const games = {} 

function createPlayer (socket, gameName) {
  const player = new Player(socket.id, socket)
  allocatePlayer(player, getGame(gameName))
  if (player.table.match) player.table.match.sendState()
  return player
}

function getGame(gameName){
  if(!games[gameName]) {
    switch(gameName.toLowerCase()) {
      case 'tictactoe': games[gameName] = Tictactoe
        break
      case 'blackjack': games[gameName] = null
        break
    }
  }
  return games[gameName]
}

function allocatePlayer (player, Game) {
  let table
  for (const t of tables) {
    if (t.waitingOpponents && t.Game === Game) {
      table = t
      break
    }
  }
  if (!table) {
    table = new Table(Game)
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
  if (player.table.match) player.table.match.update(player, pos)
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
    .map(table => ({ id: table.id, game: table.Game.name }))
}

module.exports.createPlayer = createPlayer
module.exports.handleClear = handleClear
module.exports.handleStart = handleStart
module.exports.handleClick = handleClick
module.exports.handleDisconnect = handleDisconnect
module.exports.getTables = getTables
