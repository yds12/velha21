const Game = require('./game')

class Blackjack extends Game {
  constructor (table) {
    super(table)
    this.type = 'blackjack'
    this.name = 'Blackjack'
  }

  start() {
    super.start()
  }

  reset() {
    super.reset()
  }

  getNumPlayers() {
    let n = 0
    for(let player of this.players) {
      if(!player.isObserver) n++;
    }
    return n
  }
}

module.exports = Blackjack
