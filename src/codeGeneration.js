// all function related to final ivr code output
const prettier = require('prettier');
const babelParser = require('@babel/parser');
import {replaceDollarString} from '../src/myFunctions';

let globalMultiEntryCount = {};

function generateInitVariablesJS(userVariables) {
  const codeString = userVariables
    .map((v) => {
      const defaultValue =
        v.type === 'number' || v.type === 'boolean' || v.type === 'system'
          ? v.defaultValue
          : `'${v.defaultValue}'`;
      return `this.${v.name}=${defaultValue};`;
    })
    .join('');

  return codeString;
}

function findIsDefaultValuesPresent(shapes) {
  const ignoredShapeTypes = ['connector', 'jumper', 'endFlow'];

  for (let shape of shapes) {
    if (!ignoredShapeTypes.includes(shape.type) && !shape.isComplete) {
      return shape;
    }
  }
  return false;
}
function findIsErrorsPresent(shapes) {
  const ignoredShapeTypes = ['connector', 'jumper', 'endFlow'];
  const shapeTypesWithMessages = ['playMessage', 'playConfirm', 'getDigits'];

  const isErrorInMessageList = (messageList) => {
    return messageList && messageList.some((message) => message.error);
  };

  const isErrorInMenuItems = (items) => {
    return items.some((item) => item.actionError || item.promptError);
  };

  for (let shape of shapes) {
    if (ignoredShapeTypes.includes(shape.type)) continue;

    if (
      shapeTypesWithMessages.includes(shape.type) &&
      isErrorInMessageList(shape.userValues?.messageList)
    ) {
      return shape;
    }

    if (
      shape.type === 'playMenu' &&
      isErrorInMenuItems(shape.userValues.items)
    ) {
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
function traverseAndReturnString(startShape, variables, multiEntryCount) {
  const mainMenuCode = generateMainMenuCode(startShape, multiEntryCount);
  const visitedShapes = new Set();
  const shapeStack = [startShape];
  let codeAndDrivers = '';

  while (shapeStack.length > 0) {
    const currentShape = shapeStack.pop();
    if (visitedShapes.has(currentShape)) continue;

    visitedShapes.add(currentShape);
    console.log(' ➡️' + currentShape.text);

    codeAndDrivers += generateCode(currentShape, variables, multiEntryCount);

    const nextShapes = getNextShapes(currentShape);

    nextShapes.forEach((shape) => {
      shapeStack.push(shape);
    });
  }
  return mainMenuCode + codeAndDrivers;
}
function generateCode(shape, variables, multiEntryCount) {
  globalMultiEntryCount = multiEntryCount;
  if (shape.type === 'playMenu') {
    return generateMenuCode(shape, variables, multiEntryCount);
  }
  if (shape.type === 'switch') {
    return generateSwitchCode(shape, multiEntryCount);
  }
  if (shape.type === 'playConfirm') {
    return generatePlayConfirmCode(shape, variables, multiEntryCount);
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
    shape.generateAndSetFunctionString(variables, multiEntryCount);

    return shape.functionString;
  }

  return '';
}
function generateMenuCode(shape, variables, multiEntryCount) {
  shape.generateAndSetFunctionString(variables);
  let driverFunctionsString = '';
  const items = shape.userValues?.items;

  if (!items.length) {
    return shape.functionString;
  }

  items.forEach((item) => {
    if (item.nextItem) {
      const shapesTillMenuOrSwitch = getShapesTillMenuOrSwitch(
        item.nextItem,
        multiEntryCount
      );
      const code = `this.${shape.text}_${item.action}=async function(){
          try{${shapesTillMenuOrSwitch
            .map((shape) => getDriverFunctionShapeCode(shape, false))
            .join('')}}catch(err){ IVR.error('Error in ${shape.text}_${
        item.action
      }', err);}
                    };`;
      driverFunctionsString += code;
    }
  });

  return shape.functionString + driverFunctionsString;
}

function generateSwitchCode(shape, multiEntryCount) {
  const actions = shape.userValues?.actions;

  if (!actions.length) {
    return '';
  }

  let ifCode = '';
  shape.userValues?.actions?.forEach((action) => {
    if (action.nextItem) {
      const actionFlowShapes = getShapesTillMenuOrSwitch(
        action.nextItem,
        multiEntryCount
      );
      ifCode += `${!ifCode ? 'if' : 'else if'}(${replaceDollarString(
        action.condition
      )}){${actionFlowShapes
        ?.map((shape) => getDriverFunctionShapeCode(shape, false))
        .join('')}}`;
    }
  });

  const defaultNextItem = shape.userValues.defaultActionNextItem;
  const defaultFlowShapes = getShapesTillMenuOrSwitch(
    defaultNextItem,
    multiEntryCount
  );
  const elseFlowShapesCode = defaultFlowShapes
    ? defaultFlowShapes
        .map((shape) => getDriverFunctionShapeCode(shape, false))
        .join('')
    : '';
  const elseCode =
    elseFlowShapesCode && ifCode ? `else{${elseFlowShapesCode}}` : '';

  const outerCode = `this.${shape.text}= async function(){
      try{
        ${ifCode + elseCode}
      }catch(err){
        IVR.error('Error in ${shape.text}', err);
      }

    };`;

  return outerCode;
}

function generatePlayConfirmCode(shape, variables, multiEntryCount) {
  shape.generateAndSetFunctionString(variables, multiEntryCount);
  let driverFunctionsString = '';

  if (shape.yes.nextItem) {
    const yesFlowShapes = getShapesTillMenuOrSwitch(
      shape.yes.nextItem,
      multiEntryCount
    );
    const code = `this.${shape.text}_yes=async function(){
      try{${yesFlowShapes
        .map((shape) => getDriverFunctionShapeCode(shape, false))
        .join('')}}catch(err){ IVR.error('Error in ${shape.text}_yes', err);}
                };`;
    driverFunctionsString += code;
  }
  if (shape.no.nextItem) {
    const noFlowShapes = getShapesTillMenuOrSwitch(
      shape.no.nextItem,
      multiEntryCount
    );
    const code = `this.${shape.text}_no=async function(){
      try{${noFlowShapes
        .map((shape) => getDriverFunctionShapeCode(shape, false))
        .join('')}}catch(err){ IVR.error('Error in ${shape.text}_no', err);}
                };`;
    driverFunctionsString += code;
  }

  return shape.functionString + driverFunctionsString;
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
  } else if (shape.type === 'playConfirm') {
    if (shape.yes.nextItem) {
      nextShapes.push(shape.yes.nextItem);
    }
    if (shape.no.nextItem) {
      nextShapes.push(shape.no.nextItem);
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

function generateMainMenuCode(startShape, multiEntryCount) {
  const shapesTillMenuOrSwitch = getShapesTillMenuOrSwitch(
    startShape,
    multiEntryCount
  );

  const mainMenuString = `this.ivrMain = async function(){
try{${shapesTillMenuOrSwitch
    .map((shape) => getDriverFunctionShapeCode(shape, false))
    .join('')}}
catch(err) { IVR.error('Error in ivrMain', err); }
    };`;

  return mainMenuString;
}

function getShapesTillMenuOrSwitch(
  startShape,
  multiEntryCount = {},
  isMultiEntryDriver = false
) {
  if (!startShape) {
    return;
  }

  const typesToIgnore = ['connector', 'jumper'];
  const shapesArray = [];

  if (!typesToIgnore.includes(startShape.type)) {
    shapesArray.push(startShape);
  }
  if (multiEntryCount[startShape.id] && !isMultiEntryDriver) {
    return shapesArray;
  }

  let nextShape = getNextShapeForSingleExit(startShape);

  while (nextShape && !shapesArray.includes(nextShape)) {
    if (!typesToIgnore.includes(nextShape.type)) {
      shapesArray.push(nextShape);
    }
    if (multiEntryCount[nextShape.id]) {
      break;
    }

    nextShape = getNextShapeForSingleExit(nextShape);
  }

  return shapesArray;
}

function getDriverFunctionShapeCode(shape, isMultiEntryDriver = false) {
  if (shape.type === 'endFlow') {
    if (shape.userValues?.type === 'disconnect') {
      return 'IVR.doDisconnect();';
    } else if (shape.userValues?.transferPoint) {
      return `IVR.doTransfer('${shape.userValues.transferPoint}');`;
    }
  } else if (globalMultiEntryCount[shape.id] && !isMultiEntryDriver) {
    return `await this.${shape.text}_X();`;
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
function findEntryCount(shapes) {
  let entryCountObj = {};
  for (let shape of shapes) {
    const nextShapes = getNextShapes(shape);

    const typesToIgnore = ['playMenu', 'switch', 'playConfirm', 'jumper'];

    for (let nextShape of nextShapes) {
      if (
        entryCountObj[nextShape.id] &&
        !typesToIgnore.includes(nextShape.type)
      ) {
        entryCountObj[nextShape.id] += 1;
      } else {
        entryCountObj[nextShape.id] = 1;
      }
    }
  }

  // remove entries with a count of 1
  for (let key in entryCountObj) {
    if (entryCountObj[key] === 1) {
      delete entryCountObj[key];
    }
  }

  return entryCountObj;
}

export {
  generateInitVariablesJS,
  findIsDefaultValuesPresent,
  findIsErrorsPresent,
  checkForStartShape,
  traverseAndReturnString,
  formatCode,
  replaceVariablesInLog,
  findEntryCount,
  getShapesTillMenuOrSwitch,
  getDriverFunctionShapeCode,
};
