const Game = require('./game')
const util = require('./util')
const cardUtil = require('./card-util')

class Blackjack extends Game {
  constructor (table) {
    super(table)
    this.type = 'blackjack'
    this.name = 'Blackjack'
    this.started = false
    this.deck = []
  }

  canStart() {
    return this.started
  }

  start() {
    super.start()
    this.deck = cardUtil.createDeck()
    util.shuffle(this.deck)
    console.log(this.deck)
  }

  /*
   * The public game state (which will be sent to players)
   * should have the following information:
   * - number of players
   * - state of players
   * - current player
   * - set of cards of each player
   * - last drawn card
   */
  getGameState() {
    return {
      numPlayers: this.getNumPlayers(),
      playerStates: this.playerStates,
      currentPlayer: this.currentPlayer,
      hands: this.hands,
      lastCard: this.lastCard
    }
  }
}

module.exports = Blackjack
