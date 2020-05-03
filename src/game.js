const ONGOING = 0;
const FINISHED = 1;
const TERMINATED = 2;

class Game {

  constructor(players){
    this.name = 'Game';
    this.players = players;
    this.reset();
  }

  static canStartWith(players){
    if (players.length > 1){
      return true;
    }
    return false;
  }

  start(){
    for (var i = this.players.length - 1; i >= 0; i--) {
      this.players[i].message('The game is starting');
    }
    console.log('A game of ', this.name, ' is starting on table ', this.id);
  }

  reset(){
    this.status = ONGOING;
    this.state = 'game state';
    this.turn = 0;
    this.start();
    this.sendState();
  }

  update(player, move){
    if (!this.moveIsValid(player, move)){
      return;
    }
    this.sendState();
    this.checkEnd();
  }

  moveIsValid(player, move){
    return true;
  }

  sendState(){
    for (var i = this.players.length - 1; i >= 0; i--) {
      this.players[i].updateGameState(this.state);
    }
  }

  checkEnd(){
    return false;
  }

  getWinner(){
    return this.players[0];
  }

  finish(){
    // return to table | start again | return to server
    console.log('End of the game ', this.name);
  }
}

module.exports = Game;
