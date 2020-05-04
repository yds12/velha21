const Game = require('./game.js');

// a table manages players joining a game
class Table{
  constructor(){
    this.players = [];
    this.id = Math.floor(Math.random() * 10000);
    this.welcome();
    this.waitingOpponents = true;
  }

  welcome(){
    //console.log('Creating a table for ', this.match.name);
  }

  addPlayer(player){
    this.players.push(player);
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
    if (!this.players)
      console.log('Table empty.');
    else
      this.waitingOpponents = true;
  }

  tryToStartGame(){
    if(this.match) return;
    console.log('Trying to start game...');

    if (Game.canStartWith(this.players)){
      console.log('Starting game...');
      this.match = new Game(this.players, this);
      this.waitingOpponents = false;
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
