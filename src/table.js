const util = require('./util.js')

// a table manages players joining a game
class Table {
  constructor (Game) {
    this.players = []
    this.id = Math.floor(Math.random() * 10000)
    this.waitingOpponents = true
    this.Game = Game
  }

  addPlayer (player) {
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
    if (!this.Game.canStartWith(this.players)) {
      this.messagePlayers('Not enough players to continue.')
      if (this.match) this.match.finish()
    }
    if (!this.empty()) { this.waitingOpponents = true }
  }

  tryToStartGame () {
    console.log('Trying to start game...')

    if (this.Game.canStartWith(this.players)) {
      console.log('Starting game...')
      this.shufflePlayers()
      this.match = new this.Game(this.players, this)
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
}

module.exports = Table
