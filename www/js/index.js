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
    result += '<h1> Open Tables </h1>\n'
    result += '<div class="row" >\n'
    for (const table of tables) {
      result += makeTableDiv(table)
    }
    result += '</div>\n'
  }
  ulTables.innerHTML = result
}

function makeTableDiv (table) {
  return '\n' +
  '<div class="col-md-4">\n' +
  '    <div class="card mb-4 shadow-sm">\n' +
  `        <img src="res/img/${table.game}.jpg" class="card-img-top" alt="..." width="100%" height="225">\n` +
  '        <div class="card-body">\n' +
  `            <p class="card-text">${table.game}:${table.id}</p>\n` +
  '            <div class="d-flex justify-content-between align-items-center">\n' +
  '                <div class="btn-group">\n' +
  `                    <a type="button" class="btn btn-sm btn-outline-secondary" href="${table.game}/${table.id}">Join</a>\n` +
  `                    <a type="button" class="btn btn-sm btn-outline-secondary" href="${table.game}/${table.id}">Watch</a>\n` +
  '                </div>\n' +
  `                <small class="text-muted">${getTableStatus(table)}</small>\n` +
  '            </div>\n' +
  '        </div>\n' +
  '    </div>\n' +
  '</div>'
}

function getTableStatus (table) {
  switch (table.status) {
    case 'waitingOpponents': return 'waiting for opponents...'
    default: return table.status
  }
}
