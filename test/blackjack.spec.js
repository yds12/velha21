const path = require('path')
const assert = require('assert')

const Blackjack = require(path.join(__dirname, '../src/blackjack'))
const OriginalPlayer = require(path.join(__dirname, '../src/player'))
const Table = require(path.join(__dirname, '../src/table'))

class Player extends OriginalPlayer {
  // todo this class is repeated in two files
  constructor (name) {
    super(name, null)
  }

  message (message) {
    console.log(message)
  }

  updateGameState (state) {
    console.log('updateGameState ', state)
  }
}

describe('Blackjack', () => {
  let table = null
  let game = null
  let player1 = null
  let player2 = null
  let observer = null

  beforeEach(() => {
    table = new Table('blackjack', 42)
    game = table.game
    player1 = new Player('player1')
    player2 = new Player('player2')
    observer = new Player('observer')
    observer.isObserver = true
  })

  afterEach(() => {
    table = null
    game = null
    player1 = null
    player2 = null
    observer = null
  })

  describe('status', () => {
    it('should be ONGOING after game starts', () => {
      table.addPlayer(player1)
      table.addPlayer(player2)
      game.start()
      assert.strictEqual(game.status, Blackjack.ONGOING)
    })

    it('should be WAITING before game starts', () => {
      table.addPlayer(player1)
      assert.strictEqual(game.status, Blackjack.WAITING)
    })
  })

  describe('getNumPlayers()', () => {
    it('should return 0 if there are no players', () => {
      assert.strictEqual(game.getNumPlayers(), 0)
    })
    it('should return 1 if there is one player', () => {
      table.addPlayer(player1)
      assert.strictEqual(game.getNumPlayers(), 1)
    })
    it('should return 0 if there are only observers', () => {
      table.addPlayer(observer)
      assert.strictEqual(game.getNumPlayers(), 0)
    })
  })

  describe('moveIsValid()', () => {
    it('only player1 can move', () => {
      table.addPlayer(player1)
      table.addPlayer(player2)
      table.addPlayer(observer)
      game.start()
      assert.strictEqual(game.moveIsValid(player1, Blackjack.STAND), true)
      assert.strictEqual(game.moveIsValid(player1, Blackjack.HIT), true)
      assert.strictEqual(game.moveIsValid(player2, Blackjack.STAND), false)
      assert.strictEqual(game.moveIsValid(player2, Blackjack.HIT), false)
      assert.strictEqual(game.moveIsValid(observer, Blackjack.STAND), false)
      assert.strictEqual(game.moveIsValid(observer, Blackjack.HIT), false)
    })

    it('only player1 can move independent of the order', () => {
      table.addPlayer(player1)
      table.addPlayer(observer)
      table.addPlayer(player2)
      game.start()
      assert.strictEqual(game.moveIsValid(player1, Blackjack.STAND), true)
      assert.strictEqual(game.moveIsValid(player1, Blackjack.HIT), true)
      assert.strictEqual(game.moveIsValid(player2, Blackjack.STAND), false)
      assert.strictEqual(game.moveIsValid(player2, Blackjack.HIT), false)
      assert.strictEqual(game.moveIsValid(observer, Blackjack.STAND), false)
      assert.strictEqual(game.moveIsValid(observer, Blackjack.HIT), false)
    })

    it('should return false if game did not start', () => {
      assert.strictEqual(game.moveIsValid(player1, null), false)
    })

    it('should return false for any moves from the observer', () => {
      table.addPlayer(player1); table.addPlayer(player2); table.addPlayer(observer)
      assert.strictEqual(game.moveIsValid(observer, { x: 0, y: 0 }), false)
    })
  })

  describe('handsum', () => {
    it('should start with more than 1 and at most 21', () => {
      table.addPlayer(player1)
      table.addPlayer(player2)
      game.start()
      assert.strictEqual(game.handSum(player1) < 22, true)
      assert.strictEqual(game.handSum(player1) > 1, true)
      assert.strictEqual(game.handSum(player2) < 22, true)
      assert.strictEqual(game.handSum(player2) > 1, true)
    })
    it('should start with more than 1 and at most 21', () => {
      table.addPlayer(player1)
      game.start()
      game.hands[player1.id] = [3, 4]
      assert.strictEqual(game.handSum(player1), 7)
      game.hands[player1.id] = [1, 11]
      assert.strictEqual(game.handSum(player1), 21)
      game.hands[player1.id] = [1, 12]
      assert.strictEqual(game.handSum(player1), 21)
      game.hands[player1.id] = [1, 13]
      assert.strictEqual(game.handSum(player1), 21)
      game.hands[player1.id] = [1, 1]
      assert.strictEqual(game.handSum(player1), 12)
    })
  })

  describe('getWinner', () => {
    it('should return -1 if no player has 21', () => {
      table.addPlayer(player1)
      game.start()
      game.hands[player1.id] = [3, 4]
      assert.strictEqual(game.getWinner(), -1)
    })
    it('should return 0 if first player has 21', () => {
      table.addPlayer(player1)
      game.start()
      game.hands[player1.id] = [1, 11]
      assert.strictEqual(game.getWinner(), 0)
    })
    it('should return 1 if first player has 21', () => {
      table.addPlayer(player1)
      table.addPlayer(player2)
      game.start()
      game.hands[player1.id] = [1, 1]
      game.hands[player2.id] = [1, 11]
      assert.strictEqual(game.getWinner(), 1)
    })
    it('should not let observer change winner', () => {
      table.addPlayer(player1)
      table.addPlayer(observer)
      table.addPlayer(player2)
      game.start()
      game.hands[player2.id] = [1, 11]
      assert.strictEqual(game.getWinner(), 1)
    })
  })
})
