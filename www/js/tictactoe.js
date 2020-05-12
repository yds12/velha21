// Socket setup
const HOST = window.location.hostname
const connectTo = (HOST === 'localhost') ? `${HOST}:${PORT}` : HOST
const socket = io(connectTo + '/tictactoe')

// Screen elements
const divMsg = document.getElementById('messages')
const ulPlayers = document.getElementById('players')
const btnClear = document.getElementById('clear')
const canvas = document.getElementById('screen')
canvas.width = 400
canvas.height = 400
canvas.style = 'border: solid 1px black;'
const ctx = canvas.getContext('2d')
const imgCircle = document.createElement('img')
const imgCross = document.createElement('img')
imgCircle.src = '../res/img/circle.png'
imgCross.src = '../res/img/cross.png'

// Game variables
let gameState = [0, 0, 0, 0, 0, 0, 0, 0, 0]

const SCREEN_W = canvas.width
const SCREEN_H = canvas.height
const BOARD = {
  x: 5,
  y: 5,
  tile: 130
}

// Event Handling (sockets)
socket.on('connect', () => {
  clearMessages()
  logMessage('Socket connected!')
})

socket.on('message', (msg) => {
  logMessage(msg)
})

socket.on('state', (state) => {
  console.log(`State ${JSON.stringify(state)} received`)
  gameState = state
  drawBoard()
})

socket.on('updatePlayers', (players) => {
  let result = ''
  if (players.length > 0) {
    result += '<p>Players:</p><ul>'
    for (const player of players) {
      result += `<li>${player.name} (${player.role})</a></li>`
    }
    result += '</ul>'
  }
  console.log('result')
  ulPlayers.innerHTML = result
})

// Game functions
function drawBoard () {
  ctx.clearRect(0, 0, SCREEN_W, SCREEN_H)

  for (let i = 0; i <= 2; i++) {
    for (let j = 0; j <= 2; j++) {
      const cell = gameState[j * 3 + i]

      if (cell === 1) { // draw X
        ctx.drawImage(imgCross,
          BOARD.x + BOARD.tile * i, BOARD.y + BOARD.tile * j)
      } else if (cell === 2) { // draw O
        ctx.drawImage(imgCircle,
          BOARD.x + BOARD.tile * i, BOARD.y + BOARD.tile * j)
      }
    }
  }
}

function findQuadrant (x, y) {
  const pos = {
    x: 0,
    y: 0
  }

  if (x > BOARD.x && x <= (BOARD.x + BOARD.tile)) {
    pos.x = 0
  } else if (x > (BOARD.x + BOARD.tile) && x <= (BOARD.x + 2 * BOARD.tile)) {
    pos.x = 1
  } else if (x > (BOARD.x + 2 * BOARD.tile) && x <= (BOARD.x + 3 * BOARD.tile)) {
    pos.x = 2
  } else return null

  if (y > BOARD.y && y <= (BOARD.y + BOARD.tile)) {
    pos.y = 0
  } else if (y > (BOARD.y + BOARD.tile) && y <= (BOARD.y + 2 * BOARD.tile)) {
    pos.y = 1
  } else if (y > (BOARD.y + 2 * BOARD.tile) && y <= (BOARD.y + 3 * BOARD.tile)) {
    pos.y = 2
  } else return null

  return pos
}

// Helper functions
function logMessage (msg) {
  const date = new Date()
  const time = date.toLocaleTimeString()
  divMsg.innerHTML = time + ': ' + msg + '</br>' + divMsg.innerHTML
}

function clearMessages () {
  divMsg.innerHTML = ''
}

// Event handling (window)
canvas.onmousemove = (event) => {
//  divMsg.innerHTML += event.clientX + ' ' + event.clientY + '; '
  drawBoard()
  const quad = findQuadrant(event.clientX, event.clientY)

  if (quad) {
    ctx.fillStyle = '#33333388'
    ctx.fillRect(BOARD.x + quad.x * BOARD.tile,
      BOARD.y + quad.y * BOARD.tile, BOARD.tile, BOARD.tile)
  }
}

canvas.onclick = (event) => {
  const quad = findQuadrant(event.clientX, event.clientY)

  if (quad) socket.emit('click', quad)
}

btnClear.onclick = (event) => {
  socket.emit('clear')
}
