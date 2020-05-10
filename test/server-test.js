const http = require('http')
const path = require('path')
const assert = require('assert')
const CONFIG = require(path.join(__dirname, '../config'))
const server = require(path.join(__dirname, '../src/server'))

const port = CONFIG.port

const options = {
  host: 'localhost', port: port, path: '/', method: 'GET'
}

console.log('For the tests to work, we are assuming the server is ' +
  `already running at ${options.host}:${options.port}.`)

describe('server', () => {

  before((done) => {
    done()
// Uncomment below to start server automatically before running tests
// (will crash if the server is already running).
//    server.start(CONFIG)
//    setTimeout((err, result) => {
//      if (err) {
//        done(err)
//      } else {
//        done()
//      }
//    }, 200)
  })

  it('should listen at ' + port, (done) => {
    http.get(options, (res) => {
      assert.equal(res.statusCode, 200)
      done()
    })
  })
})
