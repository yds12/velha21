// entering table
const enterTableForm = document.getElementById('enter-table-form')
const enterTableId = document.getElementById('enter-table-id')
const enterPlayerName = document.getElementById('enter-player-name')
const gameBox = document.getElementById('game-box')
const enterTableBox = document.getElementById('enter-table-box')
const enterTableErrorMessage = document.getElementById('enter-table-error-message')
gameBox.style.display = 'none'
enterTableBox.style.display = 'block'

const tableId = (new URL(window.location.href)).searchParams.get('tableId')
if (tableId) enterTableId.value = tableId

enterTableForm.addEventListener('submit', (event) => {
  socket.emit('enterTable', {
    playerName: enterPlayerName.value,
    tableId: enterTableId.value
  })
  event.preventDefault()
})

socket.on('enterTableResponse', (response) => {
  if (response === 'success') {
    gameBox.style.display = 'block'
    enterTableBox.style.display = 'none'
  } else {
    gameBox.style.display = 'none'
    enterTableBox.style.display = 'block'
    enterTableErrorMessage.innerText = response
  }
})

// Screen elements
const divMsg = document.getElementById('messages')
const ulPlayers = document.getElementById('players')
const btnClear = document.getElementById('clear')
const btnStart = document.getElementById('start')

// Event Handling (sockets)
socket.on('connect', () => {
  clearMessages()
  logMessage('Socket connected!')
})

socket.on('message', (msg) => {
  logMessage(msg)
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

function logMessage (msg) {
  const date = new Date()
  const time = date.toLocaleTimeString()
  divMsg.innerHTML = time + ': ' + msg + '</br>' + divMsg.innerHTML
}

function clearMessages () {
  divMsg.innerHTML = ''
}

btnStart.onclick = (event) => {
  socket.emit('start')
}

btnClear.onclick = (event) => {
  socket.emit('clear')
}
