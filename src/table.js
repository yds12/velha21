const util = require('./util.js')
const Tictactoe = require('./tictactoe')
const Blackjack = require('./blackjack')

// a table manages players joining a game
class Table {
  constructor (gameType, tableId) {
    this.gameType = gameType
    this.players = []
    this.id = tableId
    this.waitingOpponents = true
    this.game = this.createNewGame(gameType)
  }

  addPlayer (player) {
    if (!this.waitingOpponents) {
      player.isObserver = true
    }
    this.players.push(player)
    // console.log(`Player ${player.name} joined the table.`)
    this.messagePlayersExcept(`Player ${player.name} joined the table.`, player)
    player.setTable(this)
  }

  removePlayer (player) {
    this.players.splice(this.players.indexOf(player), 1)
    this.messagePlayers(`${player.name} left.`)
    if (!player.isObserver)
      this.waitingOpponents = true
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
    for (const player of this.players) {
      player.message(message)
    }
  }

  logMovePlayers (message) {
    for (const player of this.players) {
      player.logMove(message)
    }
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
