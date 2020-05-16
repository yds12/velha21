const Game = require('./game')
const util = require('./util')
const cardUtil = require('./card-util')


class Blackjack extends Game {

  static PLAYING = 0
  static BUSTED = 1
  static STOPPED = 2
  static VICTORIOUS = 3

  static HIT = 0
  static STAND = 1

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
      if (!player.isObserver) states[player.id] = Blackjack.PLAYING
      return states
    }, {})
  }

  createPlayerHands () {
    this.hands = this.getPlayers().reduce((hand, player) => {
      hand[player.id] = [this.deck.pop(), this.deck.pop()]
      return hand
    }, {})
    for (let player of this.getPlayers())
      this.updatePlayerState(player)

    this.hands.dealer = [this.deck.pop(), this.deck.pop()]
  }

  moveIsValid (player, move) {
    if (!super.moveIsValid(player, move)) {
      return false
    }
    if ((move === Blackjack.HIT) && 
      (this.playerStates[player.id] !== Blackjack.PLAYING)) {
      player.message('You are not playing anymore.')
      return false
    }
    return true
  }

  isPlayerTurn (player) {
    return this.playerStates[player.id] === Blackjack.PLAYING
  }

  executeMove (player, move) {
    switch (move) {
      case Blackjack.HIT: {
        this.buyCard(player)
        this.updatePlayerState(player)
        break
      }
      case Blackjack.STAND: {
        this.playerStates[player.id] = Blackjack.STOPPED
        break
      }
    }
    this.state = this.getGameState()
  }

  updatePlayerState (player) {
    const handTotal = this.handSum(player)
    if (handTotal > 21) {
      this.playerStates[player.id] = Blackjack.BUSTED
      player.message("You are busted!")
    }
    else if (this.handSum(player) === 21) {
      this.playerStates[player.id] = Blackjack.VICTORIOUS
      player.message('You win!')
    }
    else
      player.message("You may keep playing!")
  }

  buyCard (player) {
    this.hands[player.id].push(this.deck.pop())
  }

  cardPoint (card) {
    const v = cardUtil.decodeCard(card).value
    if (v === 1) { return 11 } else if (v < 11) { return v } else if (v <= 13) { return 10 }
  }

  handSum (player) {
    let total = this.hands[player.id].reduce((sum, card) => sum + this.cardPoint(card), 0)
    let usableAces = this.numberOfAces(this.hands[player.id])
    while ((total > 21) && (usableAces > 0)){
      total -= 10
      usableAces -= 1
    }
    return total
  }

  numberOfAces (hand) {
    let total = 0
    for (const card of hand) {
      if (cardUtil.decodeCard(card).value === 1)
        total += 1
    }
    return total
  }

  checkEnd () {
    if (this.noPlayerPlaying()) {
      this.status = Game.FINISHED
      return true
    }
    else
      return false
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
      hands: this.getListOfHands(),
      lastCard: this.lastCard
    }
  }

  getListOfHands () {
    const listOfHands = []
    for (let player of this.getPlayers())
      listOfHands.push(this.getPlayerCards(player.id))

    let dealerCards = this.getPlayerCards('dealer')
    dealerCards.pop()
    dealerCards.push(-1)  // only show 1 card of dealer
    listOfHands.push(dealerCards)
//    listOfHands.push(this.getPlayerCards('dealer'))
    return listOfHands
  }

  getPlayerCards (playerId) {
    return this.hands[playerId].reduce((cards, cardNumber) => {
      cards.push(cardUtil.decodeCard(cardNumber))
      return cards
    }, [])
  }
  

  noPlayerPlaying () {
    for (const player of this.getPlayers())
      if (this.playerStates[player.id] === Blackjack.PLAYING)
        return false
    return true
  }

  getWinner () {
    for (const player of this.players)
      if (this.handSum(player) === 21)
        return this.players.indexOf(player)
    return -1
  }
}

module.exports = Blackjack
