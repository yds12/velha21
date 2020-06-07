const path = require('path')
const Player = require(path.join(__dirname, '../src/player'))

class MockPlayer extends Player {
  constructor (name) {
    super(name, null)
  }

  message (message) {
    // console.log(message)
  }

  logMove (message) {
    // console.log(message)
  }

  updateGameState (state) {
    // console.log('updateGameState ', state)
  }
}

module.exports = MockPlayer
