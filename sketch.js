/**
 * Mouse and zoom
 */
let zoom = 1;
let offset;

/**
 * Game logic
 */
class TimelineArrow {
  constructor(rect1, rect2, triangle) {
    this.rect1 = rect1;
    this.rect2 = rect2;
    this.triangle = triangle;
  }
}

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

function preload() {
  loadFont("assets/Nunito-Regular.ttf");
}

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
  textFont("Nunito-Regular");

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
  for (let i = 0; i < game.timelineArrows.length; i++) {
    let arrow = game.timelineArrows[i];
    
    fill(255);
    rect(arrow.rect1[0], arrow.rect1[1], arrow.rect1[2], arrow.rect1[3]);
    rect(arrow.rect2[0], arrow.rect2[1], arrow.rect2[2], arrow.rect2[3]);
    triangle(arrow.triangle[0], arrow.triangle[1], arrow.triangle[2], arrow.triangle[3], arrow.triangle[4], arrow.triangle[5]);
  }

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
    stroke(255);
    strokeWeight(5);
    textSize(100);
    textAlign(CENTER, CENTER);

    fill(0);
    rect(-50, height * 0.5 - 60, width + 100, 120);
    noStroke();

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
