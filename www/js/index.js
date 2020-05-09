const HOST = window.location.hostname
const connectTo = (HOST === 'localhost') ? `${HOST}:${PORT}` : HOST
const socket = io(connectTo + '/index')

const ulTables = document.getElementById('tables')

// Event Handling (sockets)
socket.on('updateTables', (tables) => {
  updateTables(tables)
})

function updateTables (tables) {
  let result = ''
  if (tables) {
    result += '<p>Tables:</p><ul>'
    for (table of tables) {
      result += `<li><a href="">${table.id}</a></li>`
    }
    result += '</ul>'
  }
  console.log("result")
  ulTables.innerHTML = result
}
