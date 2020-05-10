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

  it('should respond to socket connections on tic-tac-toe with a message', 
    (done) => {
    let socket = connectSocket('/tictactoe')
    socket.on('message', () => {
      socket.disconnect()
      done()
    })
  })

  after(() => {
    if(httpServer) httpServer.close()
  })
})
