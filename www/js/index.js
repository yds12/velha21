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
  if (tables.length > 0) {
    result += '<p>Tables:</p><ul>'
    for (const table of tables) {
      result += `<li><a href="${table.game}/${table.id}">` +
        `${table.game}:${table.id} (${getTableStatus(table)})</a></li>`
    }
    result += '</ul>'
  }
  console.log('result')
  ulTables.innerHTML = result
}

function getTableStatus(table) {
  switch(table.status) {
    case 'waitingOpponents': return 'waiting opponents...'
    default: return table.status
  }
}
