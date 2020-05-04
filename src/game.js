const ONGOING = 0;
const FINISHED = 1;
const TERMINATED = 2;

const OBSERVER = -1;
const PLAYER1 = 1;
const PLAYER2 = 2;

class Game {
  static canStartWith(players){
    if (players.length === 2) return true;

    return false;
  }

  constructor(players, table){
    this.name = 'tic-tac-toe';
    this.players = players;
    this.table = table;
    this.reset();
  }

  start(){
    for (let i = this.players.length - 1; i >= 0; i--) {
      this.players[i].message(
        `The game is starting. You are player ${i + 1}.`);
    }
    console.log('A match of', this.name, 'is starting on table', this.table.id);
  }

  reset(){
    this.status = ONGOING;
    this.state = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.turn = 0;
    this.start();
    this.sendState();
  }

  update(player, move){
    if (!this.moveIsValid(player, move)){
      return;
    }
    this.fill(move.x, move.y, player);
    this.sendState();
    this.checkEnd();
    this.turn++;
  }

  moveIsValid(player, move){
    if(this.getRole(player) === -1){
      player.message('You are not playing!');
      return false;
    }

    if(this.status !== ONGOING) {
      player.message('Game finished.');
      return false;
    }
    if(!this.isFree(move.x, move.y)){
      player.message('This square is already filled.');
      return false;
    }
    if(!this.isPlayerTurn(player)){
      player.message('It is not your turn.');
      return false;
    }
    return true;
  }

  isPlayerTurn(player){
    return (this.players.indexOf(player) === this.turn % 2);
  }

  isFree(x, y){
    return this.state[y * 3 + x] === 0;
  }

  fill(x, y, player){
    this.state[y * 3 + x] = this.players.indexOf(player) + 1;
  }

  sendState(){
    for (let i = this.players.length - 1; i >= 0; i--) {
      this.players[i].updateGameState(this.state);
    }
  }

  checkEnd(){
    const winner = this.getWinner();
    console.log('Winner ', winner);

    if(this.turn === 8 && winner <= 0){
      for (let i = this.players.length - 1; i >= 0; i--) {
        this.players[i].message('Draw!');
      }
      this.status = FINISHED;
    }
    else{
      if(winner <= 0)
        return;
      this.status = FINISHED;
      for (let i = this.players.length - 1; i >= 0; i--) {
        if (i == (winner - 1)){
          this.players[i].message('Congratulations, you won!');
        }
        else{
          this.players[i].message('You lost!');
        }
      }
    }
  }

  getWinner(){
    if(this.turn < 4) return 0;
    const gs = this.state;

    for(let i = 0; i < 3; i++){
      if(gs[i*3] === gs[i*3 + 1] && gs[i*3 + 1] === gs[i*3 + 2]
        && gs[i*3] > 0)
        return gs[i*3];
      if(gs[i] === gs[i + 3] && gs[i + 3] === gs[i + 6]
        && gs[i] > 0)
        return gs[i];
    }
    if(gs[0] === gs[4] && gs[4] === gs[8] && gs[0] > 0)
      return gs[0];
    if(gs[2] === gs[4] && gs[4] === gs[6] && gs[2] > 0)
      return gs[2];
    return 0;
  }

  finish(){
    // return to table | start again | return to server
    console.log('End of the game', this.name);
  }

  getRole(player){
    let idx = this.players.findIndex(pl => pl.id === player.id);

    switch(idx){
      case 0: return PLAYER1;
      case 1: return PLAYER2;
      default: return OBSERVER;
    }
  }
}

module.exports = Game;
