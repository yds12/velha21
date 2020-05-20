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
    this.message(`Hello ${this.name}, welcome.`)
  }

  turnIntoObserver () {
    this.isObserver = true
  }
}

module.exports = Player
