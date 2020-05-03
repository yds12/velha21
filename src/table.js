const Game = require('./game.js');

// a table manages players joining a games
class Table{
  constructor(){
    this.players = [];
    this.id = 'table_id';
    this.welcome();
  }

  welcome(){
    //console.log('Creating a table for ', this.match.name);
  }

  addPlayer(player){
    var new_lenght = this.players.push(player);
    console.log('Player ', player.name, ' joined the table ');
    player.setTable(this);
    this.tryToStartGame();
  }

  removePlayer(player){
    this.players.splice(this.players.indexOf(player), 1);
    console.log('Player ', player.name, ' left table ', this.id);
    player.message("You left the table ", this.id);
    if (!this.players){
      console.log('Table empty.');
    }
  }

  tryToStartGame(){
    console.log('Trying to start game...');

    if (Game.canStartWith(this.players)){
      console.log('Starting game...');
      this.match = new Game(this.players, this);
    }
    else{
      console.log("Can't start game ");
    }
  }
}

module.exports = Table;
