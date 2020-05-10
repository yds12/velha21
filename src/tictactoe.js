const Game = require('./game')

class TicTacToe extends Game {
  static canStartWith (players) {
    return players.length === 2
  }

  constructor (table) {
    super(table)
    this.state = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.name = 'tic-tac-toe'
  }

  start () {
    Game.prototype.start.call(this) // call the method in the parent
  }

  reset () {
    this.state = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    Game.prototype.reset.call(this)
  }

  logMove (player, move) {
    console.log(
      `Player ${player.name} clicked on quadrant ${move.x}, ${move.y}`)
  }

  executeMove (player, move) {
    this.fill(move.x, move.y, player)
  }

  moveIsValid (player, move) {
    if (player.isObserver) {
      player.message('You are not playing!')
      return false
    }

    if (this.status !== Game.ONGOING) {
      player.message('Game finished.')
      return false
    }
    if (!this.isFree(move.x, move.y)) {
      player.message('This square is already filled.')
      return false
    }
    if (!this.isPlayerTurn(player)) {
      player.message('It is not your turn.')
      return false
    }
    return true
  }

  isPlayerTurn (player) {
    return (this.players.indexOf(player) === this.turn % 2)
  }

  isFree (x, y) {
    return this.state[y * 3 + x] === 0
  }

  fill (x, y, player) {
    this.state[y * 3 + x] = this.players.indexOf(player) + 1
  }

  sendState () {
    for (let i = this.players.length - 1; i >= 0; i--) {
      this.players[i].updateGameState(this.state)
    }
  }

  checkEnd () {
    const winner = this.getWinner()
    if (this.turn === 8 && winner <= 0) {
      for (let i = this.players.length - 1; i >= 0; i--) {
        this.players[i].message('Draw!')
      }
      this.status = Game.FINISHED
    } else {
      if (winner <= 0) { return }
      this.status = Game.FINISHED
      for (let i = this.players.length - 1; i >= 0; i--) {
        if (i === (winner - 1)) {
          this.players[i].message('Congratulations, you won!')
        } else if (!this.players[i].isObserver) {
          this.players[i].message('You lost!')
        } else {
          this.players[i].message(
            `Player ${this.players[winner - 1].name} won!`)
        }
      }
    }
  }

  getWinner () {
    if (this.turn < 4) return 0
    const gs = this.state

    for (let i = 0; i < 3; i++) {
      if (gs[i * 3] === gs[i * 3 + 1] && gs[i * 3 + 1] === gs[i * 3 + 2] &&
        gs[i * 3] > 0) { return gs[i * 3] }
      if (gs[i] === gs[i + 3] && gs[i + 3] === gs[i + 6] &&
        gs[i] > 0) { return gs[i] }
    }
    if (gs[0] === gs[4] && gs[4] === gs[8] && gs[0] > 0) { return gs[0] }
    if (gs[2] === gs[4] && gs[4] === gs[6] && gs[2] > 0) { return gs[2] }
    return 0
  }
}

module.exports = TicTacToe
