const util = require('./util.js')
const Tictactoe = require('./tictactoe')
const Blackjack = require('./blackjack')

class Table {
  constructor (gameType, tableId, tableSocket, privateTable = false) {
    this.gameType = gameType
    this.players = []
    this.id = tableId
    this.waitingOpponents = true
    this.game = this.createNewGame(gameType)
    this.socket = tableSocket
    this.roomName = `${gameType}_${tableId}`
    this.isPrivate = privateTable
  }

  addPlayer (player) {
    if (!this.waitingOpponents) {
      player.isObserver = true
    }
    this.players.push(player)
    this.messagePlayersExcept(`Player ${player.name} joined the table.`, player)
    player.setTable(this)
  }

  removePlayer (player) {
    this.players.splice(this.players.indexOf(player), 1)
    this.messagePlayers(`${player.name} left.`)
    if (!player.isObserver) { this.clear() }
  }

  clear () {
    this.waitingOpponents = true
    this.game = this.createNewGame(this.gameType)
    this.game.sendState()
  }

  empty () {
    return this.players.length === 0
  }

  shufflePlayers () {
    util.shuffle(this.players)
  }

  messagePlayers (message) {
    this.socket.to(this.roomName).emit('message', message)
  }

  logMovePlayers (message) {
    this.socket.to(this.roomName).emit('move', message)
  }

  updateGameState (state) {
    this.socket.to(this.roomName).emit('state', state)
  }

  messagePlayersExcept (message, player) {
    for (const p of this.players) {
      if (p !== player) {
        p.message(message)
      }
    }
  }

  createNewGame (gameType) {
    switch (gameType.toLowerCase()) {
      case 'tictactoe': return new Tictactoe(this)
      case 'blackjack': return new Blackjack(this)
    }
  }

  updatePlayers () {
    this.socket.to(this.roomName).emit('updatePlayers', this.getPlayers())
  }

  getPlayers () {
    return this.players
      .map(player => ({
        name: player.name,
        role: (player.isObserver) ? 'observer' : 'player',
        currentPlayer: this.game.isPlayerTurn(player)
      }))
  }
}

module.exports = Table
