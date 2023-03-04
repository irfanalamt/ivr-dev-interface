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
  const arrowLength = 10;
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

function getConnectingLines(shapes) {
  const connections = [];

  for (const shape of shapes) {
    if (!shape.nextItem) {
      continue;
    }

    const shape2 = shapes.find((s) => s.id === shape.nextItem);

    if (!shape2) {
      continue;
    }

    const [x1, y1] = shape.getBottomCoordinates();
    const [x2, y2] = shape2.getTopCoordinates();

    connections.push({x1, y1, x2, y2});
  }

  return connections;
}

export {
  replaceVarNameDollar,
  drawGridLines,
  drawGridLines2,
  drawFilledArrow,
  getConnectingLines,
};
