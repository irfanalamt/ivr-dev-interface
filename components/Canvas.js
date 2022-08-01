import { Button, Container } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Shape from './Shape';
import Shapes from './Shapes';

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  let isDragging = false;
  let current_shape_index = null;
  let startX, startY;
  let initX, initY;

  let palletRectangle = new Shape(35, 150, 60, 40, 'rectangle', 'red');
  let palletCircle = new Shape(65, 250, 30, 30, 'circle', 'blue');
  let shapeGroup1 = new Shapes('palette', [palletRectangle, palletCircle]);
  let shapeGroup2 = new Shapes('stage', []);

  //   const circle = {
  //     x: 50,
  //     y: 150,
  //     width: 34,
  //     height: 67,
  //   };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 3;

    contextRef.current = context;

    clearAndDraw();
  }, []);

  function clearAndDraw() {
    contextRef.current.clearRect(0, 0, window.innerWidth, window.innerHeight);
    shapeGroup1.getShapes().forEach((el) => {
      el.drawShape(contextRef.current);
    });
  }

  function handleMouseDown({ nativeEvent }) {
    let { offsetX, offsetY, clientX, clientY } = nativeEvent;
    nativeEvent.preventDefault();

    shapeGroup1.getShapes().forEach((element, i) => {
      if (element.isMouseInShape(offsetX, offsetY)) {
        console.log(`YES in shape ${element.type}`);
        current_shape_index = i;
        startX = clientX;
        startY = clientY;
        isDragging = true;
      } else console.log('NO');
    });
  }
  function handleMouseUp({ nativeEvent }) {
    let { offsetX, offsetY } = nativeEvent;
    if (!isDragging) return;
    // we only have two pallet items
    else if (current_shape_index < 2) {
      console.log('mouse up while dragging pallet');
      let palletFigureDragged = shapeGroup1.getShapes()[current_shape_index];
      let stageFigure;
      if (current_shape_index === 0) {
        stageFigure = new Shape(
          offsetX,
          offsetY,
          120,
          80,
          'rectangle',
          null,
          true
        );
      } else if (current_shape_index === 1) {
        stageFigure = new Shape(offsetX, offsetY, 60, 60, 'circle', null, true);
      }
      let current_shape = shapeGroup1.getShapes()[current_shape_index];
      current_shape.x = palletFigureDragged.getInitPos()[0];
      current_shape.y = palletFigureDragged.getInitPos()[1];
      shapeGroup1.addShape(stageFigure);
      clearAndDraw();
      stageFigure.drawShape(contextRef.current);
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
      let current_shape = shapeGroup1.getShapes()[current_shape_index];
      current_shape.x += dx;
      current_shape.y += dy;
      clearAndDraw();
      startX = mouseX;
      startY = mouseY;
    }
  }
  function handleTest() {
    let testShape = new Shape(
      window.innerWidth - 10,
      100,
      60,
      40,
      'rectangle',
      'green'
    );
    testShape.drawShape(contextRef.current);
  }

  return (
    <canvas
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      ref={canvasRef}
    ></canvas>
  );
};

export default CanvasComponent;
