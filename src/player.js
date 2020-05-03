class Player{

  constructor(name, socket){
    this.name = name;
    this.socket = socket;
  }

  message(message){
    this.socket.emit('message', message);
  }

  updateGameState(state){
    this.socket.emit('state', state);
  }

  setTable(table){
    this.table = table;
    this.message("You joined table ", table.id, " to play ", table.game);
  }

  leave(){
    console.log('Player ', this.name, ' disconnected');
    this.table.removePlayer(this);
  }
}

module.exports = Player;