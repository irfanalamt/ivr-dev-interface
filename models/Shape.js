class Shape {
  constructor(x, y, width, height, type, style = 'black', stroke = false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.style = style;
    this.stroke = stroke;
    this.initPos = [x, y];
    if (type === 'rectangle') {
      this.text = 'function';
    } else if (type === 'hexagon') {
      this.text = 'playMenu';
    } else if (type === 'circle') {
      this.text = 'playMessage';
    } else if (type === 'parallelogram') {
      this.text = 'getDigits';
    } else this.text = '';
  }

  setText(inputText) {
    this.text = inputText;
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
          ctx.font = '19px sans-serif';
          ctx.fillStyle = 'black';
          ctx.lineWidth = 2;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.text, this.x, this.y);
          ctx.strokeStyle = '#ff5722';
          ctx.strokeRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
          );
        } else {
          ctx.fillStyle = this.style;
          ctx.strokeStyle = '#ff5722';
          ctx.lineWidth = 2;
          ctx.fillRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
          );
          ctx.strokeRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
          );
        }
        break;

      case 'circle':
        ctx.beginPath();

        if (this.stroke) {
          ctx.font = '19px sans-serif';
          ctx.fillStyle = 'black';
          ctx.lineWidth = 2;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.text, this.x, this.y);
          ctx.strokeStyle = '#2196f3';
          ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = this.style;
          ctx.strokeStyle = '#2196f3';
          ctx.lineWidth = 2;
          ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        break;

      case 'hexagon':
        this.drawHexagon(ctx);
        break;

      case 'parallelogram':
        this.drawParallelogram(ctx);
        break;
    }
  }

  drawParallelogram(ctx) {
    ctx.beginPath();

    ctx.lineTo(this.x + (this.width - this.height), this.y + this.height);
    ctx.lineTo(this.x + (-this.width - this.height), this.y + this.height);
    ctx.lineTo(this.x + (-this.width + this.height), this.y - this.height);
    ctx.lineTo(this.x + (this.width + this.height), this.y - this.height);
    ctx.closePath();

    if (this.stroke) {
      ctx.font = '19px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.strokeStyle = this.style;
      ctx.stroke();
    } else {
      ctx.fillStyle = this.style;
      ctx.strokeStyle = '#9c27b0';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    }
  }

  drawHexagon(ctx) {
    const ANGLE_IN_RADIAN = (2 * Math.PI) / 6;

    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      let k = 1.0;
      if (i === 0 || i === 3) {
        k = 0.8;
      }
      ctx.lineTo(
        this.x + this.width * Math.cos(ANGLE_IN_RADIAN * i) * k,
        this.y + this.height * Math.sin(ANGLE_IN_RADIAN * i)
      );
    }
    ctx.closePath();

    if (this.stroke) {
      ctx.font = '19px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.strokeStyle = this.style;
      ctx.stroke();
      console.log('stroke hex');
    } else {
      ctx.fillStyle = this.style;
      ctx.strokeStyle = '#009688';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    }
  }

  isMouseInEnd(x, y) {
    let shapeLeft, shapeRight, shapeTop, shapeBottom;
    if (this.type == 'rectangle') {
      shapeLeft = this.x - this.width / 2;
      shapeRight = this.x + this.width / 2;
      shapeTop = this.y - this.height / 2;
      shapeBottom = this.y + this.height / 2;
    } else {
      shapeLeft = this.x - this.width;
      shapeRight = this.x + this.width;
      shapeTop = this.y - this.height;
      shapeBottom = this.y + this.height;
    }

    if (
      ((shapeLeft < x && x < shapeLeft + 10) ||
        (x < shapeRight && shapeRight - 10 < x)) &&
      ((shapeTop < y && y < shapeTop + 10) ||
        (y < shapeBottom && shapeBottom - 10 < y))
    ) {
      return true;
    }
    return false;
  }
  isMouseInShape(x, y) {
    let shapeLeft, shapeRight, shapeTop, shapeBottom;
    if (this.type == 'rectangle') {
      shapeLeft = this.x - this.width / 2;
      shapeRight = this.x + this.width / 2;
      shapeTop = this.y - this.height / 2;
      shapeBottom = this.y + this.height / 2;
    } else {
      shapeLeft = this.x - this.width;
      shapeRight = this.x + this.width;
      shapeTop = this.y - this.height;
      shapeBottom = this.y + this.height;
    }

    if (x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom) {
      return true;
    }
    return false;
  }
}

export default Shape;
