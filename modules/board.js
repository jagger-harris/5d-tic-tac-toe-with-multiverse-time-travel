class Board {
  constructor(x, y, level, timeline, turn, turnAmount, buttons) {
    this.x = x;
    this.y = y;
    this.level = level;
    this.timeline = timeline;
    this.turn = turn;
    this.turnAmount = turnAmount;
    this.nextBoard = false;
    this.buttons = [];

    for (let i = 0; i < 9; i++) {
      let x1 = Math.floor(i / 3);
      let y1 = i % 3;
      let button = new Button(
        this.x + x1 * (boardSize / 3),
        this.y + y1 * (boardSize / 3),
        boardSize / 3,
        boardSize / 3,
        0,
        "",
        150
      );
      this.buttons.push(button);
    }

    if (buttons) {
      for (let i = 0; i < 9; i++) {
        this.buttons[i].label = buttons[i].label;
      }
    }
  }

  draw() {
    /* Draw arrow */
    if (this.nextBoard) {
      let arrow = new Arrow(
        this.x + boardSize,
        this.y + boardSize * 0.5,
        190,
        0
      );
      arrow.draw();
    }

    strokeWeight(5);

    /* Draw border */
    this.turn == "X" ? stroke(255, 100, 100) : stroke(100, 100, 255);
    fill(0);
    rect(this.x, this.y, boardSize, boardSize, 20);

    /* Draw buttons */
    this.buttons.forEach((button) =>
      button.draw(() => this.buttonPress(button))
    );

    /* Draw lines */
    stroke(255);

    for (let i = 1; i < 3; i++) {
      line(
        this.x + i * (boardSize / 3),
        this.y,
        this.x + i * (boardSize / 3),
        this.y + boardSize
      );
    }

    for (let i = 1; i < 3; i++) {
      line(
        this.x,
        this.y + i * (boardSize / 3),
        this.x + boardSize,
        this.y + i * (boardSize / 3)
      );
    }

    /* Draw border again to cover up lines and buttons */
    this.turn == "X" ? stroke(255, 100, 100) : stroke(100, 100, 255);
    fill(0, 0);
    rect(this.x, this.y, boardSize, boardSize, 20);
  }

  buttonPress(button) {
    if (!this.checkMove(button)) {
      return;
    }

    button.label = this.turn;
    this.turnAmount += 1;
    this.nextBoard = true;

    /* Play sounds */
    this.turn == "X" ? soundX.play() : soundO.play();

    /* Check if player won */
    let won = this.checkWin();

    if (won) {
      soundWin.play();
      this.turnAmount > 8
        ? (game.winningPlayer = "DRAW")
        : (game.winningPlayer = this.turn);
    }

    /* Variables for new board */
    let x = this.x + boardSize + boardMargin;
    let y = this.y;
    let level = this.level + 1;
    let timeline = this.timeline;
    let turn = this.turn == "X" ? "O" : "X";
    let turnAmount = this.turnAmount;

    /* Time travel logic */
    if (level != this.turnAmount) {
      soundTimeTravel.play();

      game.timelines += 1;
      console.log("Game Timelines: " + game.timelines);
      timeline = game.timelines;
      console.log("Board Timeline: " + this.timeline);
      y = this.y - (boardSize + boardMargin) * (game.timelines - this.timeline);
      turnAmount -= 1;

      let arrowLength =
        (boardSize + boardMargin) * (game.timelines - this.timeline) -
        boardSize * 0.5;

      let firstArrow = new Arrow(
        this.x + boardSize * 0.5,
        this.y,
        arrowLength,
        "UP"
      );
      let secondArrow = new Arrow(
        this.x + boardSize * 0.5,
        this.y - arrowLength,
        490
      );
      let timelineArrow = new TimelineArrow(firstArrow, secondArrow);
      game.timelineArrows.push(timelineArrow);
    }

    game.turn = turn;
    game.present = level;
    game.boards.push(
      new Board(x, y, level, timeline, turn, turnAmount, this.buttons)
    );

    if (level != this.turnAmount) {
      button.label = "";
      this.turnAmount -= 1;
    }
  }

  checkMove(button) {
    /* Can only play on empty spaces */
    if (button.label != "") {
      return false;
    }

    /* Can only play if no one has won */
    if (game.winningPlayer != "") {
      return false;
    }

    /* Can only play on a board with matching turn */
    if (this.turn != game.turn) {
      return false;
    }

    /* Can only play on boards in the present or past */
    if (this.level > game.present) {
      return false;
    }

    /* Can only play on a board with no future */
    if (this.nextBoard && this.level == game.present) {
      return false;
    }

    return true;
  }

  checkWin() {
    /* Columns */
    for (let i = 0; i < 3; i++) {
      if (
        this.buttons[i * 3].label == this.turn &&
        this.buttons[i * 3 + 1].label == this.turn &&
        this.buttons[i * 3 + 2].label == this.turn
      ) {
        return true;
      }
    }

    /* Rows */
    for (let i = 0; i < 3; i++) {
      if (
        this.buttons[i].label == this.turn &&
        this.buttons[i + 3].label == this.turn &&
        this.buttons[i + 6].label == this.turn
      ) {
        return true;
      }
    }

    /* Diagnal */
    if (
      this.buttons[0].label == this.turn &&
      this.buttons[4].label == this.turn &&
      this.buttons[8].label == this.turn
    ) {
      return true;
    }

    /* Anti-diagnal */
    if (
      this.buttons[2].label == this.turn &&
      this.buttons[4].label == this.turn &&
      this.buttons[6].label == this.turn
    ) {
      return true;
    }

    /* Draw */
    if (this.turnAmount > 8) {
      return true;
    }

    return false;
  }
}
