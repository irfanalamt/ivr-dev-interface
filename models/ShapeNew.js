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
      invertedHexagon: 'callAPI',
      parallelogram: 'getDigits',
      roundedRectangle: 'playMessage',
      roundedRectangle2: 'playConfirm',
      pentagon: 'setParams',
      smallCircle: 'connector',
      triangle: 'jumper',
    };

    this.text = mapShapes[type] ?? '';
    this.selected = false;
    this.userValues = null;
    this.nextItem = null;
    this.functionString = '';
    this.id = null;
    this.connectors = this.type === 'hexagon' ? [] : null;
  }

  getInitPos() {
    // return initial position to reset palette shape after dragdrop
    return this.initPos;
  }
  getEntryPoint() {
    return [this.x, this.y - this.height / 2];
  }

  getExitPoint() {
    return [this.x, this.y + this.height / 2];
  }

  setConnectors(id) {
    // only push if not present in array
    if (this.connectors.includes(id)) return;

    this.connectors.push(id);
  }

  setId(id, page = 1) {
    if (page > 1) {
      this.id = parseInt(`${page}` + id);
      this.text += `${page}` + `${id}`;
      return;
    }

    // unique id set based on shapes array length
    this.id = id;
    // add id to name text end
    this.text += id;
  }
  setText(inputText) {
    this.text = inputText;

    // auto set width from textSize
    this.setWidthFromText();
  }
  setNextItem(item) {
    this.nextItem = item;
  }

  setFunctionString(text) {
    this.functionString = text;
  }

  setSelected(bool) {
    this.selected = bool;
  }
  setUserValues(userValues) {
    this.userValues = { ...userValues };
  }
  fillSelected(ctx) {
    ctx.fillStyle = '#d4d7d8';
    ctx.fill();
  }

  isMouseInShape(x, y) {
    // returns true if mouse is in shape; else false

    let shapeLeft, shapeRight, shapeTop, shapeBottom;

    shapeLeft = this.x - this.width / 2;
    shapeRight = this.x + this.width / 2;
    shapeTop = this.y - this.height / 2;
    shapeBottom = this.y + this.height / 2;

    return x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom;
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

  static createFromObject(shapeObj) {
    const tempShape = new Shape(
      shapeObj.x,
      shapeObj.y,
      shapeObj.width,
      shapeObj.height,
      shapeObj.type,
      shapeObj.style,
      shapeObj.stroke
    );
    tempShape.text = shapeObj.text;
    tempShape.userValues = JSON.parse(shapeObj.userValues);

    return tempShape;
  }

  setWidthFromText() {
    switch (this.type) {
      case 'rectangle':
        this.width = this.text.length * 11.5;
        break;

      case 'invertedHexagon':
        this.width = this.text.length * 10.5 + 10;
        break;

      case 'pentagon':
        this.width = this.text.length * 11.5;
        break;

      case 'hexagon':
        this.width = this.text.length * 12;
        break;

      case 'parallelogram':
        this.width = this.text.length * 11 + 30;
        break;

      case 'roundedRectangle':
        this.width = this.text.length * 10.3 + 10;
        break;

      case 'roundedRectangle2':
        this.width = this.text.length * 10.3 + 10;
        break;
    }
  }

  drawShape(ctx) {
    switch (this.type) {
      case 'rectangle':
        this.drawRectangle(ctx);
        break;

      case 'invertedHexagon':
        this.drawInvertedHexagon(ctx);
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

      case 'roundedRectangle2':
        this.drawRoundedRectangle2(ctx);
        break;

      case 'smallCircle':
        this.drawSmallCircle(ctx);
        break;

      case 'triangle':
        this.drawTriangle(ctx);
        break;
    }
  }

  drawInvertedHexagon(ctx) {
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width * 0.5, -this.height * 0.5);
    ctx.lineTo(this.width * 0.5, this.height * 0.5);
    ctx.lineTo(0, this.height * 0.5 + this.height * 0.3);
    ctx.lineTo(-this.width * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5, -this.height * 0.5);
    ctx.lineTo(0, -this.height * 0.5 - this.height * 0.3);

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
      ctx.strokeStyle = '#2196f3';
      ctx.stroke();
      return;
    }

    ctx.fillStyle = this.style;
    ctx.lineWidth = 2;
    ctx.fill();
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
    ctx.lineWidth = 2;
    ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
    ctx.fill();
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

      ctx.lineWidth = 2;

      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    }
  }

  drawPentagon(ctx) {
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
    ctx.lineWidth = 2;
    ctx.fill();
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
    ctx.lineWidth = 2;
    ctx.fill();
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
    ctx.lineWidth = 2;
    ctx.fill();
  }

  drawRoundedRectangle(ctx) {
    ctx.beginPath();
    ctx.translate(this.x, this.y);
    ctx.moveTo(this.width * 0.5 - this.height * 0.5, this.height * 0.5);
    ctx.lineTo(-(this.width * 0.5 - this.height * 0.5), this.height * 0.5);

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
    ctx.lineWidth = 2;
    ctx.fill();
  }
  // #7cb342
  drawRoundedRectangle2(ctx) {
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
      ctx.strokeStyle = '#7cb342';
      ctx.stroke();
      return;
    }
    ctx.fillStyle = this.style;
    ctx.lineWidth = 2;
    ctx.fill();
  }
  drawTriangle(ctx) {
    ctx.beginPath();

    if (this.stroke) {
      ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
      // fill color if selected
      this.selected && this.fillSelected(ctx);
      ctx.fillStyle = '#f57f17';
      ctx.fill();

      ctx.lineWidth = 1;
      ctx.font = '20px sans-serif';
      ctx.fillStyle = 'black';

      ctx.fillText('▼', this.x, this.y + 2);

      return;
    }

    ctx.fillStyle = this.style;
    ctx.lineWidth = 2;
    ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.font = '20px sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('▼', this.x, this.y + 2);
  }
}

export default Shape;
