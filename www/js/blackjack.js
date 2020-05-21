// Socket setup
const HOST = window.location.hostname
const connectTo = (HOST === 'localhost') ? `${HOST}:${PORT}` : HOST

let tableId = (new URL(window.location.href)).searchParams.get('tableId')
if (!tableId) {
  tableId = Math.floor(Math.random() * 10000)
}

const socket = io(connectTo + '/blackjack', { query: { tableId: tableId } })

// Screen elements
const divMsg = document.getElementById('messages')
const ulPlayers = document.getElementById('players')
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
const HAND_SEP = 40
const DEALT_SEP = CARD_W + 5
const HANDS_X_OFFSET = 10
const HANDS_Y_OFFSET = 10
const NAME_H = 40

let NAMES = []
let HANDS = []
let handPositions = []
let OPPONENTS, TABLE, DECK

const HIT = 0
const STAND = 1

const WAITING = 2
const ONGOING = 0
const FINISHED = 1

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
  NAMES = state.playerNames
  if (state.gameStatus === WAITING) {
    btnClear.hidden = true
    btnStart.hidden = false
  } else {
    btnClear.hidden = false
    btnStart.hidden = true
  }
  if (state) {
    HANDS = state.hands
    setHandPositions()
  } else {
    HANDS = []
  }
  draw()
})

socket.on('updatePlayers', (players) => {
  let result = ''
  console.log(players)
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

function setHandPositions () {
  handPositions = []
  for (let i = 0; i < HANDS.length; i++) {
    const x = (i % 2 === 0) ? HANDS_X_OFFSET : HANDS_X_OFFSET + SCREEN_W / 2
    const y = NAME_H + HANDS_Y_OFFSET + Math.floor(i / 2.0) * (CARD_H + HAND_SEP)
    handPositions.push({ x: x, y: y })
  }
}

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
  if (card !== -1) {
    const spriteXpos = card.value - 1
    const spriteYpos = card.suit

    ctx.drawImage(imgCards, spriteXpos * CARD_W, spriteYpos * CARD_H,
      CARD_W, CARD_H, pos.x, pos.y, CARD_W, CARD_H)
  } else {
    ctx.drawImage(imgBack, 0, 0, CARD_W, CARD_H, pos.x, pos.y, CARD_W, CARD_H)
  }
}

function drawName (name, pos) {
  ctx.font = '30px Arial'
  ctx.fillText(name, pos.x, pos.y - 10)
}

function drawBg () {
}

function drawTable () {
}

function drawHands () {
  for (let j = 0; j < HANDS.length; j++) {
    const hand = HANDS[j]
    let x = handPositions[j].x
    const y = handPositions[j].y
    drawName(NAMES[j], { x: x, y: y })
    for (let i = 0; i < hand.length; i++) {
      const card = hand[i]
      drawCard(card, { x: x, y: y })

      if (i === 1) x += DEALT_SEP
      else x += HAND_SEP
    }
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
}

canvas.onclick = (event) => {}

btnHit.onclick = (event) => {
  socket.emit('click', HIT)
}

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
