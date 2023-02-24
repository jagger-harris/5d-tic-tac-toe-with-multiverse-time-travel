let boards = []
let won = false;
let winningPlayer = ""

function setup() {
  createCanvas(windowWidth, windowHeight);

  let size = 200

  boards.push(new Board(width * 0.5 - size * 1.5, height * 0.5  - size * 1.5, size));
}

function draw() {
  background(0);

  for (let i = 0; i < boards.length; i++) {
    boards[i].draw();

    if (boards[i].won) {
      won = true;
      winningPlayer = boards[i].winningPlayer;
    }
  }

  drawGui();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawGui() {
  if (won) {
    stroke(0);
    strokeWeight(50);
    textSize(100);
    textAlign(CENTER, CENTER);

    if (winningPlayer == "DRAW") {
      text("No one won the game!", width * 0.5, height * 0.5);
    } else {
      text(winningPlayer + " has won the game!", width * 0.5, height * 0.5);
    }
  }
}
