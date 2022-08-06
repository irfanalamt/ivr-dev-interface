import { Box, Button, Container, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Shape from '../models/Shape';
import Shapes from '../models/Shapes';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import LabelIcon from '@mui/icons-material/Label';

const CanvasComponent = () => {
  const [showInput, setShowInput] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const bgRef = useRef(null);
  const bgContext = useRef(null);
  const currentShape = useRef(null);
  const palletGroup = useRef(null);
  const stageGroup = useRef(null);

  let isDragging = false;
  let isPalletShape = false;
  console.log('loopsie');

  let startX, startY;
  let initX, initY;

  //   const circle = {
  //     x: 50,
  //     y: 150,
  //     width: 34,
  //     height: 67,
  //   };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const bg = bgRef.current;
    const context2 = bg.getContext('2d');

    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 3;

    let palletRectangle = new Shape(65, 230, 40, 30, 'rectangle', '#bf360c');
    let palletCircle = new Shape(65, 285, 20, 20, 'circle', '#0d47a1');
    let palletHexagon = new Shape(65, 340, 30, 20, 'hexagon', '#004d40');
    palletGroup.current = new Shapes('palette', [
      palletRectangle,
      palletCircle,
      palletHexagon,
    ]);
    stageGroup.current = new Shapes('stage', []);

    contextRef.current = context;
    bgContext.current = context2;

    drawBackground();
    clearAndDraw();
  }, []);

  function drawBackground() {
    bgContext.current.strokeRect(30, 100, 70, 400);
  }

  function clearAndDraw() {
    contextRef.current.clearRect(0, 0, window.innerWidth, window.innerHeight);
    palletGroup.current.getShapes().forEach((el) => {
      el.drawShape(contextRef.current);
    });
    stageGroup.current.getShapes().forEach((el) => {
      el.drawShape(contextRef.current);
    });
  }

  function handleMouseDown({ nativeEvent }) {
    let { offsetX, offsetY, clientX, clientY } = nativeEvent;
    nativeEvent.preventDefault();

    stageGroup.current.getShapes().forEach((element, i) => {
      if (element.isMouseInShape(offsetX, offsetY)) {
        console.log(`YES in stage shape ${element.type}`);
        currentShape.current = element;
        startX = clientX;
        startY = clientY;
        isDragging = true;
        isPalletShape = false;
        return;
      }
    });

    palletGroup.current.getShapes().forEach((element, i) => {
      if (element.isMouseInShape(offsetX, offsetY)) {
        console.log(`YES in pallet shape ${element.type}`);
        currentShape.current = element;
        startX = clientX;
        startY = clientY;
        isDragging = true;
        isPalletShape = true;
      }
    });
  }

  function handleMouseUp({ nativeEvent }) {
    let { offsetX, offsetY } = nativeEvent;
    if (!isDragging) return;
    // we only have two pallet items
    else if (isPalletShape) {
      console.log('mouse up while dragging pallet');
      let palletFigureDragged = currentShape.current;
      let stageFigure;
      if (palletFigureDragged.type === 'rectangle') {
        stageFigure = new Shape(
          offsetX,
          offsetY,
          120,
          60,
          'rectangle',
          null,
          true
        );
      } else if (palletFigureDragged.type === 'circle') {
        stageFigure = new Shape(offsetX, offsetY, 60, 60, 'circle', null, true);
      } else if (palletFigureDragged.type === 'hexagon') {
        stageFigure = new Shape(
          offsetX,
          offsetY,
          80,
          40,
          'hexagon',
          '#009688',
          true
        );
      }
      // reset pallet figure to pallet
      palletFigureDragged.x = palletFigureDragged.getInitPos()[0];
      palletFigureDragged.y = palletFigureDragged.getInitPos()[1];
      //add figure to stage
      stageGroup.current.addShape(stageFigure);
      clearAndDraw();
      // stageFigure.drawShape(contextRef.current);
    }

    nativeEvent.preventDefault();
    isDragging = false;
  }
  function handleMouseOut({ nativeEvent }) {
    if (!isDragging) return;

    nativeEvent.preventDefault();
    isDragging = false;
  }

  function handleMouseMove({ nativeEvent }) {
    if (!isDragging) return;
    else {
      nativeEvent.preventDefault();
      let mouseX = parseInt(nativeEvent.clientX);
      let mouseY = parseInt(nativeEvent.clientY);

      let dx = mouseX - startX;
      let dy = mouseY - startY;
      let current_shape = currentShape.current;
      current_shape.x += dx;
      current_shape.y += dy;
      clearAndDraw();
      startX = mouseX;
      startY = mouseY;
    }
  }
  function handleDoubleClick({ nativeEvent }) {
    let { offsetX, offsetY, clientX, clientY } = nativeEvent;
    nativeEvent.preventDefault();

    stageGroup.current.getShapes().forEach((element, i) => {
      if (element.isMouseInShape(offsetX, offsetY)) {
        console.log(`dbclick in shape ${element.type}`);
        currentShape.current = element;
        placeTextField();
      } else console.log('NOT dbclick in shape');
    });

    console.log(palletGroup.current.getShapes());
  }

  function placeTextField() {
    let boxd = document.getElementById('box-div');
    setShowInput(true);

    console.log('double cliick');
    boxd.style.position = 'absolute';
    if (currentShape.current.type === 'rectangle') {
      boxd.style.left =
        currentShape.current.x - currentShape.current.width / 2 + 'px';
      boxd.style.top = currentShape.current.y - 19 + 'px';
    } else if (currentShape.current.type === 'hexagon') {
      boxd.style.left =
        currentShape.current.x - currentShape.current.width + 12 + 'px';
      boxd.style.top = currentShape.current.y - 19 + 'px';
    } else {
      boxd.style.left =
        currentShape.current.x - currentShape.current.width + 'px';
      boxd.style.top = currentShape.current.y - 19 + 'px';
    }
  }
  const handleReset = () => {
    stageGroup.current.getShapes().splice(0);
    setShowInput(false);
    clearAndDraw();
  };

  function handleTextSave({ nativeEvent }) {
    nativeEvent.preventDefault();
    let tb = document.getElementById('text-box');

    currentShape.current.setText(tb.value);

    clearAndDraw();
    setShowInput(false);

    console.log(palletGroup.current.getShapes());
    console.log(stageGroup.current.getShapes());
    console.log(currentShape.current);
  }

  function handleTextFocus() {
    let tb = document.getElementById('text-box');
    tb.value = currentShape.current.text;
  }

  return (
    <Box sx={{ marginY: 1 }}>
      <canvas
        style={{ position: 'absolute', left: 0, bottom: 10, zIndex: 5 }}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
        onDoubleClick={handleDoubleClick}
        ref={canvasRef}
      ></canvas>
      <canvas
        style={{
          position: 'absolute',
          zIndex: -1,
          left: 0,
          bottom: 10,
          backgroundColor: '#eceff1',
        }}
        width={window.innerWidth}
        height={window.innerHeight}
        ref={bgRef}
      ></canvas>
      <Button
        onClick={handleReset}
        sx={{
          marginX: 'auto',
          position: 'absolute',
          textAlign: 'center',
          maxWidth: 150,
          left: 0,
          right: 0,
          bottom: 20,
          zIndex: 5,
        }}
        variant='contained'
      >
        RESET
        <RestartAltRoundedIcon />
      </Button>

      <div style={{ position: 'relative' }} id='box-div'>
        {showInput && (
          <>
            <TextField
              style={{
                zIndex: 5,
                maxWidth: 115,
                backgroundColor: '#eceff1',
              }}
              id='text-box'
              variant='standard'
              size='small'
              onFocus={handleTextFocus}
            />
            <Button
              onClick={handleTextSave}
              sx={{ marginX: 2, zIndex: 5, backgroundColor: '#26a69a' }}
              variant='contained'
            >
              <LabelIcon />
            </Button>
          </>
        )}
      </div>
    </Box>
  );
};

export default CanvasComponent;
