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
}
export default Lines;
