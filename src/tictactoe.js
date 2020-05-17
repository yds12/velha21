const Game = require('./game')

class TicTacToe extends Game {
  constructor (table) {
    super(table)
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.type = 'tictactoe'
    this.name = 'Tic-tac-toe'
  }

  canStart () {
    return this.getNumPlayers() === 2
  }

  start () {
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    if (this.getNumPlayers() < 2) {
      this.table.messagePlayers('not enough players')
      return false
    }
    this.makeExtraPlayersObservers()
    return super.start()
  }

  getGameState () {
    return this.board
  }

  makeExtraPlayersObservers () {
    const currentPlayers = this.getPlayers()
    if (currentPlayers.length > 2) {
      for (let i = 2; i < currentPlayers.length; i++) {
        currentPlayers[i].turnIntoObserver()
      }
    }
  }

  logMove (player, move) {
    this.table.messagePlayers(`Player ${player.name} clicked on quadrant ${move.x}, ${move.y}`)
  }

  executeMove (player, move) {
    this.fill(move.x, move.y, player)
  }

  moveIsValid (player, move) {
    if (!super.moveIsValid(player, move)) {
      return false
    }
    if (!this.isFree(move.x, move.y)) {
      player.message('This square is already filled.')
      return false
    }
    return true
  }

  isFree (x, y) {
    return this.board[y * 3 + x] === 0
  }

  fill (x, y, player) {
    this.board[y * 3 + x] = this.players.indexOf(player) + 1
  }

  sendState () {
    for (let i = this.players.length - 1; i >= 0; i--) {
      this.players[i].updateGameState(this.board)
    }
  }

  checkEnd () {
    const winners = this.getWinners()
    return (this.turn === 8) || (winners.length !== 0)
  }

  sendResults () {
    const winners = this.getWinners()
    if (winners.length === 0) {
      this.table.messagePlayers('Draw!')
    } else {
      for (let i = this.players.length - 1; i >= 0; i--) {
        if (winners.includes(i + 1)) {
          this.players[i].message('Congratulations, you won!')
        } else if (!this.players[i].isObserver) {
          this.players[i].message('You lost!')
        } else {
          const winnersNames = winners.map(x => x.name)
          this.players[i].message(`Player ${winnersNames.join(' ')} won!`)
        }
      }
    }
  }

  getWinners () {
    if (this.turn < 4) return []
    const gs = this.board

    for (let i = 0; i < 3; i++) {
      if (gs[i * 3] === gs[i * 3 + 1] &&
          gs[i * 3 + 1] === gs[i * 3 + 2] &&
          gs[i * 3] > 0) {
        return [gs[i * 3]]
      }
      if (gs[i] === gs[i + 3] &&
          gs[i + 3] === gs[i + 6] &&
          gs[i] > 0) {
        return [gs[i]]
      }
    }
    if (gs[0] === gs[4] && gs[4] === gs[8] && gs[0] > 0) { return [gs[0]] }
    if (gs[2] === gs[4] && gs[4] === gs[6] && gs[2] > 0) { return [gs[2]] }
    return []
  }
}

module.exports = TicTacToe
