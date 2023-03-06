/**
 * Mouse and zoom
 */
let zoom = 1;
let offset;

/**
 * Game logic
 */
let game = new Game("X");
let font;
let soundTimeTravel;
let soundWin;
let soundX;
let soundO;

/* Global board variables to save memory */
const boardSize = 600;
const boardMargin = 200;

function preload() {
  font = loadFont("assets/Nunito-Regular.ttf");

  soundTimeTravel = loadSound("assets/timetravel.mp3");
  soundWin = loadSound("assets/win.mp3");
  soundX = loadSound("assets/x-click.mp3");
  soundO = loadSound("assets/o-click.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  /* Create board */
  game.boards.push(new Board(50, 50, 0, 0, "X", 0));

  /* Mouse transformations setup */
  offset = createVector(width * 0.5 - (boardSize * 0.6), height * 0.5 - (boardSize * 0.6));

  window.addEventListener("wheel", event => {
    const minZoom = 0.35;
    const maxZoom = 1;
    const zoomCalc = 1 - (event.deltaY / 1000);
    const mouse = createVector(mouseX, mouseY);

    zoom *= zoomCalc;

    if (zoom < minZoom) {
      zoom = minZoom;
      return;
    }

    if (zoom > maxZoom) {
      zoom = maxZoom;
      return;
    }

    offset.sub(mouse).mult(zoomCalc).add(mouse);
  });
}

function draw() {
  background(0);
  textFont(font);

  /* Mouse transformations */
  translate(offset.x, offset.y);
  scale(zoom);

  if (mouseIsPressed) {
    offset.x -= pmouseX - mouseX;
    offset.y -= pmouseY - mouseY;
  }

  /* Draw present bar */
  let color = game.turn == "X" ? [255, 100, 100] : [100, 100, 255];
  noStroke();
  fill(color[0], color[1], color[2]);
  rect(game.boards[game.boards.length - 1].x + 100, -999999, 400, 99999999);
  fill(255);

  /* Draw timeline arrows */
  game.timelineArrows.forEach(arrow => arrow.draw());

  /* Draw all boards */
  game.boards.forEach(board => {
    board.draw();
  });

  drawGui();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawGui() {
  /* Reset matrices for GUI */
  resetMatrix();

  strokeWeight(10);

  if (game.winningPlayer != "") {
    noStroke();
    
    if (game.winningPlayer == "DRAW") {
      fill(150, 150, 150, 150);
      rect(0, 0, width, height);
      fill(255, 255, 255);
      stroke(150, 150, 150);
      text("No one won the game!", width * 0.5, height * 0.45);
    } else {
      if (game.winningPlayer === "X") {
        fill(255, 100, 100, 150);
        rect(0, 0, width, height);
        fill(255, 50, 50);
        stroke(230, 0, 0);
      } else {
        fill(100, 100, 255, 150);
        rect(0, 0, width, height);
        fill(50, 50, 255);
        stroke(0, 0, 200);
      }

      text(game.winningPlayer + " won the game!", width * 0.5, height * 0.45);
    }
  }
}
