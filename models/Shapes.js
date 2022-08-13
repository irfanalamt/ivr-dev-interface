class Shapes {
  constructor(groupname, shapes) {
    this.groupname = groupname;
    this.shapes = shapes;
  }
  setShapes({ groupname, shapes }) {
    this.groupname = groupname;
    this.shapes = shapes;
  }
  displayAll() {
    return `name=${this.groupname} shapes=${this.shapes}`;
  }
  getShapes() {
    return this.shapes;
  }
  addShape(newShape) {
    this.shapes.push(newShape);
  }
}

export default Shapes;
