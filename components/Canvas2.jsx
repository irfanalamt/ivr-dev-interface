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
  drawMultiSelectRect,
  getConnectingLines,
  isPointInRectangle,
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

  const isMultiSelectMode = useRef(false);
  const drawnMultiSelectRectangle = useRef(null);

  const multiSelectDragStart = useRef(null);

  let startX = 0,
    startY = 0;

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    contextRef.current = context;
    clearAndDraw();
  }, [shapes]);

  function clearAndDraw() {
    const ctx = contextRef.current;
    clearCanvas();
    drawGridLines2(contextRef.current, canvasRef.current);

    const connectionsArray = getConnectingLines(shapes);
    connectionsArray.forEach((c) =>
      drawFilledArrow(contextRef.current, c.x1, c.y1, c.x2, c.y2)
    );
    shapes.forEach((shape) => shape.drawShape(ctx));
    if (drawnMultiSelectRectangle.current) {
      console.log('is drawing multii📍');
      const {x, y, width, height} = drawnMultiSelectRectangle.current;

      drawMultiSelectRect(ctx, x, y, width, height);
    }
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
    if (button !== 0) return;

    if (selectedItemToolbar) {
      addNewShape(realX, realY, selectedItemToolbar);
      resetSelectedItemToolbar();
      return;
    }

    if (drawnMultiSelectRectangle.current) {
      // check if mouse down outside rect; reset this
      // if in, prepare to move the whole damn thing with the selected shapes.

      if (isPointInRectangle(realX, realY, drawnMultiSelectRectangle.current)) {
        // task2

        multiSelectDragStart.current = {x: realX, y: realY};
      } else {
        // reset it
        resetMultiSelect();
      }

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

        isDragging.current = true;
        currentShape.current = shape;
        startX = realX;
        startY = realY;
        return;
      }
    }

    if (button === 0) {
      resetSelectedElement();

      if (connectingMode === 0) {
        // for multi select
        isMultiSelectMode.current = true;
        startX = realX;
        startY = realY;
      }
    }
  }

  function handleMouseUp(e) {
    e.preventDefault();
    const {clientX, clientY, button} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);
    // Reset dragging mode
    isDragging.current = false;

    //stop drawing
    isMultiSelectMode.current = false;

    if (multiSelectDragStart.current) {
      multiSelectDragStart.current = false;
      return;
    }

    if (connectingMode === 1) {
      shapes.forEach((shape) => {
        if (shape.isMouseInShape(realX, realY)) {
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
      });

      if (connectingShapes.current)
        connectingShapes.current.shape1.nextItem = null;
      setConnectingMode(0);
      connectingShapes.current = null;
    }

    if (drawnMultiSelectRectangle.current) {
      // if rect drawn, if shapes in multi rect-> set to selected
      // no shapes selected-> reset multi selection

      const {x, y, width, height} = drawnMultiSelectRectangle.current;

      let x1 = x;
      let y1 = y;
      let x2 = x + width;
      let y2 = y + height;

      // Swap coordinates if width or height is negative
      if (width < 0) {
        x1 = x + width;
        x2 = startX;
      }
      if (height < 0) {
        y1 = y + height;
        y2 = y;
      }

      drawnMultiSelectRectangle.current = {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1,
      };

      selectedShapes.current = shapes.filter((shape) =>
        shape.isInRectangle(x, y, width, height)
      );
      if (selectedShapes.current.length) {
        selectedShapes.current.forEach((shape) => shape.setSelected(true));
        clearAndDraw();
      } else {
        // reset multi select if no shapes bound

        resetMultiSelect();
      }
    }

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

    if (multiSelectDragStart.current) {
      let offsetX = realX - multiSelectDragStart.current.x;
      let offsetY = realY - multiSelectDragStart.current.y;

      drawnMultiSelectRectangle.current.x += offsetX;
      drawnMultiSelectRectangle.current.y += offsetY;

      selectedShapes.current.forEach((shape) => {
        shape.x += offsetX;
        shape.y += offsetY;
      });

      clearAndDraw();

      multiSelectDragStart.current.x = realX;
      multiSelectDragStart.current.y = realY;
    }

    if (isMultiSelectMode.current) {
      if (!drawnMultiSelectRectangle.current) {
        drawnMultiSelectRectangle.current = {
          x: startX,
          y: startY,
          width: realX - startX,
          height: realY - startY,
        };
      } else {
        // rectangle already there

        drawnMultiSelectRectangle.current.x = startX;
        drawnMultiSelectRectangle.current.y = startY;
        drawnMultiSelectRectangle.current.width = realX - startX;

        drawnMultiSelectRectangle.current.height = realY - startY;
      }

      clearAndDraw();
    }

    if (connectingMode == 1) {
      // draw connecting arrow from shape1
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
      // change cursor when in element and near exit point
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

    if (drawnMultiSelectRectangle.current) {
      if (isPointInRectangle(realX, realY, drawnMultiSelectRectangle.current)) {
        let items = ['Cut', 'Copy', 'Delete'];
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

      return;
    }

    for (const shape of shapes) {
      if (shape.isMouseInShape(realX, realY)) {
        if (!contextMenuItem.current) {
          currentShape.current = shape;
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

  function resetMultiSelect() {
    selectedShapes.current.forEach((shape) => shape.setSelected(false));
    selectedShapes.current = null;
    drawnMultiSelectRectangle.current = null;
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
