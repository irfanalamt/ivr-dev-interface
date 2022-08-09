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
      this.text = 'addNew';
    } else if (type === 'parallelogram') {
      this.text = 'getDigits';
    } else if (type === 'roundedRectangle') {
      this.text = 'playMessage';
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
          let menubookIcon = new Image();
          menubookIcon.src = '/icons/menu_book.svg';
          ctx.fillRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
          );
          ctx.drawImage(
            menubookIcon,
            this.x - this.width / 2 + 10,
            this.y - this.height / 2 + 5,
            20,
            20
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
          ctx.arc(this.x, this.y, this.width * 0.5, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = this.style;
          ctx.strokeStyle = '#2196f3';
          ctx.lineWidth = 2;
          ctx.arc(this.x, this.y, this.width * 0.5, 0, Math.PI * 2);
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

      case 'roundedRectangle':
        this.drawRoundedRectangle(ctx);
        break;
    }
  }

  drawParallelogram(ctx) {
    ctx.beginPath();
    ctx.translate(this.x, this.y);
    ctx.lineTo(this.width * 0.5 - this.height * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5 - this.height * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5 + this.height * 0.5, -this.height * 0.5);
    ctx.lineTo(this.width * 0.5 + this.height * 0.5, -this.height * 0.5);
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

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
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width * 0.5, 0);
    ctx.lineTo(this.width * 0.4, 0.5 * this.height);

    ctx.lineTo(-this.width * 0.4, 0.5 * this.height);
    ctx.lineTo(-this.width * 0.5, 0);
    ctx.lineTo(-this.width * 0.4, -0.5 * this.height);
    ctx.lineTo(this.width * 0.4, -0.5 * this.height);
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

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

  drawRoundedRectangle(ctx) {
    ctx.beginPath();
    ctx.translate(this.x, this.y);
    ctx.moveTo(this.width * 0.5 - this.height * 0.5, this.height * 0.5);
    ctx.lineTo(-(this.width * 0.5 - this.height * 0.5), this.height * 0.5);
    // ctx.lineTo(-this.width * 0.5, -this.height * 0.5);
    ctx.arc(
      -(this.width * 0.5 - this.height * 0.5),
      0,
      Math.abs(this.height * 0.5),
      0.5 * Math.PI,
      1.5 * Math.PI
    );
    ctx.lineTo(this.width * 0.5 - this.height * 0.5, -this.height * 0.5);
    ctx.arc(
      this.width * 0.5 - this.height * 0.5,
      0,
      Math.abs(this.height * 0.5),
      1.5 * Math.PI,
      0.5 * Math.PI
    );
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
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
      ctx.strokeStyle = '#cddc39';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    }
  }

  isMouseNearVertex(x, y) {
    let leftVertex, rightVertex;

    leftVertex = [this.x - this.width / 2, this.y];
    rightVertex = [this.x + this.width / 2, this.y];
    console.log('.is near vertex.');
    if (
      this.isNearPoint(x, y, ...leftVertex) ||
      this.isNearPoint(x, y, ...rightVertex)
    ) {
      return true;
    }

    return false;
  }

  isNearPoint(x1, y1, x2, y2) {
    const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    if (parseInt(dist) < 10) {
      return true;
    } else return false;
  }
  isMouseInShape(x, y) {
    let shapeLeft, shapeRight, shapeTop, shapeBottom;

    shapeLeft = this.x - this.width / 2;
    shapeRight = this.x + this.width / 2;
    shapeTop = this.y - this.height / 2;
    shapeBottom = this.y + this.height / 2;

    if (x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom) {
      return true;
    }
    return false;
  }
}

export default Shape;
