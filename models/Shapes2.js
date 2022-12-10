import Shape from './Shape2';

class Shapes {
  constructor(groupname, shapes) {
    this.groupname = groupname;
    this.shapes = shapes;
  }

  getShapes() {
    return this.shapes;
  }
  getShapesAsArray() {
    return Object.values(this.shapes);
  }
  getShapesEntries() {
    return Object.entries(this.shapes);
  }

  addShape(type, x, y, count, pageNumber) {
    console.log(type, x, y, 'ha');
    let stageFigure;
    switch (type) {
      case 'setParams':
        stageFigure = new Shape(x, y, 120, 30, 'setParams', '#e91e63', true);
        break;

      case 'runScript':
        stageFigure = new Shape(x, y, 105, 30, 'runScript', null, true);
        break;

      case 'callAPI':
        stageFigure = new Shape(x, y, 90, 20, 'callAPI', null, true);
        break;

      case 'playMenu':
        stageFigure = new Shape(x, y, 125, 30, 'playMenu', '#009688', true);
        stageFigure.setUserValues({
          items: [],
        });
        break;

      case 'getDigits':
        stageFigure = new Shape(x, y, 110, 30, 'getDigits', '#9c27b0', true);
        break;

      case 'playMessage':
        stageFigure = new Shape(x, y, 145, 30, 'playMessage', '#c0ca33', true);
        break;

      case 'playConfirm':
        stageFigure = new Shape(x, y, 135, 30, 'playConfirm', '#7cb342', true);
        break;

      case 'switch':
        stageFigure = new Shape(x, y, 130, 35, 'switch', '#795548', true);
        stageFigure.setUserValues({
          switchArray: [],
          default: { exitPoint: 'default' },
        });
        break;

      case 'connector':
        stageFigure = new Shape(x, y, 25, 25, 'connector', '#e91e63', true);
        break;

      case 'jumper':
        stageFigure = new Shape(x, y, 30, 30, 'jumper', '#f57f17', true);
        stageFigure.setUserValues({ type: 'exit' });
        break;
    }

    const id = this.generateID(stageFigure.type, pageNumber, count);

    //append shapeCount to shape text
    stageFigure.text += count;
    stageFigure.id = id;

    //add shape to group
    this.shapes[id] = stageFigure;
  }

  generateID(type, pageNumber, count) {
    const shapeTypeLetterMap = {
      setParams: 'A',
      runScript: 'B',
      callAPI: 'C',
      playMenu: 'D',
      getDigits: 'E',
      playMessage: 'F',
      playConfirm: 'G',
      switch: 'H',
      connector: 'I',
      jumper: 'J',
    };

    const startCharacter = shapeTypeLetterMap[type] ?? 'X';
    const pageCharacter = pageNumber < 10 ? `0${pageNumber}` : `${pageNumber}`;

    return `${startCharacter}${pageCharacter}${count}`;
  }

  drawAllShapes(ctx) {
    this.getShapesAsArray().forEach((el) => el.drawShape(ctx));
  }
  addOffset(offset) {
    this.getShapesAsArray().forEach((el) => {
      el.y = el.getInitPos()[1] + offset;
    });
  }

  getIdOfFirstShape() {
    // start shape is setParams
    // if  found, return id; else return null

    for (let shape of this.getShapesAsArray()) {
      if (shape.type === 'setParams') {
        return shape.id;
      }
    }

    return null;
  }

  traverseShapes(id) {
    // Create an array to store the shapes that we have visited
    let visitedShapes = [];

    // Create a stack to store the shapes that we need to visit
    let shapeStack = [this.shapes[id]];

    // Traverse the shapes array until all shapes have been visited
    while (shapeStack.length > 0) {
      // Pop the top shape from the stack
      let currentShape = shapeStack.pop();

      // Print the properties of the current shape
      console.log('▶️', currentShape.text);

      // If the current shape has a nextItem property, push the shape with the corresponding id onto the stack
      if (currentShape.nextItem) {
        shapeStack.push(this.shapes[currentShape.nextItem]);
      }

      if (currentShape.type === 'playMenu') {
        currentShape.userValues.items.forEach((item) => {
          if (item.nextId) {
            shapeStack.push(this.shapes[item.nextId]);
          }
        });
      }
    }
  }

  getConnectionsArray() {
    // traverse through all shapes, return an array of connections to draw arrows

    const tempArray = [];
    this.getShapesAsArray().forEach((el) => {
      if (el.type === 'switch') {
        this.getSwitchConnections(tempArray, el);
      }

      if (el.type === 'playMenu') {
        this.getMenuConnections(tempArray, el);
      }

      if (el.nextItem !== null) {
        let shape2 = this.shapes[el.nextItem];
        if (shape2) {
          let shape1 = el;
          // let lineColor = this.getValidNextItem(i) === null ? 'red' : 'black';
          tempArray.push({
            x1: shape1.getExitPoint()[0],
            y1: shape1.getExitPoint()[1],
            x2: shape2.getEntryPoint()[0],
            y2: shape2.getEntryPoint()[1],
            startItem: shape1.id,
            endItem: shape2.id,
            lineCap: null,
            lineColor: 'black',
          });
        }
      }
    });
    return tempArray;
  }

  getSwitchConnections(tempArray, el) {
    // draw connecting lines for switch
    let shape1 = el;
    if (el.userValues.switchArray.length === 0) {
      // only default condition
      let shape2 = this.shapes[el.userValues.default.nextId];
      if (shape2) {
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
        let shape2 = this.shapes[row.nextId];
        if (shape2) {
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

      let shape2 = this.shapes[el.userValues.default.nextId];

      if (shape2) {
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

  getMenuConnections(tempArray, el) {
    let shape1 = el;
    if (el.userValues.items.length === 1 && el.userValues.items[0].nextId) {
      // default condition; 1 exit middle bottom
      let shape2 = this.shapes[el.userValues.items[0].nextId];
      if (shape2) {
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
      // connectors>1; spread out bottom evenly
      el.userValues.items.forEach((row, i) => {
        let shape2 = this.shapes[row.nextId];
        if (shape2) {
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
  isFunctionStringPresent() {
    // check if all shapes have a fn string,return false;
    // else return first shapeText without one
    for (let shape of this.getShapesAsArray()) {
      if (
        !['connector', 'tinyCircle', 'jumper', 'switch', 'setParams'].includes(
          shape.type
        )
      ) {
        if (!shape.functionString) return shape.text;
      }
    }
    return false;
  }

  removeShape(key) {
    delete this.shapes[key];
  }
  removeConnectingLine(shape1Id, shape2Id, lineData = null) {
    const shape1 = this.shapes[shape1Id];
    if (shape1) {
      console.log('▶️ ~ Shapes ~ removeConnectingLine ~ shape1', shape1);
      if (shape1.type !== 'switch' && shape1.type !== 'playMenu') {
        // single exit condition
        // reset nextItem property
        shape1.nextItem = null;
        return;
      }

      if (shape1.type === 'switch') {
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

      if (shape1.type === 'playMenu') {
        delete shape1.userValues.items[lineData.position - 1].nextId;
      }
    }
  }
}

export default Shapes;
