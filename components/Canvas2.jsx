import {Button, Menu, MenuItem, Typography} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import Shape from '../newModels/Shape';
import ElementDrawer from './ElementDrawer';

const CanvasTest = ({toolBarObj, resetSelectedItemToolbar}) => {
  const [shapes, setShapes] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [isOpenElementDrawer, setIsOpenElementDrawer] = useState(false);

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

  let startX, startY;

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    contextRef.current = context;
    clearAndDraw();
  }, [shapes]);

  function clearAndDraw() {
    const ctx = contextRef.current;
    clearCanvas();
    shapes.forEach((shape) => {
      shape.drawShape(ctx);
    });
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
    newShape.text += count;
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
        console.log('mouseInShape');
        isDragging.current = true;
        currentShape.current = shape;
        startX = realX;
        startY = realY;
        return;
      }
    }
  }

  function handleMouseUp(e) {
    e.preventDefault();
    // Reset dragging mode
    isDragging.current = false;
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

    canvasRef.current.style.cursor = 'default';
    for (const shape of shapes) {
      if (shape.isMouseInShape(realX, realY)) {
        canvasRef.current.style.cursor = 'pointer';
        break;
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
        let items = ['Settings', 'Cut', 'Copy', 'Delete'];
        if (shape.type === 'connector') {
          // no settings for connector
          items.splice(0, 1);
        }

        // contextMenuItem.current = null;
        // clearAndDraw();
        setContextMenu(
          contextMenu === null
            ? {
                mouseX: realX,
                mouseY: realY,
                items: items,
              }
            : null
        );
        break;
      }
    }
  }

  function handleContextMenuClick(item) {
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

    // if (item === 'Cut') {
    //   // selectedShapes.current.forEach((shape) =>
    //   //   stageGroup.current[pageNumber.current - 1].removeShape(shape.id)
    //   // );
    //   if (!multiSelectEndPoint.current) {
    //     selectedShapes.current = [];
    //     selectedShapes.current.push(currentShape.current);
    //     currentShape.current.setSelected(true);
    //   }
    //   selectedShapes.current.cutPage = pageNumber.current;
    //   contextMenuItem.current = 'Cut';
    //   clearAndDraw();
    //   return;
    // }

    // if (item === 'Copy') {
    //   if (!multiSelectEndPoint.current) {
    //     selectedShapes.current = [];
    //     selectedShapes.current.push(currentShape.current);
    //     currentShape.current.setSelected(true);
    //   }
    //   contextMenuItem.current = 'Copy';
    //   clearAndDraw();
    //   return;
    // }

    // if (item === 'Paste') {
    //   if (contextMenuItem.current == 'Copy') {
    //     handleContextCopyPaste(realX, realY);
    //   } else if (contextMenuItem.current == 'Cut') {
    //     handleContextCutPaste(realX, realY);
    //   }
    // }
    // contextMenuItem.current = null;
  }

  function handleContextSettings() {
    const shape = currentShape.current;
    if (shape.type !== 'connector') {
      console.log('Current shape: ' + JSON.stringify(shape, null, 2));

      shape.setSelected(true);
      setIsOpenElementDrawer(true);
    }
  }

  function handleContextDelete() {
    deleteShape(currentShape.current);
    currentShape.current = null;
  }

  function handleCloseElementDrawer() {
    console.log('closee');
    setIsOpenElementDrawer(false);
    currentShape.current.setSelected(false);
  }

  return (
    <>
      <canvas
        style={{
          backgroundColor: '#EFF7FD',
          cursor: isToolBarItemSelected ? 'none' : 'default',
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
        }>
        {contextMenu?.items.map((item, i) => (
          <MenuItem
            sx={{display: 'flex', alignItems: 'center'}}
            onClick={() => handleContextMenuClick(item)}
            key={i}>
            <Typography sx={{fontSize: 'small'}} variant='button'>
              {item}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
      <ElementDrawer
        shape={currentShape.current}
        isOpen={isOpenElementDrawer}
        handleCloseDrawer={handleCloseElementDrawer}
      />
    </>
  );
};

export default CanvasTest;
