class Lines {
  constructor(lines) {
    this.lines = lines;
  }
  getLines() {
    return this.lines;
  }
  addLine(newLine) {
    this.lines.push(newLine);
  }

  linepointNearestMouse(line, x, y) {
    //
    lerp = function (a, b, x) {
      return a + x * (b - a);
    };
    var dx = line.x1 - line.x0;
    var dy = line.y1 - line.y0;
    var t = ((x - line.x0) * dx + (y - line.y0) * dy) / (dx * dx + dy * dy);
    var lineX = lerp(line.x0, line.x1, t);
    var lineY = lerp(line.y0, line.y1, t);
    return {
      x: lineX,
      y: lineY,
    };
  }
}
export default Lines;
