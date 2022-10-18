import { ThumbDown } from '@mui/icons-material';

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
    const mapShapes = {
      rectangle: 'runScript',
      hexagon: 'playMenu',
      circle: 'callAPI',
      parallelogram: 'getDigits',
      roundedRectangle: 'playMessage',
      pentagon: 'setParams',
      smallCircle: 'connector',
    };

    this.text = mapShapes[type] ?? '';
    this.selected = false;
    this.userValues = null;
    this.nextItem = null;
    this.functionString = '';
  }

  setSelected(bool) {
    this.selected = bool;
  }
  setUserValues(userValues) {
    this.userValues = { ...userValues };
  }

  fillSelected(ctx) {
    ctx.fillStyle = '#eceff1';
    ctx.fill();
  }

  setNextItem(item) {
    this.nextItem = item;
  }

  setFunctionString(text) {
    this.functionString = text;
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

  getSerialized() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      type: this.type,
      style: this.style,
      stroke: this.stroke,
      text: this.text,
      userValues: JSON.stringify(this.userValues),
      functionString: this.functionString,
    };
  }

  drawShape(ctx) {
    switch (this.type) {
      case 'rectangle':
        this.drawRectangle(ctx);
        break;

      case 'circle':
        this.drawCircle(ctx);
        break;

      case 'pentagon':
        this.drawPentagon(ctx);
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

      case 'smallCircle':
        this.drawSmallCircle(ctx);
        break;
    }
  }

  drawSmallCircle(ctx) {
    ctx.beginPath();

    if (this.stroke) {
      ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
      // fill color if selected
      this.selected && this.fillSelected(ctx);
      ctx.fillStyle = '#009688';
      ctx.fill();

      ctx.lineWidth = 1;
      ctx.font = '30px sans-serif';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('+', this.x, this.y + 2);

      return;
    }

    ctx.fillStyle = '#b2dfdb';
    ctx.strokeStyle = '#00796b';
    ctx.lineWidth = 2;
    ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.font = '25px sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', this.x, this.y + 1);
  }

  drawRectangle(ctx) {
    if (this.stroke) {
      if (this.selected) {
        ctx.fillStyle = '#eceff1';
        ctx.fillRect(
          this.x - this.width / 2,
          this.y - this.height / 2,
          this.width,
          this.height
        );
      }
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
  }

  drawCircle(ctx) {
    ctx.beginPath();

    if (this.stroke) {
      ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
      // fill color when selected
      this.selected && this.fillSelected(ctx);

      ctx.font = '19px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.strokeStyle = '#2196f3';

      ctx.stroke();
      return;
    }

    ctx.fillStyle = this.style;
    ctx.strokeStyle = '#2196f3';
    ctx.lineWidth = 2;
    ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  drawPentagon(ctx) {
    // ctx.beginPath();
    // ctx.translate(this.x, this.y);

    // ctx.lineTo(this.width * 0.5, -10);
    // ctx.lineTo(this.width * 0.5, this.height * 0.5);
    // ctx.lineTo(-this.width * 0.5, this.height * 0.5);
    // ctx.lineTo(-this.width * 0.5, -10);
    // ctx.lineTo(0, -this.height * 0.5);

    // ctx.closePath();
    // ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width * 0.5, -this.height * 0.5);
    ctx.lineTo(this.width * 0.5, 10);
    ctx.lineTo(0, this.height * 0.5 + 2);
    ctx.lineTo(-this.width * 0.5, 10);
    ctx.lineTo(-this.width * 0.5, -this.height * 0.5);

    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (this.stroke) {
      // fill color when selected
      this.selected && this.fillSelected(ctx);

      ctx.font = '19px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y - 2);
      ctx.strokeStyle = '#e91e63';
      ctx.stroke();
      return;
    }

    ctx.fillStyle = this.style;
    ctx.strokeStyle = '#e91e63';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
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
      // fill color when selected
      this.selected && this.fillSelected(ctx);

      ctx.font = '19px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.strokeStyle = '#9c27b0';
      ctx.stroke();
      return;
    }
    ctx.fillStyle = this.style;
    ctx.strokeStyle = '#9c27b0';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
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
      // fill color when selected
      this.selected && this.fillSelected(ctx);

      ctx.font = '19px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.strokeStyle = '#009688';
      ctx.stroke();
      return;
    }

    ctx.fillStyle = this.style;
    ctx.strokeStyle = '#009688';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
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
      // fill color if selected
      this.selected && this.fillSelected(ctx);

      ctx.font = '19px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.strokeStyle = '#c0ca33';
      ctx.stroke();
      return;
    }
    ctx.fillStyle = this.style;
    ctx.strokeStyle = '#cddc39';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
  }

  getEntryPoint() {
    return [this.x, this.y - this.height / 2];
  }

  getExitPoint() {
    return [this.x, this.y + this.height / 2];
  }

  isMouseNearVertex(x, y) {
    let leftVertex, rightVertex;

    leftVertex = [this.x - this.width / 2, this.y];
    rightVertex = [this.x + this.width / 2, this.y];
    console.log('.is near vertex.');

    return (
      this.isNearPoint(x, y, ...leftVertex) ||
      this.isNearPoint(x, y, ...rightVertex)
    );
  }

  isNearPoint(x1, y1, x2, y2) {
    const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

    return parseInt(dist) < 10;
  }

  isMouseInShape(x, y) {
    let shapeLeft, shapeRight, shapeTop, shapeBottom;

    shapeLeft = this.x - this.width / 2;
    shapeRight = this.x + this.width / 2;
    shapeTop = this.y - this.height / 2;
    shapeBottom = this.y + this.height / 2;

    return x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom;
  }
}

export default Shape;
