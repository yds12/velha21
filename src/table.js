const Game = require('./game.js');

// a table manages players joining a games
class Table{
  constructor(){
    this.players = [];
    this.id = Math.floor(Math.random() * 10000);
    this.welcome();
  }

  welcome(){
    //console.log('Creating a table for ', this.match.name);
  }

  addPlayer(player){
    let new_lenght = this.players.push(player);
    console.log(`Player ${player.name} joined the table.`);
    this.messagePlayers(`Player ${player.name} joined the table.`);
    player.setTable(this);

    if(!this.match) this.tryToStartGame();
    else player.message('Game already started. You are an observer.');
  }

  removePlayer(player){
    this.players.splice(this.players.indexOf(player), 1);
    console.log('Player', player.name, 'left table', this.id);
    player.message(`You left table ${this.id}.`);
    if (!this.players){
      console.log('Table empty.');
    }
  }

  tryToStartGame(){
    if(this.match) return;
    console.log('Trying to start game...');

    if (Game.canStartWith(this.players)){
      console.log('Starting game...');
      this.match = new Game(this.players, this);
    }
    else{
      console.log("Can't start the game.");
      this.messagePlayers('Waiting for opponents...');
    }
  }

  messagePlayers(message){
    for(player of this.players){
      player.message(message);
    }
  }
}

module.exports = Table;
