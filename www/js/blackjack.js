// Socket setup
const HOST = window.location.hostname;
const connectTo = (HOST === 'localhost')? `${HOST}:${PORT}`: HOST;
let socket = io(connectTo);

// Screen elements
let divMsg = document.getElementById('messages');
let btnClear = document.getElementById('clear');
let canvas = document.getElementById('screen');
canvas.width = 800;
canvas.height = 600;
canvas.style = "border: solid 1px black;";
let ctx = canvas.getContext('2d');
let imgCards, imgBack, imgBg;

// Game variables
const SCREEN_W = canvas.width;
const SCREEN_H = canvas.height;
const CARD_W = 77;
const CARD_H = 112;
const HAND_SEP = 36;

let HANDS, OPPONENTS, TABLE, DECK;




// Event Handling (sockets)
socket.on('connect', () => {
  clearMessages();
  logMessage('Socket connected!');
});

socket.on('message', (msg) => {
  logMessage(msg);
});

socket.on('state', (state) => {
  console.log(`State ${JSON.stringify(state)} received`);
//  gameState = state;
  draw();
});




// Game functions
function loadImages(){
  let loaded = 0;
  imgCards = document.createElement('img');
  imgBack = document.createElement('img');
  imgBg = document.createElement('img');
  imgCards.src = 'res/img/cards.png';
  imgBack.src = 'res/img/back.png';
  imgBg.src = 'res/img/bg.png';

  let f = () =>{
    loaded++;
    if(loaded === 3) start();
  };

  imgCards.onload = f;
  imgBack.onload = f;
  imgBg.onload = f;
}

function start(){
}

function drawCard(card, pos){
  let xpos = card.value - 1;
  let ypos;

  switch(card.suit){
    case 'd': ypos = 0;
      break;
    case 'h': ypos = 1;
      break;
    case 's': ypos = 2;
      break;
    case 'c': ypos = 3;
      break;
  }

  ctx.drawImage(imgCards, xpos * CARD_W, ypos * CARD_H, CARD_W, CARD_H,
    pos.x, pos.y, CARD_W, CARD_H); 
}

function drawBg(){
}

function drawTable(){
  // temporary/test
  drawCard({ value: 1, suit: 's' }, { x: 2, y: 2 });
  drawCard({ value: 11, suit: 'h' }, { x: 200, y: 20 });
  drawCard({ value: 12, suit: 'c' }, { x: 200 + HAND_SEP * 1, y: 20 });
  drawCard({ value: 13, suit: 'd' }, { x: 200 + HAND_SEP * 2, y: 20 });
  drawCard({ value: 7, suit: 's' }, { x: 200 + HAND_SEP * 3, y: 20 });
  drawCard({ value: 10, suit: 'd' }, { x: 200 + HAND_SEP * 4, y: 20 });
}

function drawHands(){
}

function drawDeck(){
}

function draw(){
  ctx.clearRect(0, 0, SCREEN_W, SCREEN_H);
  drawBg();
  drawTable();
  drawDeck();
  drawHands();
}





// Helper functions
function logMessage(msg){
  let date = new Date();
  let time = date.toLocaleTimeString();
  divMsg.innerHTML = time + ': ' + msg + '</br>' + divMsg.innerHTML;
}

function clearMessages(){
  divMsg.innerHTML = '';
}




// Event handling (window)
canvas.onmousemove = (event) => {
  draw();

/*  if(quad){
    ctx.fillStyle = '#33333388';
    ctx.fillRect(BOARD.x + quad.x * BOARD.tile, 
      BOARD.y + quad.y * BOARD.tile, BOARD.tile, BOARD.tile);
  }*/
};

canvas.onclick = (event) => {
  // socket.emit('click', {});
};

btnClear.onclick = (event) => {
  socket.emit('clear');
};



// Initialization
loadImages();
