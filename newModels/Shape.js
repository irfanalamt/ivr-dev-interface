class Shape {
  constructor(x, y, type, style = 'black') {
    this.x = x;
    this.y = y;
    this.width = null;
    this.height = null;
    this.type = type;
    this.style = style;

    this.initPos = [x, y];
    this.text = type;
    this.selected = false;
    this.userValues = null;

    this.nextItem = null;
    this.functionString = '';
  }

  fillSelected(ctx) {
    ctx.fillStyle = '#d4d7d8';
    ctx.fill();
  }
  getBottomCoordinates() {
    return [this.x, this.y + this.height / 2];
  }
  getTopCoordinates() {
    return [this.x, this.y - this.height / 2];
  }
  getLeftCoordinates() {
    return [this.x - this.width / 2, this.y];
  }
  getRightCoordinates() {
    return [this.x + this.width / 2, this.y];
  }

  drawDotsTopAndBottom(ctx) {
    const dotRadius = 1.9;
    const topCoordinates = this.getTopCoordinates();
    const bottomCoordinates = this.getBottomCoordinates();

    ctx.fillStyle = this.style;

    // Draw top dot
    ctx.beginPath();
    ctx.arc(...topCoordinates, dotRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw bottom dot
    ctx.beginPath();
    ctx.arc(...bottomCoordinates, dotRadius, 0, 2 * Math.PI);
    ctx.fill();
  }

  drawShape(ctx) {
    switch (this.type) {
      case 'runScript':
        this.drawRectangle(ctx);
        break;

      case 'callAPI':
        this.drawInvertedHexagon(ctx);
        break;

      case 'setParams':
        this.drawPentagon(ctx);
        break;

      case 'playMenu':
        this.drawHexagon(ctx);
        break;

      case 'getDigits':
        this.drawParallelogram(ctx);
        break;

      case 'playMessage':
        this.drawRoundedRectangle(ctx);
        break;

      case 'playConfirm':
        this.drawRoundedRectangle2(ctx);
        break;

      case 'endFlow':
        this.drawEndCircle(ctx);
        break;

      case 'connector':
        this.drawSmallCircle(ctx);
        break;

      case 'jumper':
        this.drawTriangle(ctx);
        break;

      case 'switch':
        this.drawPentagonSwitch(ctx);
        break;

      case 'module':
        this.drawModule(ctx);
        break;

      //   case 'exitPoint':
      //     this.drawTinyCircle(ctx);
      //     break;

      //   case 'tinyCircle':
      //     this.drawTinyCircle(ctx);
      //     break;
    }
  }

  drawRectangle(ctx) {
    this.width = 120;
    this.height = 30;

    if (this.selected) {
      ctx.fillStyle = '#d4d7d8';
      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    }
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x, this.y);
    ctx.strokeStyle = '#ff5722';
    this.style = '#ff5722';
    ctx.strokeRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    this.drawDotsTopAndBottom(ctx);
  }

  drawInvertedHexagon(ctx) {
    this.width = 90;
    this.height = 30;

    ctx.beginPath();
    ctx.translate(this.x, this.y);
    this.stroke && this.setWidthFromText(ctx);

    ctx.moveTo(this.width / 2, -(this.height / 3));
    ctx.lineTo(this.width / 2, this.height / 3);
    ctx.lineTo(0, this.height / 2);
    ctx.lineTo(-this.width / 2, this.height / 3);
    ctx.lineTo(-this.width / 2, -this.height / 3);
    ctx.lineTo(0, -this.height / 2);

    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // fill color when selected
    this.selected && this.fillSelected(ctx);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x, this.y);
    ctx.strokeStyle = '#2196f3';
    ctx.stroke();
    this.style = '#2196f3';
    this.drawDotsTopAndBottom(ctx);
  }
  drawPentagon(ctx) {
    this.width = 120;
    this.height = 30;
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width / 2, -this.height / 2);
    ctx.lineTo(this.width / 2, this.height / 3);
    ctx.lineTo(0, this.height / 2);
    ctx.lineTo(-this.width / 2, this.height / 3);
    ctx.lineTo(-this.width / 2, -this.height / 2);

    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // fill color when selected
    this.selected && this.fillSelected(ctx);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x, this.y - 2);
    ctx.strokeStyle = '#e91e63';
    ctx.stroke();
    this.style = '#e91e63';
    this.drawDotsTopAndBottom(ctx);
  }
  drawHexagon(ctx) {
    this.width = 150;
    this.height = 30;
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

    // fill color when selected
    this.selected && this.fillSelected(ctx);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x, this.y);
    ctx.strokeStyle = '#009688';
    ctx.stroke();

    this.style = '#009688';
    this.drawDotsTopAndBottom(ctx);
    // this.drawExitPointsMenu(ctx);
  }
  drawParallelogram(ctx) {
    this.width = 120;
    this.height = 30;
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(-this.width * (3 / 8), -this.height / 2);
    ctx.lineTo(this.width * (5 / 8), -this.height / 2);
    ctx.lineTo(this.width * (3 / 8), this.height / 2);
    ctx.lineTo(-this.width * (5 / 8), this.height / 2);
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // fill color when selected
    this.selected && this.fillSelected(ctx);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x, this.y);

    ctx.strokeStyle = '#9c27b0';
    ctx.stroke();

    this.style = '#9c27b0';
    this.drawDotsTopAndBottom(ctx);
  }
  drawRoundedRectangle(ctx) {
    this.width = 150;
    this.height = 30;
    this.style = '#c0ca33';
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

    // fill color if selected
    this.selected && this.fillSelected(ctx);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x, this.y);
    ctx.strokeStyle = this.style;
    ctx.stroke();
    this.drawDotsTopAndBottom(ctx);
  }
  drawRoundedRectangle2(ctx) {
    this.width = 150;
    this.height = 30;
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

    // fill color if selected
    this.selected && this.fillSelected(ctx);
    this.style = '#7cb342';
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x, this.y);
    ctx.strokeStyle = this.style;
    ctx.stroke();
    this.drawDotsTopAndBottom(ctx);
  }

  drawEndCircle(ctx) {
    this.width = 35;
    this.height = 35;
    this.style = '#e91e63';
    ctx.beginPath();

    ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
    // fill color if selected
    this.selected && this.fillSelected(ctx);
    ctx.fillStyle = this.style;
    ctx.fill();

    ctx.lineWidth = 1;
    ctx.font = '25px sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Χ', this.x, this.y + 2);
  }
  drawSmallCircle(ctx) {
    this.width = 25;
    this.height = 25;
    this.style = '#009688';
    ctx.beginPath();

    ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
    // fill color if selected
    this.selected && this.fillSelected(ctx);
    ctx.fillStyle = this.style;
    ctx.fill();

    ctx.lineWidth = 1;
    ctx.font = '30px sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', this.x, this.y + 2);
  }

  drawTriangle(ctx) {
    this.width = 25;
    this.height = 25;
    this.style = '#f57f17';

    ctx.beginPath();

    ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
    // fill color if selected
    this.selected && this.fillSelected(ctx);
    ctx.fillStyle = this.style;
    ctx.fill();

    ctx.lineWidth = 1;
    ctx.font = '20px sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('▼', this.x, this.y + 2);
  }
  drawPentagonSwitch(ctx) {
    this.width = 120;
    this.height = 30;
    this.style = '#795548';

    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5 + 0.5 * this.height, -this.height * 0.5);
    ctx.lineTo(this.width * 0.5 - 0.5 * this.height, -this.height * 0.5);

    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // exit points for switch when in stage

    // fill color if selected
    this.selected && this.fillSelected(ctx);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x, this.y);
    ctx.strokeStyle = this.style;
    ctx.stroke();
    this.drawDotsTopAndBottom(ctx);
    // this.drawExitPointsSwitch(ctx);
  }

  drawModule(ctx) {
    this.width = 50;
    this.height = 45;

    ctx.fillStyle = '#f5cbab';
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.strokeStyle = '#eda167';
    this.style = '#eda167';
    this.drawDotsTopAndBottom(ctx);
    ctx.strokeRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x, this.y);
  }
}

export default Shape;
