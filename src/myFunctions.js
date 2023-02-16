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
  const thinGridOffset = gridSpacing / 2;
  const thickGrid = {
    color: '#E6E6E6',
    width: 1,
  };
  const thinGrid = {
    color: '#E4EBFD',
    width: 0.5,
  };

  function drawLine(startX, startY, endX, endY, style) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    ctx.stroke();
  }

  for (let i = 0; i <= canvasHeight; i += gridSpacing) {
    drawLine(xPaletteOffset, i, canvasWidth, i, thickGrid);
    drawLine(
      xPaletteOffset,
      i + thinGridOffset,
      canvasWidth,
      i + thinGridOffset,
      thinGrid
    );
  }

  for (let j = 0; j <= canvasWidth; j += gridSpacing) {
    drawLine(
      j + xPaletteOffset,
      0,
      j + xPaletteOffset,
      canvasHeight,
      thickGrid
    );
    drawLine(
      j + xPaletteOffset + thinGridOffset,
      0,
      j + xPaletteOffset + thinGridOffset,
      canvasHeight,
      thinGrid
    );
  }
}

export {replaceVarNameDollar, drawGridLines};
