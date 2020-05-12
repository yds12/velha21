const path = require('path')
const assert = require('assert')

const TicTacToe = require(path.join(__dirname, '../src/tictactoe'))
const OriginalPlayer = require(path.join(__dirname, '../src/player'))
const Table = require(path.join(__dirname, '../src/table'))

class Player extends OriginalPlayer {
  constructor (name) {
    super(name, null)
  }

  message (message) {
    //console.log(message)
  }

  updateGameState (state) {
    //console.log('updateGameState ', state)
  }
}

describe('TicTacToe', () => {
  let table = null
  let game = null
  let player1 = null
  let player2 = null
  let observer = null

  beforeEach(() => {
    table = new Table('tictactoe', 42)
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
      assert.strictEqual(game.status, TicTacToe.ONGOING)
    })

    it('should be FINISHED before game starts', () => {
      table.addPlayer(player1)
      assert.strictEqual(game.status, TicTacToe.FINISHED)
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
    it('should return true', () => {
      table.addPlayer(player1)
      table.addPlayer(player2)
      assert.strictEqual(game.moveIsValid(table.players[0], { x: 0, y: 0 }), true)
    })
    it('should return false if game did not start', () => {
      assert.strictEqual(game.moveIsValid(player1, null), false)
    })
    it('should return false if cell if filled', () => {
      table.addPlayer(player1)
      table.addPlayer(player2)
      game.update(table.players[0], { x: 0, y: 0 })
      assert.strictEqual(game.moveIsValid(table.players[0], { x: 0, y: 0 }), false)
    })
    it('should return false for any moves from the observer', () => {
      table.addPlayer(player1); table.addPlayer(player2); table.addPlayer(observer)
      assert.strictEqual(game.moveIsValid(observer, { x: 0, y: 0 }), false)
    })
  })
})
