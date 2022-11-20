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

  getSerializedShapes() {
    const serializedShapesArray = this.shapes.map((el) => el.getSerialized());
    console.log(
      '🚀 ~ Shapes ~ getSerializedShapes ~ serializedShapesArray',
      serializedShapesArray
    );

    return serializedShapesArray;
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

  getValidNextItem(i) {
    while (true) {
      let nextShapeId = this.shapes[i].nextItem;
      if (nextShapeId === null || nextShapeId === undefined) return null;

      let ind = this.shapes.findIndex((el) => el.id === nextShapeId);
      if (ind !== -1 && this.shapes[ind].type !== 'smallCircle') {
        return this.shapes[ind].id;
      }
      i = ind;
    }
  }

  // getConnectionsArray() {
  //   let tempArray = [];
  //   this.shapes.forEach((el, i) => {
  //     // if shape has nextitem, find nextShape from shapes array, push linecordinates to tempArray
  //     if (el.nextItem !== null) {
  //       let index = this.shapes.findIndex((elm) => elm.id === el.nextItem);
  //       if (index !== -1) {
  //         let shape1 = el;
  //         let shape2 = this.shapes[index];
  //         console.log('valid next shape:', this.getNextValidItem(i));
  //         // let lineColor = this.getNextValidItem(i) === null ? 'red' : 'black';
  //         tempArray.push({
  //           x1: shape1.getExitPoint()[0],
  //           y1: shape1.getExitPoint()[1],
  //           x2: shape2.getEntryPoint()[0],
  //           y2: shape2.getEntryPoint()[1],
  //           startItem: shape1.id,
  //           endItem: shape2.id,
  //           lineCap: null,
  //           lineColor: 'black',
  //         });
  //       }
  //     }
  //     // if type is playMenu, loop through items array and find action to connect to, find shape in shape array, push linecordinates to tempArray
  //     if (el.type === 'hexagon') {
  //       el.userValues?.items.forEach((elm) => {
  //         if (elm.action) {
  //           let index = this.shapes.findIndex((s) => s.text === elm.action);
  //           if (index !== -1) {
  //             let shape1 = el;
  //             let shape2 = this.shapes[index];
  //             // let lineColor =
  //             //   this.getNextValidItem(index) === null ||
  //             //   el.userValues.items.some(
  //             //     (el) => el.action !== this.getNextValidItem(index)
  //             //   )
  //             //     ? 'red'
  //             //     : 'black';
  //             tempArray.push({
  //               x1: shape1.getExitPoint()[0],
  //               y1: shape1.getExitPoint()[1],
  //               x2: shape2.getEntryPoint()[0],
  //               y2: shape2.getEntryPoint()[1],
  //               startItem: shape1.id,
  //               endItem: shape2.id,
  //               lineCap: parseInt(elm.digit),
  //             });
  //           }
  //         }
  //       });
  //     }
  //   });
  //   return tempArray;
  // }

  getConnectionsArray() {
    let tempArray = [];
    this.shapes.forEach((el, i) => {
      if (el.nextItem !== null) {
        let index = this.shapes.findIndex((elm) => elm.id === el.nextItem);
        if (index !== -1) {
          let shape1 = el;
          let shape2 = this.shapes[index];
          let lineColor = this.getValidNextItem(i) === null ? 'red' : 'black';
          tempArray.push({
            x1: shape1.getExitPoint()[0],
            y1: shape1.getExitPoint()[1],
            x2: shape2.getEntryPoint()[0],
            y2: shape2.getEntryPoint()[1],
            startItem: shape1.id,
            endItem: shape2.id,
            lineCap: null,
            lineColor: lineColor,
          });
        }
      }

      if (el.type === 'hexagon') {
        el.userValues?.items.forEach((elm) => {
          if (elm.action) {
            let index = this.shapes.findIndex((s) => s.id === elm.action);
            if (index !== -1) {
              let shape1 = el;
              let shape2 = this.shapes[index];
              tempArray.push({
                x1: shape1.getExitPoint()[0],
                y1: shape1.getExitPoint()[1],
                x2: shape2.getEntryPoint()[0],
                y2: shape2.getEntryPoint()[1],
                startItem: shape1.id,
                endItem: shape2.id,
                lineCap: null,
                lineColor: 'blue',
              });
            }
          }
        });
      }
    });

    return tempArray;
  }

  removeShape(index) {
    // if any shapes has next item that matches the removing shape id;
    // reset nextItem
    let ind = this.shapes.findIndex(
      (elm) => elm.nextItem === this.shapes[index].id
    );

    if (ind !== -1) this.shapes[ind].nextItem = null;

    this.shapes.splice(index, 1);
  }

  removeShapeNextById(id) {
    // to reset nextItem by ID
    let index = this.shapes.findIndex((el) => el.id === id);
    if (index !== -1) this.shapes[index].nextItem = null;
  }
}

export default Shapes;
