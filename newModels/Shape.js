import {replaceVariablesInLog} from '../src/codeGeneration';
import {
  calculateDistance,
  deleteDollar,
  replaceVarNameDollar,
  stringifySafe,
} from '../src/myFunctions';

class Shape {
  constructor(x, y, type, pageNumber, style = 'black') {
    this.x = x;
    this.y = y;

    this.type = type;
    this.style = style;

    this.text = type;
    this.selected = false;
    this.userValues = null;
    this.nextItem = null;

    this.exitPoint = null;
    this.functionString = '';
    this.pageNumber = pageNumber;
    this.isComplete = false;
    this.setWidthAndHeight(type);
    this.setImage(type);
    this.setInitialValue();
  }

  setWidthAndHeight(type) {
    switch (type) {
      case 'runScript':
        this.width = 120;
        this.height = 40;
        break;

      case 'callAPI':
        this.width = 90;
        this.height = 40;
        break;

      case 'setParams':
        this.width = 120;
        this.height = 40;
        break;

      case 'playMenu':
        this.width = 150;
        this.height = 40;
        break;

      case 'getDigits':
        this.width = 120;
        this.height = 40;
        break;

      case 'playMessage':
        this.width = 150;
        this.height = 40;
        break;

      case 'playConfirm':
        this.width = 150;
        this.height = 40;
        break;

      case 'endFlow':
        this.width = 40;
        this.height = 40;
        break;

      case 'connector':
        this.width = 30;
        this.height = 30;
        break;

      case 'jumper':
        this.width = 35;
        this.height = 35;
        break;

      case 'switch':
        this.width = 120;
        this.height = 40;
        break;

      case 'module':
        this.width = 50;
        this.height = 45;
        break;

      default:
        this.width = 120;
        this.height = 40;
    }
  }

  setImage(type) {
    if (
      [
        'runScript',
        'callAPI',
        'setParams',
        'playMenu',
        'getDigits',
        'playMessage',
        'playConfirm',
        'switch',
        'endFlow',
      ].includes(type)
    ) {
      this.img = new Image(15, 15);
      this.img.src = `/icons/${type}Black.png`;
    }
  }
  setInitialValue() {
    if (this.type === 'endFlow') {
      this.setUserValues({type: 'disconnect'});
    } else if (this.type === 'jumper') {
      this.setUserValues({type: 'entry'});
    }
  }

  setTextAndId(shapeCount) {
    const shapeTypeLetterMap = new Map([
      ['setParams', 'A'],
      ['runScript', 'B'],
      ['callAPI', 'C'],
      ['playMenu', 'D'],
      ['getDigits', 'E'],
      ['playMessage', 'F'],
      ['playConfirm', 'G'],
      ['switch', 'H'],
      ['endFlow', 'I'],
      ['connector', 'J'],
      ['jumper', 'K'],
      ['module', 'M'],
    ]);

    const startCharacter = shapeTypeLetterMap.get(this.type) || 'X';
    const id = `${startCharacter}${shapeCount}`;

    this.text += shapeCount.toString();

    this.id = id;
  }

  copyShape(shapeCount, shapes, offsetX, offsetY, pageNumber, idMap = {}) {
    const {x, y, type, text} = this;
    const count = ++shapeCount[type];
    const newShape = new Shape(x + offsetX, y + offsetY, type, pageNumber);
    newShape.setTextAndId(count);
    const shapeNames = shapes.map((shape) => shape.text);
    newShape.text = this.getUniqueName(text, shapeNames);
    newShape.userValues = this.copyUserValues();
    newShape.isComplete = this.isComplete;

    // add old and new id to idMap
    idMap[this.id] = newShape.id;

    return newShape;
  }

  copyUserValues() {
    const {type, userValues} = this;
    let newUserValues;

    if (type === 'playMenu' && userValues?.items) {
      newUserValues = {
        ...userValues,
        items: userValues.items.map(({nextItem, ...rest}) => rest),
      };
    } else if (type === 'switch' && userValues?.actions) {
      newUserValues = {
        ...userValues,
        actions: userValues.actions.map(({nextItem, ...rest}) => rest),
      };
      delete newUserValues.defaultActionNextItem;
    } else {
      newUserValues = userValues;
    }

    return structuredClone(newUserValues);
  }

  getUniqueName(oldName, shapeNames) {
    let num = 1;
    let newName = `${oldName}${num}`;
    while (shapeNames.includes(newName)) {
      num++;
      newName = `${oldName}${num}`;
    }

    return newName;
  }

  prepareForDb() {
    const newShape = {
      text: this.text,
      x: this.x,
      y: this.y,
      type: this.type,
      pageNumber: this.pageNumber,
      name: this.name,
      userValues: this.userValues
        ? this.addNextItemIdUserValues(this.userValues)
        : null,
      nextItemId: this.nextItem?.id || null,
      id: this.id,
      functionString: this.functionString,
      isComplete: this.isComplete,
    };

    return newShape;
  }

  generateAndSetFunctionString(variables) {
    switch (this.type) {
      case 'setParams':
        this.setFunctionStringSetParams();
        break;

      case 'playMessage':
        this.setFunctionStringPlayMessage(variables);
        break;

      case 'getDigits':
        this.setFunctionStringGetDigits(variables);
        break;

      case 'playConfirm':
        this.setFunctionStringPlayConfirm(variables);
        break;

      case 'runScript':
        this.setFunctionStringRunScript();
        break;

      case 'callAPI':
        this.setFunctionStringCallAPI();
        break;

      case 'playMenu':
        this.setFunctionStringPlayMenu(variables);
        break;
    }
  }

  setFunctionStringSetParams() {
    const functionName = this.text ? this.text : `setParams${this.id}`;

    const codeModifiedParameters = this.userValues?.params
      ?.map(({name, value}) => `${name}: ${JSON.stringify(value)}`)
      .join(', ');

    const codeString = `this.${functionName} = async function() {
      const newParams = { ${codeModifiedParameters} };
      await IVR.setCallParams('${functionName}', newParams);
    };`;

    console.log('codeString☄️', codeString);

    this.setFunctionString(codeString);
  }

  setFunctionStringPlayMessage(variables) {
    const functionName = this.text ? this.text : `playMessage${this.id}`;

    const paramsString = this.userValues.optionalParams
      .map(({name, value}) => `${name}: ${JSON.stringify(value)}`)
      .join(', ');
    const modifiedMessageList = this.userValues.messageList.map(
      ({useVariable, ...rest}) => rest
    );
    const messageListString = replaceVarNameDollar(
      JSON.stringify(modifiedMessageList)
    );

    const logText = this.userValues.logs;
    const beforeLog = replaceVariablesInLog(logText.before.text, variables);
    const afterLog = replaceVariablesInLog(logText.after.text, variables);

    const codeString = `this.${functionName} = async function() {
      const msgList = ${messageListString};
      const params = { ${paramsString} };
      ${
        logText.before.text
          ? `IVR.log.${logText.before.type}(${beforeLog});`
          : ''
      }await IVR.playMessage('${functionName}', msgList, params);${
      logText.after.text ? `IVR.log.${logText.after.type}(${afterLog});` : ''
    }
    };`;

    console.log('codeString', codeString);
    this.setFunctionString(codeString);
  }

  setFunctionStringGetDigits(variables) {
    const functionName = this.text ? this.text : `getDigits${this.id}`;
    const paramsString =
      `minDigits:${this.userValues.params.minDigits},maxDigits:${this.userValues.params.maxDigits},` +
      this.userValues.optionalParams
        .map(({name, value}) => `${name}: ${JSON.stringify(value)}`)
        .join(', ');
    const modifiedMessageList = this.userValues.messageList.map(
      ({useVariable, ...rest}) => rest
    );
    const messageListString = replaceVarNameDollar(
      JSON.stringify(modifiedMessageList)
    );
    const resultNameString = deleteDollar(this.userValues.variableName);

    const logText = this.userValues.logs;
    const beforeLog = replaceVariablesInLog(logText.before.text, variables);
    const afterLog = replaceVariablesInLog(logText.after.text, variables);
    const codeString = `this.${functionName} = async function() {
    const msgList = ${messageListString};
    const params = { ${paramsString} };${
      logText.before.text ? `IVR.log.${logText.before.type}(${beforeLog});` : ''
    }this.${
      resultNameString || 'default'
    } = await IVR.getDigits('${functionName}',msgList,params);${
      logText.after.text ? `IVR.log.${logText.after.type}(${afterLog});` : ''
    }
  };`;

    console.log('codeString', codeString);
    this.setFunctionString(codeString);
  }

  setFunctionStringPlayConfirm(variables) {
    const functionName = this.text ? this.text : `playConfirm${this.id}`;
    const paramsString = this.userValues.optionalParams
      .map(({name, value}) => `${name}: ${JSON.stringify(value)}`)
      .join(', ');
    const modifiedMessageList = this.userValues.messageList.map(
      ({useVariable, ...rest}) => rest
    );
    const messageListString = replaceVarNameDollar(
      JSON.stringify(modifiedMessageList)
    );

    const logText = this.userValues.logs;
    const beforeLog = replaceVariablesInLog(logText.before.text, variables);
    const afterLog = replaceVariablesInLog(logText.after.text, variables);
    const codeString = `this.${functionName} = async function() {
      const msgList = ${messageListString};
      const params = { ${paramsString} }; ${
      logText.before.text ? `IVR.log.${logText.before.type}(${beforeLog});` : ''
    }await IVR.playConfirm('${functionName}', msgList, params);${
      logText.after.text ? `IVR.log.${logText.after.type}(${afterLog});` : ''
    }
    };`;

    console.log('codeString📍', codeString);
    this.setFunctionString(codeString);
  }

  setFunctionStringRunScript() {
    function replaceDollarString(str) {
      return str.replace(/\$([a-zA-Z])/g, 'this.$1');
    }
    function replaceLogWithIvrLog(str) {
      return str.replace(/log/g, 'IVR.log');
    }
    const functionName = this.text ? this.text : `runScript${this.id}`;
    const newReplacedString = replaceDollarString(this.userValues.script);
    const ivrReplacedString = replaceLogWithIvrLog(newReplacedString);

    const codeString = `this.${functionName} = async function(){${ivrReplacedString}};`;

    console.log('codeString📍', codeString);
    this.setFunctionString(codeString);
  }

  setFunctionStringCallAPI() {
    const functionName = this.text ? this.text : `callAPI${this.id}`;
    const {endpoint, inputVars, outputVars} = this.userValues;

    const inputVarsString = `{${inputVars
      .filter((el) => el.name)
      .map((el) => `${el.name}:this.${el.name}`)
      .join(',')}}`;
    const outputVarsString = outputVars
      .filter((el) => el.name)
      .map((el) => `this.${el.name}=outputVars.${el.name};`)
      .join('');

    const codeString = `this.${functionName}=async function(){let endpoint = '${endpoint}';let inputVars= ${inputVarsString};let outputVars = await IVR.callAPI('${functionName}',endpoint,inputVars);${outputVarsString}};`;

    console.log('codeString📍', codeString);
    this.setFunctionString(codeString);
  }

  setFunctionStringPlayMenu(variables) {
    const functionName = this.text || `playMenu${this.id}`;
    const paramsString = this.userValues.optionalParams
      ?.map(({name, value}) => `${name}: ${JSON.stringify(value)}`)
      .join(', ');

    const modifiedItems = this.userValues.items.map(
      ({
        actionError,
        promptError,
        isDefault,
        nextItem,
        nextItemId,
        isSkip,
        skip,
        disabled,
        silent,
        ...rest
      }) => {
        if (isSkip) {
          rest.skip = skip;
        }
        if (disabled) {
          rest.disabled = disabled;
        }
        if (silent) {
          rest.silent = silent;
        }
        return rest;
      }
    );

    const modifiedItemsString = replaceVarNameDollar(
      JSON.stringify(modifiedItems)
    );

    const menuString = `{menuId: '${functionName}'${
      paramsString ? ',' : ''
    }${paramsString}, items: ${modifiedItemsString}}`;

    const logText = this.userValues.logs;
    const beforeLog = replaceVariablesInLog(logText.before.text, variables);
    const afterLog = replaceVariablesInLog(logText.after.text, variables);

    const codeString = `this.${functionName} = async function() {
    let menu =${menuString}; ${
      logText.before.text ? `IVR.log.${logText.before.type}(${beforeLog});` : ''
    }await IVR.playMenu(menu);${
      logText.after.text ? `IVR.log.${logText.after.type}(${afterLog});` : ''
    }
  };`;

    console.log('codeString 📍', codeString);
    this.setFunctionString(codeString);
  }

  addNextItemIdUserValues(userValues) {
    if (this.type === 'playMenu') {
      userValues.items?.forEach((item) => {
        if (item.nextItem) {
          item.nextItemId = item.nextItem.id;
        }
      });

      return stringifySafe(userValues);
    } else if (this.type === 'switch') {
      userValues.actions?.forEach((action) => {
        if (action.nextItem) {
          action.nextItemId = action.nextItem.id;
        }
      });
      if (userValues.defaultActionNextItem) {
        userValues.defaultActionNextItemId =
          userValues.defaultActionNextItem.id;
      }

      return stringifySafe(userValues);
    } else if (this.type === 'jumper') {
      if (userValues.nextItem) {
        userValues.nextItemId = userValues.nextItem.id;
      }

      return stringifySafe(userValues);
    } else {
      return stringifySafe(userValues);
    }
  }

  getBottomCoordinates() {
    return [this.x, this.y + this.height / 2];
  }

  getBottomCoordinatesMultiExit(position, totalPoints) {
    const SPACING = 20;
    const isEvenPoints = totalPoints % 2 === 0;

    const xPosition =
      this.x +
      (position - totalPoints * 0.5 - (isEvenPoints ? 0 : 0.5)) * SPACING;

    const yPosition = this.y + this.height / 2;

    if (this.type === 'playMenu') {
      let exitPoints =
        this.userValues?.items.filter((item) => !item.isDefault) || [];
      const hasDuplicatePoint = exitPoints.some(
        (point) =>
          point.exitPoint &&
          point.exitPoint.x === xPosition &&
          point.exitPoint.y === yPosition
      );
      if (hasDuplicatePoint) {
        return [xPosition + 10, yPosition];
      }
    }

    return [xPosition, yPosition];
  }

  getTopCoordinates() {
    return [this.x, this.y - this.height / 2];
  }
  getLeftCoordinates() {
    if (this.type === 'switch') {
      return [this.x - this.width / 2 + this.height / 4, this.y];
    }

    return [this.x - this.width / 2, this.y];
  }
  getRightCoordinates() {
    if (this.type === 'switch') {
      return [this.x + this.width / 2 - this.height / 4, this.y];
    }

    return [this.x + this.width / 2, this.y];
  }

  getRelativeExitCoordinates(shape2) {
    if (['connector', 'endFlow', 'jumper'].includes(this.type)) {
      return this.getCircularCoordinates(shape2.x, shape2.y);
    }

    const [exitPointX, exitPointY] = this.findIntersectionPoint(
      shape2.x,
      shape2.y
    );

    this.exitPoint = {x: exitPointX, y: exitPointY};

    return [this.x, this.y];
  }

  getRelativeExitCoordinatesMenu(shape2, action, duplicateCount = 0) {
    let i = duplicateCount ? duplicateCount - 1 : 0;

    const centerOffsetX = [0, 20, -20, 40, -40];
    const [exitPointX, exitPointY] = this.findIntersectionPoint(
      shape2.x,
      shape2.y,
      centerOffsetX[i]
    );

    const items = this.userValues?.items;
    const index = items.findIndex((item) => item.action === action);

    if (index !== -1) {
      this.userValues.items[index].exitPoint = {x: exitPointX, y: exitPointY};
    }

    return [exitPointX, exitPointY];
  }

  getRelativeExitCoordinatesSwitch(shape2, action) {
    const [exitPointX, exitPointY] = this.findIntersectionPoint(
      shape2.x,
      shape2.y
    );
    const defaultItem = this.userValues?.defaultAction;

    if (action === defaultItem) {
      this.userValues.defaultActionExitPoint = {x: exitPointX, y: exitPointY};
      return [this.x, this.y];
    }

    const items = this.userValues?.actions;
    const index = items.findIndex((item) => item.action === action);

    if (index !== -1) {
      this.userValues.actions[index].exitPoint = {x: exitPointX, y: exitPointY};
    }

    return [this.x, this.y];
  }

  getRelativeEntryCoordinates(shape1) {
    if (['connector', 'endFlow', 'jumper'].includes(this.type)) {
      return this.getCircularCoordinates(shape1.x, shape1.y);
    }

    return this.findIntersectionPoint(shape1.x, shape1.y);
  }

  getShapePoints() {
    // return an array of shape points
    //[{x,y},..]

    switch (this.type) {
      case 'setParams':
        return [
          {x: this.x + this.width / 2, y: this.y - this.height / 2},
          {x: this.x + this.width / 2, y: this.y + this.height / 3},
          {x: this.x, y: this.y + this.height / 2},
          {x: this.x - this.width / 2, y: this.y + this.height / 3},
          {x: this.x - this.width / 2, y: this.y - this.height / 2},
        ];

      case 'playMenu':
        return [
          {x: this.x + this.width * 0.5, y: this.y},
          {x: this.x + this.width * 0.4, y: this.y + 0.5 * this.height},
          {x: this.x - this.width * 0.4, y: this.y + 0.5 * this.height},
          {x: this.x - this.width * 0.5, y: this.y},
          {x: this.x - this.width * 0.4, y: this.y - 0.5 * this.height},
          {x: this.x + this.width * 0.4, y: this.y - 0.5 * this.height},
        ];

      case 'playConfirm':
      case 'playMessage':
        return [
          {
            x: this.x + this.width * 0.5 - this.height * 0.5,
            y: this.y + this.height * 0.5,
          },
          {
            x: this.x - (this.width * 0.5 - this.height * 0.5),
            y: this.y + this.height * 0.5,
          },

          {
            x: this.x - (this.width * 0.5 - this.height * 0.5),
            y: this.y - this.height * 0.5,
          },
          {
            x: this.x + this.width * 0.5 - this.height * 0.5,
            y: this.y - this.height * 0.5,
          },
        ];

      case 'getDigits':
        return [
          {x: this.x - this.width * (3 / 8), y: this.y - this.height / 2},
          {x: this.x + this.width * (5 / 8), y: this.y - this.height / 2},
          {x: this.x + this.width * (3 / 8), y: this.y + this.height / 2},
          {x: this.x - this.width * (5 / 8), y: this.y + this.height / 2},
        ];

      case 'runScript':
        return [
          {x: this.x - this.width / 2, y: this.y - this.height / 2},
          {x: this.x + this.width / 2, y: this.y - this.height / 2},
          {x: this.x + this.width / 2, y: this.y + this.height / 2},
          {x: this.x - this.width / 2, y: this.y + this.height / 2},
        ];

      case 'switch':
        return [
          {x: this.x + this.width * 0.5, y: this.y + this.height * 0.5},
          {x: this.x - this.width * 0.5, y: this.y + this.height * 0.5},
          {
            x: this.x - this.width * 0.5 + 0.5 * this.height,
            y: this.y - this.height * 0.5,
          },
          {
            x: this.x + this.width * 0.5 - 0.5 * this.height,
            y: this.y - this.height * 0.5,
          },
        ];

      case 'callAPI':
        return [
          {x: this.x + this.width / 2, y: this.y - this.height / 3},
          {x: this.x + this.width / 2, y: this.y + this.height / 3},
          {x: this.x, y: this.y + this.height / 2},
          {x: this.x - this.width / 2, y: this.y + this.height / 3},
          {x: this.x - this.width / 2, y: this.y - this.height / 3},
          {x: this.x, y: this.y - this.height / 2},
        ];

      default:
        return [];
    }
  }

  findIntersectionPoint(x, y, centerOffsetX = 0) {
    console.log('centerOffsetX = ', centerOffsetX);
    if (this.type === 'playMessage' || this.type === 'playConfirm') {
      return this.findIntersectionPointCurve(x, y);
    }

    const centerX = this.x + centerOffsetX;
    const centerY = this.y;

    const points = this.getShapePoints();

    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];

      const denominator =
        (p2.x - p1.x) * (y - centerY) - (p2.y - p1.y) * (x - centerX);

      if (denominator === 0) {
        continue; // Parallel lines
      }

      const ua =
        ((p1.y - centerY) * (x - centerX) - (p1.x - centerX) * (y - centerY)) /
        denominator;
      const ub =
        ((p2.x - p1.x) * (p1.y - centerY) - (p2.y - p1.y) * (p1.x - centerX)) /
        denominator;

      if (ua >= 0 && ua <= 1 && ub >= 0) {
        const intersectionX = p1.x + ua * (p2.x - p1.x);
        const intersectionY = p1.y + ua * (p2.y - p1.y);

        return [intersectionX, intersectionY];
      }
    }

    return [centerX, centerY];
  }

  findIntersectionPointCurve(x, y) {
    const {height, width, x: centreX, y: centreY} = this;

    const diagonalSlope = Math.abs(height / (width - height));
    const lineSlope = Math.abs((centreY - y) / (centreX - x));

    if (lineSlope >= diagonalSlope) {
      const points = this.getShapePoints();

      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];

        const denominator =
          (p2.x - p1.x) * (y - centreY) - (p2.y - p1.y) * (x - centreX);

        if (denominator === 0) {
          continue; // Parallel lines
        }

        const ua =
          ((p1.y - centreY) * (x - centreX) -
            (p1.x - centreX) * (y - centreY)) /
          denominator;
        const ub =
          ((p2.x - p1.x) * (p1.y - centreY) -
            (p2.y - p1.y) * (p1.x - centreX)) /
          denominator;

        if (ua >= 0 && ua <= 1 && ub >= 0) {
          const intersectionX = p1.x + ua * (p2.x - p1.x);
          const intersectionY = p1.y + ua * (p2.y - p1.y);

          return [intersectionX, intersectionY];
        }
      }
    } else {
      const circle1CentreX = centreX - width / 2 + height / 2;
      const circle2CentreX = centreX + width / 2 - height / 2;

      const d1 = calculateDistance(x, y, circle1CentreX, centreY);
      const d2 = calculateDistance(x, y, circle2CentreX, centreY);

      if (d1 < d2) {
        return this.findIntersectionPointArc(
          x,
          y,
          centreX,
          centreY,
          circle1CentreX,
          centreY,
          height / 2
        );
      } else {
        return this.findIntersectionPointArc(
          x,
          y,
          centreX,
          centreY,
          circle2CentreX,
          centreY,
          height / 2
        );
      }
    }
  }
  findIntersectionPointArc(x1, y1, x2, y2, centreX, centreY, r) {
    const slope = (y2 - y1) / (x2 - x1);
    const yIntercept = y1 - slope * x1;
    const a = 1 + slope * slope;
    const b = 2 * (slope * yIntercept - slope * centreY - centreX);
    const c =
      centreX * centreX +
      (yIntercept - centreY) * (yIntercept - centreY) -
      r * r;
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
      return [centreX, centreY];
    } else {
      const x1Intersect = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2Intersect = (-b - Math.sqrt(discriminant)) / (2 * a);
      const y1Intersect = slope * x1Intersect + yIntercept;
      const y2Intersect = slope * x2Intersect + yIntercept;

      const distance1 = calculateDistance(x1, y1, x1Intersect, y1Intersect);
      const distance2 = calculateDistance(x1, y1, x2Intersect, y2Intersect);

      if (distance1 < distance2) {
        return [x1Intersect, y1Intersect];
      } else {
        return [x2Intersect, y2Intersect];
      }
    }
  }

  getCircularCoordinates(pointX, pointY) {
    const angle = Math.atan2(pointY - this.y, pointX - this.x);
    const radius = this.width / 2;
    const x = this.x + radius * Math.cos(angle);
    const y = this.y + radius * Math.sin(angle);

    return [x, y];
  }

  isInRectangle(startX, startY, width, height) {
    let x1 = startX;
    let y1 = startY;
    let x2 = startX + width;
    let y2 = startY + height;

    // Swap coordinates if width or height is negative
    if (width < 0) {
      [x1, x2] = [x2, x1];
    }
    if (height < 0) {
      [y1, y2] = [y2, y1];
    }

    // Check if point is inside the rectangle
    return this.x >= x1 && this.x <= x2 && this.y >= y1 && this.y <= y2;
  }

  isMouseInShape(x, y) {
    const THRESHOLD = 4;
    const left = this.x - this.width / 2 - THRESHOLD;
    const right = this.x + this.width / 2 + THRESHOLD;
    const top = this.y - this.height / 2 - THRESHOLD;
    const bottom = this.y + this.height / 2 + THRESHOLD;

    return x > left && x < right && y > top && y < bottom;
  }

  isMouseNearExitPoint(x, y) {
    let exitX, exitY;

    if (['endFlow', 'connector', 'jumper'].includes(this.type)) {
      return this.isMouseNearExitPointCircularShape(x, y);
    }

    let exitPointCount = 0;

    if (this.type === 'playMenu') {
      return this.isMouseNearExitPointPlayMenu(x, y);
    } else if (this.type === 'switch') {
      return this.isMouseNearExitPointSwitch(x, y);
      exitPointCount = (this.userValues?.actions?.length || 0) + 1;
    } else {
      exitPointCount = 1;
    }

    if (exitPointCount === 1) {
      if (this.exitPoint) {
        [exitX, exitY] = [this.exitPoint.x, this.exitPoint.y];
      } else {
        [exitX, exitY] = this.getBottomCoordinates();
      }

      const distance = Math.hypot(x - exitX, y - exitY);

      if (distance <= 4) {
        return {
          totalPoints: 1,
          position: 1,
          name: 'default',
          exitX,
          exitY,
        };
      } else {
        return false;
      }
    }

    if (exitPointCount > 1) {
      let minDistance = Infinity;
      let minPoint = null;
      let minPosition = null;

      for (let i = 1; i <= exitPointCount; i++) {
        const [pointX, pointY] = this.getBottomCoordinatesMultiExit(
          i,
          exitPointCount
        );
        const distance = Math.hypot(x - pointX, y - pointY);

        if (distance < minDistance) {
          minDistance = distance;
          minPoint = [pointX, pointY];
          minPosition = i;
        }
      }

      [exitX, exitY] = minPoint;
      const distance = Math.hypot(x - exitX, y - exitY);

      if (distance <= 4) {
        const name =
          this.type === 'switch' && minPosition === exitPointCount
            ? this.userValues.defaultAction
            : this.getExitPointNameAtPosition(minPosition);

        return {
          totalPoints: exitPointCount,
          position: minPosition,
          name,
          exitX,
          exitY,
        };
      } else {
        return false;
      }
    }

    return false;
  }

  isMouseNearExitPointCircularShape(x, y) {
    const [exitX, exitY] = [this.x, this.y];
    const distance = Math.hypot(x - exitX, y - exitY);

    if (distance <= 4) {
      return {
        totalPoints: 1,
        position: 1,
        name: 'default',
      };
    } else {
      return false;
    }
  }

  isMouseNearExitPointPlayMenu(x, y) {
    const items =
      this.userValues?.items?.filter((item) => !item.isDefault) || [];

    if (items.length === 0) {
      return false;
    }

    let minDistance = Infinity;
    let minPoint = null;
    let minPosition = null;
    let name = '';

    items.forEach((item, i) => {
      let pointX, pointY;

      if (item.exitPoint) {
        pointX = item.exitPoint.x;
        pointY = item.exitPoint.y;
      } else {
        [pointX, pointY] = this.getBottomCoordinatesMultiExit(
          i + 1,
          items.length
        );
      }

      const distance = Math.hypot(x - pointX, y - pointY);

      if (distance < minDistance) {
        minDistance = distance;
        minPoint = [pointX, pointY];
        minPosition = i + 1;
        name = item.action;
      }
    });

    const [exitX, exitY] = minPoint;
    const distance = Math.hypot(x - exitX, y - exitY);

    if (distance <= 4) {
      return {
        totalPoints: items.length,
        position: minPosition,
        name,
        exitX,
        exitY,
      };
    } else {
      return false;
    }
  }

  isMouseNearExitPointSwitch(x, y) {
    const actions = this.userValues?.actions || [];

    if (actions.length === 0) {
      return false;
    }

    const actionCount = actions.length + 1;
    let minDistance = Infinity;
    let minPoint = null;
    let minPosition = null;
    let name = '';

    actions.forEach((a, i) => {
      let pointX, pointY;

      if (a.exitPoint) {
        pointX = a.exitPoint.x;
        pointY = a.exitPoint.y;
      } else {
        [pointX, pointY] = this.getBottomCoordinatesMultiExit(
          i + 1,
          actionCount
        );
      }

      const distance = Math.hypot(x - pointX, y - pointY);

      if (distance < minDistance) {
        minDistance = distance;
        minPoint = [pointX, pointY];
        minPosition = i + 1;
        name = a.action;
      }
    });

    let pointX, pointY;

    if (this.userValues?.defaultActionExitPoint) {
      pointX = this.userValues.defaultActionExitPoint.x;
      pointY = this.userValues.defaultActionExitPoint.y;
    } else {
      [pointX, pointY] = this.getBottomCoordinatesMultiExit(
        actionCount,
        actionCount
      );
    }

    const distance = Math.hypot(x - pointX, y - pointY);

    if (distance < minDistance) {
      minDistance = distance;
      minPoint = [pointX, pointY];
      minPosition = actionCount;
      name = this.userValues?.defaultAction;
    }

    const [exitX, exitY] = minPoint;
    const closestDistance = Math.hypot(x - exitX, y - exitY);

    if (closestDistance <= 4) {
      return {
        totalPoints: actionCount,
        position: minPosition,
        name,
        exitX,
        exitY,
      };
    } else {
      return false;
    }
  }

  clearExitPoint() {
    delete this.exitPoint;
  }

  getExitPointNameAtPosition(position) {
    // Position starts from 1.
    const {type, userValues} = this;

    if (type === 'playMenu') {
      const filteredItems = userValues?.items.filter((item) => !item.isDefault);
      const selectedAction = filteredItems?.[position - 1]?.action;
      return selectedAction ?? null;
    }

    if (type === 'switch') {
      const selectedAction = userValues?.actions?.[position - 1]?.action;
      return selectedAction ?? null;
    }

    return null;
  }

  setUserValues(userValues) {
    this.userValues = {...userValues};
  }
  setFunctionString(text) {
    this.functionString = text;
  }

  setText(inputText) {
    this.text = inputText;
  }
  setSelected(bool) {
    this.selected = bool;
  }
  fillSelected(ctx) {
    ctx.fillStyle = '#B3E5FC';
    ctx.fill();
  }
  resetContextForDrawingImage(ctx) {
    ctx.fillStyle = 'transparent';
    ctx.strokeStyle = 'transparent';
    ctx.lineWidth = 1;
    ctx.font = '12px arial';
    ctx.globalCompositeOperation = 'source-over';
  }
  resetContextForText(ctx) {
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }

  setWidthFromText(ctx) {
    // reset text styles
    ctx.font = '18px sans-serif';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const width = ctx.measureText(this.text).width;
    const minWidth = 90;
    let additionalWidth = 50;

    if (this.type === 'getDigits' || this.type === 'switch') {
      additionalWidth = 60;
    }

    this.width = Math.max(width + additionalWidth, minWidth);
  }

  setWidthfromExitPoints() {
    const SPACING = 20;

    let exitPointCount = 0;
    let minWidth = 0;

    if (this.type === 'switch') {
      exitPointCount = (this.userValues?.actions?.length || 0) + 1;
      minWidth = exitPointCount * SPACING + 2 * SPACING;
    } else if (this.type === 'playMenu') {
      exitPointCount =
        (this.userValues?.items?.filter((item) => !item.isDefault)?.length ||
          0) + 1;
      minWidth = exitPointCount * SPACING + 2 * SPACING;
    }

    this.width = Math.max(minWidth, this.width);
  }

  drawExitPoints(ctx) {
    ctx.fillStyle = '#0d5bdd';

    if (this.type === 'playMenu') {
      this.drawExitPointPlayMenu(ctx);
    } else if (this.type === 'switch') {
      this.drawExitPointSwitch(ctx);
    } else {
      this.drawSingleExitPoint(ctx);
    }
  }

  drawSingleExitPoint(ctx) {
    const dotRadius = 1.9;

    if (this.exitPoint) {
      // If exit point, draw it at the specified coordinates
      ctx.beginPath();
      ctx.arc(
        this.exitPoint.x,
        this.exitPoint.y,
        dotRadius * 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
    } else {
      // If no exit point, draw it at the bottom coordinates
      ctx.beginPath();
      ctx.arc(...this.getBottomCoordinates(), dotRadius * 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  drawExitPointPlayMenu(ctx) {
    const dotRadius = 1.9;

    let exitPoints =
      this.userValues?.items.filter((item) => !item.isDefault) || [];

    for (let i = 1; i <= exitPoints.length; i++) {
      ctx.beginPath();

      if (exitPoints[i - 1].exitPoint) {
        ctx.arc(
          exitPoints[i - 1].exitPoint.x,
          exitPoints[i - 1].exitPoint.y,
          dotRadius * 2,
          0,
          2 * Math.PI
        );
      } else {
        ctx.arc(
          ...this.getBottomCoordinatesMultiExit(i, exitPoints.length),
          dotRadius * 2,
          0,
          2 * Math.PI
        );
      }
      ctx.fill();
    }
  }

  drawExitPointSwitch(ctx) {
    const dotRadius = 1.9;
    const exitPoints = this.userValues?.actions;

    if (!exitPoints?.length) {
      return;
    }

    const exitPointCount = exitPoints?.length + 1 || 0;

    for (let i = 1; i <= exitPointCount; i++) {
      ctx.beginPath();

      if (i === exitPointCount) {
        if (this.userValues?.defaultActionExitPoint) {
          ctx.arc(
            this.userValues.defaultActionExitPoint.x,
            this.userValues.defaultActionExitPoint.y,
            dotRadius * 2,
            0,
            2 * Math.PI
          );
        } else {
          ctx.arc(
            ...this.getBottomCoordinatesMultiExit(i, exitPointCount),
            dotRadius * 2,
            0,
            2 * Math.PI
          );
        }
      } else {
        if (exitPoints[i - 1]?.exitPoint) {
          ctx.arc(
            exitPoints[i - 1].exitPoint.x,
            exitPoints[i - 1].exitPoint.y,
            dotRadius * 2,
            0,
            2 * Math.PI
          );
        } else {
          ctx.arc(
            ...this.getBottomCoordinatesMultiExit(i, exitPointCount),
            dotRadius * 2,
            0,
            2 * Math.PI
          );
        }
      }

      ctx.fill();
    }
  }

  drawShape(ctx) {
    switch (this.type) {
      case 'runScript':
        this.drawRectangle(ctx);
        break;

      case 'callAPI':
        this.drawInvertedHexagon(ctx);
        break;

      case 'setParams':
        this.drawPentagon(ctx);
        break;

      case 'playMenu':
        this.drawHexagon(ctx);
        break;

      case 'getDigits':
        this.drawParallelogram(ctx);
        break;

      case 'playMessage':
        this.drawRoundedRectangle(ctx);
        break;

      case 'playConfirm':
        this.drawRoundedRectangle2(ctx);
        break;

      case 'endFlow':
        this.drawEndCircle(ctx);
        break;

      case 'connector':
        this.drawSmallCircle(ctx);
        break;

      case 'jumper':
        this.drawTriangle(ctx);
        break;

      case 'switch':
        this.drawPentagonSwitch(ctx);
        break;

      case 'module':
        this.drawModule(ctx);
        break;

      //   case 'exitPoint':
      //     this.drawTinyCircle(ctx);
      //     break;

      //   case 'tinyCircle':
      //     this.drawTinyCircle(ctx);
      //     break;
    }
  }

  drawRectangle(ctx) {
    this.setWidthFromText(ctx);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    if (this.selected) {
      ctx.fillStyle = '#B3E5FC';
      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    }

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(this.img, this.x + 10 - this.width / 2, this.y - 10, 20, 20);

    this.resetContextForText(ctx);
    ctx.fillText(this.text, this.x + 10, this.y);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#4285F4';
    this.style = '#4285F4';
    ctx.strokeRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );

    this.drawExitPoints(ctx);
  }

  drawInvertedHexagon(ctx) {
    this.setWidthFromText(ctx);

    ctx.beginPath();
    ctx.translate(this.x, this.y);
    this.stroke && this.setWidthFromText(ctx);

    ctx.moveTo(this.width / 2, -(this.height / 3));
    ctx.lineTo(this.width / 2, this.height / 3);
    ctx.lineTo(0, this.height / 2);
    ctx.lineTo(-this.width / 2, this.height / 3);
    ctx.lineTo(-this.width / 2, -this.height / 3);
    ctx.lineTo(0, -this.height / 2);

    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // fill color when selected
    this.selected && this.fillSelected(ctx);

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(this.img, this.x + 10 - this.width / 2, this.y - 10, 20, 20);
    this.resetContextForText(ctx);
    ctx.fillText(this.text, this.x + 10, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#4285F4';
    ctx.stroke();
    this.style = '#4285F4';
    this.drawExitPoints(ctx);
  }
  drawPentagon(ctx) {
    this.setWidthFromText(ctx);
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width / 2, -this.height / 2);
    ctx.lineTo(this.width / 2, this.height / 3);
    ctx.lineTo(0, this.height / 2);
    ctx.lineTo(-this.width / 2, this.height / 3);
    ctx.lineTo(-this.width / 2, -this.height / 2);

    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = this.text === 'start' ? '#B2DF8A' : '#FFFFFF';
    ctx.fill();

    // fill color when selected
    this.selected && this.fillSelected(ctx);

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(
      this.img,
      this.x + 10 - this.width / 2,
      this.y - 10 - 2,
      20,
      20
    );

    this.resetContextForText(ctx);
    ctx.fillText(this.text, this.x + 12, this.y - 2);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#4285F4';
    ctx.stroke();
    this.style = '#4285F4';
    this.drawExitPoints(ctx);
  }
  drawHexagon(ctx) {
    this.setWidthFromText(ctx);
    this.setWidthfromExitPoints();
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width * 0.5, 0);
    ctx.lineTo(this.width * 0.4, 0.5 * this.height);

    ctx.lineTo(-this.width * 0.4, 0.5 * this.height);
    ctx.lineTo(-this.width * 0.5, 0);
    ctx.lineTo(-this.width * 0.4, -0.5 * this.height);
    ctx.lineTo(this.width * 0.4, -0.5 * this.height);
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // fill color when selected
    this.selected && this.fillSelected(ctx);

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(this.img, this.x + 10 - this.width / 2, this.y - 10, 20, 20);
    this.resetContextForText(ctx);
    ctx.fillText(this.text, this.x + 10, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#4285F4';
    ctx.stroke();

    this.style = '#4285F4';
    this.drawExitPoints(ctx);
    // this.drawExitPointsMenu(ctx);
  }
  drawParallelogram(ctx) {
    this.setWidthFromText(ctx);
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(-this.width * (3 / 8), -this.height / 2);
    ctx.lineTo(this.width * (5 / 8), -this.height / 2);
    ctx.lineTo(this.width * (3 / 8), this.height / 2);
    ctx.lineTo(-this.width * (5 / 8), this.height / 2);
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // fill color when selected
    this.selected && this.fillSelected(ctx);

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(
      this.img,
      this.x + 9 + 10 - this.width / 2,
      this.y - 9,
      18,
      18
    );

    this.resetContextForText(ctx);
    ctx.fillText(this.text, this.x + 12, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#4285F4';
    ctx.stroke();

    this.style = '#4285F4';
    this.drawExitPoints(ctx);
  }
  drawRoundedRectangle(ctx) {
    this.setWidthFromText(ctx);
    this.style = '#4285F4';
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width * 0.5 - this.height * 0.5, this.height * 0.5);
    ctx.lineTo(-(this.width * 0.5 - this.height * 0.5), this.height * 0.5);

    ctx.arc(
      -(this.width * 0.5 - this.height * 0.5),
      0,
      Math.abs(this.height * 0.5),
      0.5 * Math.PI,
      1.5 * Math.PI
    );
    ctx.lineTo(this.width * 0.5 - this.height * 0.5, -this.height * 0.5);
    ctx.arc(
      this.width * 0.5 - this.height * 0.5,
      0,
      Math.abs(this.height * 0.5),
      1.5 * Math.PI,
      0.5 * Math.PI
    );
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // fill color if selected
    this.selected && this.fillSelected(ctx);

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(this.img, this.x + 10 - this.width / 2, this.y - 10, 20, 20);

    this.resetContextForText(ctx);
    ctx.fillText(this.text, this.x + 10, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = this.style;
    ctx.stroke();
    this.drawExitPoints(ctx);
  }
  drawRoundedRectangle2(ctx) {
    this.setWidthFromText(ctx);
    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width * 0.5 - this.height * 0.5, this.height * 0.5);
    ctx.lineTo(-(this.width * 0.5 - this.height * 0.5), this.height * 0.5);

    ctx.arc(
      -(this.width * 0.5 - this.height * 0.5),
      0,
      Math.abs(this.height * 0.5),
      0.5 * Math.PI,
      1.5 * Math.PI
    );
    ctx.lineTo(this.width * 0.5 - this.height * 0.5, -this.height * 0.5);
    ctx.arc(
      this.width * 0.5 - this.height * 0.5,
      0,
      Math.abs(this.height * 0.5),
      1.5 * Math.PI,
      0.5 * Math.PI
    );
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // fill color if selected
    this.selected && this.fillSelected(ctx);
    this.style = '#4285F4';

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(this.img, this.x + 10 - this.width / 2, this.y - 10, 20, 20);
    this.resetContextForText(ctx);
    ctx.fillText(this.text, this.x + 10, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = this.style;
    ctx.stroke();
    this.drawExitPoints(ctx);
  }

  drawEndCircle(ctx) {
    this.style = this.userValues?.type === 'transfer' ? '#66bb6a' : '#ef5350';
    const radius = Math.abs(this.width * 0.5);
    const x = this.x - radius;
    const y = this.y - radius;
    const size = 22;

    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);

    // fill color if selected
    this.selected && this.fillSelected(ctx);

    ctx.fillStyle = this.style;
    ctx.fill();

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(
      this.img,
      x + (radius - size / 2),
      y + (radius - size / 2),
      size,
      size
    );
  }

  drawSmallCircle(ctx) {
    this.style = '#AAAAAA';
    ctx.beginPath();

    ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);
    // fill color if selected
    this.selected && this.fillSelected(ctx);
    ctx.fillStyle = this.style;
    ctx.fill();

    ctx.lineWidth = 1;
    ctx.font = '30px sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', this.x, this.y + 2);
  }

  drawTriangle(ctx) {
    this.style = this.userValues?.type === 'entry' ? '#d4e157' : '#ffa726';

    ctx.beginPath();

    ctx.arc(this.x, this.y, Math.abs(this.width * 0.5), 0, Math.PI * 2);

    ctx.fillStyle = this.style;
    ctx.fill();

    ctx.lineWidth = 1;
    ctx.font = '22px sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('▼', this.x, this.y + 3);
  }
  drawPentagonSwitch(ctx) {
    this.setWidthFromText(ctx);
    this.setWidthfromExitPoints();
    this.style = '#4285F4';

    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.moveTo(this.width * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5, this.height * 0.5);
    ctx.lineTo(-this.width * 0.5 + 0.5 * this.height, -this.height * 0.5);
    ctx.lineTo(this.width * 0.5 - 0.5 * this.height, -this.height * 0.5);

    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // exit points for switch when in stage

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // fill color if selected
    this.selected && this.fillSelected(ctx);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    this.resetContextForDrawingImage(ctx);
    ctx.drawImage(this.img, this.x + 15 - this.width / 2, this.y - 10, 22, 22);
    this.resetContextForText(ctx);
    ctx.fillText(this.text, this.x + 10, this.y);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = this.style;
    ctx.stroke();
    this.drawExitPoints(ctx);
  }

  drawModule(ctx) {
    this.setWidthFromText(ctx);
    ctx.fillStyle = '#f5cbab';
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.strokeStyle = '#eda167';
    this.style = '#eda167';
    this.drawExitPoints(ctx);
    ctx.strokeRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x, this.y);
  }
}

export default Shape;
