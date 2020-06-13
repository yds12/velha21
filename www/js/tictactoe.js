/* global socket */

// Screen elements
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

let SCREEN_W = canvas.width

const BOARD = {
  x: 5,
  y: 5,
  tile: (canvas.width - 10) / 3
}

function updateGameState (state) {
  gameState = state.board
  drawBoard()
}

// Game functions
function drawBoard () {
  ctx.clearRect(0, 0, SCREEN_W, SCREEN_W)

  for (let i = 0; i <= 2; i++) {
    for (let j = 0; j <= 2; j++) {
      const cell = gameState[j * 3 + i]

      if (cell === 1) { // draw X
        ctx.drawImage(imgCross,
          BOARD.x + BOARD.tile * i, BOARD.y + BOARD.tile * j, BOARD.tile, BOARD.tile)
      } else if (cell === 2) { // draw O
        ctx.drawImage(imgCircle,
          BOARD.x + BOARD.tile * i, BOARD.y + BOARD.tile * j, BOARD.tile, BOARD.tile)
      }
    }
  }
}

function findQuadrant (x, y) {
  const rect = canvas.getBoundingClientRect()
  x -= rect.left
  y -= rect.top
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

// Event handling (window)
canvas.onmousemove = (event) => {
  SCREEN_W = canvas.width
  BOARD.tile = (canvas.width - 10) / 3
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

// Initialization
updateGameState({ board: [0, 0, 0, 0, 0, 0, 0, 0, 0] })
