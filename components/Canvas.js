import { useEffect, useRef, useState } from 'react';

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 5;

    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent: { offsetX, offsetY } }) => {
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };
  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };
  const draw = ({ nativeEvent: { offsetX, offsetY } }) => {
    if (!isDrawing) return;

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

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
