var myGamePiece;
var ballSpeed = 7;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var image = document.getElementById('source');
var x = canvas.width/2;
var y = canvas.height-100;
var dx = 0
var dy = 0
var ddx = 0;
var ddy = .5;
var ballRadius = 15;
var mySound;
var delayInMilliseconds = 250; //1 second
var tired = false;


var paddleHeight = 1;
var paddleWidth = 20;
var paddleX = (canvas.width-paddleWidth) / 2;
var paddleY = (canvas.height/2);
var rightPressed = false;
var leftPressed = false;
var spacePressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

var score = 0;
var lives = 3;

//---------MAIN VARIABLE SECTION ENDS--------//

//----------SOUNDS AND SOUND SETUP-----------//
bounceSound = new sound("bounce.wav");
loseSound = new sound("lose.wav");

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}
//----------END OF SOUND SETUP-----------//

//----------DRAWING FUNCTIONS------------//

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawLaser() {
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI*2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function drawSanik() {
    ctx.drawImage(image, x-50, y-50, 100, 100);
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX-10, paddleY-10, paddleWidth, paddleHeight);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.rect(paddleX-10+paddleWidth/2, paddleY-10-paddleWidth/2, paddleHeight, paddleWidth);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
      for(var r=0; r<brickRowCount; r++) {
          if(bricks[c][r].status == 1) {
              var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
              var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
              bricks[c][r].x = brickX;
              bricks[c][r].y = brickY;
              ctx.beginPath();
              ctx.rect(brickX, brickY, brickWidth, brickHeight);
              ctx.fillStyle = "#0095DD";
              ctx.fill();
              ctx.closePath();
            }
        }
    }
}

//-------MAIN GAME DRAW FUNC--------//

function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  drawBall();
  drawLives();
  drawLaser();
  drawPaddle();
  drawSanik();
  drawScore();
  drawBricks();
  collisionDetection();
  x += dx;
  y += dy;
  dx += ddx;  //Sideways Gravity (DEFAULT ZERO)
  dy += ddy;  //Gravity Y-Direction
  dx = dx*0.93;  //Controls Horizontal Drag
  dy = dy*0.98   //Controls Verticle Drag
  if(x + dx > canvas.width-ballRadius*0.5 || x + dx < ballRadius*0.5) {
    dx = -dx;
  }
  if(y + dy < ballRadius) {
  dy = -dy;
} else if(y + dy > canvas.height-ballRadius*3.5) {  //Resting Height on Floor
    dy = -dy*0.1;  //Controls Bounce Amount
  }

  if(rightPressed && x < canvas.width - ballRadius) {
    dx += 1.5;           // MOVE SPEED
  }
  else if(leftPressed && x > ballRadius) {
    dx -= 1.5;            // MOVE SPEED
  }
  if(spacePressed) {
    if(tired == false && y > canvas.height-60)
    dy = -13;            // JUMP VELOCITY
    tired = true
    setTimeout(function() {
      tired = false
    }, delayInMilliseconds);
  }


requestAnimationFrame(draw);
}


//-------END MAIN GAME DRAW--------//

//------OTHER FUNCTIONS---asd----//a


// function jump() {
//   delayInMilliseconds = 1000;
//   if(spacePressed) {
//     if(tired == false)
//     dy = -19;
//     tired = true
//     setTimeout(function() {
//       tired = false
//     }, delayInMilliseconds);
//   }
// }

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;

                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
//------END OTHER FUNCTIONS------//



//---------INPUT HANDLING----------//
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
  document.addEventListener("click", drawLaser, false);

  function mouseMoveHandler(e) {
      var relativeX = e.clientX - canvas.offsetLeft;
      if(relativeX > 0 && relativeX < canvas.width) {
          paddleX = relativeX - paddleWidth/2;
      }
      var relativeY = e.clientY;
          paddleY = relativeY - paddleWidth/2;

  }

function keyDownHandler(e) {
  if(e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) {
      rightPressed = true;
  }
  else if(e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */) {
      leftPressed = true;
  }
  if(e.keyCode === 32 /* space */) {
      spacePressed = true;
  }
}

function keyUpHandler(e) {
  if(e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) {
      rightPressed = false;
  }
  else if(e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */) {
      leftPressed = false;
  }
  if(e.keyCode === 32 /* space */) {
      spacePressed = false;
  }
}
//--------END INPUT HANDLING----------//


draw();
