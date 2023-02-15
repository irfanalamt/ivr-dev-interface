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
  const gridSpacing = 40;
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

  // Draw thick horizontal lines
  for (let i = 0; i <= canvasHeight; i += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(xPaletteOffset, i);
    ctx.lineTo(canvasWidth, i);
    ctx.strokeStyle = thickGrid.color;
    ctx.lineWidth = thickGrid.width;
    ctx.stroke();
  }

  // Draw thick vertical lines
  for (let j = 0; j <= canvasWidth; j += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(j + xPaletteOffset, 0);
    ctx.lineTo(j + xPaletteOffset, canvasHeight);
    ctx.strokeStyle = thickGrid.color;
    ctx.lineWidth = thickGrid.width;
    ctx.stroke();
  }

  // Draw thin horizontal lines
  for (let i = 0; i <= canvasHeight; i += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(xPaletteOffset, i + thinGridOffset);
    ctx.lineTo(canvasWidth, i + thinGridOffset);
    ctx.strokeStyle = thinGrid.color;
    ctx.lineWidth = thinGrid.width;
    ctx.stroke();
  }

  // Draw thin vertical lines
  for (let j = 0; j <= canvasWidth; j += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(j + xPaletteOffset + thinGridOffset, 0);
    ctx.lineTo(j + xPaletteOffset + thinGridOffset, canvasHeight);
    ctx.strokeStyle = thinGrid.color;
    ctx.lineWidth = thinGrid.width;
    ctx.stroke();
  }
}

export {replaceVarNameDollar, drawGridLines};
