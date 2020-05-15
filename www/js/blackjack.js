// Socket setup
const HOST = window.location.hostname
const connectTo = (HOST === 'localhost') ? `${HOST}:${PORT}` : HOST
const socket = io(connectTo + '/blackjack')

// Screen elements
const divMsg = document.getElementById('messages')
const btnClear = document.getElementById('clear')
const btnStart = document.getElementById('start')
const btnHit = document.getElementById('hit')
const btnStand = document.getElementById('stand')
const canvas = document.getElementById('screen')
canvas.width = 800
canvas.height = 600
canvas.style = 'border: solid 1px black;'
const ctx = canvas.getContext('2d')
let imgCards, imgBack, imgBg

// Game variables
const SCREEN_W = canvas.width
const SCREEN_H = canvas.height
const CARD_W = 77
const CARD_H = 112
const HAND_SEP = 36

let HANDS = []
let OPPONENTS, TABLE, DECK

const HIT = 0
const STAND = 1

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
  //  gameState = state;
  if (state !== null) {
    HANDS = state.hands
  }
  draw()
})

// Game functions
function loadImages () {
  let loaded = 0
  imgCards = document.createElement('img')
  imgBack = document.createElement('img')
  imgBg = document.createElement('img')
  imgCards.src = '../res/img/cards.png'
  imgBack.src = '../res/img/back.png'
  imgBg.src = '../res/img/bg.png'

  const f = () => {
    loaded++
    if (loaded === 3) start()
  }

  imgCards.onload = f
  imgBack.onload = f
  imgBg.onload = f
}

function start () {
}

function drawCard (card, pos) {
  const xpos = card.value - 1
  const ypos = card.suit

  ctx.drawImage(imgCards, xpos * CARD_W, ypos * CARD_H, CARD_W, CARD_H,
    pos.x, pos.y, CARD_W, CARD_H)
}

function drawBg () {
}

function drawTable () {
}

function drawHands () {
  let x = 10
  let y = 10
  for (const hand of HANDS) {
    for (const card of hand) {
      drawCard(card, { x: x, y: y })
      x += CARD_W + HAND_SEP
    }
    x = 10
    y += CARD_H + 2 * HAND_SEP
  }
}

function drawDeck () {
}

function draw () {
  ctx.clearRect(0, 0, SCREEN_W, SCREEN_H)
  drawBg()
  drawTable()
  drawDeck()
  drawHands()
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
  draw()

/*  if(quad){
    ctx.fillStyle = '#33333388';
    ctx.fillRect(BOARD.x + quad.x * BOARD.tile,
      BOARD.y + quad.y * BOARD.tile, BOARD.tile, BOARD.tile);
  } */
}

canvas.onclick = (event) => {
  // socket.emit('click', {});
}
// hit
btnHit.onclick = (event) => {
  socket.emit('click', HIT)
}

// hit
btnStand.onclick = (event) => {
  socket.emit('click', STAND)
}

btnStart.onclick = (event) => {
  socket.emit('start')
}

btnClear.onclick = (event) => {
  socket.emit('clear')
}

// Initialization
loadImages()
