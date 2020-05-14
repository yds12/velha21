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

  canStart () {
    return this.started
  }

  start () {
    this.deck = cardUtil.createDeck()
    util.shuffle(this.deck)
    this.createPlayerStates()
    this.createPlayerHands()
    this.currentPlayer = 0
    this.lastCard = null
    this.state = this.getGameState()
    super.start()
  }

  createPlayerStates () {
    this.playerStates = this.getPlayers().reduce((states, player) => {
      if (!player.isObserver) states[player.id] = PLAYING
      return states
    }, {})
  }

  createPlayerHands () {
    this.hands = this.getPlayers().reduce((states, player) => {
      if (!player.isObserver) states[player.id] = [this.deck.pop(), this.deck.pop()]
      return states
    }, {})
    this.hands.dealer = [this.deck.pop(), this.deck.pop()]
  }

  moveIsValid (player, move) {
    if (!super.moveIsValid(player, move)) {
      return false
    }
    if ((move === HIT) && (this.playerStates[player.id] !== BUSTED)) {
      player.message('You are not playing anymore.')
      return false
    }
    return true
  }

  executeMove (player, move) {
    switch (move) {
      case HIT: {
        this.buyCard(player)
        break
      }
      case STAND: {
        this.playerStates[player.id] = STOPPED
        break
      }
    }
  }

  buyCard (player) {
    this.hands[player.id].push(this.deck.pop())
    if (this.handSum(player) > 21) {
      this.playerStates[player.id] = BUSTED
    }
  }

  cardPoint (card) {
    const v = cardUtil.decodeCard(card).value
    if (v === 1) { return 11 } else if (v < 11) { return v } else if (v <= 13) { return 10 }
  }

  handSum (player) {
    const initialSum = this.hands[player.id].reduce((sum, card) => sum + this.cardPoint(card), 0)
    if ((initialSum > 21) && this.hasAceOn(this.hands[player.id])) { return initialSum - 10 } else { return initialSum }
  }

  hasAceOn (hand) {
    for (const card of hand) {
      if (cardUtil.decodeCard(card).value === 1) { return true }
    }
    return false
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
  getGameState () {
    return {
      numPlayers: this.getNumPlayers(),
      playerStates: this.playerStates,
      currentPlayer: this.currentPlayer,
      hands: this.hands,
      lastCard: this.lastCard
    }
  }

  noPlayerPlaying () {
    for (const player of this.players) {
      if (this.playerStates[player.id] === PLAYING) { return false }
    }
    return true
  }
}

module.exports = Blackjack
