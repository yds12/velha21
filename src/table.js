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
    this.messagePlayers(`Player ${player.name} joined the table.`)
    player.setTable(this)
  }

  removePlayer (player) {
    this.players.splice(this.players.indexOf(player), 1)
    // console.log('Player', player.name, 'left table', this.id)
    this.messagePlayers(`${player.name} left table ${this.id}.`)
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
        role: (player.isObserver) ? 'observer' : 'player'
      }))
  }
}

module.exports = Table
