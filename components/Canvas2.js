import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Drawer, Tooltip, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Shape from '../models/Shape';
import Shapes from '../models/Shapes';
import Line from '../models/Line';
import Lines from '../models/Lines';
import DrawerComponent from './Drawer';
import InitVariables from './InitVariables2';

const CanvasComponent = () => {
  const [isOpenVars, setIsOpenVars] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const currentLine = useRef(null);
  const currentShape = useRef(null);
  const palletGroup = useRef(null);
  const stageGroup = useRef(null);
  const lineGroup = useRef(null);
  const userVariables = useRef([]);

  let startX, startY;
  let startX1, startY1;
  let isDragging = false,
    isPalletShape = false,
    isOnEdge = false,
    isResizing = false,
    isDraggingLine = false;
  const connectShape1 = useRef(null),
    connectShape2 = useRef(null);

  useEffect(() => {
    initializeCanvas();
  }, []);

  function initializeCanvas() {
    const context1 = canvasRef.current.getContext('2d');

    context1.lineCap = 'round';
    context1.strokeStyle = 'black';
    context1.lineWidth = 3;
    // Initialize palette shapes; add to palette group
    const palletPentagon = new Shape(70, 115, 40, 30, 'pentagon', '#880e4f');
    const palletRectangle = new Shape(70, 165, 40, 30, 'rectangle', '#bf360c');
    const palletCircle = new Shape(70, 220, 40, 40, 'circle', '#0d47a1');
    const palletHexagon = new Shape(70, 275, 50, 30, 'hexagon', '#004d40');
    const palletParallelogram = new Shape(
      70,
      320,
      36,
      22,
      'parallelogram',
      '#4a148c'
    );
    const palletRoundedRectangle = new Shape(
      70,
      365,
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
      palletPentagon,
    ]);

    // Initialize stageGroup
    stageGroup.current = new Shapes('stage', []);
    // init lineGroup
    lineGroup.current = new Lines([]);

    contextRef.current = context1;

    clearAndDraw();
  }

  function clearAndDraw() {
    // clear canvas
    contextRef.current.clearRect(0, 0, window.innerWidth, window.innerHeight);
    contextRef.current.lineCap = 'round';
    contextRef.current.strokeStyle = 'black';
    contextRef.current.lineWidth = 2;
    // draw bg rectangle
    contextRef.current.strokeRect(30, 50, 80, 480);

    // draw shapes and lines
    palletGroup.current
      .getShapes()
      .forEach((el) => el.drawShape(contextRef.current));

    stageGroup.current
      .getShapes()
      .forEach((el) => el.drawShape(contextRef.current));

    lineGroup.current
      .getLines()
      .forEach((el) => el.connectPoints(contextRef.current));
  }

  function handleMouseMove(e) {
    e.preventDefault();
    let { clientX, clientY } = e;

    let tooltip = document.getElementById('my-tooltip');
    isOnEdge = false;
    if (isDragging) {
      // drag shape - mousemove
      let dx = clientX - startX;
      let dy = clientY - startY;
      let current_shape = currentShape.current;

      current_shape.x += dx;
      current_shape.y += dy;
      // change connected lines position also if present
      const posStart = lineGroup.current
        .getLines()
        .findIndex((el) => el.startItem === current_shape.text);
      if (posStart !== -1) {
        // dragged element is a line start item
        lineGroup.current
          .getLines()
          [posStart].setStartPoint(...currentShape.current.getExitPoint());
      }

      const posEnd = lineGroup.current
        .getLines()
        .findIndex((el) => el.endItem === current_shape.text);
      if (posEnd !== -1) {
        // dragged element is a line End item
        lineGroup.current
          .getLines()
          [posEnd].setEndPoint(...currentShape.current.getEntryPoint());
      }

      clearAndDraw();
      startX = clientX;
      startY = clientY;
      return;
    }

    if (isResizing) {
      //Change width, height - mousemove
      let dx = clientX - startX;
      let dy = clientY - startY;
      let current_shape = currentShape.current;
      let newWidth = Math.abs(current_shape.width + dx);
      let newHeight = Math.abs(current_shape.height + dy);
      if (newWidth < 40 || newHeight < 40) return;
      current_shape.width = newWidth;
      current_shape.height = newHeight;
      // change connected lines position also if present
      const posStart = lineGroup.current
        .getLines()
        .findIndex((el) => el.startItem === current_shape.text);
      if (posStart !== -1) {
        // resized element is a line start item
        lineGroup.current
          .getLines()
          [posStart].setStartPoint(...currentShape.current.getExitPoint());
      }

      const posEnd = lineGroup.current
        .getLines()
        .findIndex((el) => el.endItem === current_shape.text);
      if (posEnd !== -1) {
        // resized element is a line End item
        lineGroup.current
          .getLines()
          [posEnd].setEndPoint(...currentShape.current.getEntryPoint());
      }

      clearAndDraw();
      startX = clientX;
      startY = clientY;
      return;
    }

    if (isDraggingLine) {
      let dx = clientX - startX;
      let dy = clientY - startY;

      let current_line = currentLine.current;
      if (current_line.segments.length === 1) return;
      current_line.segments.at(-1).x1 += dx;
      current_line.segments.at(-1).y1 += dy;
      current_line.segments[0].x2 += dx;
      current_line.segments[0].y2 += dy;
      clearAndDraw();
      startX = clientX;
      startY = clientY;

      return;
    }

    if (isConnecting > 0) return;
    if (isDeleting) return;

    // reset cursor,tooltip; place tooltip on mouse pallet shape
    canvasRef.current.style.cursor = 'default';
    tooltip.style.visibility = 'hidden';
    palletGroup.current.getShapes().forEach((element) => {
      if (element.isMouseInShape(clientX, clientY)) {
        console.log(`YES in pallet shape ${element.type}`);
        canvasRef.current.style.cursor = 'grab';
        tooltip.style.top = element.y - element.height / 2 + 2 + 'px';
        tooltip.style.left = element.x + 45 + 'px';
        tooltip.textContent = element.text;
        tooltip.style.visibility = 'visible';
      }
    });
    // if mouse near left/right edge mid, change cursor; set isOnEdge
    stageGroup.current.getShapes().forEach((element) => {
      if (element.isMouseNearVertex(clientX, clientY)) {
        console.log('Mouse near vertex');
        canvasRef.current.style.cursor = 'w-resize';
        isOnEdge = true;
        currentShape.current = element;
        return;
      }
      // if in stage shape; change cursor to grab
      if (element.isMouseInShape(clientX, clientY)) {
        canvasRef.current.style.cursor = 'grab';
      }
    });
  }
  function handleMouseDown(e) {
    e.preventDefault();
    let { clientX, clientY } = e;
    console.log('🚀 ~ handleMouseDown ~ clientX, clientY', clientX, clientY);
    // if is onEdge mouseDown, set isResizing
    isResizing = false;
    if (isOnEdge) {
      isResizing = true;
      startX = clientX;
      startY = clientY;
      return;
    }

    //Check mouse in stage shape
    stageGroup.current.getShapes().forEach((element, i) => {
      if (element.isMouseInShape(clientX, clientY)) {
        if (isDeleting) {
          stageGroup.current.removeShape(i);
          clearAndDraw();
        }
        console.log(`YES in stage shape ${element.type}`);
        if (isConnecting === 1) {
          connectShape1.current = element;
          connectShape1.current.setSelected(true);
          clearAndDraw();
          setIsConnecting(2);
          return;
        }
        if (isConnecting === 2) {
          connectShape2.current = element;
          connectShape2.current.setSelected(true);
          clearAndDraw();
          setIsConnecting(0);
          connectShapes();
          return;
        }
        currentShape.current = element;
        isDragging = true;
        isPalletShape = false;
        startX = clientX;
        startY = clientY;
        startX1 = clientX;
        startY1 = clientY;
        return;
      }
    });

    // check mouse in palette shape
    palletGroup.current.getShapes().forEach((element) => {
      if (element.isMouseInShape(clientX, clientY)) {
        console.log(`YES in pallet shape ${element.type}`);
        setIsDeleting(false);
        setIsConnecting(0);
        canvasRef.current.style.cursor = 'grabbing';
        currentShape.current = element;
        isDragging = true;
        isPalletShape = true;
        startX = clientX;
        startY = clientY;
        return;
      }
    });

    // check mouse on line
    lineGroup.current.getLines().forEach((el, i) => {
      const linepoint = el.linepointNearestMouse(clientX, clientY);
      const distanceArray = [];
      const distanceSegmentsObj = {};

      linepoint.forEach((elm) => {
        let dx = clientX - elm.x;
        let dy = clientY - elm.y;
        // root of dx^2 + dy^2
        let distance = Math.abs(Math.sqrt(dx * dx + dy * dy));
        distanceArray.push(distance);
        distanceSegmentsObj[distance] = { x: elm.x, y: elm.y };
      });

      const minDistance = distanceArray.reduce(
        (prev, cur) => (prev < cur ? prev : cur),
        +Infinity
      );

      if (minDistance < 5) {
        console.log('mouse on line🐁');
        if (isDeleting) {
          lineGroup.current.removeLineIndex(i);
          clearAndDraw();
          return;
        }
        if (el.segments.length < 2) {
          el.addSegment(
            distanceSegmentsObj[minDistance].x,
            distanceSegmentsObj[minDistance].y
          );
        }
        isDraggingLine = true;
        startX = clientX;
        startY = clientY;
        el.dragCount++;
        currentLine.current = el;
        el.setColor('#1e88e5');
        clearAndDraw();
        return;
      }

      el.setColor('#424242');
      clearAndDraw();
      return;
    });
  }
  function handleMouseUp(e) {
    e.preventDefault();
    let { clientX, clientY } = e;
    isDragging = false;
    isDraggingLine = false;

    if (isPalletShape) {
      isPalletShape = false;
      // create new stage shape on dragdrop
      let palletFigureDragged = currentShape.current;
      let stageFigure;
      switch (palletFigureDragged.type) {
        case 'rectangle':
          stageFigure = new Shape(
            clientX,
            clientY,
            120,
            50,
            'rectangle',
            null,
            true
          );
          break;

        case 'circle':
          stageFigure = new Shape(
            clientX,
            clientY,
            120,
            120,
            'circle',
            null,
            true
          );
          break;

        case 'hexagon':
          stageFigure = new Shape(
            clientX,
            clientY,
            140,
            50,
            'hexagon',
            '#009688',
            true
          );
          break;

        case 'parallelogram':
          stageFigure = new Shape(
            clientX,
            clientY,
            120,
            50,
            'parallelogram',
            '#9c27b0',
            true
          );
          break;

        case 'roundedRectangle':
          stageFigure = new Shape(
            clientX,
            clientY,
            130,
            50,
            'roundedRectangle',
            '#c0ca33',
            true
          );
          break;

        case 'pentagon':
          stageFigure = new Shape(
            clientX,
            clientY,
            135,
            50,
            'pentagon',
            '#e91e63',
            true
          );
          break;
      }

      // reset pallet figure to pallet
      palletFigureDragged.x = palletFigureDragged.getInitPos()[0];
      palletFigureDragged.y = palletFigureDragged.getInitPos()[1];
      //add figure to stage
      if (clientX > 160) stageGroup.current.addShape(stageFigure);
      clearAndDraw();
      return;
    }

    if (isConnecting > 0) return;

    if (clientX == startX1 && clientY == startY1) {
      (startX1 = null), (startY1 = null);
      console.log('isDragging', isDragging);
      // mouse clicked, released same spot in stage shape, check mouse in stage shape
      stageGroup.current.getShapes().forEach((element) => {
        if (element.isMouseInShape(clientX, clientY)) {
          console.log(`YES in pallet shape mouseUp ${element.type}`);
          currentShape.current = element;
          currentShape.current.setSelected(true);
          clearAndDraw();
          setIsOpen(true);
          return;
        }
      });
    }
  }

  function handleCloseDrawer() {
    setIsOpen(false);
    clearAndDraw();
  }

  function setPalletArrowColor() {
    if (isConnecting === 0) return '#37474f';
    if (isConnecting === 1) return '#2e7d32';
    if (isConnecting === 2) return '#1565c0';
  }

  function connectShapes() {
    console.log('🚀 ~ connectShapes ~ connectShape1', connectShape1.current);
    console.log('🚀 ~ connectShapes ~ connectShape2', connectShape2.current);
    connectShape1.current.setSelected(false);
    connectShape2.current.setSelected(false);
    clearAndDraw();

    // return if connecting shapes same
    if (connectShape1.current === connectShape2.current) return;

    // return if shape2 default text
    if (
      [
        'playMenu',
        'playMessage',
        'function',
        'setParams',
        'getDigits',
        'callAPI',
      ].includes(connectShape2.current.text)
    )
      return;

    if (
      lineGroup.current
        .getLines()
        .some((el) => el.startItem === connectShape1.current.text)
    )
      // if connect shape1 already has connection, remove line
      lineGroup.current.removeLine(connectShape1.current.text);

    // set nextItem for shape1; create new line to connect shapes
    connectShape1.current.setNextItem(connectShape2.current.text);
    let newLine = new Line(
      ...connectShape1.current.getExitPoint(),
      ...connectShape2.current.getEntryPoint(),
      connectShape1.current.text,
      connectShape2.current.text
    );
    lineGroup.current.addLine(newLine);
    clearAndDraw();
  }

  return (
    <Box>
      <Typography
        sx={{
          mt: 2,
          alignItems: 'center',
          justifyContent: 'center',
          display: isDeleting ? 'flex' : 'none',
          fontSize: '1.2rem',
          color: '#00897b',
        }}
        variant='subtitle2'
      >
        <DeleteIcon /> Delete mode: Click on items to erase them
      </Typography>
      <Typography
        sx={{
          mt: 2,
          alignItems: 'center',
          justifyContent: 'center',
          display: isConnecting > 0 ? 'flex' : 'none',
          fontSize: '1.2rem',
          color: '#00897b',
        }}
        variant='subtitle2'
      >
        <ArrowRightAltIcon />
        Connect mode: Click on shapes to connect them.
        {isConnecting === 1 && ' Select shape 1'}
        {isConnecting === 2 && ' Select shape 2'}
      </Typography>

      <canvas
        style={{ position: 'absolute', left: 0, bottom: 0, zIndex: 5 }}
        width={window.innerWidth}
        height={window.innerHeight}
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      ></canvas>
      <Drawer anchor='right' open={isOpenVars}>
        <InitVariables
          handleCloseDrawer={() => {
            setIsOpenVars(false);
          }}
          userVariables={userVariables.current}
        />
      </Drawer>
      <DrawerComponent
        isOpen={isOpen}
        handleCloseDrawer={handleCloseDrawer}
        shape={currentShape.current}
        userVariables={userVariables.current}
        stageGroup={stageGroup.current}
      />
      <Tooltip title='connect shapes' placement='right-end'>
        <ArrowRightAltIcon
          sx={{
            position: 'absolute',
            left: 32,
            top: 440,
            zIndex: 5,
            width: 75,
            fontSize: isConnecting === 0 ? '3rem' : '3.5rem',
            color: setPalletArrowColor(),
          }}
          onClick={() => {
            !isDeleting && isConnecting === 0 && setIsConnecting(1);
            isConnecting > 0 && setIsConnecting(0);
            canvasRef.current.style.cursor = 'crosshair';
          }}
        />
      </Tooltip>
      <Tooltip title='remove item' placement='right-end'>
        <DeleteIcon
          sx={{
            position: 'absolute',
            left: 32,
            top: 481,
            zIndex: 5,
            width: 75,
            color: isDeleting ? '#2e7d32' : '#37474f',
            fontSize: isDeleting ? '2.5rem' : '2rem',
            boxShadow: isDeleting ? 1 : 0,
            borderRadius: 2,
            backgroundColor: isDeleting && '#ffcdd2',
          }}
          onClick={() => {
            !isConnecting && setIsDeleting(!isDeleting);
            console.log('is deleting', isDeleting);
            canvasRef.current.style.cursor = 'pointer';
          }}
        />
      </Tooltip>
      <Tooltip title='InitVariables' placement='right-end'>
        <Button
          sx={{
            position: 'absolute',
            left: 32,
            top: 55,
            zIndex: 5,
            width: 75,
          }}
          size='small'
          variant='outlined'
          color='info'
          onClick={() => {
            setIsOpenVars(true);
          }}
        >
          Variables
        </Button>
      </Tooltip>
      <Typography
        sx={{
          visibility: 'hidden',
          position: 'absolute',
          zIndex: 6,
          backgroundColor: '#e1f5fe',
          px: 1,
          boxShadow: 1,
        }}
        id='my-tooltip'
        variant='subtitle2'
      >
        Im a tooltip
      </Typography>
    </Box>
  );
};

export default CanvasComponent;
