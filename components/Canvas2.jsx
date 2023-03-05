import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import {Menu, MenuItem, Typography} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import Shape from '../newModels/Shape';
import {
  alignAllShapes,
  drawFilledArrow,
  drawGridLines2,
  getConnectingLines,
} from '../src/myFunctions';
import ElementDrawer from './ElementDrawer';

const CanvasTest = ({toolBarObj, resetSelectedItemToolbar}) => {
  const [shapes, setShapes] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [isOpenElementDrawer, setIsOpenElementDrawer] = useState(false);
  const [connectingMode, setConnectingMode] = useState(0);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isToolBarItemSelected = Object.values(toolBarObj)[0];
  const selectedItemToolbar = isToolBarItemSelected
    ? Object.keys(toolBarObj)[0]
    : null;

  const shapeCount = useRef({
    setParams: 1,
    runScript: 1,
    callAPI: 1,
    playMenu: 1,
    getDigits: 1,
    playMessage: 1,
    playConfirm: 1,
    switch: 1,
    endFlow: 1,
    connector: 1,
    jumper: 1,
    module: 1,
  });
  const currentShape = useRef(null);
  const isDragging = useRef(false);

  const connectingShapes = useRef(null);

  const selectedShapes = useRef(null);
  const contextMenuItem = useRef(null);

  let startX, startY;

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    contextRef.current = context;
    clearAndDraw();
  }, [shapes]);

  function clearAndDraw() {
    const ctx = contextRef.current;
    clearCanvas();
    drawGridLines2(contextRef.current, canvasRef.current);
    shapes.forEach((shape) => shape.drawShape(ctx));
    const connectionsArray = getConnectingLines(shapes);
    connectionsArray.forEach((c) =>
      drawFilledArrow(contextRef.current, c.x1, c.y1, c.x2, c.y2)
    );
  }
  function clearCanvas() {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  }

  function addNewShape(x, y, type) {
    // to add a new shape to state variable
    const count = shapeCount.current[type]++;
    const newShape = new Shape(x, y, type);
    newShape.setTextAndId(count);
    setShapes([...shapes, newShape]);
  }

  function deleteShape(shapeToDelete) {
    const index = shapes.indexOf(shapeToDelete);
    if (index !== -1) {
      const newShapes = [...shapes];
      newShapes.splice(index, 1);
      setShapes(newShapes);
    }
  }

  function getRealCoordinates(clientX, clientY) {
    const boundingRect = canvasRef.current.getBoundingClientRect();
    const realX = clientX - boundingRect.left;
    const realY = clientY - boundingRect.top;
    return {realX, realY};
  }

  function handleMouseDown(e) {
    e.preventDefault();
    const {clientX, clientY, button} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);

    if (selectedItemToolbar && button === 0) {
      addNewShape(realX, realY, selectedItemToolbar);
      resetSelectedItemToolbar();
      return;
    }

    for (const shape of shapes) {
      console.log('in loop', shape, realX, realY);
      if (shape.isMouseInShape(realX, realY)) {
        const exitPoint = shape.isMouseNearExitPoint(realX, realY);
        if (exitPoint && connectingMode === 0) {
          connectingShapes.current = {};
          connectingShapes.current.shape1 = shape;
          connectingShapes.current.exitPoint = exitPoint;
          setConnectingMode(1);
          return;
        }
        if (connectingMode === 1) {
          connectingShapes.current.shape2 = shape;
          if (
            connectingShapes.current.shape2 !== connectingShapes.current.shape1
          ) {
            connectingShapes.current.shape1.nextItem =
              connectingShapes.current.shape2;
          }

          setConnectingMode(0);
          connectingShapes.current = null;
          clearAndDraw();
          return;
        }

        isDragging.current = true;
        currentShape.current = shape;
        startX = realX;
        startY = realY;
        return;
      }
    }

    if (button === 0) {
      if (connectingMode == 1) {
        // reset connection if clicked in workspace while connecting
        connectingShapes.current.shape1.nextItem = null;
      }
      setConnectingMode(0);
      connectingShapes.current = null;
      resetSelectedElement();
    }
  }

  function handleMouseUp(e) {
    e.preventDefault();
    // Reset dragging mode
    isDragging.current = false;
    alignAllShapes(shapes, setShapes);
  }

  function handleMouseMove(e) {
    e.preventDefault();
    const {clientX, clientY} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);

    if (selectedItemToolbar) {
      clearAndDraw();
      const tempShape = new Shape(realX, realY, selectedItemToolbar);
      tempShape.drawShape(contextRef.current);
      return;
    }

    if (isDragging.current) {
      const draggingShape = currentShape.current;
      const dx = realX - startX;
      const dy = realY - startY;

      const MIN_X = 85;
      const MAX_X = canvasRef.current.width;
      const MIN_Y = 60;
      const MAX_Y = canvasRef.current.height;

      const inBoundsX =
        draggingShape.x + dx - draggingShape.width / 2 > MIN_X &&
        draggingShape.x + dx + draggingShape.width / 2 < MAX_X;
      const inBoundsY =
        draggingShape.y + dy - draggingShape.height / 2 > MIN_Y &&
        draggingShape.y + dy + draggingShape.height / 2 < MAX_Y;

      if (inBoundsX && inBoundsY) {
        draggingShape.x += dx || 0;
        draggingShape.y += dy || 0;

        clearAndDraw();
        startX = realX;
        startY = realY;
      }
      return;
    }

    if (connectingMode == 1) {
      const shape1 = connectingShapes.current.shape1;
      let x1, y1;
      if (['connector', 'endFlow', 'jumper'].includes(shape1.type)) {
        [x1, y1] = shape1.getCircularCoordinates(realX, realY);
      } else {
        [x1, y1] = shape1.getBottomCoordinates();
      }

      clearAndDraw();
      drawFilledArrow(contextRef.current, x1, y1, realX, realY);
    }

    if (connectingMode === 0) {
      canvasRef.current.style.cursor = 'default';
      for (const shape of shapes) {
        if (shape.isMouseInShape(realX, realY)) {
          canvasRef.current.style.cursor = 'pointer';
          if (shape.isMouseNearExitPoint(realX, realY)) {
            canvasRef.current.style.cursor = 'crosshair';
          }
          break;
        }
      }
    }
  }

  function handleContextMenu(e) {
    e.preventDefault();
    const {clientX, clientY} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);
    if (selectedItemToolbar) return;

    for (const shape of shapes) {
      if (shape.isMouseInShape(realX, realY)) {
        if (!contextMenuItem.current) {
          let items = ['Settings', 'Cut', 'Copy', 'Delete'];
          if (shape.type === 'connector') {
            // no settings for connector
            items.splice(0, 1);
          }

          setContextMenu(
            contextMenu === null
              ? {
                  mouseX: realX,
                  mouseY: realY,
                  items: items,
                }
              : null
          );
        }
        resetSelectedElement();
        return;
      }
    }

    if (contextMenuItem.current) {
      let items = ['Paste'];
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: realX,
              mouseY: realY,
              items: items,
            }
          : null
      );
    }
  }

  function handleContextMenuClick(e, item) {
    e.preventDefault();
    const {clientX, clientY} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);
    setContextMenu(null);

    console.log('item clicked: ' + item);

    if (item === 'Settings') {
      handleContextSettings();
      return;
    }

    if (item === 'Delete') {
      handleContextDelete();
      return;
    }

    if (item === 'Cut') {
      currentShape.current.setSelected(true);
      contextMenuItem.current = 'Cut';
      selectedShapes.current = [];
      selectedShapes.current.push(currentShape.current);
      clearAndDraw();
      return;
    }
    if (item === 'Copy') {
      currentShape.current.setSelected(true);
      selectedShapes.current = [];
      selectedShapes.current.push(currentShape.current);
      contextMenuItem.current = 'Copy';
      clearAndDraw();
      return;
    }

    if (item === 'Paste') {
      if (contextMenuItem.current == 'Copy') {
        handleContextCopyPaste(realX, realY);
      } else if (contextMenuItem.current == 'Cut') {
        handleContextCutPaste(realX, realY);
      }
    }
  }

  function handleContextSettings() {
    const shape = currentShape.current;

    if (shape.type !== 'connector') {
      console.log('Current shape: ' + JSON.stringify(shape, null, 2));

      shape.setSelected(true);
      setIsOpenElementDrawer(true);
      clearAndDraw();
    }
  }

  function handleContextDelete() {
    deleteShape(currentShape.current);
    currentShape.current = null;
  }
  function handleContextCopyPaste(realX, realY) {
    const currShape = selectedShapes.current[0];
    const offsetX = realX - currShape.x;
    const offsetY = realY - currShape.y;

    const newShape = currShape.copyShape(
      shapeCount.current,
      shapes,
      offsetX,
      offsetY
    );

    setShapes([...shapes, newShape]);
    resetSelectedElement();
  }
  function handleContextCutPaste(realX, realY) {
    const currShape = selectedShapes.current[0];
    const offsetX = realX - currShape.x;
    const offsetY = realY - currShape.y;
    currShape.x += offsetX;
    currShape.y += offsetY;

    resetSelectedElement();
  }

  function resetSelectedElement() {
    contextMenuItem.current = null;
    if (selectedShapes.current) {
      selectedShapes.current.forEach((shape) => shape.setSelected(false));
    }
    selectedShapes.current = null;
    clearAndDraw();
  }

  function handleCloseElementDrawer() {
    console.log('closee');
    setIsOpenElementDrawer(false);
    currentShape.current.setSelected(false);
    clearAndDraw();
  }

  return (
    <>
      <canvas
        style={{
          backgroundColor: '#EFF7FD',
          cursor: isToolBarItemSelected
            ? 'none'
            : connectingMode > 0
            ? 'crosshair'
            : 'default',
        }}
        height={2 * window.innerHeight}
        width={window.innerWidth - 20}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onContextMenu={handleContextMenu}
        ref={canvasRef}
      />
      <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClick}
        anchorReference='anchorPosition'
        anchorPosition={
          contextMenu !== null
            ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
            : undefined
        }
        PaperProps={{
          style: {
            backgroundColor: '#CCCCCC',
          },
        }}>
        {contextMenu?.items.map((item, i) => (
          <MenuItem
            key={i}
            sx={{display: 'flex', alignItems: 'center'}}
            onClick={(e) => handleContextMenuClick(e, item)}>
            {item === 'Settings' && <SettingsIcon sx={{fontSize: '13px'}} />}
            {item === 'Cut' && <ContentCutIcon sx={{fontSize: '13px'}} />}
            {item === 'Copy' && <ContentCopyIcon sx={{fontSize: '13px'}} />}
            {item === 'Delete' && <DeleteIcon sx={{fontSize: '13px'}} />}
            {item === 'Paste' && <ContentPasteIcon sx={{fontSize: '13px'}} />}
            <Typography sx={{ml: 0.5}} fontSize='13px' variant='caption'>
              {item}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
      <ElementDrawer
        shape={currentShape.current}
        shapes={shapes}
        isOpen={isOpenElementDrawer}
        handleCloseDrawer={handleCloseElementDrawer}
        clearAndDraw={clearAndDraw}
      />
    </>
  );
};

export default CanvasTest;
