class Board {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.turn = "X";
    this.turnAmount = 0;
    this.won = false;
    this.winningPlayer = "";
    this.buttons = [];

    for (let i = 0; i < 9; i++) {
      let x1 = Math.floor(i / 3);
      let y1 = i % 3;
      let button = new Button(this.x + 5 + x1 * this.size, this.y + 5 + y1 * this.size, this.size - 10, this.size - 10, "");
      this.buttons.push(button);
    }
  }

  draw() {
    stroke(255);
    strokeWeight(5);
    line(this.x + this.size, this.y, this.x + this.size, this.y + this.size * 3);
    line(this.x + this.size * 2, this.y, this.x + this.size * 2, this.y + this.size * 3);
    line(this.x, this.y + this.size, this.x + this.size * 3, this.y + this.size);
    line(this.x, this.y + this.size * 2, this.x + this.size * 3, this.y + this.size * 2);

    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].draw(() => {
        if (this.buttons[i].label == "" && !this.won) {
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
            if (this.turn == "X") {
              this.turn = "O";
            } else if (this.turn = "O") {
              this.turn = "X";
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
