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

  addModule(x, y, count, pageNumber, name, data) {
    const stageFigure = new Shape(x, y, 50, 45, 'module', '#f5cbab', true);
    stageFigure.text = name;
    stageFigure.setUserValues(data);

    const id = this.generateID(stageFigure.type, pageNumber, count);
    stageFigure.id = id;

    this.shapes[id] = stageFigure;
  }

  moveShapes(shapes) {
    shapes.forEach((shape) => {
      this.shapes[shape.id] = shape;
    });
  }

  addShape(type, x, y, count, pageNumber, isModule = false) {
    let stageFigure;
    switch (type) {
      case 'setParams':
        stageFigure = new Shape(x, y, 120, 30, 'setParams', '#e91e63', true);
        stageFigure.setUserValues({params: {}});
        break;

      case 'runScript':
        stageFigure = new Shape(x, y, 120, 30, 'runScript', null, true);
        stageFigure.setUserValues({script: ''});
        break;

      case 'callAPI':
        stageFigure = new Shape(x, y, 90, 30, 'callAPI', null, true);
        stageFigure.setUserValues({
          endpoint: '',
          inputArr: [{value: ''}],
          outputArr: [{value: ''}],
        });
        break;

      case 'playMenu':
        stageFigure = new Shape(x, y, 150, 30, 'playMenu', '#009688', true);
        stageFigure.setUserValues({
          params: {},
          paramSelectedList: [],
          items: [],
        });
        break;

      case 'getDigits':
        stageFigure = new Shape(x, y, 120, 30, 'getDigits', '#9c27b0', true);
        stageFigure.setUserValues({
          params: {minDigits: 1, maxDigits: 1},
          messageList: [],
          variableName: '',
        });
        break;

      case 'playMessage':
        stageFigure = new Shape(x, y, 150, 30, 'playMessage', '#c0ca33', true);
        stageFigure.setUserValues({
          params: {interruptible: true, repeatOption: 'X'},
          messageList: [],
        });
        break;

      case 'playConfirm':
        stageFigure = new Shape(x, y, 150, 30, 'playConfirm', '#7cb342', true);
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
        stageFigure = new Shape(x, y, 150, 30, 'switch', '#795548', true);
        stageFigure.setUserValues({
          switchArray: [
            {
              condition: 'condition1',
              exitPoint: 'action1',
            },
          ],
          default: {exitPoint: 'default'},
        });
        break;

      case 'endFlow':
        stageFigure = new Shape(x, y, 35, 35, 'endFlow', '#e91e63', true);
        stageFigure.setUserValues({type: isModule ? 'return' : 'disconnect'});
        break;

      case 'connector':
        stageFigure = new Shape(x, y, 25, 25, 'connector', '#009688', true);
        break;

      case 'jumper':
        stageFigure = new Shape(x, y, 30, 30, 'jumper', '#f57f17', true);
        stageFigure.setUserValues({type: 'exit'});
        break;
    }

    const id = this.generateID(stageFigure.type, pageNumber, count);

    if (
      stageFigure.type === 'setParams' &&
      !Object.keys(this.shapes).some((key) => key.startsWith('A'))
    ) {
      // if this is the first setParams; set it to be the start
      stageFigure.text = 'start';
      stageFigure.setFunctionString(
        "this.start= async function(){\n      let newParams = {};\n      await IVR.setCallParams('start',newParams);\n    };"
      );
    } else {
      //append shapeCount to shape text
      stageFigure.text += count;
    }

    stageFigure.id = id;
    //add shape to group
    this.shapes[id] = stageFigure;

    return stageFigure;
  }

  addTempShape(x, y) {
    let stageFigure = new Shape(x, y, 5, 5, 'tinyCircle', 'white', true);
    stageFigure.id = 'temp';
    this.shapes.temp = stageFigure;
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
      module: 'M',
    };

    const startCharacter = shapeTypeLetterMap[type] || 'X';
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
    // if  found, return id; else return null`
    const firstShape = this.getShapesAsArray().find(
      (shape) => shape.type === 'setParams'
    );

    return firstShape ? firstShape.id : null;
  }

  alignAllShapes() {
    const shapes = this.getShapesAsArray();
    const paletteOffset = 75;
    const yAppbarOffset = 50;
    const snapValue = 15;
    const tolerance = 10;

    for (const shape of shapes) {
      let dx = this.calculateDelta(shape.x, paletteOffset, snapValue);
      let dy = this.calculateDelta(shape.y, yAppbarOffset, snapValue);

      if (Math.abs(dx) <= tolerance) {
        shape.x += dx;
      }

      if (Math.abs(dy) <= tolerance) {
        shape.y += dy;
      }
    }
  }

  calculateDelta(coordinate, offset, snapValue) {
    const multipleNumber = coordinate - offset;
    const closestMultiple = Math.round(multipleNumber / snapValue) * snapValue;
    return closestMultiple - multipleNumber;
  }

  traverseShapes(id, isModule = false) {
    let tempString = this.generateMainMenuCode(id, isModule);
    const visitedShapes = new Set();
    const shapeStack = [this.shapes[id]];

    while (shapeStack.length > 0) {
      const currentShape = shapeStack.pop();
      if (visitedShapes.has(currentShape.id)) continue;

      visitedShapes.add(currentShape.id);
      console.log('▶️', currentShape.text);

      tempString += this.generateCode(currentShape);
      const nextShapes = this.getNextShapes(currentShape);

      nextShapes.forEach((shape) => {
        shapeStack.push(shape);
      });
    }

    return tempString;
  }

  generateCode(shape) {
    if (shape.type === 'playMenu') {
      return this.generateMenuCode(shape.id);
    } else if (shape.type === 'switch') {
      return this.generateSwitchCode(shape.id);
    } else if (shape.type === 'module')
      return this.generateModuleCode(shape.id);
    else {
      return '';
    }
  }

  getNextShapes(shape) {
    let nextShapes = [];

    if (shape.nextItem && shape.type !== 'jumper') {
      nextShapes.push(this.shapes[shape.nextItem]);
    }

    if (shape.type === 'playMenu') {
      shape.userValues.items.forEach((item) => {
        if (item.nextId) {
          nextShapes.push(this.shapes[item.nextId]);
        }
      });
    } else if (shape.type === 'switch') {
      shape.userValues.switchArray.forEach((item) => {
        if (item.nextId) {
          nextShapes.push(this.shapes[item.nextId]);
        }
      });

      if (shape.userValues.default.nextId) {
        nextShapes.push(this.shapes[shape.userValues.default.nextId]);
      }
    } else if (shape.type === 'jumper') {
      const entryJumperNextShapeId = this.findEntryJumperNextShape(shape.text);
      if (entryJumperNextShapeId) {
        nextShapes.push(this.shapes[entryJumperNextShapeId]);
      }
    }
    return nextShapes;
  }

  findEntryJumperNextShape(name) {
    const entryJumper = this.getShapesAsArray().find(
      (shape) => shape.type === 'jumper' && shape.userValues.exitPoint === name
    );

    return entryJumper?.nextItem;
  }
  generateMainMenuCode(id, isModule = false) {
    if (!this.shapes[id]) return '';

    const arrayShapesTillMenuOrSwitch =
      this.getShapesTillMenuSwitchOrModule(id);

    let mainMenuString = `this.${
      isModule ? 'moduleMain' : 'ivrMain'
    } = async function() { try { `;
    arrayShapesTillMenuOrSwitch.forEach((el) => {
      if (el.type === 'endFlow') {
        if (el.userValues.type === 'disconnect') {
          mainMenuString += 'IVR.doDisconnect();';
        } else if (el.userValues.type === 'return') {
          mainMenuString += 'IVR.doReturnModule();';
        } else if (el.userValues.transferPoint) {
          mainMenuString += `IVR.doTransfer('${el.userValues.transferPoint}');`;
        }
      } else {
        mainMenuString += `await this.${el.text}();`;
      }
    });
    mainMenuString += "} catch(err) { IVR.error('Error in ivrMain', err); } };";

    return mainMenuString;
  }

  generateSwitchCode(id) {
    const switchShape = this.shapes[id];
    if (!switchShape) {
      return '';
    }

    let code = '';
    if (switchShape.userValues.switchArray.length > 0) {
      switchShape.userValues.switchArray.forEach((el) => {
        if (el.nextId) {
          const arrayShapesTillMenuOrSwitch =
            this.getShapesTillMenuSwitchOrModule(el.nextId);
          let ifCode = `if (${el.condition}) {`;
          arrayShapesTillMenuOrSwitch.forEach((el) => {
            if (el.type === 'endFlow') {
              if (el.userValues.type === 'disconnect') {
                ifCode += 'IVR.doDisconnect();';
              } else if (el.userValues.type === 'return') {
                ifCode += 'IVR.doReturnModule();';
              } else if (el.userValues.transferPoint) {
                ifCode += `IVR.doTransfer('${el.userValues.transferPoint}');`;
              }
            } else {
              ifCode += `await this.${el.text}();`;
            }
          });
          ifCode += '}';
          code += ifCode;
        }
      });

      if (switchShape.userValues.default.nextId) {
        const arrayShapesTillMenuOrSwitch =
          this.getShapesTillMenuSwitchOrModule(
            switchShape.userValues.default.nextId
          );
        let elseCode = `else {`;
        arrayShapesTillMenuOrSwitch.forEach((el) => {
          if (el.type === 'endFlow') {
            if (el.userValues.type === 'disconnect') {
              elseCode += 'IVR.doDisconnect();';
            } else if (el.userValues.type === 'return') {
              elseCode += 'IVR.doReturnModule();';
            } else if (el.userValues.transferPoint) {
              elseCode += `IVR.doTransfer('${el.userValues.transferPoint}');`;
            }
          } else {
            elseCode += `await this.${el.text}();`;
          }
        });
        elseCode += '}';
        code += elseCode;
      }

      if (code) {
        let finalCode = `this.${switchShape.text} = async function() { try {${code}} catch(err) { IVR.error('Error in ${switchShape.text}',err); } };`;
        return finalCode;
      }
    }

    if (switchShape.userValues.default.nextId) {
      const arrayShapesTillMenuOrSwitch = this.getShapesTillMenuSwitchOrModule(
        switchShape.userValues.default.nextId
      );
      let code = `this.${switchShape.text} = async function() { try {`;
      arrayShapesTillMenuOrSwitch.forEach((el) => {
        if (el.type === 'endFlow') {
          if (el.userValues.type === 'disconnect') {
            code += 'IVR.doDisconnect();';
          } else if (el.userValues.type === 'return') {
            code += 'IVR.doReturnModule();';
          } else if (el.userValues.transferPoint) {
            code += `IVR.doTransfer('${el.userValues.transferPoint}');`;
          }
        } else {
          code += `await this.${el.text}();`;
        }
      });
      code += `} catch(err) { IVR.error('Error in ${switchShape.text}',err); } };`;
      return code;
    }
    return '';
  }

  generateMenuCode(id) {
    const menuShape = this.shapes[id];
    const items = menuShape.userValues.items;

    if (items.length === 0) {
      return '';
    }

    let finalCode = '';

    // generate driver fn for each item
    items.forEach((item) => {
      if (item.nextId) {
        const arrayShapesTillMenuOrSwitch =
          this.getShapesTillMenuSwitchOrModule(item.nextId);
        let code = `this.${menuShape.text}_${item.action} = async function() { try {`;
        arrayShapesTillMenuOrSwitch.forEach((el) => {
          if (el.type === 'endFlow') {
            if (el.userValues.type === 'disconnect') {
              code += 'IVR.doDisconnect();';
            } else if (el.userValues.type === 'return') {
              code += 'IVR.doReturnModule();';
            } else if (el.userValues.transferPoint) {
              code += `IVR.doTransfer('${el.userValues.transferPoint}');`;
            }
          } else {
            code += `await this.${el.text}();`;
          }
        });
        code += `} catch(err) { IVR.error('Error in ${menuShape.text}_${item.action}', err); } };`;
        finalCode += code;
      }
    });
    return finalCode;
  }

  generateModuleCode(id) {
    const moduleShape = this.shapes[id];
    const moduleStartCode = moduleShape.functionString;
    const allVars = moduleShape.userValues.allVars;
    const outputVarsString = allVars
      .filter((obj) => obj.isOutput)
      .map((obj) => `this.${obj.currentName}=outputVars.${obj.name}`)
      .join(';');

    const shapesArray = this.getShapesTillMenuSwitchOrModule(
      moduleShape.nextItem
    );
    let flowCode = '';
    shapesArray.forEach((el) => {
      if (el.type === 'endFlow') {
        switch (el.userValues.type) {
          case 'disconnect':
            flowCode += 'IVR.doDisconnect();';
            break;
          case 'return':
            flowCode += 'IVR.doReturnModule();';
            break;
          default:
            if (el.userValues.transferPoint) {
              flowCode += `IVR.doTransfer('${el.userValues.transferPoint}');`;
            }
            break;
        }
      } else {
        flowCode += `await this.${el.text}();`;
      }
    });

    const moduleFinishCode = `this.${moduleShape.text}_finished = async function(outputVars) {
      ${outputVarsString};
      ${flowCode}
    };`;

    return moduleStartCode + moduleFinishCode;
  }

  getSelectedShapesInRectangle(startX, startY, endX, endY) {
    const shapes = this.getShapesAsArray();

    const x1 = Math.min(startX, endX);
    const x2 = Math.max(startX, endX);

    const y1 = Math.min(startY, endY);
    const y2 = Math.max(startY, endY);

    const selectedShapes = shapes.filter(
      (shape) =>
        shape.x >= x1 && shape.x <= x2 && shape.y >= y1 && shape.y <= y2
    );

    return selectedShapes;
  }

  getShapesTillMenuSwitchOrModule(id) {
    const tempArray = [];
    const visitedShapes = new Set();
    let currentShape = this.shapes[id];

    if (!currentShape) {
      return null;
    }

    while (currentShape) {
      if (visitedShapes.has(currentShape.id)) {
        break;
      }

      if (currentShape.type !== 'connector' && currentShape.type !== 'jumper') {
        tempArray.push(currentShape);
      }

      visitedShapes.add(currentShape.id);

      if (currentShape.type === 'module') {
        break;
      }

      if (currentShape.type === 'jumper') {
        currentShape =
          this.shapes[this.findEntryJumperNextShape(currentShape.text)];
      } else {
        currentShape = this.shapes[currentShape.nextItem];
      }
    }

    return tempArray;
  }

  getConnectionsArray() {
    // traverse through all shapes, return an array of connections to draw arrows

    const connections = [];
    this.getShapesAsArray().forEach((el) => {
      if (el.nextItem !== null) {
        let shape2 = this.shapes[el.nextItem];
        if (shape2) {
          connections.push(this.getConnection(el, shape2));
        }
      }

      if (el.type === 'switch') {
        this.getSwitchConnections(connections, el);
      }

      if (el.type === 'playMenu') {
        this.getMenuConnections(connections, el);
      }
    });
    return connections;
  }

  getConnection(shape1, shape2) {
    const [x1, y1] = shape1.getRelativeExitPoint(shape2);
    const [x2, y2] = shape2.getRelativeEntryPoint(shape1, {x: x1, y: y1});

    return {
      x1,
      y1,
      x2,
      y2,
      startItem: shape1.id,
      endItem: shape2.id,
      lineCap: null,
      lineColor: shape2.id === 'temp' ? '#757575' : '#37474f',
    };
  }

  getSwitchConnections(tempArray, el) {
    let shape1 = el;
    let switchArrayLength = shape1.userValues?.switchArray.filter(
      (object) => object.condition && object.exitPoint
    ).length;
    if (!switchArrayLength) {
      let shape2 = this.shapes[el.userValues.default.nextId];
      if (shape2) {
        let [x1, y1] = shape1.getExitPoint();
        let [x2, y2] = shape2.getRelativeEntryPoint(shape1, {x: x1, y: y1});

        tempArray.push({
          x1,
          y1,
          x2,
          y2,
          startItem: shape1.id,
          endItem: shape2.id,
          lineCap: null,
          lineColor: shape2.id === 'temp' ? '#757575' : '#37474f',
          lineData: {
            exitPoint: el.userValues.default.exitPoint,
            position: 1,
            totalExitPoints: 1,
          },
        });
      }
    } else {
      el.userValues.switchArray.forEach((row, i) => {
        let shape2 = this.shapes[row.nextId];
        if (shape2) {
          let [x1, y1] = shape1.getBottomPointForExit(
            switchArrayLength + 1,
            i + 1
          );
          let [x2, y2] = shape2.getRelativeEntryPoint(shape1, {x: x1, y: y1});

          tempArray.push({
            x1,
            y1,
            x2,
            y2,
            startItem: shape1.id,
            endItem: shape2.id,
            lineCap: null,
            lineColor: shape2.id === 'temp' ? '#757575' : '#37474f',
            lineData: {
              exitPoint: row.exitPoint,
              position: i + 1,
              totalExitPoints: switchArrayLength + 1,
            },
          });
        }
      });
      let shape2 = this.shapes[el.userValues.default.nextId];
      if (shape2) {
        let [x1, y1] = shape1.getBottomPointForExit(
          switchArrayLength + 1,
          switchArrayLength + 1
        );
        let [x2, y2] = shape2.getRelativeEntryPoint(shape1, {x: x1, y: y1});

        tempArray.push({
          x1,
          y1,
          x2,
          y2,
          startItem: shape1.id,
          endItem: shape2.id,
          lineCap: null,
          lineColor: shape2.id === 'temp' ? '#757575' : '#37474f',
          lineData: {
            exitPoint: el.userValues.default.exitPoint,
            position: switchArrayLength + 1,
            totalExitPoints: switchArrayLength + 1,
          },
        });
      }
    }
  }

  getMenuConnections(tempArray, shape1) {
    const itemsWithoutDefaults = shape1.userValues.items.filter(
      (item) => !item.isDefault
    );
    const itemsLength = itemsWithoutDefaults.length;

    if (itemsLength === 1 && itemsWithoutDefaults[0].nextId) {
      const shape2 = this.shapes[itemsWithoutDefaults[0].nextId];
      if (shape2) {
        let [x1, y1] = shape1.getExitPoint();
        let [x2, y2] = shape2.getRelativeEntryPoint(shape1, {x: x1, y: y1});
        tempArray.push({
          x1,
          y1,
          x2,
          y2,
          startItem: shape1.id,
          endItem: shape2.id,
          lineColor: shape2.id === 'temp' ? '#757575' : '#37474f',
          lineData: {
            exitPoint: itemsWithoutDefaults[0].action,
            position: 1,
            totalExitPoints: 1,
          },
        });
      }
    } else if (itemsLength > 1) {
      itemsWithoutDefaults.forEach((item, i) => {
        const shape2 = this.shapes[item.nextId];
        if (shape2) {
          const [x1, y1] = shape1.getBottomPointForExit(itemsLength, i + 1);
          let [x2, y2] = shape2.getRelativeEntryPoint(shape1, {x: x1, y: y1});
          tempArray.push({
            x1,
            y1,
            x2,
            y2,
            startItem: shape1.id,
            endItem: shape2.id,
            lineColor: shape2.id === 'temp' ? '#757575' : '#37474f',
            lineData: {
              exitPoint: item.action,
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
    const shapes = this.getShapesAsArray();

    for (let shape of shapes) {
      const typesToIgnore = [
        'connector',
        'tinyCircle',
        'jumper',
        'switch',
        'endFlow',
      ];
      if (!typesToIgnore.includes(shape.type) && !shape.functionString) {
        return shape.text;
      }
    }
    return false;
  }

  removeShape(key) {
    delete this.shapes[key];
  }

  removeConnectionsTo(shapes) {
    const shapeIds = shapes.map((shape) => shape.id);

    this.getShapesAsArray().forEach((s) => {
      if (s.type === 'playMenu') {
        const items = s.userValues.items;

        items.forEach((item) => {
          if (shapeIds.includes(item.nextId)) {
            item.nextId = undefined;
          }
        });
      } else if (s.type === 'switch') {
        if (shapeIds.includes(s.userValues.default.nextId)) {
          s.userValues.default.nextId = undefined;
        }
        const switchArr = s.userValues.switchArray;
        switchArr.forEach((item) => {
          if (shapeIds.includes(item.nextId)) {
            item.nextId = undefined;
          }
        });
      } else {
        if (shapeIds.includes(s.nextItem)) {
          s.nextItem = null;
        }
      }
    });
  }

  copyShapes(shapes, count) {
    shapes.forEach((s) => {
      count[s.type]++;
      s.text += '1';
      s.id += '1';
    });
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
    const shapes = this.getShapesAsArray();
    for (let i = 0; i < shapes.length; i++) {
      const messages = shapes[i].userValues?.messageList;
      if (messages) {
        for (let j = 0; j < messages.length; j++) {
          if (messages[j].value === `$${varName}`) return true;
        }
      }
    }
    return false;
  }

  modifyVariable(varName, newVarName) {
    // checks if any of the shapes have used this variable name, if so modify it.
    const shapes = this.getShapesAsArray();

    for (let i = 0; i < shapes.length; i++) {
      const messages = shapes[i].userValues?.messageList;
      if (messages) {
        for (let j = 0; j < messages.length; j++) {
          if (messages[j].value === `$${varName}`) {
            messages[j].value = `$${newVarName}`;
          }
        }
      }
      if (shapes[i].userValues.variableName === varName) {
        shapes[i].userValues.variableName = newVarName;
      }
    }
  }
}

export default Shapes;
