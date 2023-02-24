class Button {
  constructor(x, y, width, height, label) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
  }

  draw(func) {
    this.click(func);

    if (this.hover()) {
      fill(50);
    } else {
      fill(0);
    }

    let size = 150;

    noStroke();
    rect(this.x, this.y, this.width, this.height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(size);
    text(this.label, this.x + this.width * 0.5, this.y + (size / 8) + this.height * 0.5)
  }

  hover() {
    if (mouseX > this.x && mouseY > this.y && mouseX < this.width + this.x && mouseY < this.height + this.y) {
      return true;
    }

    return false;
  }

  click(func) {
    if (mouseX > this.x && mouseY > this.y && mouseX < this.width + this.x && mouseY < this.height + this.y) {
      if (mouseIsPressed) {
        func();
      }
    }
  }
}
