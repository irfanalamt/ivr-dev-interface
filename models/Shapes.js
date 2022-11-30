import Shape from './ShapeNew';

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

  addExitShapes(exitPoints, id) {
    const index = this.shapes.findIndex((shape) => shape.id === id);
    const shapeBottom = this.shapes[index].getExitPoint();
    console.log('🚀 ~ Shapes ~ addExitShapes ~ shapeBottom', shapeBottom);

    if (index !== -1) {
      const newShape = new Shape(...shapeBottom, 30, 30, 'tinyCircle', 'black');

      exitPoints.forEach((point, i) => {
        const newShape = new Shape(
          shapeBottom[0],
          shapeBottom[1],
          15,
          15,
          'tinyCircle',
          '#aeea00'
        );

        newShape.setUserValues({
          prevShapeId: id,
          position: i + 1,
          name: point,
        });
        this.addShape(newShape);
      });
    }
  }

  updateExitPointsPosition() {
    this.shapes.forEach((el) => {
      if (el.type === 'tinyCircle') {
        if (el.userValues?.prevShapeId) {
          const prevShapeIndex = this.shapes.findIndex(
            (shape) => shape.id === el.userValues.prevShapeId
          );
          if (prevShapeIndex !== -1) {
            // update position of element wrt shape
            const prevShape = this.shapes[prevShapeIndex];
            const numberOfExitPoints = prevShape.userValues?.switchArray.length;
            const positionOfExitPoint = el.userValues?.position;
            // write function to get bottomPointForExit
            const newXY = prevShape.getBottomPointForExit(
              numberOfExitPoints,
              positionOfExitPoint
            );
            el.setXY(...newXY);
          }
        }
      }
    });
  }

  getIndexOfFirstShape() {
    // first shape is always setParams
    // find it and return index
    const index = this.shapes.findIndex((shape) => shape.type === 'pentagon');

    if (index === -1) return null;

    return index;
  }

  getShapesTillMenu() {
    // return array of shape names till a menu
    let tempArray = [];

    let i1 = this.getIndexOfFirstShape();
    // if no 1st shape (setParams) return null
    if (i1 === null) return null;

    tempArray.push(this.shapes[i1].text);

    while (1) {
      let nextShapeId = this.shapes[i1].nextItem;
      if (nextShapeId === null || nextShapeId === undefined) break;

      // get index of nextShape
      let nextShapeInd = this.shapes.findIndex((el) => el.id === nextShapeId);
      if (nextShapeInd === -1) break;
      // if not connector; add to array
      if (this.shapes[nextShapeInd].type !== 'smallCircle')
        tempArray.push(this.shapes[nextShapeInd].text);

      i1 = nextShapeInd;
    }

    return tempArray;
  }

  isPlayMenuAction(menuID, id) {
    // return true if shape is a valid playMenu action
    // else false

    let menuInd = this.shapes.findIndex((el) => el.id === menuID);
    let menuShape = this.shapes[menuInd];

    if (menuShape.userValues?.items.some((el) => parseInt(el.action) === id)) {
      return true;
    }

    return false;
  }

  isPlayMenuConnector(id) {
    // return id of shape if connector is connected to any playMenu
    // else false

    for (const el of this.shapes) {
      if (el.type === 'hexagon' && el.connectors.includes(id)) return el.id;
    }

    return false;
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
    // to get cordinates to draw connections

    let tempArray = [];
    this.shapes.forEach((el, i) => {
      if (el.type === 'hexagon') {
        el.userValues?.items.forEach((elm) => {
          let shape1 = el;
          if (elm.action) {
            let index = this.shapes.findIndex(
              (s) => s.id === parseInt(elm.action)
            );

            if (index !== -1) {
              let shape2 = this.shapes[index];
              let connectorValidItemIndexArray = [];

              // check if any connectors validNextItem index matches shape2 index;
              el.connectors.forEach((s) => {
                // get index of each connector of playMenu
                let i = this.shapes.findIndex((t) => t.id === s);
                if (i !== -1) {
                  let indexOfValidItem = this.getValidNextItem(i);
                  if (indexOfValidItem !== null)
                    connectorValidItemIndexArray.push(indexOfValidItem);
                }
              });
              // draw if 2nd shape index doesnt match any connectors validNextItem index
              if (!connectorValidItemIndexArray.includes(index)) {
                tempArray.push({
                  x1: shape1.getExitPoint()[0],
                  y1: shape1.getExitPoint()[1],
                  x2: shape2.getEntryPoint()[0],
                  y2: shape2.getEntryPoint()[1],
                  startItem: shape1.id,
                  endItem: shape2.id,
                  lineCap: null,
                  lineColor: 'green',
                });
              }
            }
          }
        });

        if (el.connectors.length > 0) {
          let shape1 = el;
          let shape2;
          el.connectors.forEach((id) => {
            let ind = this.shapes.findIndex((s) => s.id === id);
            if (ind !== -1) {
              shape2 = this.shapes[ind];
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
          });
        }

        return tempArray;
      }

      // draw lines to connected playMenu connectors
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
