class Arrow {
  constructor(x, y, length, rotation) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.rotation = rotation;
  }

  draw() {
    stroke(255);
    strokeWeight(20);

    if (this.rotation == "UP") {
      line(this.x, this.y, this.x, this.y - this.length);
    } else {
      line(this.x, this.y, this.x + this.length, this.y);
      line(this.x + (this.length - 60), this.y + 50, this.x + this.length, this.y);
      line(this.x + (this.length - 60), this.y - 50, this.x + this.length, this.y);
    }
  }
}

class TimelineArrow {
  constructor(firstArrow, secondArrow) {
    this.firstArrow = firstArrow;
    this.secondArrow = secondArrow;
  }

  draw() {
    this.firstArrow.draw();
    this.secondArrow.draw();
  }
}
