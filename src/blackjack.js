const Game = require('./game')
const util = require('./util')
const cardUtil = require('./card-util')

const PLAYING = 0
const BUSTED = 1
const STOPPED = 2

const HIT = 0
const STAND = 1

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

  moveIsValid (player, move) {
    if (!super.moveIsValid(player, move)) {
      return false
    }
    if ((move === HIT) && (this.getPlayerState(player) === BUSTED)) {
      player.message('You were busted already.')
      return false
    }
    return true
  }

  getPlayerState(player) {
    // todo check actual player state
    return this.playerStates[player]
  }

  executeMove (player, move) {
    switch (move) {
      case HIT: {
        this.buyCard(player)
        break
      }
      case STAND: {
        this.playerStates[player] = STOPPED
        break
      }
    }
  }

  buyCard (player) {

    if (this.handSum(player) > 21) {
      this.playerStates[player] = BUSTED
    }
    if (this.handSum(player) === 21) {
      this.playerStates[player] = BUSTED
    }
  }

  handSum (player) {
    return 0
  }

  checkEnd () {
    return this.noPlayerPlaying() || (this.getWinner() !== -1)
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

  noPlayerPlaying () {
    for (let player of this.players){
      if (this.playerStates[player] === PLAYING)
        return false
    }
    return true
  }
}

module.exports = Blackjack
