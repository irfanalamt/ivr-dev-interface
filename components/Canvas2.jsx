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

    if (selectedItemToolbar) addNewShape(realX, realY, selectedItemToolbar);
    console.log('selectedItem: ' + selectedItemToolbar);
    resetSelectedItemToolbar();
  }

  function handleMouseMove(e) {
    const {clientX, clientY} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);

    if (selectedItemToolbar) {
      clearAndDraw();
      const tempShape = new Shape(realX, realY, selectedItemToolbar);
      tempShape.drawShape(contextRef.current);
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
      onMouseMove={handleMouseMove}
      ref={canvasRef}
    />
  );
};

export default CanvasTest;
