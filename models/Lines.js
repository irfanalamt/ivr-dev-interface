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
