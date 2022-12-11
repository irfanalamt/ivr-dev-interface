class Line {
  constructor(
    x1,
    y1,
    x2,
    y2,
    startItem,
    endItem,
    lineCap = null,
    lineColor,
    lineData = null
  ) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.startItem = startItem;
    this.endItem = endItem;
    // this.color = '#424242';
    this.lineCap = lineCap;
    this.lineColor = lineColor;
    this.lineData = lineData;
  }
  drawFilledArrow(ctx) {
    // draw a line from the first point to the second
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.strokeStyle = this.lineColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();

    // draw an arrow head
    let angle = Math.atan2(this.y2 - this.y1, this.x2 - this.x1);
    ctx.beginPath();
    ctx.fillStyle = this.lineColor;
    ctx.moveTo(this.x2, this.y2);
    ctx.lineTo(
      this.x2 - 10 * Math.cos(angle - Math.PI / 6),
      this.y2 - 10 * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      this.x2 - 10 * Math.cos(angle + Math.PI / 6),
      this.y2 - 10 * Math.sin(angle + Math.PI / 6)
    );
    ctx.fill();
  }
  drawArrow(ctx) {
    const headlen = 8; // length of head in pixels
    const angle = Math.atan2(this.y2 - this.y1, this.x2 - this.x1);
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.lineTo(
      this.x2 - headlen * Math.cos(angle - Math.PI / 6),
      this.y2 - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(this.x2, this.y2);
    ctx.lineTo(
      this.x2 - headlen * Math.cos(angle + Math.PI / 6),
      this.y2 - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  }

  connectPoints(ctx) {
    const headLength = 8;
    let dx = this.x2 - this.x1;
    let dy = this.y2 - this.y1;
    let angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);

    ctx.lineTo(
      this.x2 - headLength * Math.cos(angle - Math.PI / 6),
      this.y2 - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(this.x2, this.y2);
    ctx.lineTo(
      this.x2 - headLength * Math.cos(angle + Math.PI / 6),
      this.y2 - headLength * Math.sin(angle + Math.PI / 6)
    );

    ctx.strokeStyle = this.lineColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    if (this.lineCap) {
      ctx.beginPath();
      ctx.arc(this.x2 - 20, this.y2 - 20, 10, 0, Math.PI * 2);
      ctx.font = '15px sans-serif';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 1;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.lineCap, this.x2 - 20, this.y2 - 18);

      ctx.stroke();
    }
  }

  isBetween(x, min, max) {
    return x >= min && x <= max;
  }
  getLargest(a, b) {
    return a > b ? a : b;
  }
  getSmallest(a, b) {
    return a < b ? a : b;
  }
  isPointBetweenEnclosingRectangle(pointX, pointY) {
    const largeX = this.getLargest(this.x1, this.x2);
    const smallX = this.getSmallest(this.x1, this.x2);
    const largeY = this.getLargest(this.y1, this.y2);
    const smallY = this.getSmallest(this.y1, this.y2);
    const isPointBetweenEnclosingRectangle =
      this.isBetween(pointX, smallX, largeX) &&
      this.isBetween(pointY, smallY, largeY);

    return isPointBetweenEnclosingRectangle;
  }

  isPointNearLine(pointX, pointY) {
    const isPointInRectangle = this.isPointBetweenEnclosingRectangle(
      pointX,
      pointY
    );
    if (!isPointInRectangle) return false;

    // Calculate the distance between point and line
    const distance =
      Math.abs(
        (this.y2 - this.y1) * pointX -
          (this.x2 - this.x1) * pointY +
          this.x2 * this.y1 -
          this.y2 * this.x1
      ) /
      Math.sqrt(
        Math.pow(this.y2 - this.y1, 2) + Math.pow(this.x2 - this.x1, 2)
      );

    // If distance is less than or equal to a certain tolerance, return true
    if (distance <= 5) {
      return true;
    }

    // Else return false
    return false;
  }

  setColor(color) {
    this.color = color;
  }

  setStartPoint(x1, y1) {
    this.x1 = x1;
    this.y1 = y1;
  }

  setEndPoint(x2, y2) {
    this.x2 = x2;
    this.y2 = y2;
  }
}

export default Line;
