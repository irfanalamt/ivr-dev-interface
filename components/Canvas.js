import { Box, Button, Container, Stack, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Shape from '../models/Shape';
import Shapes from '../models/Shapes';
import DrawerComponent from './Drawer';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import InputRoundedIcon from '@mui/icons-material/InputRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';

const CanvasComponent = () => {
  const [showInput, setShowInput] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [shapeInputText, setShapeInputText] = useState('');
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const bgRef = useRef(null);
  const bgContext = useRef(null);
  const currentShape = useRef(null);
  const palletGroup = useRef(null);
  const stageGroup = useRef(null);
  const textBoxRef = useRef(null);

  let isDragging = false;
  let isPalletShape = false;
  let isResizing = false;
  let isOnEdge = false;
  console.log('loopsie');

  let startX, startY;
  let startX1, startY1;

  //   const circle = {
  //     centreX: 50,
  //     centreY: 150,
  //     totalWidth: 34,
  //     totalHeight: 67,
  //   };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const bg = bgRef.current;
    const context2 = bg.getContext('2d');

    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 3;

    let palletRectangle = new Shape(65, 220, 40, 30, 'rectangle', '#bf360c');
    let palletCircle = new Shape(65, 275, 40, 40, 'circle', '#0d47a1');
    let palletHexagon = new Shape(65, 330, 50, 30, 'hexagon', '#004d40');
    let palletParallelogram = new Shape(
      65,
      377,
      36,
      22,
      'parallelogram',
      '#4a148c'
    );
    let palletRoundedRectangle = new Shape(
      65,
      420,
      50,
      30,
      'roundedRectangle',
      '#827717'
    );
    palletGroup.current = new Shapes('palette', [
      palletRectangle,
      palletCircle,
      palletHexagon,
      palletParallelogram,
      palletRoundedRectangle,
    ]);
    stageGroup.current = new Shapes('stage', []);

    contextRef.current = context;
    bgContext.current = context2;

    drawBackground();
    clearAndDraw();
  }, []);

  useEffect(() => {
    if (showInput) {
      textBoxRef.current.style.width = currentShape.current.width + 'px';
    }
  }, [showInput]);

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

    if (isOnEdge) {
      isResizing = true;
      startX = clientX;
      startY = clientY;
      return;
    } else {
      isResizing = false;
    }

    stageGroup.current.getShapes().forEach((element, i) => {
      if (element.isMouseInShape(offsetX, offsetY)) {
        console.log(`YES in stage shape ${element.type}`);
        currentShape.current = element;
        //setIsOpen(true);
        startX = clientX;
        startY = clientY;
        startX1 = clientX;
        startY1 = clientY;
        isDragging = true;
        isPalletShape = false;
        // handleDoubleClickX(offsetX, offsetY);
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
        return;
      }
    });
    if (showInput) {
      setShowInput(false);
      clearAndDraw();
    }
  }

  function handleMouseUp({ nativeEvent }) {
    let { offsetX, offsetY, clientX, clientY } = nativeEvent;
    if (!isDragging) {
      // handleDoubleClickX(offsetX, offsetY);
      // console.log('hmu Not dragging');
    } else if (isPalletShape) {
      console.log('mouse up while dragging pallet');
      let palletFigureDragged = currentShape.current;
      let stageFigure;
      if (palletFigureDragged.type === 'rectangle') {
        stageFigure = new Shape(
          offsetX,
          offsetY,
          120,
          50,
          'rectangle',
          null,
          true
        );
      } else if (palletFigureDragged.type === 'circle') {
        stageFigure = new Shape(
          offsetX,
          offsetY,
          120,
          120,
          'circle',
          null,
          true
        );
      } else if (palletFigureDragged.type === 'hexagon') {
        stageFigure = new Shape(
          offsetX,
          offsetY,
          140,
          50,
          'hexagon',
          '#009688',
          true
        );
      } else if (palletFigureDragged.type === 'parallelogram') {
        stageFigure = new Shape(
          offsetX,
          offsetY,
          120,
          50,
          'parallelogram',
          '#9c27b0',
          true
        );
      } else if (palletFigureDragged.type === 'roundedRectangle') {
        stageFigure = new Shape(
          offsetX,
          offsetY,
          130,
          50,
          'roundedRectangle',
          '#c0ca33',
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
    } else {
      if (clientX == startX1 && clientY == startY1) {
        handleDoubleClickX(offsetX, offsetY);
      }
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
    let { offsetX, offsetY, clientX, clientY } = nativeEvent;
    let initPosResizeX, initPosResizeY;
    let mouseX = parseInt(clientX);
    let mouseY = parseInt(clientY);
    if (!isDragging && !isResizing) {
      isOnEdge = false;
      canvasRef.current.style.cursor = 'default';

      stageGroup.current.getShapes().forEach((element, i) => {
        if (element.isMouseNearVertex(offsetX, offsetY)) {
          console.log('Mouse near vertex');
          canvasRef.current.style.cursor = 'w-resize';
          initPosResizeX = parseInt(clientX);
          initPosResizeY = parseInt(clientY);
          isOnEdge = true;
          currentShape.current = element;
          return;
        }
      });
    } else if (isResizing) {
      let dx = mouseX - startX;
      let dy = mouseY - startY;
      let current_shape = currentShape.current;
      current_shape.width += dx;
      current_shape.height += dy;
      clearAndDraw();
      startX = mouseX;
      startY = mouseY;
      isOnEdge = false;
    } else {
      nativeEvent.preventDefault();

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

  function handleDoubleClickX(offsetX, offsetY) {
    stageGroup.current.getShapes().forEach((element, i) => {
      if (element.isMouseInShape(offsetX, offsetY)) {
        console.log(`dbclick in shape ${element.type}`);
        currentShape.current = element;
        currentShape.current.setSelected(true);
        clearAndDraw();
        setIsOpen(true);
        // placeTextField();

        return;
      } else {
        console.log('NOT dbclick in shape');
      }
    });
  }

  function handleDoubleClick({ nativeEvent }) {
    let { offsetX, offsetY, clientX, clientY } = nativeEvent;
    nativeEvent.preventDefault();

    // handleDoubleClickX(offsetX, offsetY);
  }

  // function placeTextField() {
  //   let boxd = document.getElementById('box-div');
  //   setShowInput(true);
  //   setShapeInputText(currentShape.current.text);

  //   console.log('double cliick');
  //   boxd.style.position = 'absolute';

  //   boxd.style.left =
  //     currentShape.current.x - currentShape.current.width / 2 + 2 + 'px';
  //   boxd.style.top = currentShape.current.y - 19 + 'px';
  // }

  const handleReset = () => {
    stageGroup.current.getShapes().splice(0);
    setShowInput(false);
    clearAndDraw();
  };

  function handleTextSave({ nativeEvent }) {
    nativeEvent.preventDefault();

    currentShape.current.setText(shapeInputText);

    clearAndDraw();
    setShowInput(false);
  }

  function handleCloseDrawer() {
    setIsOpen(false);
    setShowInput(false);
    clearAndDraw();
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
          backgroundColor: '#fafafa',
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

      {isOpen && (
        <DrawerComponent
          isOpen={isOpen}
          handleCloseDrawer={handleCloseDrawer}
          shape={currentShape.current}
        />
      )}

      <div style={{ position: 'relative', display: 'flex' }} id='box-div'>
        {showInput && (
          <>
            <TextField
              style={{
                zIndex: 5,
                maxWidth: 500,
                backgroundColor: '#fafafa',
              }}
              value={shapeInputText}
              ref={textBoxRef}
              variant='standard'
              size='small'
              onChange={(e) => {
                setShapeInputText(e.target.value);
              }}
            />
            <Stack spacing={4}>
              <Button
                onClick={handleTextSave}
                sx={{ marginX: 2, zIndex: 5, backgroundColor: '#42a5f5' }}
                variant='standard'
              >
                <InputRoundedIcon />
              </Button>
              <Button
                onClick={() => {
                  setIsOpen(true);
                }}
                sx={{ zIndex: 6, borderRadius: 4 }}
                variant='contained'
                color='secondary'
              >
                Edit <TuneRoundedIcon sx={{ marginX: 1 }} />
              </Button>
            </Stack>
          </>
        )}
      </div>
    </Box>
  );
};

export default CanvasComponent;
