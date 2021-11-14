// useful to have them as global variables
var canvas, ctx, w, h; 
var mousePos;

// an empty array!
var balls = []; 
var initialNumberOfBalls;
var globalSpeedMutiplier = 0.5;
var colorToEat = 'red';
var wrongBallsEaten = goodBallsEaten = 0;
var numberOfGoodBalls;
var level = 1;
var actif = 0;
// game state (game over, game running, starting screen, hi score screen, options  etc.)
let gameState = "StartMenu";
let currentScore = 0;


// bullet
var bulletXpos = 0;
var bulletYpos = 0;
const BULLET_WIDTH = 10;
const BULLET_HEIGHT = 10;
var bulletYspeed = 20;

var shooting = false;
var shot = false;


//images
const playerImage = new Image();
const covidImage = new Image();
const cyanImage = new Image();
const blueImage = new Image();
const pinkImage = new Image();
const purpleImage = new Image();
const yellowImage = new Image();
const redImage = new Image();
const fireImage = new Image();
const bgImage = new Image();
const shotImage = new Image();

covidImage.src = 'img/covid.png';
cyanImage.src = 'img/cyan.png';
blueImage.src = 'img/blue.png';
pinkImage.src = 'img/pink.png';
purpleImage.src = 'img/purple.png';
yellowImage.src = 'img/yellow.png';
redImage.src = 'img/red.png';
fireImage.src = 'img/pink.png';
bgImage.src = 'img/bg.jpg'
shotImage.src = 'img/shot.png'
playerImage.src = 'img/boy.png';


//songs
const shoot = new Audio();
const winner = new Audio();
const loser = new Audio();
const coin = new Audio();
const hit = new Audio();

shoot.src = "sfx/shoot.mp3";
winner.src = "sfx/winner.wav";
loser.src = "sfx/loser.wav";
coin.src = "sfx/coin.wav";
hit.src = "sfx/hit.wav";




class Players{
    constructor(){
      this.x = 10;
      this.y = 10;
      this.width = 20;
      this.height = 20;
    }
}
const player = new Players();


let numberOfLives = 5;

window.onload = function init() {
    // called AFTER the page has been loaded
    canvas = document.querySelector("#myCanvas");

    
    // often useful
    w = canvas.width; 
    h = canvas.height;  
  
    // important, we will draw with this object
    ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // add a mousemove event listener to the canvas
    canvas.addEventListener('mousemove', mouseMoved);
    document.addEventListener('keydown', keyPressed);

    // ready to go !
    mainLoop();
};

function keyPressed(event) {
  console.log('key pressed : ' + event.key);
  if(event.key === " ") {
    if(gameState === "GameOverMenu") {
      // reset the level to 0, the score to 0 etc.
      restartGame();
    } else if(gameState === "StartMenu") {
      gameState = "GameRunning";
      startGame(level);
    } else if(gameState === "NextLevel") {
      gameState = "GameRunning";
      startGame(level);
    }else if(gameState === "GameRunning") {
      gameState = "GameRunning";
      shooting = true;
      console.log('shoooot......');
      shoot.play();
    }
  }
}


function bulletshoot(){
  if(shooting && shot == false){
    bulletXpos = player.x + player.width / 2 + BULLET_WIDTH / 2;
    bulletYpos = player.y;
    shot = true;
  }
  if(shooting && shot){
    bulletYpos -= bulletYspeed;
  }
  if(bulletYpos < 0 && bulletXpos){
    shot = false;
    shooting = false;
  }
  if(shooting == false && shot == false){
    bulletXpos = 0 - BULLET_WIDTH;
    bulletYpos = 0;
  }
}


function restartGame() {
  //reset game variables to initial state
  level = 1;
  wrongBallsEaten = goodBallsEaten = 0;
  currentScore = 0;
  numberOfLives = 5;

  startGame(level);

  gameState = "GameRunning";
}

function startGame(level) {
    globalSpeedMutiplier += 0.01;
    nb = level;
  
  do {
    balls = createBalls(nb);
    initialNumberOfBalls = nb;
    numberOfGoodBalls = countNumberOfGoodBalls(balls, colorToEat);
  } while(numberOfGoodBalls === 0);
  
  wrongBallsEaten = goodBallsEaten = 0;
}

function countNumberOfGoodBalls(balls, colorToEat) {
  var nb = 0;
  
  balls.forEach(function(b) {
    if(b.color === colorToEat)
      nb++;
  });
  
  return nb;
}

function changeNbBalls(nb) {
  startGame(nb);
}

function changeColorToEat(color) {
  colorToEat = color;
}

function changePlayer(color) {
 playerImage.src = color;
}

function changeBallSpeed(coef) {
    globalSpeedMutiplier = coef;
}

function mouseMoved(evt) {
    mousePos = getMousePos(canvas, evt);
}

function getMousePos(canvas, evt) {
    // necessary work in the canvas coordinate system
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function movePlayerWithMouse() {
  if(mousePos !== undefined) {
    player.x = mousePos.x;
    player.y = mousePos.y;
  }
}

function mainLoop() {
  // 1 - clear the canvas

        ctx.drawImage(bgImage, 0, 0);
  ctx.drawImage(shotImage, bulletXpos, bulletYpos, BULLET_WIDTH, BULLET_HEIGHT);
  //ctx.colorRect(bulletXpos,bulletYpos,BULLET_WIDTH,BULLET_HEIGHT,'red');
  bulletshoot();
  switch(gameState) {
    case "StartMenu" :

      ctx.font = '20pt Calibri';
      ctx.fillText("Instructions", 140, 80);
      ctx.font = '15pt Calibri';
      ctx.fillText("Shot all virus by taping <SPACE>", 80, 120);
      ctx.fillText("Eat hearts to complete the level", 80, 150);

      ctx.font = 'italic 20pt Calibri';
      ctx.fillText("Press <SPACE> to start the game", 20, 220+Math.random()*2);

      
      break;
    case "GameRunning": 
      updateGame();
      break;
    case "GameOverMenu" :
      ctx.font = 'italic 50pt Calibri';
      ctx.fillText("GAME OVER", 20, 160+Math.random()*5);
      ctx.fillText("Press <SPACE> to start a new game", 10, 240+Math.random()*5);
      break;
    case "NextLevel" :
      ctx.font = 'italic 20pt Calibri';
      ctx.fillText("YOU WIN", 150, 160+Math.random()*2);
      ctx.fillText("Press <SPACE> to play next level", 20, 200+Math.random()*2);
      break;
  }
  
  // ask the browser to call mainloop in 1/60 of  for a new animation frame
  requestAnimationFrame(mainLoop);
}

function updateGame() {
  // draw the ball and the player
  drawPlayer(player);
  drawAllBalls(balls);
  drawBallNumbers(balls);
  
  // animate the ball that is bouncing all over the walls
  moveAllBalls(balls);
  
  movePlayerWithMouse();
}
// Collisions between rectangle and circle
function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
   var testX=cx;
   var testY=cy;
   if (testX < x0) testX=x0;
   if (testX > (x0+w0)) testX=(x0+w0);
   if (testY < y0) testY=y0;
   if (testY > (y0+h0)) testY=(y0+h0);
   return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY))< r*r);
}

function createBalls(n) {
  // empty array
  var ballArray = [];
  var redExist = 0;
  
  // create n balls
  for(var i=0; i < n; i++) {
     var b = {
        x:w/2,
        y:h/2,
        radius: 20 + 30 * Math.random(), // between 5 and 35
        speedX: -5 + 10 * Math.random(), // between -5 and + 5
        speedY: -5 + 10 * Math.random(), // between -5 and + 5
        color:getARandomColor(),


      }

     // add ball b to the array
     ballArray.push(b);
    }


  // returns the array full of randomly created balls
  return ballArray;
}

function getARandomColor() {
  var colors = ['red', 'blue', 'cyan', 'purple', 'pink', 'green', 'yellow'];
  // a value between 0 and color.length-1
  // Math.round = rounded value
  // Math.random() a value between 0 and 1
  var colorIndex = Math.round((colors.length-1)*Math.random()); 
  var c = colors[colorIndex];
  
  // return the random color
  return c;
}

function drawBallNumbers(balls) { 
  ctx.save();
  ctx.font="20px Arial";
  
  if(balls.length === 0) {
    //ctx.fillText("Game Over!", 20, 30);
    level++;
    startGame(level);
  } else {
    ctx.fillText("Balls still alive: " + balls.length, 210, 30);
    ctx.fillText("Good Balls eaten: " + goodBallsEaten, 210, 50);
     ctx.fillText("Wrong Balls eaten: " + wrongBallsEaten, 210, 70);
     ctx.fillText("Lives left : " + numberOfLives, 210, 90);
     ctx.fillText("Level " + level, 210, 110);
     ctx.fillText("SCORE = " + currentScore, 210, 130);
     ctx.fillText("Good Balls = " + numberOfGoodBalls, 210, 150);
     
  }
  ctx.restore();
}

function drawAllBalls(ballArray) {
    ballArray.forEach(function(b) {
      drawFilledCircle(b);
    });
}

function moveAllBalls(ballArray) {
  // iterate on all balls in array
  balls.forEach(function(b, index) {
      // b is the current ball in the array
      b.x += (b.speedX * globalSpeedMutiplier);
      b.y += (b.speedY * globalSpeedMutiplier);

      if(b.color === "green") 
        b.x += Math.random()*10;

      testCollisionBallWithWalls(b); 
      testCollisionWithPlayer(b, index);
  });
}

function testCollisionWithPlayer(b, index) {
  var ballRest;
  if(b.color !== colorToEat){
    if(circRectsOverlap(bulletXpos, bulletYpos,
                       BULLET_WIDTH, BULLET_HEIGHT,
                       b.x, b.y, b.radius)) {
      currentScore += 5;
      balls.splice(index, 1);
  }
  }

  if(circRectsOverlap(player.x, player.y,
                     player.width, player.height,
                     b.x, b.y, b.radius)) {
    // we remove the element located at index
    // from the balls array
    // splice: first parameter = starting index
    //         second parameter = number of elements to remove
    

    if(b.color === colorToEat) {
      // Yes, we remove it and increment the score
      goodBallsEaten += 1;
      currentScore += 10;
      coin.play();

      if(goodBallsEaten === numberOfGoodBalls) {
        level++;
        gameState = "NextLevel";
        winner.play();
      }

    } else {

      hit.play();
      wrongBallsEaten += 1;
      // we decrement the number of lives
      numberOfLives--;

      if(numberOfLives === 0) {
        // display game over menu
        gameState = "GameOverMenu";
        loser.play();
      }
    }
    
    balls.splice(index, 1);

  }
}

function testCollisionBallWithWalls(b) {
    // COLLISION WITH VERTICAL WALLS ?
    if((b.x + b.radius) > w) {
    // the ball hit the right wall
    // change horizontal direction
    b.speedX = -b.speedX;
    
    // put the ball at the collision point
    b.x = w - b.radius;
  } else if((b.x -b.radius) < 0) {
    // the ball hit the left wall
    // change horizontal direction
    b.speedX = -b.speedX;
    
    // put the ball at the collision point
    b.x = b.radius;
  }
  
  // COLLISIONS WTH HORIZONTAL WALLS ?
  // Not in the else as the ball can touch both
  // vertical and horizontal walls in corners
  if((b.y + b.radius) > h) {
    // the ball hit the right wall
    // change horizontal direction
    b.speedY = -b.speedY;
    
    // put the ball at the collision point
    b.y = h - b.radius;
  } else if((b.y -b.radius) < 0) {
    // the ball hit the left wall
    // change horizontal direction
    b.speedY = -b.speedY;
    
    // put the ball at the collision point
    b.Y = b.radius;
  }  
}

function drawPlayer(r) {
    // GOOD practice: save the context, use 2D trasnformations
    ctx.save();
  
    // translate the coordinate system, draw relative to it

    ctx.drawImage(playerImage, r.x, r.y);

    ctx.beginPath();
  
    // GOOD practice: restore the context
    ctx.restore();
}

function drawFilledCircle(c) {
    // GOOD practice: save the context, use 2D trasnformations
    ctx.save();
    if(c.color === "green") {
      
      ctx.drawImage(covidImage, c.x, c.y, c.radius, c.radius);
      ctx.beginPath();
      ctx.restore();
    }else if(c.color === "red") {
      
      ctx.drawImage(redImage, c.x, c.y, c.radius, c.radius);
      ctx.beginPath();
      ctx.restore();
    }else if(c.color === "cyan") {
      
      ctx.drawImage(cyanImage, c.x, c.y, c.radius, c.radius);
      ctx.beginPath();
      ctx.restore();
    }else if(c.color === "pink") {
      
      ctx.drawImage(pinkImage, c.x, c.y, c.radius, c.radius);
      ctx.beginPath();
      ctx.restore();
    }else if(c.color === "purple") {
      
      ctx.drawImage(purpleImage, c.x, c.y, c.radius, c.radius);
      ctx.beginPath();
      ctx.restore();
    }else if(c.color === "yellow"){
    // translate the coordinate system, draw relative to it
    ctx.drawImage(yellowImage, c.x, c.y, c.radius, c.radius);
    // (0, 0) is the top left corner of the monster.
    ctx.beginPath();
 
    // GOOD practice: restore the context
    ctx.restore();
    }
}