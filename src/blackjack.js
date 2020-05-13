const Game = require('./game')
const util = require('./util')
const cardUtil = require('./card-util')

const PLAYING = 0
const BUST = 1

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
    this.deck = cardUtil.createDeck()
    util.shuffle(this.deck)
    this.createPlayerStates()
    this.createPlayerHands()
    this.currentPlayer = 0
    this.lastCard = null
    this.state = this.getGameState()
    super.start()
  }

  createPlayerStates() {
    this.playerStates = this.getPlayers().map(player => PLAYING)
  }

  createPlayerHands() {
    this.hands = this.getPlayers().map(player => [])
    this.hands.push([]) // dealer
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
