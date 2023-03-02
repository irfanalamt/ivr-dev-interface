import {Button} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import Shape from '../newModels/Shape';

const CanvasTest = ({toolBarObj, resetSelectedItemToolbar}) => {
  const [shapes, setShapes] = useState([]);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isToolBarItemSelected = Object.values(toolBarObj)[0];
  const selectedItemToolbar = isToolBarItemSelected
    ? Object.keys(toolBarObj)[0]
    : null;

  const currentShape = useRef(null);
  const isDragging = useRef(false);

  let startX, startY;

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    contextRef.current = context;
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

    const newShape = new Shape(x, y, type);
    setShapes([...shapes, newShape]);
  }

  function getRealCoordinates(clientX, clientY) {
    const boundingRect = canvasRef.current.getBoundingClientRect();
    const realX = clientX - boundingRect.left;
    const realY = clientY - boundingRect.top;
    return {realX, realY};
  }

  function handleMouseDown(e) {
    e.preventDefault();
    const {clientX, clientY} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);

    if (selectedItemToolbar) {
      addNewShape(realX, realY, selectedItemToolbar);
      resetSelectedItemToolbar();
    }

    for (const shape of shapes) {
      console.log('in loop', shape, realX, realY);
      if (shape.isMouseInShape(realX, realY)) {
        console.log('mouseInShape');
        isDragging.current = true;
        currentShape.current = shape;
        startX = realX;
        startY = realY;
        break;
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

      draggingShape.x += dx || 0;
      draggingShape.y += dy || 0;

      clearAndDraw();
      startX = realX;
      startY = realY;
    }
  }

  return (
    <canvas
      style={{
        backgroundColor: '#EFF7FD',
        cursor: isToolBarItemSelected ? 'crosshair' : 'default',
      }}
      height={2 * window.innerHeight}
      width={window.innerWidth - 20}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      ref={canvasRef}
    />
  );
};

export default CanvasTest;
