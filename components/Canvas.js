import { useEffect, useRef, useState } from 'react';

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const circle = {
    x: 50,
    y: 150,
    size: 15,
    dx: 5,
    dy: 4,
  };

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
    //draw pallet rectangle
    contextRef.current.fillStyle = 'purple';
    contextRef.current.fillRect(35, 200, 30, 20);

    //draw pallet circle
    drawCircle();
  }

  const startDrawing = ({ nativeEvent: { offsetX, offsetY } }) => {
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };
  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };
  function drawCircle() {
    contextRef.current.beginPath();
    contextRef.current.fillStyle = 'purple';
    contextRef.current.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);

    contextRef.current.fill();
  }
  const draw = ({ nativeEvent: { offsetX, offsetY } }) => {
    if (!isDrawing) return;

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };
  function update(params) {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    drawCircle();

    circle.x += circle.dx;

    if (
      circle.x + circle.size > canvasRef.current.width ||
      circle.x - circle.size < 0
    ) {
      circle.dx *= -1;
    }

    setTimeout(() => {}, 5000);

    requestAnimationFrame(update);
  }

  return (
    <canvas
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      ref={canvasRef}
    ></canvas>
  );
};

export default CanvasComponent;
