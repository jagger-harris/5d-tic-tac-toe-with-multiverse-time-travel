class Button {
  constructor(x, y, width, height, roundness, label, labelSize) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.roundness = roundness;
    this.label = label;
    this.labelSize = labelSize;
  }

  draw(func) {
    this.click(func);
    this.hover() ? fill(50) : fill(0);

    noStroke();
    rect(this.x, this.y, this.width, this.height, this.roundness);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(this.labelSize);
    this.label == "X" ? fill(255, 100, 100) : fill(100, 100, 255);
    text(this.label, this.x + this.width * 0.5, this.y + this.height * 0.55);
  }

  hover() {
    let x = (mouseX - offset.x) / zoom;
    let y = (mouseY - offset.y) / zoom;
    
    if (x > this.x && y > this.y && x < this.width + this.x && y < this.height + this.y) {
      return true;
    }

    return false;
  }

  click(func) {
    if (this.hover(offset, zoom) && mouseIsPressed) {
      func();
    }
  }
}
