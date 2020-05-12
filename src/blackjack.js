const Game = require('./game')

class Blackjack extends Game {
  constructor (table) {
    super(table)
    this.type = 'blackjack'
    this.name = 'Blackjack'
    this.started = false
  }

  canStart() {
    return this.started
  }

  start() {
    super.start()
  }

  reset() {
    super.reset()
  }

}

module.exports = Blackjack
