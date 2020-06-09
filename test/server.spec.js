const http = require('http')
const path = require('path')
const socketIoClient = require('socket.io-client')
const assert = require('assert')
const CONFIG = require(path.join(__dirname, '../config'))
const server = require(path.join(__dirname, '../src/server'))

const port = CONFIG.port

function connectSocket (path) {
  const socketPath = 'http://localhost:' + CONFIG.port + path
  return socketIoClient.connect(socketPath)
}

describe('server', () => {
  let httpServer

  before((done) => {
    http.get(options, res => {
      console.log('    is already running and...')
      done()
    }).on('error', () => {
      console.log('is not running, we will start it for the tests and it...')

      httpServer = server.start(CONFIG)
      setTimeout((err, result) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      }, 200)
    })
  })

  const options = {
    host: 'localhost', port: port, path: '/', method: 'GET'
  }

  it('should listen at ' + port, (done) => {
    http.get(options, (res) => {
      assert.strictEqual(res.statusCode, 200)
      done()
    })
  })

  it('should accept socket connections', (done) => {
    const socket = connectSocket('/index')
    socket.on('connect', () => {
      socket.disconnect()
      done()
    })
  })

  it('should send an updateTables event to sockets on index', (done) => {
    const socket = connectSocket('/index')
    socket.on('updateTables', () => {
      socket.disconnect()
      done()
    })
  })

  describe('on tic-tac-toe', () => {
    let playerSocket, opponentSocket

    it('should respond to socket connections with a message',
      (done) => {
        const socket = connectSocket('/game')
        socket.emit('enterTable', { playerName: 'Arthur Dent', tableId: 'Persephone', gameType: 'tictactoe' })
        socket.on('message', (message) => {
          socket.disconnect()
          done()
        })
      })

    it('should message the player when an opponent joins the table',
      (done) => {
        playerSocket = connectSocket('/game')
        playerSocket.emit('enterTable', { playerName: 'Arthur Dent', tableId: 'Earth', gameType: 'tictactoe' })
        playerSocket.on('message', (msg) => {
          if (msg.endsWith('joined the table.')) {
            playerSocket.disconnect()
            done()
          }
        })
        playerSocket.on('connect', () => {
          opponentSocket = connectSocket('/game')
          opponentSocket.emit('enterTable', { playerName: 'Ford Prefect', tableId: 'Earth', gameType: 'tictactoe' })
        })
      })

    // Need to find a way to connect both to the same room
    /* it('should send an updated game state after two players connect and ' +
      'one of them makes a move', (done) => {
      playerSocket = connectSocket('/game')
      opponentSocket = connectSocket('/game')
      let stateReceived = false

      playerSocket.on('connect', () => {
        playerSocket.emit('click', { x: 0, y: 0 })

        playerSocket.on('state', (state) => {
          if(!stateReceived && state[0] !== 0) {
            stateReceived = true
            done()
          }
        })
      })

      opponentSocket.on('connect', () => {
        opponentSocket.emit('click', { x: 0, y: 0 })

        opponentSocket.on('state', (state) => {
          if(!stateReceived && state[0] !== 0) {
            stateReceived = true
            done()
          }
        })
      })
    }); */

    after(() => {
      if (playerSocket && playerSocket.connected) playerSocket.disconnect()
      if (opponentSocket && opponentSocket.connected) opponentSocket.disconnect()
    })
  })

  after(() => {
    if (httpServer) httpServer.close()
  })
})
