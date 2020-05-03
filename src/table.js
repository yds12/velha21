// a table manages players joining a games
class Table{

  constructor(Game){
    this.Game = Game;
    this.match = null;
    this.players = [];
    this.id = 'table_id'
    this.welcome();
  }

  welcome(){
    console.log('Creating a table for ', this.Game);
  }

  addPlayer(player){
    var new_lenght = this.players.push(player);
    console.log('Player ', player.name, ' joined the table ');
    player.setTable(this);
  }

  removePlayer(player){
    this.players.splice(this.players.indexOf(player), 1);
    console.log('Player ', player.name, ' left the table ', this.id);
    player.message("You left the table ", this.id);
    if (this.players === undefined || this.players.length === 0){
      console.log('Table empyt');
    }
  }

  tryToStartGame(){
    console.log('Trying to start game ');

    if (this.Game.canStartWith(this.players)){
        console.log('Starting game ');
        this.match = new this.Game(this.players, this);

    }
    else{
        console.log('Cant start game ');
    }
  }
}

module.exports = Table;