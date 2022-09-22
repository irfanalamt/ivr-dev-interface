class Line {
  constructor(x1, y1, x2, y2, startItem, endItem) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.startItem = startItem;
    this.endItem = endItem;
    this.color = '#424242';
    this.segments = [{ x1: this.x1, y1: this.y1, x2: this.x2, y2: this.y2 }];
    this.slope = (y2 - y1) / (x2 - x1);
    this.dragCount = 0;
  }

  connectPoints(ctx) {
    let slope1, slope2;
    ctx.beginPath();
    // if num of lines >1, connect points and add circle at endPoint
    if (this.segments.length > 1) {
      let { x1, y1, x2, y2 } = this.segments[0];
      slope1 = (y2 - y1) / (x2 - x1);

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.arc(x2, y2, 2, 0, Math.PI * 2);
    }

    // draw last segment with arrow at endPoint
    let { x1, y1, x2, y2 } = this.segments.at(-1);
    slope2 = (y2 - y1) / (x2 - x1);

    const headLength = 8;
    let dx = x2 - x1;
    let dy = y2 - y1;
    let angle = Math.atan2(dy, dx);

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(
      x2 - headLength * Math.cos(angle - Math.PI / 6),
      y2 - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLength * Math.cos(angle + Math.PI / 6),
      y2 - headLength * Math.sin(angle + Math.PI / 6)
    );

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();

    console.log('slope1', slope1, 'slope2', slope2);
    if (slope2 === slope1) return;
    if (Math.abs(slope2 - slope1) < 0.15 && this.dragCount > 1) {
      console.log('remove seg🚫');
      this.removeSegment();
      this.dragCount = 0;
    }
  }

  linepointNearestMouse(x, y) {
    const lerp = (a, b, x) => a + x * (b - a);
    const linePointsArray = [];

    this.segments.forEach((el) => {
      const dx = el.x2 - el.x1;
      const dy = el.y2 - el.y1;
      const t = ((x - el.x1) * dx + (y - el.y1) * dy) / (dx * dx + dy * dy);
      const lineX = lerp(el.x1, el.x2, t);
      const lineY = lerp(el.y1, el.y2, t);

      const xSmall = el.x1 < el.x2 ? el.x1 : el.x2;
      const xBig = el.x1 > el.x2 ? el.x1 : el.x2;
      const ySmall = el.y1 < el.y2 ? el.y1 : el.y2;
      const yBig = el.y1 > el.y2 ? el.y1 : el.y2;
      // check if mousepoint inside that line enclosing rectangle
      if (xSmall < x && x < xBig && ySmall < y && y < yBig) {
        linePointsArray.push({ x: lineX, y: lineY });
      }
    });

    return linePointsArray;
  }

  setColor(color) {
    this.color = color;
  }

  addSegment(x, y) {
    this.segments.at(-1).x2 = x;
    this.segments.at(-1).y2 = y;
    this.segments.push({ x1: x, y1: y, x2: this.x2, y2: this.y2 });
  }

  removeSegment() {
    this.segments.pop();
    this.segments[0].x2 = this.x2;
    this.segments[0].y2 = this.y2;
  }

  setStartPoint(x1, y1) {
    this.x1 = x1;
    this.y1 = y1;
    this.segments[0].x1 = x1;
    this.segments[0].y1 = y1;
  }

  setEndPoint(x2, y2) {
    this.x2 = x2;
    this.y2 = y2;
    this.segments.at(-1).x2 = x2;
    this.segments.at(-1).y2 = y2;
  }
}

export default Line;
