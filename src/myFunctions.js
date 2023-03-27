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
    if (shape.type === 'playMenu') {
      const filteredItems = shape.userValues?.items?.filter(
        (item) => !item.isDefault
      );

      if (!filteredItems?.length) continue;

      for (const [index, item] of filteredItems.entries()) {
        const shape2 = item.nextItem;
        if (!shape2) continue;

        const [x1, y1] = shape.getBottomCoordinatesMultiExit(
          index + 1,
          filteredItems.length
        );
        const [x2, y2] = shape2.getRelativeEntryCoordinates(shape);

        connections.push({x1, y1, x2, y2});
      }
    } else if (shape.type === 'switch') {
      const items = shape.userValues?.actions ?? [];

      if (shape.userValues?.defaultActionNextItem) {
        const [x1, y1] = shape.getBottomCoordinatesMultiExit(
          items.length + 1,
          items.length + 1
        );
        const [x2, y2] =
          shape.userValues.defaultActionNextItem.getRelativeEntryCoordinates(
            shape
          );

        connections.push({x1, y1, x2, y2});
      }

      for (const [index, item] of items.entries()) {
        const shape2 = item.nextItem;
        if (!shape2) continue;

        const [x1, y1] = shape.getBottomCoordinatesMultiExit(
          index + 1,
          items.length + 1
        );
        const [x2, y2] = shape2.getRelativeEntryCoordinates(shape);

        connections.push({x1, y1, x2, y2});
      }
    } else {
      const shape2 = shape.nextItem;
      if (!shape2) {
        continue;
      }
      const [x1, y1] = shape.getRelativeExitCoordinates(shape2);
      const [x2, y2] = shape2.getRelativeEntryCoordinates(shape);

      connections.push({x1, y1, x2, y2});
    }
  }

  return modifyConnections(connections);
}

function modifyConnections(connections) {
  const groups = groupConnectionsByEndCoordinate(connections);
  modifyX2ValuesForConnectionsInGroups(groups);
  return connections;
}

function groupConnectionsByEndCoordinate(connections) {
  return connections.reduce((groups, connection) => {
    const key = `${connection.x2},${connection.y2}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(connection);
    return groups;
  }, {});
}

function modifyX2ValuesForConnectionsInGroups(groups) {
  Object.values(groups).forEach((group) => {
    group.sort((a, b) => a.x1 - b.x1);
    let numOfLeftPoints = 0;

    group.forEach((con) => {
      if (con.x1 < con.x2) numOfLeftPoints++;
    });

    group.forEach((connection, i) => {
      connection.x2 += (i - numOfLeftPoints) * 4;
    });
  });
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

function isNameUnique(name, shape, shapes) {
  for (let i = 0; i < shapes.length; i++) {
    const currentShape = shapes[i];
    if (currentShape !== shape && currentShape.text === name) {
      return false;
    }
  }
  return true;
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
};
