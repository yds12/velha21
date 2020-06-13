/* global socket */

// Screen elements
const canvas = document.getElementById('screen')
const ctx = canvas.getContext('2d')
const imgCircle = document.createElement('img')
const imgCross = document.createElement('img')
imgCircle.src = '../res/img/circle.png'
imgCross.src = '../res/img/cross.png'

// Game variables
let gameState = [0, 0, 0, 0, 0, 0, 0, 0, 0]

const SCREEN_W = canvas.width

const PADDING_RATIO = 0.02
const TILE_RATIO = (1 - 2 * PADDING_RATIO) / 3
const BOARD = {
  padding: canvas.width * PADDING_RATIO,
  tile: canvas.width * TILE_RATIO
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
          BOARD.padding + BOARD.tile * i, BOARD.padding + BOARD.tile * j, BOARD.tile, BOARD.tile)
      } else if (cell === 2) { // draw O
        ctx.drawImage(imgCircle,
          BOARD.padding + BOARD.tile * i, BOARD.padding + BOARD.tile * j, BOARD.tile, BOARD.tile)
      }
    }
  }
}

function findQuadrant (x, y) {
  const clientTile = canvas.clientWidth * TILE_RATIO
  const clientPadding = canvas.width * PADDING_RATIO
  const rect = canvas.getBoundingClientRect()
  x -= rect.left
  y -= rect.top
  const pos = {
    x: 0,
    y: 0
  }
  if (x > clientPadding && x <= (clientPadding + clientTile)) {
    pos.x = 0
  } else if (x > (clientPadding + clientTile) && x <= (clientPadding + 2 * clientTile)) {
    pos.x = 1
  } else if (x > (clientPadding + 2 * clientTile) && x <= (clientPadding + 3 * clientTile)) {
    pos.x = 2
  } else return null

  if (y > clientPadding && y <= (clientPadding + clientTile)) {
    pos.y = 0
  } else if (y > (clientPadding + clientTile) && y <= (clientPadding + 2 * clientTile)) {
    pos.y = 1
  } else if (y > (clientPadding + 2 * clientTile) && y <= (clientPadding + 3 * clientTile)) {
    pos.y = 2
  } else return null

  return pos
}

// Event handling (window)
canvas.onmousemove = (event) => {
  drawBoard()
  const quad = findQuadrant(event.clientX, event.clientY)
  if (quad) {
    ctx.fillStyle = '#33333388'
    ctx.fillRect(BOARD.padding + quad.x * BOARD.tile,
      BOARD.padding + quad.y * BOARD.tile, BOARD.tile, BOARD.tile)
  }
}

canvas.onclick = (event) => {
  const quad = findQuadrant(event.clientX, event.clientY)

  if (quad) socket.emit('click', quad)
}

// Initialization
updateGameState({ board: [0, 0, 0, 0, 0, 0, 0, 0, 0] })
