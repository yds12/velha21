const Player = require('./player');
const Table = require('./table');

let tables = [];

function createPlayer(socket){
  let player = new Player(socket.id, socket);
  allocatePlayer(player);
  if(player.table.match) player.table.match.sendState();
  return player;
}

function allocatePlayer(player){
  let table;
  for (let i = tables.length - 1; i >= 0; i--) {
    if (tables[i].waitingOpponents) {
      table = tables[i];
      break;
    }
  }
  if (!table){
   table = new Table();
   tables.push(table);
  }
  table.addPlayer(player);
}

function handleDisconnect(player){
  player.leave();
}

function handleClick(player, pos){
  console.log(
    `Player ${player.socket.id} clicked on quadrant ${pos.x}, ${pos.y}`);
  if(player.table.match) player.table.match.update(player, pos);
}

function handleClear(player){
  player.table.tryToStartGame();
}

function handleStart(player){
  player.message('You asked to start a game... Nice.');
}

module.exports.createPlayer = createPlayer;
module.exports.handleClear = handleClear;
module.exports.handleStart = handleStart;
module.exports.handleClick = handleClick;
module.exports.handleDisconnect = handleDisconnect;
