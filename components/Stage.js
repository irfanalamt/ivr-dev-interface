import { Stage, Layer, Rect, Circle, Text } from 'react-konva';
import Konva from 'konva';
import { useState, useRef, useEffect } from 'react';
import { Button, Container } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';
import raw from '../figures.json';

const StageComponent = () => {
  const [circles, setCircles] = useState([]);
  const [currentFigure, setCurrentFigure] = useState(null);
  const stageRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (currentFigure) {
      switch (currentFigure.type) {
        case 'circle':
          addCircle();
          break;

        case 'rectangle':
          addRectangle();
          break;
      }
    }
  }, [currentFigure]);

  const addCircle = () => {
    var circle = new Konva.Circle({
      x: currentFigure.x,
      y: currentFigure.y,
      radius: 60,
      stroke: 'green',
      strokeWidth: 3,
    });
    layerRef.current.add(circle);
    layerRef.current.draw();
  };

  const addRectangle = () => {
    var rectangle = new Konva.Rect({
      x: currentFigure.x,
      y: currentFigure.y,
      height: 100,
      width: 150,
      stroke: 'blue',
      strokeWidth: 3,
    });
    layerRef.current.add(rectangle);
    layerRef.current.draw();
  };
  const handleClickReset = () => {
    layerRef.current.destroyChildren();
  };
  const handleClickJson = () => {
    console.log('aaa');
    axios
      .post('/api/saveFigures', {
        msg: layerRef.current.toJSON(),
      })
      .then((result) => {
        console.log(result.data.message);
        alert(result.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClickLoadFile = () => {
    fetch('/api/getFigures')
      .then((res) => res.json())
      .then((data) => {
        console.log(JSON.stringify(data));
        var stage = Konva.Node.create(JSON.stringify(data), 'container');
        layerRef.current.destroyChildren();
        stageRef.current.add(stage);
        stageRef.current.draw();
        alert('loaded from JSON');
      })
      .catch((err) => {
        alert('figure fetch api error');
      });
  };

  return (
    <Container>
      <Stage
        width={window.innerWidth - 100}
        height={window.innerHeight - 200}
        ref={stageRef}
      >
        <Layer>
          <Circle
            name='draggableCircle'
            x={50}
            y={150}
            radius={15}
            fill='black'
            draggable
            onDragEnd={(e) => {
              setCurrentFigure({
                x: e.target.x(),
                y: e.target.y(),
                type: 'circle',
              });
              setCircles((prevCircles) => [
                ...prevCircles,
                { x: e.target.x(), y: e.target.y() },
              ]);

              //return circle to original position
              //  dot (.) before "draggableCircle"

              var draggableCircle =
                stageRef.current.findOne('.draggableCircle');
              draggableCircle.position({ x: 50, y: 150 });
            }}
          />
          <Rect
            name='draggableRectangle'
            x={35}
            y={200}
            height={20}
            width={30}
            fill='black'
            draggable
            onDragEnd={(e) => {
              setCurrentFigure({
                x: e.target.x(),
                y: e.target.y(),
                type: 'rectangle',
              });
              var draggableRectangle = stageRef.current.findOne(
                '.draggableRectangle'
              );
              draggableRectangle.position({ x: 35, y: 200 });
            }}
          />
        </Layer>
        <Layer ref={layerRef}></Layer>
      </Stage>
      <Button variant='contained' onClick={() => handleClickReset()}>
        RESET
        <RestartAltIcon />
      </Button>
      <Button
        sx={{ marginX: 2 }}
        variant='contained'
        onClick={() => handleClickJson()}
      >
        To JSON
        <SimCardDownloadIcon />
      </Button>
      <Button variant='contained' onClick={() => handleClickLoadFile()}>
        Load from File
        <UploadFileIcon />
      </Button>
    </Container>
  );
};

export default StageComponent;
