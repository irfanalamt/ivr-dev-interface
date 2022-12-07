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

  getIndexById(id) {
    const index = this.shapes.findIndex((shape) => shape.id === id);

    return index;
  }

  getIndexOfFirstShape() {
    // first shape is always setParams
    // find it and return index
    const index = this.shapes.findIndex((shape) => shape.type === 'pentagon');

    if (index === -1) return null;

    return index;
  }

  generateMenuCode(index) {
    const menuShape = this.shapes[index];
    const items = menuShape.userValues.items;

    if (items.length === 0) return '';

    let finalCode = '';

    // denerate driver fn for each item

    items.forEach((item) => {
      if (item.nextId) {
        const nextShapeIndex = this.getIndexById(item.nextId);
        const [arrayShapesTillMenu, isMenuIndex] =
          this.getShapesTillMenu(nextShapeIndex);

        let code = `this.${menuShape.text}_${
          item.action
        }=async function(){${arrayShapesTillMenu
          .map((el) => `await this.${el}();`)
          .join('')}};`;

        finalCode += code;
      }
    });

    return finalCode;
  }

  getShapesTillMenu(index = null) {
    // return array of shape names till a menu
    let tempArray = [];
    let isLastElementMenu = false;
    let i1 = index ? index : this.getIndexOfFirstShape();
    // if no 1st shape (setParams) return null
    if (i1 === null) return null;

    tempArray.push(this.shapes[i1].text);

    while (1) {
      let nextShapeId = this.shapes[i1].nextItem;
      if (nextShapeId === null || nextShapeId === undefined) break;

      // get index of nextShape
      let nextShapeInd = this.shapes.findIndex((el) => el.id === nextShapeId);
      if (nextShapeInd === -1) break;
      // if menu set index
      if (this.shapes[nextShapeInd].type === 'hexagon') {
        isLastElementMenu = nextShapeInd;
      }
      // if not connector; add to array
      if (this.shapes[nextShapeInd].type !== 'smallCircle')
        tempArray.push(this.shapes[nextShapeInd].text);

      i1 = nextShapeInd;
    }

    return [tempArray, isLastElementMenu];
  }

  isFunctionStringPresent() {
    for (let shape of this.shapes) {
      if (
        ![
          'smallCircle',
          'tinyCircle',
          'triangle',
          'pentagonSwitch',
          'pentagon',
        ].includes(shape.type)
      ) {
        if (!shape.functionString) return shape.text;
      }
    }
    return false;
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

  traverseShapes(indexOfStartShape) {
    // Create an array to store the shapes that we have visited
    let visitedShapes = [];

    // Create a stack to store the shapes that we need to visit
    let shapeStack = [this.shapes[indexOfStartShape]];

    // Traverse the shapes array until all shapes have been visited
    while (shapeStack.length > 0) {
      // Pop the top shape from the stack
      let currentShape = shapeStack.pop();

      // Print the properties of the current shape
      console.log('▶️', currentShape.text);

      // If the current shape has a nextItem property, push the shape with the corresponding id onto the stack
      if (currentShape.nextItem) {
        shapeStack.push(
          this.shapes.find((shape) => shape.id === currentShape.nextItem)
        );
      }

      if (currentShape.type === 'hexagon') {
        currentShape.userValues.items.forEach((item) => {
          if (item.nextId) {
            shapeStack.push(
              this.shapes.find((shape) => shape.id === item.nextId)
            );
          }
        });
      }
    }
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

  getConnectionsArray() {
    // to get cordinates to draw connections

    let tempArray = [];
    this.shapes.forEach((el, i) => {
      if (el.type === 'pentagonSwitch') {
        // draw connecting lines for switch
        let shape1 = el;
        if (el.userValues.switchArray.length === 0) {
          // only default condition

          let index = this.getIndexById(el.userValues.default.nextId);

          if (index !== -1) {
            let shape2 = this.shapes[index];
            tempArray.push({
              x1: shape1.getExitPoint()[0],
              y1: shape1.getExitPoint()[1],
              x2: shape2.getEntryPoint()[0],
              y2: shape2.getEntryPoint()[1],
              startItem: shape1.id,
              endItem: shape2.id,
              lineCap: null,
              lineColor: '#4a148c',
              lineData: {
                exitPoint: el.userValues.default.exitPoint,
                position: 1,
                totalExitPoints: 1,
              },
            });
          }
        } else {
          // switchArray has atleast one element

          el.userValues.switchArray.forEach((row, i) => {
            let index = this.getIndexById(row.nextId);
            if (index !== -1) {
              let shape2 = this.shapes[index];
              let exitCordinate = shape1.getBottomPointForExit(
                el.userValues.switchArray.length + 1,
                i + 1
              );
              tempArray.push({
                x1: exitCordinate[0],
                y1: exitCordinate[1],
                x2: shape2.getEntryPoint()[0],
                y2: shape2.getEntryPoint()[1],
                startItem: shape1.id,
                endItem: shape2.id,
                lineCap: null,
                lineColor: '#4a148c',
                lineData: {
                  exitPoint: row.exitPoint,
                  position: i + 1,
                  totalExitPoints: el.userValues.switchArray.length + 1,
                },
              });
            }
          });

          // default condition right end of switch

          let index = this.getIndexById(el.userValues.default.nextId);

          if (index !== -1) {
            let shape2 = this.shapes[index];
            let exitCordinate = shape1.getBottomPointForExit(
              el.userValues.switchArray.length + 1,
              el.userValues.switchArray.length + 1
            );
            tempArray.push({
              x1: exitCordinate[0],
              y1: exitCordinate[1],
              x2: shape2.getEntryPoint()[0],
              y2: shape2.getEntryPoint()[1],
              startItem: shape1.id,
              endItem: shape2.id,
              lineCap: null,
              lineColor: '#4a148c',
              lineData: {
                exitPoint: el.userValues.default.exitPoint,
                position: el.userValues.switchArray.length + 1,
                totalExitPoints: el.userValues.switchArray.length + 1,
              },
            });
          }
        }
      }

      if (el.type === 'hexagon') {
        let shape1 = el;
        if (el.userValues.items.length === 1 && el.userValues.items[0].nextId) {
          let index = this.getIndexById(el.userValues.items[0].nextId);
          if (index !== -1) {
            let shape2 = this.shapes[index];
            tempArray.push({
              x1: shape1.getExitPoint()[0],
              y1: shape1.getExitPoint()[1],
              x2: shape2.getEntryPoint()[0],
              y2: shape2.getEntryPoint()[1],
              startItem: shape1.id,
              endItem: shape2.id,
              lineCap: null,
              lineColor: '#4a148c',
              lineData: {
                exitPoint: el.userValues.items[0].action,
                position: 1,
                totalExitPoints: 1,
              },
            });
          }
        }

        if (el.userValues.items.length > 1) {
          el.userValues.items.forEach((row, i) => {
            let index = this.getIndexById(row.nextId);
            if (index !== -1) {
              let shape2 = this.shapes[index];
              let exitCordinate = shape1.getBottomPointForExit(
                el.userValues.items.length,
                i + 1
              );
              tempArray.push({
                x1: exitCordinate[0],
                y1: exitCordinate[1],
                x2: shape2.getEntryPoint()[0],
                y2: shape2.getEntryPoint()[1],
                startItem: shape1.id,
                endItem: shape2.id,
                lineCap: null,
                lineColor: '#4a148c',
                lineData: {
                  exitPoint: row.action,
                  position: i + 1,
                  totalExitPoints: el.userValues.items.length,
                },
              });
            }
          });
        }
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

  removeShapeById(id) {
    const index = this.shapes.findIndex((shape) => shape.id === id);
    if (index !== -1) {
      this.shapes.splice(index, 1);
    }
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

  removeConnectingLine(shape1Id, shape2Id, lineData = null) {
    const index1 = this.getIndexById(shape1Id);
    if (index1 !== -1) {
      const shape1 = this.shapes[index1];
      console.log('▶️ ~ Shapes ~ removeConnectingLine ~ shape1', shape1);
      if (shape1.type !== 'pentagonSwitch' && shape1.type !== 'hexagon') {
        // single exit condition
        // reset nextItem property
        shape1.nextItem = null;
        return;
      }

      if (shape1.type === 'pentagonSwitch') {
        if (
          lineData.totalExitPoints === 1 ||
          lineData.position === lineData.totalExitPoints
        ) {
          // default condition
          delete shape1.userValues.default.nextId;
          return;
        }

        // switchArray > 0
        delete shape1.userValues.switchArray[lineData.position - 1].nextId;
      }

      if (shape1.type === 'hexagon') {
        delete shape1.userValues.items[lineData.position - 1].nextId;
      }
    }
  }

  removeShapeNextById(id) {
    // to reset nextItem by ID
    let index = this.getIndexById(id);
    if (index !== -1) this.shapes[index].nextItem = null;
  }
}

export default Shapes;
