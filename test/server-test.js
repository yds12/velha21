const http = require('http')
const path = require('path')
const socketIoClient = require('socket.io-client')
const assert = require('assert')
const CONFIG = require(path.join(__dirname, '../config'))
const server = require(path.join(__dirname, '../src/server'))

const port = CONFIG.port

describe('server', () => {

  let httpServer

  const options = {
    host: 'localhost', port: port, path: '/', method: 'GET'
  }

  before((done) => {
    http.get(options, res => {
      console.log('Server already running...')
      done()
    }).on('error', err => {
      console.log('Server not running. Starting it for the tests...')

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

  it('should listen at ' + port, (done) => {
    http.get(options, (res) => {
      assert.equal(res.statusCode, 200)
      done()
    })
  })

  after(() => {
    if(httpServer) httpServer.close()
  })
})
