import { Stage, Layer, Rect, Circle, Text } from 'react-konva';
import Konva from 'konva';
import { useState } from 'react';

const StageComponent = () => {
  const [stageState, setStageState] = useState({
    isDragging: false,
    x: 50,
    y: 50,
  });

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Rect width={50} height={50} fill='red' />
        <Circle x={200} y={200} stroke='black' radius={50} />
        <Text
          text='Draggable Text'
          x={stageState.x}
          y={stageState.y}
          draggable
          fill={stageState.isDragging ? 'green' : 'black'}
          onDragStart={() => {
            setStageState({
              isDragging: true,
            });
          }}
          onDragEnd={(e) => {
            setStageState({
              isDragging: false,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
        />
      </Layer>
    </Stage>
  );
};

export default StageComponent;
