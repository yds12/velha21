
// entering table
const btnEnter = document.getElementById('enter')
const enterTableId = document.getElementById('enter-table-id')
const enterPlayerName = document.getElementById('enter-player-name')
const gameBox = document.getElementById('game-box')
const enterTableBox = document.getElementById('enter-table-box')
const enterTableErrorMessage = document.getElementById('error-message')
gameBox.style.display = 'none'
enterTableBox.style.display = 'block'

let tableId = (new URL(window.location.href)).searchParams.get('tableId')
if (tableId) enterTableId.value = tableId

btnEnter.onclick = (event) => {
  socket.emit('enterTable', {
    "playerName": enterPlayerName.value,
    "tableId": enterTableId.value
  })
}

socket.on('enterTableResponse', (response) => {
  if (response === 'success'){
    gameBox.style.display = 'block'
    enterTableBox.style.display = 'none'
  } else {
    gameBox.style.display = 'none'
    enterTableBox.style.display = 'block'
    enterTableErrorMessage.innerText = response
  }
})