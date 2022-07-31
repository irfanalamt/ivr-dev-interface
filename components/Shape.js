class Shape {
  constructor(x, y, width, height, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
  }

  calcArea() {
    return this.width * this.height;
  }
}

export default Shape;
