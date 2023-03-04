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

function drawFilledArrow(ctx, x1, y1, x2, y2) {
  // draw a line from the first point to the second

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = '#424242';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.stroke();

  // draw an arrow head
  let angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.fillStyle = '#424242';
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - 10 * Math.cos(angle - Math.PI / 6),
    y2 - 10 * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    x2 - 10 * Math.cos(angle + Math.PI / 6),
    y2 - 10 * Math.sin(angle + Math.PI / 6)
  );
  ctx.fill();
}

function getConnectingLines(shapes) {
  const connections = [];

  for (const shape of shapes) {
    if (shape.nextItem) {
      const shape2 = shapes.find((s) => s.id === shape.nextItem);

      const [x1, y1] = shape.getBottomCoordinates();

      const [x2, y2] = shape2.getTopCoordinates();

      connections.push({x1, y1, x2, y2});
    }
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
