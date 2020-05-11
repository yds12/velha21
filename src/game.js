class Game {
  static ONGOING = 0
  static FINISHED = 1

  static PLAYER1 = 1
  static PLAYER2 = 2

  constructor (table) {
    this.name = 'Game'
    this.type = 'game'
    this.table = table
    this.players = table.players
  }

  canStart () {
    return this.players.length === 2
  }

  start () {
    for (let i = this.players.length - 1; i >= 0; i--) {
      this.players[i].message(
        `The game is starting. You are player ${i + 1}.`)
    }
    console.log(
      `A game of ${this.name} is starting on table ${this.table.id}.`)
  }

  reset () {
    this.status = Game.ONGOING
    this.state = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.turn = 0
    this.start()
    this.sendState()
  }

  update (player, move) {
    this.logMove(player, move)
    if (!this.moveIsValid(player, move)) {
      return
    }
    this.executeMove(player, move)
    this.sendState()
    this.checkEnd()
    this.turn++
  }

  logMove (player, move) {
    return
  }

  executeMove (player, move) {
    return
  }

  moveIsValid (player, move) {
    return true
  }

  isPlayerTurn (player) {
    return (this.players.indexOf(player) === this.turn % 2)
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
