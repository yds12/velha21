class Game {
  static ONGOING = 0
  static FINISHED = 1

  static OBSERVER = -1
  static PLAYER1 = 1
  static PLAYER2 = 2

  static canStartWith (players) {
    return players.length === 2
  }

  constructor (players, table) {
    this.players = players
    this.table = table
    this.reset()
  }

  start () {
    for (let i = this.players.length - 1; i >= 0; i--) {
      this.players[i].message(
        `The game is starting. You are player ${i + 1}.`)
    }
    console.log('A match of', this.name, 'is starting on table', this.table.id)
  }

  reset () {
    this.status = Game.ONGOING
    this.state = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.turn = 0
    this.start()
    this.sendState()
  }

  update (player, move) {
    console.log(
        `Player ${player.socket.id} clicked on quadrant ${move.x}, ${move.y}`)
    if (!this.moveIsValid(player, move)) {
      return
    }
    this.fill(move.x, move.y, player)
    this.sendState()
    this.checkEnd()
    this.turn++
  }

  moveIsValid (player, move) {
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
    return false
  }

  getWinner () {
    return 0
  }

  finish () {
    // return to table | start again | return to server
    this.table.messagePlayers('End of the game')
    console.log('End of the game', this.name)
    this.status = Game.FINISHED
  }
}

module.exports = Game
