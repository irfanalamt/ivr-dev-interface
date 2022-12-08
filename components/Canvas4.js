import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import InfoIcon from '@mui/icons-material/Info';

import {
  Alert,
  Box,
  Drawer,
  Pagination,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Shape from '../models/Shape2';
import Shapes from '../models/Shapes2';
import Line from '../models/Line';
import Lines from '../models/Lines';
import DrawerComponent from './Drawer';
import InitVariables from './InitVariables2';
import { useSession } from 'next-auth/react';
import CanvasAppbar from './CanvasAppbar';
import ResetCanvasDialog from './ResetCanvasDialog';

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const scrollOffsetY = useRef(0);
  const pageNumber = useRef(1);

  const palletGroup = useRef(null);
  const lineGroup = useRef(null);
  const stageGroup = useRef(null);
  const currentShape = useRef(null);
  const connectShape1 = useRef(null),
    connectShape2 = useRef(null);
  const shapeCount = useRef({
    setParams: { value: 0, count: 1 },
    runScript: { value: 1, count: 1 },
    callAPI: { value: 2, count: 1 },
    playMenu: { value: 3, count: 1 },
    getDigits: { value: 4, count: 1 },
    playMessage: { value: 5, count: 1 },
    playConfirm: { value: 6, count: 1 },
    switch: { value: 7, count: 1 },
    connector: { value: 8, count: 1 },
    jumper: { value: 9, count: 1 },
  });

  let isDragging = false,
    isPalletShape = false;
  let startX, startY;
  let startX1, startY1;

  useEffect(() => {
    initializeCanvas();
    const handleScroll = (event) => {
      // draw palette dynamically on window scrollY
      scrollOffsetY.current = window.scrollY;
      initializePallette();
      clearAndDraw();
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function initializeCanvas() {
    const context1 = canvasRef.current.getContext('2d');

    context1.lineCap = 'round';
    context1.strokeStyle = 'black';
    context1.lineWidth = 3;

    initializePallette();

    // Each stage element is a page
    stageGroup.current = [];
    for (let i = 1; i <= 4; i++) {
      stageGroup.current.push(new Shapes(`p${i}`, {}));
    }

    contextRef.current = context1;
    clearAndDraw();
  }

  function initializePallette() {
    const setParams = new Shape(
      40,
      100 + scrollOffsetY.current,
      30,
      25,
      'setParams',
      '#880e4f'
    );
    const runScript = new Shape(
      40,
      145 + scrollOffsetY.current,
      30,
      25,
      'runScript',
      '#bf360c'
    );
    const callAPI = new Shape(
      40,
      195 + scrollOffsetY.current,
      35,
      20,
      'callAPI',
      '#0d47a1'
    );
    const playMenu = new Shape(
      40,
      245 + scrollOffsetY.current,
      40,
      25,
      'playMenu',
      '#004d40'
    );
    const getDigits = new Shape(
      40,
      290 + scrollOffsetY.current,
      26,
      17,
      'getDigits',
      '#4a148c'
    );
    const playMessage = new Shape(
      40,
      335 + scrollOffsetY.current,
      40,
      25,
      'playMessage',
      '#827717'
    );
    const playConfirm = new Shape(
      40,
      383 + scrollOffsetY.current,
      40,
      25,
      'playConfirm',
      '#33691e'
    );
    const switchShape = new Shape(
      40,
      433 + scrollOffsetY.current,
      40,
      25,
      'switch',
      '#3e2723'
    );
    const connector = new Shape(
      40,
      480 + scrollOffsetY.current,
      22,
      22,
      'connector',
      '#827717'
    );
    const jumper = new Shape(
      40,
      525 + scrollOffsetY.current,
      30,
      30,
      'jumper',
      '#ffe0b2'
    );
    palletGroup.current = new Shapes('palette', {
      1: setParams,
      2: runScript,
      3: callAPI,
      4: playMenu,
      5: getDigits,
      6: playMessage,
      7: playConfirm,
      8: switchShape,
      9: connector,
      10: jumper,
    });
  }

  function clearAndDraw() {
    // clear canvas
    contextRef.current.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight * 2
    );
    contextRef.current.lineCap = 'round';
    contextRef.current.strokeStyle = '#062350';
    contextRef.current.lineWidth = 2.5;
    contextRef.current.fillStyle = 'white';

    // draw bg palette rectangle
    contextRef.current.strokeRect(5, 70 + scrollOffsetY.current, 70, 480);
    contextRef.current.fillRect(5, 70 + scrollOffsetY.current, 70, 480);
    contextRef.current.fillStyle = '#616161';
    contextRef.current.font = '20px Arial';

    // display page number canvas top right
    contextRef.current.fillText(
      `P${pageNumber.current}`,
      window.innerWidth * 0.9 - 35,
      80
    );

    // draw shapes and lines

    palletGroup.current.drawAllShapes(contextRef.current);

    stageGroup.current[pageNumber.current - 1].drawAllShapes(
      contextRef.current
    );

    // Calculate all connecting lines return array of connections
    // let connectionsArray =
    //   stageGroup.current[pageNumber.current - 1].getConnectionsArray();

    // // init lineGroup
    // lineGroup.current = new Lines([]);
    // connectionsArray.forEach((el) => {
    //   let newLine = new Line(
    //     el.x1,
    //     el.y1,
    //     el.x2,
    //     el.y2,
    //     el.startItem,
    //     el.endItem,
    //     el.lineCap,
    //     el.lineColor,
    //     el.lineData
    //   );
    //   lineGroup.current.addLine(newLine);
    // });

    // lineGroup.current
    //   .getLines()
    //   .forEach((el) => el.connectPoints(contextRef.current));

    // console.log('lineGroup', lineGroup.current);
  }

  function handleMouseDown(e) {
    e.preventDefault();
    const { clientX, clientY } = e;
    const boundingRect = canvasRef.current.getBoundingClientRect();
    const realX = clientX - boundingRect.left;
    const realY = clientY - boundingRect.top;

    // check mouse in palette shape
    palletGroup.current.getShapesEntries().forEach(([key, element]) => {
      if (element.isMouseInShape(realX, realY)) {
        console.log(`✨YES in pallette shape ${element.type}`);

        currentShape.current = element;
        isDragging = true;
        isPalletShape = true;
        startX = realX;
        startY = realY;

        return;
      }
    });

    //Check mouse in stage shape
    stageGroup.current[pageNumber.current - 1]
      .getShapesEntries()
      .forEach(([key, element]) => {
        if (element.isMouseInShape(realX, realY)) {
          console.log(`✨YES in stage shape ${element.type}`);
          console.log(key, element);

          currentShape.current = element;
          isDragging = true;
          isPalletShape = false;
          startX = realX;
          startY = realY;
          startX1 = realX;
          startY1 = realY;
        }
      });
  }
  function handleMouseMove(e) {
    e.preventDefault();
    const { clientX, clientY } = e;
    const boundingRect = canvasRef.current.getBoundingClientRect();
    const realX = clientX - boundingRect.left;
    const realY = clientY - boundingRect.top;

    if (isDragging) {
      // drag shape - mousemove
      const dx = realX - startX;
      const dy = realY - startY;
      const current_shape = currentShape.current;

      current_shape.x += dx;
      current_shape.y += dy;

      clearAndDraw();
      startX = realX;
      startY = realY;
      return;
    }
  }
  function handleMouseUp(e) {
    e.preventDefault();
    const { clientX, clientY } = e;
    const boundingRect = canvasRef.current.getBoundingClientRect();
    const realX = clientX - boundingRect.left;
    const realY = clientY - boundingRect.top;

    // reset dragging mode
    isDragging = false;

    if (isPalletShape) {
      isPalletShape = false;
      // reset pallet figure to pallet
      const palletFigureDragged = currentShape.current;
      palletFigureDragged.x = palletFigureDragged.getInitPos()[0];
      palletFigureDragged.y = palletFigureDragged.getInitPos()[1];
      // do nothing if palette drop too close to palette
      if (realX < 120) {
        clearAndDraw();
        return;
      }
      const count = shapeCount.current[palletFigureDragged.type].count++;
      const shapeValue = shapeCount.current[palletFigureDragged.type].value;
      const shapeId = `${shapeValue}${pageNumber.current}${count}`;
      console.log('dw', shapeId);
      // id = value|pageNumber|count
      stageGroup.current[pageNumber.current - 1].addShape(
        palletFigureDragged.type,
        realX,
        realY,
        shapeId,
        count
      );
      clearAndDraw();
    }
  }

  return (
    <>
      <canvas
        style={{ backgroundColor: '#F7FBFE' }}
        width={window.innerWidth * 0.9}
        height={window.innerHeight * 2}
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      ></canvas>
    </>
  );
};

export default CanvasComponent;
