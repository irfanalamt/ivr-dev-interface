class Shape {
  constructor(x, y, width, height, type, style = 'black', stroke = false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.style = style;
    this.initPos = [x, y];
    this.stroke = stroke;
  }

  calcArea() {
    return this.width * this.height;
  }
  getInitPos() {
    return this.initPos;
  }

  drawShape(ctx) {
    switch (this.type) {
      case 'rectangle':
        if (this.stroke) {
          ctx.strokeStyle = '#e65100';
          ctx.strokeRect(this.x, this.y, this.width, this.height);
        } else {
          ctx.fillStyle = this.style;
          ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        break;

      case 'circle':
        ctx.beginPath();

        if (this.stroke) {
          ctx.strokeStyle = '#2196f3';
          ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = this.style;
          ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
          ctx.fill();
        }
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
