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
      this.buttons[i].draw(offset, zoom, () => {
        if (this.buttons[i].label == "" && !game.won && this.turn == game.turn && this.level <= game.present) {
          this.buttons[i].label = this.turn;
          this.turnAmount += 1;
          this.won = this.checkWin();

          if (this.won) {
            if (this.turnAmount > 8) {
              this.winningPlayer = "DRAW";
            } else {
              this.winningPlayer = this.turn;
            }
          } else {
            let x = this.x + (this.size * 3) + 200;
            let y = this.y;
            let size = this.size;
            let turn = this.turn == "X" ? "O" : "X";
            let turnAmount = this.turnAmount;
            let level = this.level + 1;

            game.turn = turn;

            /* Time travel logic */
            if (level != this.turnAmount) {
              game.timelines += 1;
              y = -((this.size * 3) + 200) * (game.timelines - 1);
              turnAmount -= 1;
            }
        
            game.present = level;

            game.boards.push(new Board(x, y, size, turn, turnAmount, level, this.buttons));

            if (level != this.turnAmount) {
              this.buttons[i].label = "";
              this.turnAmount -= 1;
            }
          }
        }
      })
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
