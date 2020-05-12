class Game {
  static ONGOING = 0
  static FINISHED = 1

  constructor (table) {
    this.name = 'Game'
    this.type = 'game'
    this.table = table
    this.players = table.players
  }

  canStart () {
    return true
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

  logMove (player, move) {}

  executeMove (player, move) {}

  moveIsValid (player, move) {
    if (player.isObserver) {
      player.message('You are not playing!')
      return false
    }

    if (this.status !== Game.ONGOING) {
      player.message('Game finished.')
      return false
    }
    if (!this.isPlayerTurn(player)) {
      player.message('It is not your turn.')
      return false
    }
    return true
  }

  isPlayerTurn (player) {
    return (this.players.indexOf(player) === this.turn % this.getNumPlayers())
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

  getNumPlayers() {
    let n = 0
    for(let player of this.players) {
      if(!player.isObserver) n++;
    }
    return n
  }
}

module.exports = Game
