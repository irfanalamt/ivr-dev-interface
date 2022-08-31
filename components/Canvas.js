import {
  Box,
  Button,
  Container,
  Drawer,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Shape from '../models/Shape';
import Shapes from '../models/Shapes';
import DrawerComponent from './Drawer';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import SaveAltRoundedIcon from '@mui/icons-material/SaveAltRounded';
import UseVariables from './UseVariables';

const CanvasComponent = ({ isExisting }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shapeInputText, setShapeInputText] = useState('');
  const [isOpenVars, setIsOpenVars] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const bgRef = useRef(null);
  const bgContext = useRef(null);
  const currentShape = useRef(null);
  const palletGroup = useRef(null);
  const stageGroup = useRef(null);

  let isDragging = false;
  let isPalletShape = false;
  let isResizing = false;
  let isOnEdge = false;
  let userValues = {};
  console.log('loopsie');

  let startX, startY;
  let startX1, startY1;
  const userVariables = useRef([]);

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
    if (isExisting) {
      handleClickLoadFile();
      console.log(palletGroup.current);
      stageGroup.current = new Shapes('stage', []);
    } else {
      stageGroup.current = new Shapes('stage', []);
    }

    contextRef.current = context;
    bgContext.current = context2;

    drawBackground();
    clearAndDraw();

    console.log('ue canvas');
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

  function handleClickLoadFile() {
    fetch('/api/getFigures')
      .then((res) => res.json())
      .then((data) => {
        console.log('loaded data', data);
        stageGroup.current = stageGroup.current.setShapes(data);
        clearAndDraw();
        console.log('loaded stage group', stageGroup.current);
        //stageGroup.current = new Shapes(data);
        alert('loaded from JSON');
      })
      .catch((err) => {
        alert('figure fetch api error');
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
  }

  function handleMouseUp({ nativeEvent }) {
    let { offsetX, offsetY, clientX, clientY } = nativeEvent;
    if (isPalletShape) {
      console.log('mouse up while dragging pallet');
      console.log('offsetX', offsetX, 'clientX', clientX);
      console.log('offsetY', offsetY, 'clientY', clientY);
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
      if (clientX > 120) stageGroup.current.addShape(stageFigure);

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
      //Change width, height - mousemove
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
      // drag shape - mousemove
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

    clearAndDraw();
  };

  function handleTextSave({ nativeEvent }) {
    nativeEvent.preventDefault();

    currentShape.current.setText(shapeInputText);

    clearAndDraw();
  }

  function handleCloseDrawer() {
    setIsOpen(false);
    console.log('userValues are:', userValues);

    clearAndDraw();
  }
  function handleSaveState() {
    console.log('handleSaveState length=', stageGroup.current.shapes.length);
    console.log('shape0', stageGroup.current.shapes[0]);

    let tempSave = [];
    for (let i = 0; i < stageGroup.current.shapes.length; i++) {
      let shape = stageGroup.current.shapes[i];
      let data = {
        name: shape.text,
        type: shape.type,
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
        userValues: shape.userValues,
      };
      tempSave.push(data);
    }

    axios
      .post('/api/saveFigures', {
        msg: JSON.stringify(tempSave),
      })
      .then((result) => {
        console.log(result.data.message);
        alert(result.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
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
      <Box
        sx={{
          position: 'absolute',
          bottom: 10,
          left: 0,
          right: 0,
        }}
      >
        <Button
          sx={{
            position: 'relative',
            width: 150,
            zIndex: 5,
            right: 50,
          }}
          variant='contained'
          onClick={handleSaveState}
        >
          Save state <SaveAltRoundedIcon sx={{ marginLeft: 1 }} />
        </Button>
        <Button
          onClick={handleReset}
          sx={{
            position: 'relative',
            width: 150,
            zIndex: 5,
            left: 50,
          }}
          variant='contained'
        >
          RESET
          <RestartAltRoundedIcon sx={{ marginLeft: 1 }} />
        </Button>
      </Box>
      {isOpen && (
        <DrawerComponent
          isOpen={isOpen}
          handleCloseDrawer={handleCloseDrawer}
          shape={currentShape.current}
          userVariables={userVariables.current}
        />
      )}
      {isOpenVars && (
        <Drawer anchor='right' open={isOpenVars}>
          <UseVariables
            handleCloseDrawer={() => {
              setIsOpenVars(false);
            }}
            userVariables={userVariables.current}
          />
        </Drawer>
      )}
      <Button
        sx={{ position: 'absolute', left: 25, top: 45, zIndex: 5 }}
        size='small'
        variant='outlined'
        color='success'
        onClick={() => {
          setIsOpenVars(true);
        }}
      >
        Set Variables
      </Button>
    </Box>
  );
};

export default CanvasComponent;
