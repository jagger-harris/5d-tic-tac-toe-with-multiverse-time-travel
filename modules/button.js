class Button {
  constructor(x, y, width, height, label) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
  }

  draw(offset, zoom, func) {
    this.click(offset, zoom, func);

    if (this.hover(offset, zoom)) {
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

    if (this.label === "X") {
      fill(255, 100, 100);
    } else {
      fill(100, 100, 255);
    }

    text(this.label, this.x + this.width * 0.5, this.y + (size / 8) + this.height * 0.5)
  }

  hover(offset, zoom) {
    let x = (mouseX - offset.x) / zoom;
    let y = (mouseY - offset.y) / zoom;
    
    if (x > this.x && y > this.y && x < this.width + this.x && y < this.height + this.y) {
      return true;
    }

    return false;
  }

  click(offset, zoom, func) {
    if (this.hover(offset, zoom)) {
      if (mouseIsPressed) {
        func();
      }
    }
  }
}
