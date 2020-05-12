const path = require('path')
const assert = require('assert')

const TicTacToe = require(path.join(__dirname, '../src/tictactoe'))
const OriginalPlayer = require(path.join(__dirname, '../src/player'))
const Table = require(path.join(__dirname, '../src/table'))

class Player extends OriginalPlayer {
  constructor () {
    super('name', null)
  }

  message (message) {
    console.log(message)
  }
}

describe('TicTacToe', function () {
  let table = null
  let game = null
  beforeEach(function () {
    table = new Table('tictactoe', 42)
    game = new TicTacToe(table)
  })

  afterEach(function () {
    table = null
    game = null
  })

  describe('#getNumPlayers()', function () {
    it('should return 0 if there are no players', function () {
      assert.strictEqual(game.getNumPlayers(), 0)
    })
  })
  describe('#getNumPlayers()', function () {
    it('should return 1 if there is one player', function () {
      table.addPlayer(new Player())
      assert.strictEqual(game.getNumPlayers(), 1)
    })
  })
  describe('#getNumPlayers()', function () {
    it('should return 0 if there are only observers', function () {
      const player = new Player()
      player.isObserver = true
      table.addPlayer(player)
      assert.strictEqual(game.getNumPlayers(), 0)
    })
  })
})
