import Shape from './Shape';

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
        stageFigure.setUserValues({ params: {} });

        break;

      case 'runScript':
        stageFigure = new Shape(x, y, 105, 30, 'runScript', null, true);
        stageFigure.setUserValues({ script: '' });
        break;

      case 'callAPI':
        stageFigure = new Shape(x, y, 90, 30, 'callAPI', null, true);
        stageFigure.setUserValues({
          endpoint: '',
          inputArr: [{ value: '' }],
          outputArr: [{ value: '' }],
        });
        break;

      case 'playMenu':
        stageFigure = new Shape(x, y, 125, 30, 'playMenu', '#009688', true);
        stageFigure.setUserValues({
          params: {},
          paramSelectedList: [],
          items: [],
        });
        break;

      case 'getDigits':
        stageFigure = new Shape(x, y, 110, 30, 'getDigits', '#9c27b0', true);
        stageFigure.setUserValues({
          params: { minDigits: 1, maxDigits: 1, paramsList: [] },
          messageList: [],
          variableName: '',
        });
        break;

      case 'playMessage':
        stageFigure = new Shape(x, y, 145, 30, 'playMessage', '#c0ca33', true);
        stageFigure.setUserValues({
          params: { interruptible: true, repeatOption: 'X' },
          messageList: [],
        });
        break;

      case 'playConfirm':
        stageFigure = new Shape(x, y, 135, 30, 'playConfirm', '#7cb342', true);
        stageFigure.setUserValues({
          params: {
            confirmOption: '',
            cancelOption: '',
            confirmPrompt: '',
            cancelPrompt: '',
          },
          messageList: [],
        });
        break;

      case 'switch':
        stageFigure = new Shape(x, y, 130, 35, 'switch', '#795548', true);
        stageFigure.setUserValues({
          switchArray: [
            { condition: '', exitPoint: '', conditionError: '', exitError: '' },
          ],
          default: { exitPoint: 'default' },
        });
        break;

      case 'endFlow':
        stageFigure = new Shape(x, y, 35, 35, 'endFlow', '#e91e63', true);
        stageFigure.setUserValues({ type: 'disconnect' });
        break;

      case 'connector':
        stageFigure = new Shape(x, y, 25, 25, 'connector', '#009688', true);
        break;

      case 'jumper':
        stageFigure = new Shape(x, y, 30, 30, 'jumper', '#f57f17', true);
        stageFigure.setUserValues({ type: 'exit' });
        break;
    }

    const id = this.generateID(stageFigure.type, pageNumber, count);

    if (
      stageFigure.type === 'setParams' &&
      !Object.keys(this.shapes).some((key) => key.startsWith('A'))
    ) {
      // if this is the first setParams; set it to be the start
      stageFigure.text = 'start';
    } else {
      //append shapeCount to shape text
      stageFigure.text += count;
    }

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
      endFlow: 'I',
      connector: 'J',
      jumper: 'K',
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
    let tempString = this.generateMainMenuCode(id);
    // Create a stack to store the shapes that we need to visit
    let shapeStack = [this.shapes[id]];

    // Traverse the shapes array until all shapes have been visited
    while (shapeStack.length > 0) {
      // Pop the top shape from the stack
      let currentShape = shapeStack.pop();

      if (visitedShapes.includes(currentShape.id)) break;

      // adding to visited array
      visitedShapes.push(currentShape.id);

      // Print the properties of the current shape
      console.log('??????', currentShape.text);

      if (currentShape.type === 'playMenu') {
        tempString += this.generateMenuCode(currentShape.id);
      }
      if (currentShape.type === 'switch') {
        tempString += this.generateSwitchCode(currentShape.id);
      }

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
      if (currentShape.type === 'switch') {
        currentShape.userValues.switchArray.forEach((item) => {
          if (item.nextId) {
            shapeStack.push(this.shapes[item.nextId]);
          }
        });

        if (currentShape.userValues.default.nextId) {
          shapeStack.push(this.shapes[currentShape.userValues.default.nextId]);
        }
      }
    }
    return tempString;
  }
  generateMainMenuCode(id) {
    if (!this.shapes[id]) return '';

    const arrayShapesTillMenuSwitch = this.getShapesTillMenuOrSwitch(id);

    const mainMenuString = `this.ivrMain=async function(){${arrayShapesTillMenuSwitch
      .map((el) => {
        if (el.type === 'endFlow') {
          if (el.userValues.type === 'disconnect') {
            return 'IVR.doDisconnect();';
          } else if (el.userValues.transferPoint) {
            return `IVR.doTransfer('${el.userValues.transferPoint}');`;
          }
        } else {
          return `await this.${el.text}();`;
        }
      })
      .join('')}};`;

    return mainMenuString;
  }

  generateSwitchCode(id) {
    const switchShape = this.shapes[id];
    if (!switchShape) return '';

    let code = '';
    if (switchShape.userValues.switchArray.length > 0) {
      switchShape.userValues.switchArray.forEach((el) => {
        if (el.nextId) {
          const arrayShapesTillMenuSwitch = this.getShapesTillMenuOrSwitch(
            el.nextId
          );

          code += !code
            ? `if(${el.condition}){
            ${arrayShapesTillMenuSwitch
              .map((el) => {
                if (el.type === 'endFlow') {
                  if (el.userValues.type === 'disconnect') {
                    return 'IVR.doDisconnect();';
                  } else if (el.userValues.transferPoint) {
                    return `IVR.doTransfer('${el.userValues.transferPoint}');`;
                  }
                } else {
                  return `await this.${el.text}();`;
                }
              })
              .join('')}
          }`
            : `else if(${el.condition}){
            ${arrayShapesTillMenuSwitch
              .map((el) => {
                if (el.type === 'endFlow') {
                  if (el.userValues.type === 'disconnect') {
                    return 'IVR.doDisconnect();';
                  } else if (el.userValues.transferPoint) {
                    return `IVR.doTransfer('${el.userValues.transferPoint}');`;
                  }
                } else {
                  return `await this.${el.text}();`;
                }
              })
              .join('')}
          }`;
        }
      });

      if (code && switchShape.userValues.default.nextId) {
        const arrayShapesTillMenuSwitch = this.getShapesTillMenuOrSwitch(
          switchShape.userValues.default.nextId
        );
        code += `else{${arrayShapesTillMenuSwitch
          .map((el) => {
            if (el.type === 'endFlow') {
              if (el.userValues.type === 'disconnect') {
                return 'IVR.doDisconnect();';
              } else if (el.userValues.transferPoint) {
                return `IVR.doTransfer('${el.userValues.transferPoint}');`;
              }
            } else {
              return `await this.${el.text}();`;
            }
          })
          .join('')}}`;
      }

      let finalCode = `this.${switchShape.text}=async function(){${code}};`;
      if (code) return finalCode;
    }

    if (
      (switchShape.userValues.switchArray.length === 0 &&
        switchShape.userValues.default.nextId) ||
      !code
    ) {
      // default only condition
      const arrayShapesTillMenuSwitch = this.getShapesTillMenuOrSwitch(
        switchShape.userValues.default.nextId
      );
      let code = `this.${
        switchShape.text
      }=async function(){${arrayShapesTillMenuSwitch
        .map((el) => {
          if (el.type === 'endFlow') {
            if (el.userValues.type === 'disconnect') {
              return 'IVR.doDisconnect();';
            } else if (el.userValues.transferPoint) {
              return `IVR.doTransfer('${el.userValues.transferPoint}');`;
            }
          } else {
            return `await this.${el.text}();`;
          }
        })
        .join('')}};`;

      return code;
    }
  }

  generateMenuCode(id) {
    const menuShape = this.shapes[id];
    const items = menuShape.userValues.items;

    if (items.length === 0) return '';

    let finalCode = '';

    // denerate driver fn for each item

    items.forEach((item) => {
      if (item.nextId) {
        const arrayShapesTillMenuSwitch = this.getShapesTillMenuOrSwitch(
          item.nextId
        );

        let code = `this.${menuShape.text}_${
          item.action
        }=async function(){${arrayShapesTillMenuSwitch
          .map((el) => {
            if (el.type === 'endFlow') {
              if (el.userValues.type === 'disconnect') {
                return 'IVR.doDisconnect();';
              } else if (el.userValues.transferPoint) {
                return `IVR.doTransfer('${el.userValues.transferPoint}');`;
              }
            } else {
              return `await this.${el.text}();`;
            }
          })
          .join('')}};`;
        finalCode += code;
      }
    });

    return finalCode;
  }

  getShapesTillMenuOrSwitch(id) {
    // return an array of connected shapes till a multi-exit shape has reached

    // return array of shape names till a menu
    let tempArray = [];
    let currentShape = this.shapes[id];
    if (!currentShape) return null;

    if (currentShape.type !== 'connector') tempArray.push(currentShape);

    let id1 = id;

    while (1) {
      let nextShapeId = this.shapes[id1].nextItem;
      if (!nextShapeId) break;

      let nextShape = this.shapes[nextShapeId];
      if (!nextShape) break;

      // if not connector; add to array
      if (nextShape.type !== 'connector') tempArray.push(nextShape);

      id1 = nextShapeId;
    }

    return tempArray;
  }
  getValidNextItem(id) {
    // return null if no valid next shape found(not connector)
    // if valid next shape found, return its id
    const currentShape = this.shapes[id];
    if (currentShape.type !== 'connector') return currentShape.id;

    while (true) {
      let nextShapeId = this.shapes[id].nextItem;
      if (!nextShapeId) return null;

      let nextShape = this.shapes[nextShapeId];
      if (!nextShape) return null;

      if (nextShape.type !== 'connector') return nextShape.id;

      id = nextShapeId;
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
          let lineColor =
            this.getValidNextItem(shape2.id) === null ? '#AA2E25' : '#37474f';
          console.log('shape1????', shape1, 'shape2', shape2);
          tempArray.push({
            x1: shape1.getRelativePosition(shape2)[0],
            y1: shape1.getRelativePosition(shape2)[1],
            x2: shape2.getRelativePosition(shape1)[0],
            y2: shape2.getRelativePosition(shape1)[1],
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

  getSwitchConnections(tempArray, el) {
    // draw connecting lines for switch
    let shape1 = el;
    if (el.userValues.switchArray.length === 0) {
      // only default condition
      let shape2 = this.shapes[el.userValues.default.nextId];
      if (shape2) {
        let lineColor =
          this.getValidNextItem(shape2.id) === null ? '#AA2E25' : '#4a148c';
        tempArray.push({
          x1: shape1.getExitPoint()[0],
          y1: shape1.getExitPoint()[1],
          x2: shape2.getRelativePosition(shape1)[0],
          y2: shape2.getRelativePosition(shape1)[1],
          startItem: shape1.id,
          endItem: shape2.id,
          lineCap: null,
          lineColor: lineColor,
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
          let lineColor =
            this.getValidNextItem(shape2.id) === null ? '#AA2E25' : '#4a148c';
          tempArray.push({
            x1: exitCordinate[0],
            y1: exitCordinate[1],
            x2: shape2.getRelativePosition(shape1)[0],
            y2: shape2.getRelativePosition(shape1)[1],
            startItem: shape1.id,
            endItem: shape2.id,
            lineCap: null,
            lineColor: lineColor,
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
        let lineColor =
          this.getValidNextItem(shape2.id) === null ? '#AA2E25' : '#4a148c';
        tempArray.push({
          x1: exitCordinate[0],
          y1: exitCordinate[1],
          x2: shape2.getRelativePosition(shape1)[0],
          y2: shape2.getRelativePosition(shape1)[1],
          startItem: shape1.id,
          endItem: shape2.id,
          lineCap: null,
          lineColor: lineColor,
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
    const itemsWithoutDefaults = shape1.userValues.items.filter(
      (item) => !(item.isDefault === true)
    );
    const itemsLength = itemsWithoutDefaults.length;
    if (itemsLength === 1 && itemsWithoutDefaults[0].nextId) {
      // default condition; 1 exit middle bottom
      let shape2 = this.shapes[itemsWithoutDefaults[0].nextId];
      if (shape2) {
        let lineColor =
          this.getValidNextItem(shape2.id) === null ? '#AA2E25' : '#4a148c';
        tempArray.push({
          x1: shape1.getExitPoint()[0],
          y1: shape1.getExitPoint()[1],
          x2: shape2.getRelativePosition(shape1)[0],
          y2: shape2.getRelativePosition(shape1)[1],
          startItem: shape1.id,
          endItem: shape2.id,
          lineCap: null,
          lineColor: lineColor,
          lineData: {
            exitPoint: itemsWithoutDefaults[0].action,
            position: 1,
            totalExitPoints: 1,
          },
        });
      }
    }

    if (itemsLength > 1) {
      // connectors>1; spread out bottom evenly
      itemsWithoutDefaults.forEach((row, i) => {
        let shape2 = this.shapes[row.nextId];
        if (shape2) {
          let exitCordinate = shape1.getBottomPointForExit(itemsLength, i + 1);
          let lineColor =
            this.getValidNextItem(shape2.id) === null ? '#AA2E25' : '#4a148c';
          tempArray.push({
            x1: exitCordinate[0],
            y1: exitCordinate[1],
            x2: shape2.getRelativePosition(shape1)[0],
            y2: shape2.getRelativePosition(shape1)[1],
            startItem: shape1.id,
            endItem: shape2.id,
            lineCap: null,
            lineColor: lineColor,
            lineData: {
              exitPoint: row.action,
              position: i + 1,
              totalExitPoints: itemsLength,
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
        !['connector', 'tinyCircle', 'jumper', 'switch', 'endFlow'].includes(
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
      console.log('?????? ~ Shapes ~ removeConnectingLine ~ shape1', shape1);
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
        const exitPoint = lineData.exitPoint;
        const index = shape1.userValues.items.findIndex(
          (s) => s.action === exitPoint
        );
        if (index !== -1) {
          delete shape1.userValues.items[index].nextId;
        }
      }
    }
  }
  checkVariableInUse(varName) {
    for (const shape of this.getShapesAsArray()) {
      for (const message of shape.userValues?.messageList) {
        if (message.value === `$${varName}`) return true;
      }
    }
    return false;
  }
  modifyVariable(varName, newVarName) {
    // checks if any of the shapes have used this variable name, if so modify it.

    this.getShapesAsArray().forEach((shape) => {
      shape.userValues.messageList?.forEach((message) => {
        if (message.value === `$${varName}`) {
          message.value = `$${newVarName}`;
        }
      });
      if (shape.userValues.variableName === varName) {
        shape.userValues.variableName = newVarName;
      }
    });
  }
}

export default Shapes;
