/**
 * Mouse and zoom
 */
let zoom = 1;
let offset;

/**
 * Game logic
 */
class Game {
  constructor(turn) {
    this.size = 200;
    this.boards = [];
    this.timelineArrows = [];
    this.winningPlayer = "";
    this.won = false;
    this.turn = turn;
    this.timelines = 1;
    this.present = 0;
  }
}

let game = new Game("X");

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  /* Create board */
  game.boards.push(new Board(width * 0.5 - game.size * 1.5, 0, game.size, "X", 0, 0));

  /* Mouse transformations setup */
  offset = createVector(0, game.size - 50);
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

  /* Draw all boards */
  for (let i = 0; i < game.boards.length; i++) {
    game.boards[i].draw(game);

    if (game.boards[i].won) {
      game.won = true;
      game.winningPlayer = game.boards[i].winningPlayer;
    }
  }

  drawGui();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawGui() {
  /* Reset matrices for GUI */
  resetMatrix();

  if (game.won) {
    stroke(0);
    strokeWeight(50);
    textSize(100);
    textAlign(CENTER, CENTER);

    if (game.winningPlayer == "DRAW") {
      fill(255, 255, 255);
      text("No one won the game!", width * 0.5, height * 0.5);
    } else {
      if (game.winningPlayer === "X") {
        fill(255, 100, 100);
      } else {
        fill(100, 100, 255);
      }

      text(game.winningPlayer + " has won the game!", width * 0.5, height * 0.5);
    }
  }
}
