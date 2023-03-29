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

    this.exitPoints = [];
    this.functionString = '';
    this.setWidthAndHeight(type);
    this.setImage(type);
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
        this.height = 40;
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
        this.width = 40;
        this.height = 40;
        break;

      case 'connector':
        this.width = 30;
        this.height = 30;
        break;

      case 'jumper':
        this.width = 35;
        this.height = 35;
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

  setImage(type) {
    if (
      [
        'runScript',
        'callAPI',
        'setParams',
        'playMenu',
        'getDigits',
        'playMessage',
        'playConfirm',
        'switch',
        'endFlow',
      ].includes(type)
    ) {
      this.img = new Image(20, 20);
      this.img.src = `/icons/${type}Black.png`;
    }
  }

  setTextAndId(shapeCount) {
    const shapeTypeLetterMap = new Map([
      ['setParams', 'A'],
      ['runScript', 'B'],
      ['callAPI', 'C'],
      ['playMenu', 'D'],
      ['getDigits', 'E'],
      ['playMessage', 'F'],
      ['playConfirm', 'G'],
      ['switch', 'H'],
      ['endFlow', 'I'],
      ['connector', 'J'],
      ['jumper', 'K'],
      ['module', 'M'],
    ]);

    const startCharacter = shapeTypeLetterMap.get(this.type) || 'X';
    const id = `${startCharacter}${shapeCount}`;

    this.text += shapeCount.toString();
    this.id = id;
  }

  copyShape(shapeCount, shapes, offsetX, offsetY) {
    const {x, y, type, text} = this;
    const count = ++shapeCount[type];
    const newShape = new Shape(x + offsetX, y + offsetY, type);
    newShape.setTextAndId(count);
    const shapeNames = shapes.map((shape) => shape.text);
    newShape.text = this.getUniqueName(text, shapeNames);

    return newShape;
  }

  getUniqueName(oldName, shapeNames) {
    let num = 1;
    let newName = `${oldName}${num}`;
    while (shapeNames.includes(newName)) {
      num++;
      newName = `${oldName}${num}`;
    }

    return newName;
  }

  getBottomCoordinates() {
    return [this.x, this.y + this.height / 2];
  }

  getBottomCoordinatesMultiExit(position, totalPoints) {
    const SPACING = 20;
    const isEvenPoints = totalPoints % 2 === 0;

    if (isEvenPoints) {
      const halfPoints = totalPoints / 2;
      if (position <= halfPoints) {
        const xPosition = this.x - SPACING * position;
        const yPosition = this.y + this.height / 2;

        return [xPosition, yPosition];
      } else {
        const xPosition = this.x + SPACING * (position - halfPoints);
        const yPosition = this.y + this.height / 2;

        return [xPosition, yPosition];
      }
    }

    const xPosition = this.x + (position - (totalPoints + 1) / 2) * SPACING;
    const yPosition = this.y + this.height / 2;

    return [xPosition, yPosition];
  }

  getTopCoordinates() {
    return [this.x, this.y - this.height / 2];
  }
  getLeftCoordinates() {
    if (this.type === 'switch') {
      return [this.x - this.width / 2 + this.height / 4, this.y];
    }

    return [this.x - this.width / 2, this.y];
  }
  getRightCoordinates() {
    if (this.type === 'switch') {
      return [this.x + this.width / 2 - this.height / 4, this.y];
    }

    return [this.x + this.width / 2, this.y];
  }

  getRelativeExitCoordinates(shape2) {
    if (['connector', 'endFlow', 'jumper'].includes(this.type)) {
      return this.getCircularCoordinates(shape2.x, shape2.y);
    }

    let [x, y] = this.getBottomCoordinates();

    if (this.y < shape2.y) {
      if (shape2.getTopCoordinates()[1] < this.getBottomCoordinates()[1]) {
        [x, y] =
          this.x < shape2.x
            ? this.getRightCoordinates()
            : this.getLeftCoordinates();
      }
    } else {
      [x, y] =
        this.x < shape2.x
          ? this.getRightCoordinates()
          : this.getLeftCoordinates();
    }

    return [x, y];
  }

  getRelativeEntryCoordinates(shape1) {
    if (['connector', 'endFlow', 'jumper'].includes(this.type)) {
      return this.getCircularCoordinates(shape1.x, shape1.y);
    }
    let [x, y] = this.getTopCoordinates();

    if (this.getTopCoordinates()[1] < shape1.getBottomCoordinates()[1]) {
      let dxLeft = Math.abs(this.getLeftCoordinates()[0] - shape1.x);
      let dxRight = Math.abs(this.getRightCoordinates()[0] - shape1.x);

      [x, y] =
        dxLeft < dxRight
          ? this.getLeftCoordinates()
          : this.getRightCoordinates();
    }

    return [x, y];
  }
  getCircularCoordinates(pointX, pointY) {
    const angle = Math.atan2(pointY - this.y, pointX - this.x);
    const radius = this.width / 2;
    const x = this.x + radius * Math.cos(angle);
    const y = this.y + radius * Math.sin(angle);

    return [x, y];
  }

  isInRectangle(startX, startY, width, height) {
    let x1 = startX;
    let y1 = startY;
    let x2 = startX + width;
    let y2 = startY + height;

    // Swap coordinates if width or height is negative
    if (width < 0) {
      x1 = startX + width;
      x2 = startX;
    }
    if (height < 0) {
      y1 = startY + height;
      y2 = startY;
    }

    // Check if point is inside the rectangle
    if (this.x >= x1 && this.x <= x2 && this.y >= y1 && this.y <= y2) {
      return true;
    } else {
      return false;
    }
  }

  isMouseInShape(x, y) {
    const THRESHOLD = 4;
    const left = this.x - this.width / 2 - THRESHOLD;
    const right = this.x + this.width / 2 + THRESHOLD;
    const top = this.y - this.height / 2 - THRESHOLD;
    const bottom = this.y + this.height / 2 + THRESHOLD;

    return x > left && x < right && y > top && y < bottom;
  }

  isMouseNearExitPoint(x, y) {
    let exitX, exitY;

    if (['endFlow', 'connector', 'jumper'].includes(this.type)) {
      [exitX, exitY] = [this.x, this.y];
      const distance = Math.hypot(x - exitX, y - exitY);

      if (distance <= 4) {
        return {
          totalPoints: 1,
          position: 1,
          name: 'default',
        };
      } else {
        return false;
      }
    }

    let exitPointCount = 0;

    if (this.type === 'playMenu') {
      const filteredItems = this.userValues?.items?.filter(
        (item) => !item.isDefault
      );
      exitPointCount = filteredItems?.length || 0;

      if (exitPointCount === 1) {
        [exitX, exitY] = this.getBottomCoordinates();
        const distance = Math.hypot(x - exitX, y - exitY);

        if (distance <= 4) {
          return {
            totalPoints: 1,
            position: 1,
            name: filteredItems[0].action,
            exitX,
            exitY,
          };
        } else {
          return false;
        }
      }
    } else if (this.type === 'switch') {
      exitPointCount = (this.userValues?.actions?.length || 0) + 1;
    } else {
      exitPointCount = 1;
    }

    if (exitPointCount === 1) {
      [exitX, exitY] = this.getBottomCoordinates();
      const distance = Math.hypot(x - exitX, y - exitY);

      if (distance <= 4) {
        return {
          totalPoints: 1,
          position: 1,
          name: 'default',
          exitX,
          exitY,
        };
      } else {
        return false;
      }
    }

    if (exitPointCount > 1) {
      let minDistance = Infinity;
      let minPoint = null;
      let minPosition = null;

      for (let i = 1; i <= exitPointCount; i++) {
        const [pointX, pointY] = this.getBottomCoordinatesMultiExit(
          i,
          exitPointCount
        );
        const distance = Math.hypot(x - pointX, y - pointY);

        if (distance < minDistance) {
          minDistance = distance;
          minPoint = [pointX, pointY];
          minPosition = i;
        }
      }

      [exitX, exitY] = minPoint;
      const distance = Math.hypot(x - exitX, y - exitY);

      if (distance <= 4) {
        const name =
          this.type === 'switch' && minPosition === exitPointCount
            ? this.userValues.defaultAction
            : this.getExitPointNameAtPosition(minPosition);

        return {
          totalPoints: exitPointCount,
          position: minPosition,
          name,
          exitX,
          exitY,
        };
      } else {
        return false;
      }
    }

    return false;
  }

  getExitPointNameAtPosition(position) {
    // Position starts from 1.
    const {type, userValues} = this;

    if (type === 'playMenu') {
      const filteredItems = userValues?.items.filter((item) => !item.isDefault);
      const selectedAction = filteredItems?.[position - 1]?.action;
      return selectedAction ?? null;
    }

    if (type === 'switch') {
      const selectedAction = userValues?.actions?.[position - 1]?.action;
      return selectedAction ?? null;
    }

    return null;
  }

  setUserValues(userValues) {
    this.userValues = {...userValues};
  }

  setText(inputText) {
    this.text = inputText;
  }
  setSelected(bool) {
    this.selected = bool;
  }
  fillSelected(ctx) {
    ctx.fillStyle = '#B3E5FC';
    ctx.fill();
  }
  resetContextForDrawingImage(ctx) {
    ctx.fillStyle = 'transparent';
    ctx.strokeStyle = 'transparent';
    ctx.lineWidth = 1;
    ctx.font = '12px arial';
    ctx.globalCompositeOperation = 'source-over';
  }
  resetContextForText(ctx) {
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
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
    ctx.fillStyle = this.style;

    // Draw top dot
    ctx.beginPath();
    ctx.arc(...this.getTopCoordinates(), dotRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw bottom dots
    let exitPointCount = 0;
    if (this.type === 'playMenu') {
      exitPointCount = this.userValues?.items.filter(
        (item) => !item.isDefault
      ).length;
    } else if (this.type === 'switch') {
      exitPointCount = this.userValues?.actions.length + 1;
    } else {
      exitPointCount = 1; // single exit point only
    }

    ctx.fillStyle = '#0d5bdd';
    if (exitPointCount === 1) {
      ctx.beginPath();
      ctx.arc(...this.getBottomCoordinates(), dotRadius * 2, 0, 2 * Math.PI);
      ctx.fill();
    } else if (exitPointCount > 1) {
      for (let i = 1; i <= exitPointCount; i++) {
        ctx.beginPath();
        ctx.arc(
          ...this.getBottomCoordinatesMultiExit(i, exitPointCount),
          dotRadius * 2,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
    }
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
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    if (this.selected) {
      ctx.fillStyle = '#B3E5FC';
      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    }

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(this.img, this.x + 10 - this.width / 2, this.y - 10, 20, 20);

    this.resetContextForText(ctx);
    ctx.fillText(this.text, this.x + 10, this.y);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#4285F4';
    this.style = '#4285F4';
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

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // fill color when selected
    this.selected && this.fillSelected(ctx);

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(this.img, this.x + 10 - this.width / 2, this.y - 10, 20, 20);
    this.resetContextForText(ctx);
    ctx.fillText(this.text, this.x + 10, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#4285F4';
    ctx.stroke();
    this.style = '#4285F4';
    this.drawDotsTopAndBottom(ctx);
  }
  drawPentagon(ctx) {
    this.setWidthFromText(ctx);
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    // ctx.moveTo(this.width / 2, -this.height / 2);
    // ctx.lineTo(this.width / 2, this.height / 3);
    // ctx.lineTo(0, this.height / 2);
    // ctx.lineTo(-this.width / 2, this.height / 3);
    // ctx.lineTo(-this.width / 2, -this.height / 2);

    ctx.moveTo(this.width / 2, -this.height / 2);
    ctx.lineTo(this.width / 2, this.height / 3);
    ctx.lineTo(0, this.height / 2);
    ctx.lineTo(-this.width / 2, this.height / 3);
    ctx.lineTo(-this.width / 2, -this.height / 2);

    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // fill color when selected
    this.selected && this.fillSelected(ctx);

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(
      this.img,
      this.x + 10 - this.width / 2,
      this.y - 10 - 2,
      20,
      20
    );

    this.resetContextForText(ctx);
    ctx.fillText(this.text, this.x + 12, this.y - 2);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#4285F4';
    ctx.stroke();
    this.style = '#4285F4';
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

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // fill color when selected
    this.selected && this.fillSelected(ctx);

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(this.img, this.x + 10 - this.width / 2, this.y - 10, 20, 20);
    this.resetContextForText(ctx);
    ctx.fillText(this.text, this.x + 10, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#4285F4';
    ctx.stroke();

    this.style = '#4285F4';
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

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // fill color when selected
    this.selected && this.fillSelected(ctx);

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(
      this.img,
      this.x + 9 + 10 - this.width / 2,
      this.y - 9,
      18,
      18
    );

    this.resetContextForText(ctx);
    ctx.fillText(this.text, this.x + 12, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#4285F4';
    ctx.stroke();

    this.style = '#4285F4';
    this.drawDotsTopAndBottom(ctx);
  }
  drawRoundedRectangle(ctx) {
    this.setWidthFromText(ctx);
    this.style = '#4285F4';
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

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // fill color if selected
    this.selected && this.fillSelected(ctx);

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(this.img, this.x + 10 - this.width / 2, this.y - 10, 20, 20);

    this.resetContextForText(ctx);
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

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // fill color if selected
    this.selected && this.fillSelected(ctx);
    this.style = '#4285F4';

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(this.img, this.x + 10 - this.width / 2, this.y - 10, 20, 20);
    this.resetContextForText(ctx);
    ctx.fillText(this.text, this.x + 10, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = this.style;
    ctx.stroke();
    this.drawDotsTopAndBottom(ctx);
  }

  drawEndCircle(ctx) {
    this.style = this.userValues?.type === 'transfer' ? '#66bb6a' : '#ef5350';
    const radius = Math.abs(this.width * 0.5);
    const x = this.x - radius;
    const y = this.y - radius;
    const size = 22;

    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);

    // fill color if selected
    this.selected && this.fillSelected(ctx);

    ctx.fillStyle = this.style;
    ctx.fill();

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(
      this.img,
      x + (radius - size / 2),
      y + (radius - size / 2),
      size,
      size
    );
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
    ctx.font = '22px sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('▼', this.x, this.y + 3);
  }
  drawPentagonSwitch(ctx) {
    this.setWidthFromText(ctx);
    this.style = '#4285F4';

    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5 + 0.5 * this.height, -this.height * 0.5);
    ctx.lineTo(this.width * 0.5 - 0.5 * this.height, -this.height * 0.5);

    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // exit points for switch when in stage

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // fill color if selected
    this.selected && this.fillSelected(ctx);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(this.img, this.x + 15 - this.width / 2, this.y - 10, 22, 22);
    this.resetContextForText(ctx);
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
