// all function related to final ivr code output
const prettier = require('prettier');
const babelParser = require('@babel/parser');
import {replaceDollarString} from '../src/myFunctions';

function generateInitVariablesJS(userVariables) {
  const codeString = userVariables
    .map((v) => {
      const defaultValue =
        v.type === 'number' || v.type === 'boolean'
          ? v.defaultValue
          : `'${v.defaultValue}'`;
      return `this.${v.name}=${defaultValue};`;
    })
    .join('');

  return codeString;
}

function findIsDefaultValuesPresent(shapes) {
  for (let shape of shapes) {
    const typesToIgnore = ['connector', 'jumper', 'endFlow'];
    if (!typesToIgnore.includes(shape.type) && !shape.isComplete) {
      return shape;
    }
  }
  return false;
}
function checkForStartShape(shapes) {
  const startShape = shapes.find(
    (shape) => shape.type === 'setParams' && shape.text === 'start'
  );

  return startShape;
}
function traverseAndReturnString(startShape, variables) {
  const mainMenuCode = generateMainMenuCode(startShape);
  const visitedShapes = new Set();
  const shapeStack = [startShape];
  let codeAndDrivers = '';

  while (shapeStack.length > 0) {
    const currentShape = shapeStack.pop();
    if (visitedShapes.has(currentShape)) continue;

    visitedShapes.add(currentShape);
    console.log(' ➡️' + currentShape.text);

    codeAndDrivers += generateCode(currentShape, variables);

    const nextShapes = getNextShapes(currentShape);

    nextShapes.forEach((shape) => {
      shapeStack.push(shape);
    });
  }
  return mainMenuCode + codeAndDrivers;
}
function generateCode(shape, variables) {
  if (shape.type === 'playMenu') {
    return generateMenuCode(shape);
  }
  if (shape.type === 'switch') {
    return generateSwitchCode(shape);
  }
  const typesToInclude = [
    'setParams',
    'playMessage',
    'playConfirm',
    'getDigits',
    'runScript',
    'callAPI',
  ];
  if (typesToInclude.includes(shape.type)) {
    shape.generateAndSetFunctionString(variables);

    return shape.functionString;
  }

  return '';
}
function generateMenuCode(shape) {
  let driverFunctionsString = '';
  const items = shape.userValues?.items;

  if (!items.length) {
    return shape.functionString;
  }

  items.forEach((item) => {
    if (item.nextItem) {
      const shapesTillMenuOrSwitch = getShapesTillMenuOrSwitch(item.nextItem);
      const code = `this.${shape.text}_${item.action}=async function(){
          try{${shapesTillMenuOrSwitch
            .map(getDriverFunctionShapeCode)
            .join('')}}catch(err){ IVR.error('Error in ${shape.text}_${
        item.action
      }', err);}
                    };`;
      driverFunctionsString += code;
    }
  });

  return shape.functionString + driverFunctionsString;
}

function generateSwitchCode(shape) {
  const actions = shape.userValues?.actions;

  if (!actions.length) {
    return '';
  }

  let ifCode = '';
  shape.userValues?.actions?.forEach((action) => {
    if (action.nextItem) {
      const actionFlowShapes = getShapesTillMenuOrSwitch(action.nextItem);
      ifCode += `${!ifCode ? 'if' : 'else if'}(${replaceDollarString(
        action.condition
      )}){${actionFlowShapes.map(getDriverFunctionShapeCode).join('')}}`;
    }
  });

  const defaultNextItem = shape.userValues.defaultActionNextItem;
  const defaultFlowShapes = getShapesTillMenuOrSwitch(defaultNextItem);
  const elseFlowShapesCode = defaultFlowShapes
    ? defaultFlowShapes.map(getDriverFunctionShapeCode).join('')
    : '';
  const elseCode = `else{${elseFlowShapesCode}}`;

  const outerCode = `this.${shape.text}= async function(){
      try{
        ${ifCode + elseCode}
      }catch(err){
        IVR.error('Error in ${shape.text}', err);
      }

    };`;

  return outerCode;
}

function getNextShapes(shape) {
  let nextShapes = [];

  if (shape.type === 'playMenu') {
    shape.userValues?.items?.forEach((item) => {
      if (item.nextItem) {
        nextShapes.push(item.nextItem);
      }
    });
  } else if (shape.type === 'switch') {
    shape.userValues?.actions?.forEach((action) => {
      if (action.nextItem) {
        nextShapes.push(action.nextItem);
      }
    });
    if (shape.userValues?.defaultActionNextItem) {
      nextShapes.push(shape.userValues.defaultActionNextItem);
    }
  } else if (
    shape.type === 'jumper' &&
    shape.userValues?.type === 'exit' &&
    shape.userValues?.nextItem
  ) {
    nextShapes.push(shape.userValues.nextItem);
  } else if (
    shape.type === 'jumper' &&
    shape.userValues?.type === 'entry' &&
    shape.nextItem
  ) {
    nextShapes.push(shape.nextItem);
  } else if (shape.nextItem) {
    nextShapes.push(shape.nextItem);
  }

  return nextShapes;
}

function generateMainMenuCode(startShape) {
  const shapesTillMenuOrSwitch = getShapesTillMenuOrSwitch(startShape);

  const mainMenuString = `this.ivrMain = async function(){
try{${shapesTillMenuOrSwitch.map(getDriverFunctionShapeCode).join('')}}
catch(err) { IVR.error('Error in ivrMain', err); }
    };`;

  return mainMenuString;
}

function getShapesTillMenuOrSwitch(startShape) {
  // Avoid shapes that are not relevant for final script
  if (!startShape) return;

  const typesToIgnore = ['connector', 'jumper'];
  const shapesArray = [];

  if (!typesToIgnore.includes(startShape.type)) {
    shapesArray.push(startShape);
  }

  let nextShape = getNextShapeForSingleExit(startShape);

  while (nextShape && !shapesArray.includes(nextShape)) {
    if (!typesToIgnore.includes(nextShape.type)) {
      shapesArray.push(nextShape);
    }

    nextShape = getNextShapeForSingleExit(nextShape);
  }

  return shapesArray;
}

function getDriverFunctionShapeCode(shape) {
  if (shape.type === 'endFlow') {
    if (shape.userValues?.type === 'disconnect') {
      return 'IVR.doDisconnect();';
    } else if (shape.userValues?.transferPoint) {
      return `IVR.doTransfer('${shape.userValues.transferPoint}');`;
    }
  } else {
    return `await this.${shape.text}();`;
  }
}
function getNextShapeForSingleExit(shape) {
  if (
    shape.type === 'jumper' &&
    shape.userValues?.type === 'exit' &&
    shape.userValues.nextItem
  ) {
    return shape.userValues.nextItem;
  } else if (shape.nextItem) {
    return shape.nextItem;
  } else return null;
}
function formatCode(code) {
  return prettier.format(code, {
    parser: 'babel',
    parser: (text, options) => babelParser.parse(text, options),
    singleQuote: true,
  });
}
function replaceVariablesInLog(text, variables) {
  variables.forEach((variable) => {
    const regex = new RegExp(`\\$${variable.name}\\b`, 'g');

    text = text.replace(regex, `\${this.${variable.name}}`);
  });

  return `\`${text}\``;
}

export {
  generateInitVariablesJS,
  findIsDefaultValuesPresent,
  checkForStartShape,
  traverseAndReturnString,
  formatCode,
  replaceVariablesInLog,
};
