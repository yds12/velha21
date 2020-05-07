const Game = require('./game.js');

// a table manages players joining a game
class Table{
  constructor(){
    this.players = [];
    this.id = Math.floor(Math.random() * 10000);
    this.waitingOpponents = true;
  }


  addPlayer(player){
    this.players.push(player);
    console.log(`Player ${player.name} joined the table.`);
    this.messagePlayers(`Player ${player.name} joined the table.`);
    player.setTable(this);
    this.tryToStartGame();
  }

  removePlayer(player){
    this.players.splice(this.players.indexOf(player), 1);
    console.log('Player', player.name, 'left table', this.id);
    this.messagePlayers(`${player.name} left table ${this.id}.`);
    if (!Game.canStartWith(this.players)){
      this.messagePlayers(`Not enough players to keep continue.`);
      if (this.match) this.match.finish();
    }
    if (!this.players)
      console.log('Table empty.');
    else
      this.waitingOpponents = true;
  }

  tryToStartGame(){
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
