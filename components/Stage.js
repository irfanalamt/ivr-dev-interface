import { Stage, Layer, Rect, Circle, Ellipse, Arrow } from 'react-konva';
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
  const layerRef1 = useRef(null);
  const layerRef2 = useRef(null);

  useEffect(() => {
    if (currentFigure) {
      switch (currentFigure.type) {
        case 'circle':
          addCircle();
          break;

        case 'rectangle':
          addRectangle();
          console.log(currentFigure);
          break;

        case 'ellipse':
          addEllipse();
          break;

        case 'arrow':
          addArrow();
          console.log(currentFigure);
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
      draggable: true,
    });
    layerRef2.current.add(circle);
    layerRef2.current.draw();
  };

  const addRectangle = () => {
    var rectangle = new Konva.Rect({
      x: currentFigure.x,
      y: currentFigure.y,
      height: 100,
      width: 150,
      cornerRadius: 20,
      stroke: 'blue',
      strokeWidth: 3,
      draggable: true,
    });
    layerRef2.current.add(rectangle);
    layerRef2.current.draw();
  };
  const addEllipse = () => {
    var ellipse = new Konva.Ellipse({
      radiusX: 60,
      radiusY: 40,
      x: currentFigure.x,
      y: currentFigure.y,
      stroke: 'red',
      strokeWidth: 3,
      draggable: true,
    });
    layerRef2.current.add(ellipse);
    layerRef2.current.draw();
  };

  const addArrow = () => {
    var arrow = new Konva.Arrow({
      points: [
        currentFigure.x,
        currentFigure.y,
        100 + currentFigure.x,
        currentFigure.y,
      ],
      pointerLength: 10,
      pointerWidth: 10,
      fill: 'grey',
      stroke: 'grey',
      strokeWidth: 4,
      draggable: true,
    });

    layerRef2.current.add(arrow);

    var tr1 = new Konva.Transformer({
      nodes: [arrow],
      centeredScaling: true,
      rotationSnaps: [0, 90, 180, 270],
      resizeEnabled: false,
    });
    layerRef2.current.add(tr1);
    layerRef2.current.draw();

    // stageRef.current
    //   .findOne('.draggableArrow')
    //   .setAttr('points', [
    //     30 - currentFigure.testx,
    //     300 - currentFigure.testy,
    //     70 - currentFigure.testx,
    //     300 - currentFigure.testy,
    //   ]);
    // layerRef1.current.draw();
  };

  const handleClickReset = () => {
    layerRef2.current.destroyChildren();
  };
  const handleClickJson = () => {
    console.log('aaa');
    axios
      .post('/api/saveFigures', {
        msg: layerRef2.current.toJSON(),
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
        layerRef2.current.destroyChildren();
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
        <Layer ref={layerRef1}>
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
            cornerRadius={5}
            fill='black'
            draggable
            onDragEnd={(e) => {
              setCurrentFigure({
                x: e.target.x(),
                y: e.target.y(),
                type: 'rectangle',
              });
              //   console.log(currentFigure.x, currentFigure.y, currentFigure.type);
              var draggableRectangle = stageRef.current.findOne(
                '.draggableRectangle'
              );
              draggableRectangle.position({ x: 35, y: 200 });
            }}
          />
          <Ellipse
            name='draggableEllipse'
            x={50}
            y={260}
            radiusX={25}
            radiusY={15}
            fill='black'
            draggable
            onDragEnd={(e) => {
              setCurrentFigure({
                x: e.target.x(),
                y: e.target.y(),
                type: 'ellipse',
              });
              var draggableEllipse =
                stageRef.current.findOne('.draggableEllipse');
              draggableEllipse.position({ x: 50, y: 260 });
            }}
          />
          <Arrow
            name='draggableArrow'
            points={[30, 300, 70, 300]}
            fill='black'
            draggable
            pointerLength={5}
            pointerWidth={7}
            stroke='black'
            strokeWidth={4}
            onDragEnd={(e) => {
              setCurrentFigure({
                x: 30 + e.target.x(),
                y: 300 + e.target.y(),
                type: 'arrow',
                testx: e.target.x(),
                testy: e.target.y(),
              });
              stageRef.current
                .findOne('.draggableArrow')
                .setAttr('points', [
                  30 - e.target.x(),
                  300 - e.target.y(),
                  70 - e.target.x(),
                  300 - e.target.y(),
                ]);
              //   layerRef1.current.draw();
              stageRef.current.draw();
            }}
          />
        </Layer>
        <Layer ref={layerRef2}></Layer>
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
      <Button
        variant='contained'
        onClick={() => {
          var draggableArrow = stageRef.current.findOne('.draggableArrow');

          addRectangle();
          draggableArrow.setAttr('points', [
            30 - currentFigure.testx,
            300 - currentFigure.testy,
            70 - currentFigure.testx,
            300 - currentFigure.testy,
          ]);
        }}
      >
        TEST
      </Button>
    </Container>
  );
};

export default StageComponent;
