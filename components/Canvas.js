import { useEffect, useRef, useState } from 'react';
import Shape from './Shape';
import Shapes from './Shapes';

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  let isDragging = false;

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
    palletRectangle.drawShape(contextRef.current);
    palletCircle.drawShape(contextRef.current);
  }

  const mouseDown = ({ nativeEvent }) => {
    let { offsetX, offsetY } = nativeEvent;
    // contextRef.current.beginPath();
    // contextRef.current.moveTo(offsetX, offsetY);
    nativeEvent.preventDefault();
    shapeGroup.getShapes().forEach((element) => {
      if (element.isMouseInShape(offsetX, offsetY)) {
        console.log(`YES in shape ${element.type}`);
        isDragging = true;
      } else console.log('NO');
    });
  };
  const mouseUp = ({ nativeEvent }) => {
    if (!isDragging) return;

    nativeEvent.preventDefault();
    isDragging = false;
  };
  const mouseOut = ({ nativeEvent }) => {
    if (!isDragging) return;

    nativeEvent.preventDefault();
    isDragging = false;
  };

  function mouseMove() {
    console.log('moving');
  }

  //   function update(params) {
  //     contextRef.current.clearRect(
  //       0,
  //       0,
  //       canvasRef.current.width,
  //       canvasRef.current.height
  //     );
  //     mouseMoveCircle();

  //     circle.x += circle.dx;

  //     if (
  //       circle.x + circle.size > canvasRef.current.width ||
  //       circle.x - circle.size < 0
  //     ) {
  //       circle.dx *= -1;
  //     }

  //     setTimeout(() => {}, 5000);

  //     requestAnimationFrame(update);
  //   }

  return (
    <canvas
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseMove={() => {
        console.log('movingggg');
      }}
      onMouseDown={() => {
        console.log('hsaha');
      }}
      onMouseUp={mouseUp}
      onMouseOut={mouseOut}
      ref={canvasRef}
    ></canvas>
  );
};

export default CanvasComponent;
