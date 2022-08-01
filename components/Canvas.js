import { StayPrimaryPortraitTwoTone } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import Shape from './Shape';
import Shapes from './Shapes';

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  let isDragging = false;
  let current_shape_index = null;
  let startX, startY;

  let palletRectangle = new Shape(35, 100, 30, 20, 'rectangle');
  let palletCircle = new Shape(50, 150, 30, 30, 'circle');
  let shapeGroup = new Shapes('palette', [palletRectangle, palletCircle]);

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
    drawOnFirstRender();
    //update();
  }, []);

  function drawOnFirstRender() {
    contextRef.current.clearRect(0, 0, window.innerWidth, window.innerHeight);
    shapeGroup.getShapes().forEach((el) => {
      el.drawShape(contextRef.current);
    });
  }

  function handleMouseDown({ nativeEvent }) {
    let { offsetX, offsetY, clientX, clientY } = nativeEvent;
    nativeEvent.preventDefault();

    shapeGroup.getShapes().forEach((element, i) => {
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
    if (!isDragging) return;

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
      let current_shape = shapeGroup.getShapes()[current_shape_index];
      current_shape.x += dx;
      current_shape.y += dy;
      drawOnFirstRender();
      startX = mouseX;
      startY = mouseY;
    }
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
