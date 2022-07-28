import { Stage, Layer, Rect, Circle, Text } from 'react-konva';
import Konva from 'konva';
import { useState, useRef, useEffect } from 'react';

const StageComponent = () => {
  const [circles, setCircles] = useState([]);
  const [currentCircle, setCurrentCircle] = useState(null);
  const stageRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (currentCircle) {
      var circle = new Konva.Circle({
        x: currentCircle.x,
        y: currentCircle.y,
        radius: 60,
        stroke: 'black',
        strokeWidth: 3,
      });
      layerRef.current.add(circle);
      layerRef.current.draw();
    }
  }, [currentCircle]);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
      <Layer ref={layerRef}>
        <Circle
          name='draggableCircle'
          x={50}
          y={150}
          radius={15}
          fill='green'
          draggable
          onDragEnd={(e) => {
            setCurrentCircle({ x: e.target.x(), y: e.target.y(), fill: 'red' });
            setCircles((prevCircles) => [
              ...prevCircles,
              { x: e.target.x(), y: e.target.y(), fill: 'red' },
            ]);

            //return circle to original position
            //  dot (.) before "draggableCircle"
            var stage = stageRef.current;
            var draggableCircle = stage.findOne('.draggableCircle');
            draggableCircle.position({ x: 50, y: 150 });
          }}
        />
      </Layer>
    </Stage>
  );
};

export default StageComponent;
