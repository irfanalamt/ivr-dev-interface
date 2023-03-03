import ApiIcon from '@mui/icons-material/Api';

class Shape {
  constructor(x, y, type, style = 'black') {
    this.x = x;
    this.y = y;

    this.type = type;
    this.style = style;

    this.text = type;
    this.selected = false;
    this.userValues = null;

    this.nextItem = null;
    this.functionString = '';
    this.setWidthAndHeight(type);
  }
  setWidthAndHeight(type) {
    switch (type) {
      case 'runScript':
        this.width = 120;
        this.height = 40;
        break;

      case 'callAPI':
        this.width = 90;
        this.height = 40;
        break;

      case 'setParams':
        this.width = 120;
        this.height = 45;
        break;

      case 'playMenu':
        this.width = 150;
        this.height = 40;
        break;

      case 'getDigits':
        this.width = 120;
        this.height = 40;
        break;

      case 'playMessage':
        this.width = 150;
        this.height = 40;
        break;

      case 'playConfirm':
        this.width = 150;
        this.height = 40;
        break;

      case 'endFlow':
        this.width = 35;
        this.height = 35;
        break;

      case 'connector':
        this.width = 25;
        this.height = 25;
        break;

      case 'jumper':
        this.width = 25;
        this.height = 25;
        break;

      case 'switch':
        this.width = 120;
        this.height = 40;
        break;

      case 'module':
        this.width = 50;
        this.height = 45;
        break;

      default:
        this.width = 120;
        this.height = 40;
    }
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
  isMouseInShape(x, y) {
    const shapeLeft = this.x - this.width / 2;
    const shapeRight = this.x + this.width / 2;
    const shapeTop = this.y - this.height / 2;
    const shapeBottom = this.y + this.height / 2;

    return x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom;
  }

  setSelected(bool) {
    this.selected = bool;
  }

  setWidthFromText(ctx) {
    // reset text styles
    ctx.font = '18px sans-serif';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const width = ctx.measureText(this.text).width;
    const minWidth = 90;
    let additionalWidth = 50;

    if (this.type === 'getDigits' || this.type === 'switch') {
      additionalWidth = 60;
    }

    this.width = Math.max(width + additionalWidth, minWidth);
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
    this.setWidthFromText(ctx);
    ctx.fillStyle = '#f8fbfe';
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
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

    const img = new Image();
    img.src = '/icons/runScriptBlack.png';

    ctx.drawImage(img, this.x + 10 - this.width / 2, this.y - 10, 20, 20);
    ctx.fillText(this.text, this.x + 10, this.y);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#00456B';
    this.style = '#00456B';
    ctx.strokeRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );

    this.drawDotsTopAndBottom(ctx);
  }

  drawInvertedHexagon(ctx) {
    this.setWidthFromText(ctx);

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

    ctx.fillStyle = '#f8fbfe';
    ctx.fill();

    // fill color when selected
    this.selected && this.fillSelected(ctx);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const img = new Image();
    img.src = '/icons/callAPIBlack.png';

    ctx.drawImage(img, this.x + 10 - this.width / 2, this.y - 10, 20, 20);
    ctx.fillText(this.text, this.x + 10, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#00456B';
    ctx.stroke();
    this.style = '#00456B';
    this.drawDotsTopAndBottom(ctx);
  }
  drawPentagon(ctx) {
    this.setWidthFromText(ctx);
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width / 2, -this.height / 2);
    ctx.lineTo(this.width / 2, this.height / 3);
    ctx.lineTo(0, this.height / 2);
    ctx.lineTo(-this.width / 2, this.height / 3);
    ctx.lineTo(-this.width / 2, -this.height / 2);

    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = '#f8fbfe';
    ctx.fill();

    // fill color when selected
    this.selected && this.fillSelected(ctx);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const img = new Image();
    img.src = '/icons/setParamsBlack.png';
    ctx.drawImage(img, this.x + 10 - this.width / 2, this.y - 10, 20, 20);
    ctx.fillText(this.text, this.x + 12, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#00456B';
    ctx.stroke();
    this.style = '#00456B';
    this.drawDotsTopAndBottom(ctx);
  }
  drawHexagon(ctx) {
    this.setWidthFromText(ctx);
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

    ctx.fillStyle = '#f8fbfe';
    ctx.fill();

    // fill color when selected
    this.selected && this.fillSelected(ctx);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const img = new Image();
    img.src = '/icons/playMenuBlack.png';

    ctx.drawImage(img, this.x + 10 - this.width / 2, this.y - 10, 20, 20);
    ctx.fillText(this.text, this.x + 10, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#00456B';
    ctx.stroke();

    this.style = '#00456B';
    this.drawDotsTopAndBottom(ctx);
    // this.drawExitPointsMenu(ctx);
  }
  drawParallelogram(ctx) {
    this.setWidthFromText(ctx);
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(-this.width * (3 / 8), -this.height / 2);
    ctx.lineTo(this.width * (5 / 8), -this.height / 2);
    ctx.lineTo(this.width * (3 / 8), this.height / 2);
    ctx.lineTo(-this.width * (5 / 8), this.height / 2);
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = '#f8fbfe';
    ctx.fill();

    // fill color when selected
    this.selected && this.fillSelected(ctx);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const img = new Image();
    img.src = '/icons/getDigitsBlack.png';
    ctx.drawImage(img, this.x + 9 + 10 - this.width / 2, this.y - 9, 18, 18);
    ctx.fillText(this.text, this.x + 12, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#00456B';
    ctx.stroke();

    this.style = '#00456B';
    this.drawDotsTopAndBottom(ctx);
  }
  drawRoundedRectangle(ctx) {
    this.setWidthFromText(ctx);
    this.style = '#00456B';
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

    ctx.fillStyle = '#f8fbfe';
    ctx.fill();

    // fill color if selected
    this.selected && this.fillSelected(ctx);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const img = new Image();
    img.src = '/icons/playMessageBlack.png';

    ctx.drawImage(img, this.x + 10 - this.width / 2, this.y - 10, 20, 20);
    ctx.fillText(this.text, this.x + 10, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = this.style;
    ctx.stroke();
    this.drawDotsTopAndBottom(ctx);
  }
  drawRoundedRectangle2(ctx) {
    this.setWidthFromText(ctx);
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

    ctx.fillStyle = '#f8fbfe';
    ctx.fill();

    // fill color if selected
    this.selected && this.fillSelected(ctx);
    this.style = '#00456B';
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const img = new Image();
    img.src = '/icons/playConfirmBlack.png';

    ctx.drawImage(img, this.x + 10 - this.width / 2, this.y - 10, 20, 20);
    ctx.fillText(this.text, this.x + 10, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = this.style;
    ctx.stroke();
    this.drawDotsTopAndBottom(ctx);
  }

  drawEndCircle(ctx) {
    this.style = '#F8D7DA';
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
    this.style = '#AAAAAA';
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
    this.style = '#FF5733';

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
    this.setWidthFromText(ctx);
    this.style = '#00456B';

    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5 + 0.5 * this.height, -this.height * 0.5);
    ctx.lineTo(this.width * 0.5 - 0.5 * this.height, -this.height * 0.5);

    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // exit points for switch when in stage

    ctx.fillStyle = '#f8fbfe';
    ctx.fill();

    // fill color if selected
    this.selected && this.fillSelected(ctx);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const img = new Image();
    img.src = '/icons/switchBlack.png';

    ctx.drawImage(img, this.x + 15 - this.width / 2, this.y - 10, 22, 22);
    ctx.fillText(this.text, this.x + 10, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = this.style;
    ctx.stroke();
    this.drawDotsTopAndBottom(ctx);
    // this.drawExitPointsSwitch(ctx);
  }

  drawModule(ctx) {
    this.setWidthFromText(ctx);
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
