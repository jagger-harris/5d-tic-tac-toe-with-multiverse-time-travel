class Board {
  constructor(x, y, size, turn, turnAmount, level, buttons) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.turn = turn;
    this.turnAmount = turnAmount;
    this.won = false;
    this.winningPlayer = "";
    this.level = level;
    this.buttons = [];
    this.hasNextBoard = false;

    for (let i = 0; i < 9; i++) {
      let x1 = Math.floor(i / 3);
      let y1 = i % 3;
      let button = new Button(this.x + 5 + x1 * this.size, this.y + 5 + y1 * this.size, this.size - 10, this.size - 10, "");
      this.buttons.push(button);
    }

    if (buttons) {
      for (let i = 0; i < 9; i++) {
        this.buttons[i].label = buttons[i].label;
      }
    }
  }

  draw(game) {
    /* Arrow */
    if (this.hasNextBoard) {
      fill(255);
      rect(this.x + 600, this.y + 250, 120, 100);
      triangle(this.x + 700, this.y + 200, this.x + 700, this.y + 400, this.x + 780, this.y + 300);
    }

    /* Border */
    if (this.turn == "X") {
      stroke(255, 100, 100);
    } else {
      stroke(100, 100, 255);
    }

    strokeWeight(5);
    fill(0);
    rect(this.x - 20, this.y - 20, this.size * 3 + 40, this.size * 3 + 40, 20);

    /* Lines */
    stroke(255);
    line(this.x + this.size, this.y, this.x + this.size, this.y + this.size * 3);
    line(this.x + this.size * 2, this.y, this.x + this.size * 2, this.y + this.size * 3);
    line(this.x, this.y + this.size, this.x + this.size * 3, this.y + this.size);
    line(this.x, this.y + this.size * 2, this.x + this.size * 3, this.y + this.size * 2);
    
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].draw(offset, zoom, () => this.buttonPress(i, game));
    }
  }

  buttonPress(button, game) {
    /* Only play on empty spaces */
    if (this.buttons[button].label != "") {
      return;
    }

    /* Only play if no one has won */
    if (game.won) {
      return;
    }

    /* Only play on board with matching turn */
    if (this.turn != game.turn) {
      return;
    }

    /* Only play on boards present and past, not future */
    if (this.level > game.present) {
      return;
    }

    /* Only play on board with no future */
    if (this.hasNextBoard && this.level == game.present) {
      return;
    }
    
    this.buttons[button].label = this.turn;
    this.turnAmount += 1;
    this.hasNextBoard = true;
    this.won = this.checkWin();

    if (this.won) {
      if (this.turnAmount > 8) {
        this.winningPlayer = "DRAW";
      } else {
        this.winningPlayer = this.turn;
      }
    }

    let x = this.x + (this.size * 3) + 200;
    let y = this.y;
    let size = this.size;
    let turn = this.turn == "X" ? "O" : "X";
    let turnAmount = this.turnAmount;
    let level = this.level + 1;

    /* Time travel logic */
    if (level != this.turnAmount) {
      game.timelines += 1;
      y = -((this.size * 3) + 200) * (game.timelines - 1);
      turnAmount -= 1;
      console.log(this.timeline);
      game.timelineArrows.push(new TimelineArrow([this.x + 250, y + 250, 100, 550 * (game.timelines - 1)], [this.x + 250, y + 250, 460, 100], [this.x + 700, y + 200, this.x + 700, y + 400, this.x + 780, y + 300]));
    }

    game.turn = turn;
    game.present = level;
    game.boards.push(new Board(x, y, size, turn, turnAmount, level, this.buttons));

    if (level != this.turnAmount) {
      this.buttons[button].label = "";
      this.turnAmount -= 1;
    }
  }

  checkWin() {
    /* Columns */
    for (let i = 0; i < 3; i++) {
      if (this.buttons[i * 3].label == this.turn && this.buttons[i * 3 + 1].label == this.turn && this.buttons[i * 3+ 2].label == this.turn) {
        return true;
      }
    }

    /* Rows */
    for (let i = 0; i < 3; i++) {
      if (this.buttons[i].label == this.turn && this.buttons[i + 3].label == this.turn && this.buttons[i + 6].label == this.turn) {
        return true;
      }
    }

    /* Diagnal */
    if (this.buttons[0].label == this.turn && this.buttons[4].label == this.turn && this.buttons[8].label == this.turn) {
      return true;
    }

    /* Anti-Diagnal */
    if (this.buttons[2].label == this.turn && this.buttons[4].label == this.turn && this.buttons[6].label == this.turn) {
      return true;
    }

    /* Draw */
    if (this.turnAmount > 8) {
      return true;
    }

    return false;
  }
}
