import Line from './Line';

class Lines {
  constructor(lines) {
    this.lines = lines;
  }
  setConnections(connections) {
    const linesArray = connections.map(
      (el) =>
        new Line(
          el.x1,
          el.y1,
          el.x2,
          el.y2,
          el.startItem,
          el.endItem,
          el.lineCap,
          el.lineColor,
          el.lineData
        )
    );

    this.lines = linesArray;
  }
  connectAllPoints(ctx) {
    this.lines.forEach((el) => el.connectPoints(ctx));
  }
  getLines() {
    return this.lines;
  }
  addLine(newLine) {
    this.lines.push(newLine);
  }
  removeLine(startItem) {
    let index = this.lines.findIndex((el) => el.startItem === startItem);
    if (index === -1) return;

    this.lines.splice(index, 1);
  }
  removeLineIndex(index) {
    this.lines.splice(index, 1);
  }
}
export default Lines;
