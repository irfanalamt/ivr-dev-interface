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
          ctx.fillRect(
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
          ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'hexagon':
        this.drawHexagon(ctx);
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
      console.log(`width=${this.width} height=${this.height}`);
    }

    if (this.stroke) {
      ctx.font = '19px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.closePath();
      ctx.strokeStyle = this.style;
      ctx.stroke();
      console.log('stroke hex');
    } else {
      ctx.fillStyle = this.style;
      ctx.fill();
    }
  }

  isMouseInEnd(x, y) {
    let edgeLeft, edgeRight, edgeTop, edgeBottom;
    if (this.type == 'rectangle') {
      edgeLeft = (this.x - this.width / 2) * 1.1;
      edgeRight = (this.x + this.width / 2) * 0.9;
      edgeTop = (this.y - this.height / 2) * 1.1;
      edgeBottom = (this.y + this.height / 2) * 0.9;
    }

    if ((x < edgeLeft || x > edgeRight) && (y < edgeTop || y > edgeBottom)) {
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
