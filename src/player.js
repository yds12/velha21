class Player {
  constructor (name, socket) {
    this.isObserver = false
    this.name = name
    this.socket = socket
    this.id = Math.floor(Math.random() * 1000000)
  }

  message (message) {
    this.socket.emit('message', message)
  }

  updateGameState (state) {
    this.socket.emit('state', state)
  }

  setTable (table) {
    this.table = table
    // At this point table.match.name is undefined
    this.message(`You joined table ${table.id}.`)
    // to play ${table.match.name}.`);
  }
}

module.exports = Player
