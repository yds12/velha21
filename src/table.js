const util = require('./util.js')
const Tictactoe = require('./tictactoe')

// a table manages players joining a game
class Table {
  constructor (gameType, tableId) {
    this.players = []
    this.id = tableId
    this.waitingOpponents = true
    this.game = this.createNewGame(gameType)
  }

  addPlayer (player) {
    if (!this.waitingOpponents){
      player.isObserver = true
    }
    this.players.push(player)
    console.log(`Player ${player.name} joined the table.`)
    this.messagePlayers(`Player ${player.name} joined the table.`)
    player.setTable(this)
    this.tryToStartGame()
  }

  removePlayer (player) {
    this.players.splice(this.players.indexOf(player), 1)
    console.log('Player', player.name, 'left table', this.id)
    this.messagePlayers(`${player.name} left table ${this.id}.`)
    if (!this.game.canStart()) {
      this.messagePlayers('Not enough players to continue.')
      this.game.finish()
    }
    if (!this.empty()) { this.waitingOpponents = true }
  }

  tryToStartGame () {
    console.log('Trying to start game...')

    if (this.game.canStart()) {
      console.log('Starting game...')
      this.shufflePlayers()
      this.game.reset()
      this.waitingOpponents = false
    } else {
      console.log("Can't start the game.")
      this.messagePlayers('Waiting for opponents...')
    }
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
      case 'blackjack': return null
    }
  }
}

module.exports = Table
