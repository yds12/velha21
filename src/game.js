class Game {
  static WAITING = 2
  static ONGOING = 0
  static FINISHED = 1

  constructor (table) {
    this.name = 'Game'
    this.type = 'game'
    this.table = table
    this.players = table.players
    this.status = Game.WAITING
  }

  canStart () {
    return true
  }

  start () {
    this.status = Game.ONGOING
    this.turn = 0
    for (let i = this.players.length - 1; i >= 0; i--) {
      this.players[i].message(
        `The game is starting. You are player ${i + 1}.`)
    }
    //console.log(
    //  `A game of ${this.name} is starting on table ${this.table.id}.`)
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

  finish () {
    // return to table | start again | return to server
    this.table.messagePlayers('End of the game')
    //console.log('End of the game', this.name)
    this.status = Game.FINISHED
  }

  // Just the non-observers
  getPlayers() {
    return this.players.filter(pl => !pl.isObserver);
  }

  // Just the non-observers
  getNumPlayers() {
    return this.getPlayers().length
  }

  checkEnd () {
    return false
  }

  getWinner () {
    return 0
  }

  logMove (player, move) {}

  executeMove (player, move) {}
}

module.exports = Game
