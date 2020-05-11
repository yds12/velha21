const Game = require('./game')

class Blackjack extends Game {
  constructor (table) {
    super(table)
    this.type = 'blackjack'
    this.name = 'Blackjack'
  }
}

module.exports = Blackjack
