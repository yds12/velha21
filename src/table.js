// a table manages players joining a games
class Table{

  constructor(game){
    this.game = game;
    this.players = [];
    this.welcome();
  }

  welcome(){
    console.log('Creating a table for ', this.game);
  }

  addPlayer(player){
    var new_lenght = this.players.push(player);
    console.log('Player ', player.name, ' joined the table ');
    console.log('number of players on the table', this.players.length, ' ', new_lenght);
    for (var i = this.players.length - 1; i >= 0; i--) {
      this.players[i].message('The game is starting');
    }
    console.log('number of players on the table', this.players.length);
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

    if (this.game.canStartWith(this.players)){
        console.log('Starting game ');
        var g = new this.game(this.players);
        g.start();
    }
    else{
        console.log('Cant start game ');
    }
  }
}

module.exports = Table;