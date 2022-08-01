class Shape {
  constructor(x, y, width, height, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
  }

  calcArea() {
    return this.width * this.height;
  }

  drawShape(ctx) {
    switch (this.type) {
      case 'rectangle':
        ctx.fillStyle = 'purple';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        break;

      case 'circle':
        ctx.beginPath();
        ctx.fillStyle = 'purple';
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }
  isMouseInShape(x, y) {
    let shapeLeft, shapeRight, shapeTop, shapeBottom;
    if (this.type == 'circle') {
      shapeLeft = this.x - this.width;
      shapeRight = this.x + this.width;
      shapeTop = this.y - this.height;
      shapeBottom = this.y + this.height;
    } else {
      shapeLeft = this.x;
      shapeRight = this.x + this.width;
      shapeTop = this.y;
      shapeBottom = this.y + this.height;
    }

    if (x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom) {
      return true;
    }
    return false;
  }
}

export default Shape;
