const http = require('http')
const path = require('path')
const socketIoClient = require('socket.io-client')
const assert = require('assert')
const CONFIG = require(path.join(__dirname, '../config'))
const server = require(path.join(__dirname, '../src/server'))

const port = CONFIG.port

function connectSocket(path){
  let socketPath = 'http://localhost:' + CONFIG.port + path 
  return socketIoClient.connect(socketPath)
}

describe('server', () => {

  let httpServer, socket

  before((done) => {
    http.get(options, res => {
      console.log('is already running and...')
      done()
    }).on('error', err => {
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
      assert.equal(res.statusCode, 200)
      done()
    })
  })

  it('should accept socket connections', (done) => {
    let socket = connectSocket('/index')
    socket.on('connect', () => {
      socket.disconnect()
      done()
    })
  })

  it('should send an updateTables event to sockets on index', (done) => {
    let socket = connectSocket('/index')
    socket.on('updateTables', () => {
      socket.disconnect()
      done()
    })
  })

  describe('on tic-tac-toe', () => {
    it('should respond to socket connections with a message', 
      (done) => {
      let socket = connectSocket('/tictactoe')
      socket.on('message', () => {
        socket.disconnect()
        done()
      })
    })

    it('should message the player when an opponent joins the table', 
      (done) => {
      let playerSocket = connectSocket('/tictactoe')
      let opponentSocket

      playerSocket.on('connect', () => {
        opponentSocket = connectSocket('/tictactoe')

        opponentSocket.on('connect', () => {
          playerSocket.on('message', () => {
            playerSocket.disconnect()
            done()
          })
          opponentSocket.disconnect()
        })
      })

    })
  })

  after(() => {
    if(httpServer) httpServer.close()
  })
})
