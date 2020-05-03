class Player{

  constructor(name, socket){
    this.name = name;
    this.socket = socket;
  }

  message(message){
    console.log('Message to player ', this.name, ': ', message);
    // this.emit('message', message);
  }

  updateGameState(state){
    console.log('Update gameState player ', this.name, ': ', state);
    // this.emit('state', this.gameState);
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