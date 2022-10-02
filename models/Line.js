class Line {
  constructor(x1, y1, x2, y2, startItem, endItem, lineCap = null, lineColor) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.startItem = startItem;
    this.endItem = endItem;
    // this.color = '#424242';
    this.lineCap = lineCap;
    this.lineColor = lineColor;
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

  linepointNearestMouse(x, y) {
    const lerp = (a, b, x) => {
      return a + x * (b - a);
    };

    let dx = this.x2 - this.x1;
    let dy = this.y2 - this.y1;
    let t = ((x - this.x1) * dx + (y - this.y1) * dy) / (dx * dx + dy * dy);
    let lineX = lerp(this.x1, this.x2, t);
    let lineY = lerp(this.y1, this.y2, t);

    return {
      x: lineX,
      y: lineY,
    };
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
