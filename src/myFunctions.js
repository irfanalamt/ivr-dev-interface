function replaceVarNameDollar(str) {
  let strOut = '';

  for (let i = 0; i < str.length; i++) {
    if (str[i] == '"' && str[i + 1] == '$') {
      strOut = strOut + 'this.';
      for (let j = i + 2; j < str.length; j++) {
        if (str[j] == '"') {
          i = j;
          break;
        } else {
          strOut = strOut + str[j];
        }
      }
    } else {
      strOut = strOut + str[i];
    }
  }
  return strOut;
}
function deleteDollar(str) {
  if (str.charAt(0) === '$') {
    return str.slice(1);
  }
  return str;
}
function replaceDollarString(str) {
  return str.replace(/\$([a-zA-Z])/g, 'this.$1');
}

function drawGridLines(ctx, canvas) {
  const canvasHeight = canvas.height;
  const canvasWidth = canvas.width;
  const gridSpacing = 30;
  const xPaletteOffset = 75;
  const yAppbarOffset = 50;
  const thinGridOffset = gridSpacing / 2;
  const thickGrid = {
    color: '#E6E6E6',
    width: 1,
  };
  const thinGrid = {
    color: '#E4EBFD',
    width: 0.5,
  };

  ctx.shadowColor = 'rgba(0, 0, 0, 0)';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;

  function drawLine(startX, startY, endX, endY, style) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    ctx.stroke();
  }

  //horizontals
  for (let i = 0; i <= canvasHeight; i += gridSpacing) {
    drawLine(
      xPaletteOffset,
      i + yAppbarOffset,
      canvasWidth,
      i + yAppbarOffset,
      thickGrid
    );
    drawLine(
      xPaletteOffset,
      i + thinGridOffset + yAppbarOffset,
      canvasWidth,
      i + thinGridOffset + yAppbarOffset,
      thinGrid
    );
  }

  //verticals
  for (let j = 0; j <= canvasWidth; j += gridSpacing) {
    drawLine(
      j + xPaletteOffset,
      0 + yAppbarOffset,
      j + xPaletteOffset,
      canvasHeight + yAppbarOffset,
      thickGrid
    );
    drawLine(
      j + xPaletteOffset + thinGridOffset,
      0 + yAppbarOffset,
      j + xPaletteOffset + thinGridOffset,
      canvasHeight + yAppbarOffset,
      thinGrid
    );
  }
}

function drawGridLines2(ctx, canvas) {
  const canvasHeight = canvas.height;
  const canvasWidth = canvas.width;
  const gridSpacing = 40;
  const xPaletteOffset = 75;
  const yAppbarOffset = 50;
  const thinGridOffset = gridSpacing / 2;
  const thickGrid = {
    color: '#A9A9A950',
    width: 1,
  };
  const thinGrid = {
    color: '#D3D3D350',
    width: 0.5,
  };

  ctx.shadowColor = 'rgba(0, 0, 0, 0)';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;

  function drawLine(startX, startY, endX, endY, style) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    ctx.stroke();
  }

  //horizontals
  for (let i = 0; i <= canvasHeight; i += gridSpacing) {
    drawLine(
      xPaletteOffset,
      i + yAppbarOffset,
      canvasWidth,
      i + yAppbarOffset,
      thickGrid
    );
    drawLine(
      xPaletteOffset,
      i + thinGridOffset + yAppbarOffset,
      canvasWidth,
      i + thinGridOffset + yAppbarOffset,
      thinGrid
    );
  }

  //verticals
  for (let j = 0; j <= canvasWidth; j += gridSpacing) {
    drawLine(
      j + xPaletteOffset,
      0 + yAppbarOffset,
      j + xPaletteOffset,
      canvasHeight + yAppbarOffset,
      thickGrid
    );
    drawLine(
      j + xPaletteOffset + thinGridOffset,
      0 + yAppbarOffset,
      j + xPaletteOffset + thinGridOffset,
      canvasHeight + yAppbarOffset,
      thinGrid
    );
  }
}

function drawFilledArrow(ctx, startX, startY, endX, endY) {
  const arrowLength = 9;
  const arrowAngle = Math.PI / 6;
  const arrowColor = '#424242';
  const lineWidth = 2;

  // Set drawing styles
  ctx.strokeStyle = arrowColor;
  ctx.fillStyle = arrowColor;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';

  // Draw line
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Draw arrowhead
  const angle = Math.atan2(endY - startY, endX - startX);
  const arrowPoint1X = endX - arrowLength * Math.cos(angle - arrowAngle);
  const arrowPoint1Y = endY - arrowLength * Math.sin(angle - arrowAngle);
  const arrowPoint2X = endX - arrowLength * Math.cos(angle + arrowAngle);
  const arrowPoint2Y = endY - arrowLength * Math.sin(angle + arrowAngle);
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(arrowPoint1X, arrowPoint1Y);
  ctx.lineTo(arrowPoint2X, arrowPoint2Y);
  ctx.fill();
}

function drawMultiSelectRect(ctx, x, y, width, height, type = null) {
  if (type == 'Cut') {
    ctx.fillStyle = 'rgba(48, 120, 112, 0.3)';
  } else if (type == 'Copy') {
    ctx.fillStyle = 'rgba(183, 226, 247, 0.3)';
  } else {
    ctx.fillStyle = 'rgba(178, 223, 219, 0.3)';
  }

  ctx.lineWidth = 1;
  ctx.fillRect(x, y, width, height);

  ctx.strokeStyle = '#757575';
  ctx.strokeRect(x, y, width, height);
}

function getConnectingLines(shapes) {
  const connections = [];

  for (const shape of shapes) {
    let items;
    let shape2;
    let x1, y1, x2, y2;
    const userValues = shape.userValues;

    switch (shape.type) {
      case 'playMenu':
        items = userValues?.items?.filter((item) => !item.isDefault);
        if (!items?.length) continue;

        const shape2Count = new Map();
        for (const item of items) {
          shape2 = item.nextItem;
          if (!shape2) {
            delete item.exitPoint;
            continue;
          }

          let duplicateCount = shape2Count.has(shape2)
            ? shape2Count.get(shape2) + 1
            : 1;
          shape2Count.set(shape2, duplicateCount);

          [x1, y1] = shape.getRelativeExitCoordinatesMenu(
            shape2,
            item.action,
            duplicateCount
          );
          [x2, y2] = shape2.getRelativeEntryCoordinates(shape);
          connections.push({x1, y1, x2, y2});
        }
        break;

      case 'switch':
        items = userValues?.actions ?? [];
        shape2 = userValues?.defaultActionNextItem;
        const shape2CountSwitch = new Map();
        if (shape2) {
          let duplicateCount = shape2CountSwitch.has(shape2)
            ? shape2CountSwitch.get(shape2) + 1
            : 1;
          shape2CountSwitch.set(shape2, duplicateCount);

          [x1, y1] = shape.getRelativeExitCoordinatesSwitch(
            shape2,
            userValues.defaultAction
          );
          [x2, y2] = shape2.getRelativeEntryCoordinates(shape);
          connections.push({x1, y1, x2, y2});
        } else {
          if (userValues) delete userValues.defaultActionExitPoint;
        }

        for (const item of items) {
          shape2 = item.nextItem;
          if (!shape2) {
            delete item.exitPoint;
            continue;
          }
          let duplicateCount = shape2CountSwitch.has(shape2)
            ? shape2CountSwitch.get(shape2) + 1
            : 1;
          shape2CountSwitch.set(shape2, duplicateCount);

          [x1, y1] = shape.getRelativeExitCoordinatesSwitch(
            shape2,
            item.action,
            duplicateCount
          );
          [x2, y2] = shape2.getRelativeEntryCoordinates(shape);
          connections.push({x1, y1, x2, y2});
        }
        break;

      case 'playConfirm':
        const confirmOptions = ['yes', 'no'];
        for (const option of confirmOptions) {
          shape2 = shape[option].nextItem;
          if (shape2) {
            [x1, y1] = shape.getRelativeExitCoordinatesPlayConfirm(
              shape2,
              option,
              shape.yes.nextItem === shape.no.nextItem
            );
            [x2, y2] = shape2.getRelativeEntryCoordinates(shape);
            connections.push({x1, y1, x2, y2});
          } else {
            delete shape[option].exitPoint;
          }
        }
        break;

      default:
        shape2 = shape.nextItem;
        if (shape2) {
          [x1, y1] = shape.getRelativeExitCoordinates(shape2);
          [x2, y2] = shape2.getRelativeEntryCoordinates(shape);
          connections.push({x1, y1, x2, y2});
        } else {
          shape.clearExitPoint();
        }
    }
  }

  return connections;
}

function alignAllShapes(shapes, setShapes) {
  const paletteOffset = 75;
  const yAppbarOffset = 50;
  const snapValue = 20;
  const tolerance = 10;

  const newShapes = shapes.map((shape) => {
    const dx = calculateDelta(shape.x, paletteOffset, snapValue);
    const dy = calculateDelta(shape.y, yAppbarOffset, snapValue);

    if (Math.abs(dx) <= tolerance) {
      shape.x += dx;
    }

    if (Math.abs(dy) <= tolerance) {
      shape.y += dy;
    }

    return shape;
  });

  setShapes(newShapes);
}

function calculateDelta(coordinate, offset, snapValue) {
  const multipleNumber = coordinate - offset;
  const closestMultiple = Math.round(multipleNumber / snapValue) * snapValue;
  return closestMultiple - multipleNumber;
}

function isPointInRectangle(pointX, pointY, startX, startY, width, height) {
  let x1 = startX;
  let y1 = startY;
  let x2 = startX + width;
  let y2 = startY + height;

  if (typeof startX === 'object') {
    let rect = startX;
    x1 = rect.x;
    y1 = rect.y;
    x2 = rect.x + rect.width;
    y2 = rect.y + rect.height;
  }

  // Swap coordinates if width or height is negative
  if (width < 0) {
    x1 = startX + width;
    x2 = startX;
  }
  if (height < 0) {
    y1 = startY + height;
    y2 = startY;
  }

  // Check if point is inside the rectangle
  if (pointX >= x1 && pointX <= x2 && pointY >= y1 && pointY <= y2) {
    return true;
  } else {
    return false;
  }
}

function isNameUnique(name, shape, shapes, userVariables = null) {
  for (let i = 0; i < shapes.length; i++) {
    const currentShape = shapes[i];
    if (currentShape !== shape && currentShape.text === name) {
      return false;
    }
  }

  if (userVariables) {
    for (let i = 0; i < userVariables.length; i++) {
      const currentVariable = userVariables[i];
      if (currentVariable.name === name) {
        return false;
      }
    }
  }

  return true;
}

function validateUserName(name) {
  if (name.length < 4 || name.length > 20) {
    return false;
  }

  if (!/^[a-zA-Z0-9_]+(\s*[a-zA-Z0-9_]+)*$/.test(name)) {
    return false;
  }

  // Check if the name starts with a letter
  if (!/^[a-zA-Z]/.test(name)) {
    return false;
  }

  // If all the checks pass
  return true;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function stringifySafe(obj) {
  const cache = new Set();

  return JSON.stringify(obj, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        // Cyclic reference found, discard key
        return;
      }
      cache.add(value);
    }
    return value;
  });
}

function calculateDistance(x1, y1, x2, y2) {
  const xDistance = x2 - x1;
  const yDistance = y2 - y1;

  const distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));

  return distance;
}

function generateOTP() {
  // random number between 1000 and 9999 (inclusive)
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;

  return randomNumber;
}

export {
  replaceVarNameDollar,
  drawGridLines,
  drawGridLines2,
  drawFilledArrow,
  getConnectingLines,
  alignAllShapes,
  isPointInRectangle,
  drawMultiSelectRect,
  isNameUnique,
  replaceDollarString,
  deleteDollar,
  validateUserName,
  validateEmail,
  stringifySafe,
  calculateDistance,
  generateOTP,
};
