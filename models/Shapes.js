import Shape from './Shape';

class Shapes {
  constructor(groupname, shapes) {
    this.groupname = groupname;
    this.shapes = shapes;
  }
  setShapes(data) {
    let newShapesArray = [];
    data.forEach((el) => {
      let { x, y, width, height, type, name, userValues } = el;
      console.log('set shapes', name, type);
      let newShape = new Shape(x, y, width, height, type, null, true);
      newShape.setText(name);
      newShapesArray.push(newShape);
      newShape.setUserValues(userValues);
    });
    let newShapes = new Shapes('stage', newShapesArray);
    return newShapes;
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

  getConnectionsArray() {
    let tempArray = [];
    this.shapes.forEach((el) => {
      if (el.nextItem) {
        let index = this.shapes.findIndex((elm) => elm.text === el.nextItem);
        if (index !== -1) {
          let shape1 = el;
          let shape2 = this.shapes[index];
          tempArray.push({
            x1: shape1.getExitPoint()[0],
            y1: shape1.getExitPoint()[1],
            x2: shape2.getEntryPoint()[0],
            y2: shape2.getEntryPoint()[1],
            startItem: shape1.text,
            endItem: shape2.text,
          });
        }
      }
    });
    return tempArray;
  }
  removeShape(index) {
    this.shapes.splice(index, 1);
  }
  removeShapeNextByName(name) {
    // to reset nextItem by name
    let index = this.shapes.findIndex((el) => el.text === name);
    if (index !== -1) {
      this.shapes[index].nextItem = null;
    }
  }
}

export default Shapes;
