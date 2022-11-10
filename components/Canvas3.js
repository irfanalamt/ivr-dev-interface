import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import ArchitectureIcon from '@mui/icons-material/Architecture';

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Drawer,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Shape from '../models/ShapeNew';
import Shapes from '../models/Shapes';
import Line from '../models/Line';
import Lines from '../models/Lines';
import DrawerComponent from './Drawer';
import InitVariables from './InitVariables2';
import SaveDialog from './SaveDialog';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SaveIcon from '@mui/icons-material/Save';
import SaveProjectDialog from './SaveProjectDialog';
import CanvasAppbar from './CanvasAppbar';

const CanvasComponent = () => {
  const [isOpenVars, setIsOpenVars] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const { status, data } = useSession();

  const palletGroup = useRef(null);
  const stageGroup = useRef(null);
  const userVariables = useRef([]);
  const currentShape = useRef(null);
  const tooltipRef = useRef(null);

  let isDragging = false,
    isPalletShape = false;
  let startX, startY;
  let startX1, startY1;

  useEffect(() => {
    initializeCanvas();
    console.log('session data:', data);
  }, []);

  function initializeCanvas() {
    const context1 = canvasRef.current.getContext('2d');

    context1.lineCap = 'round';
    context1.strokeStyle = 'black';
    context1.lineWidth = 3;
    // Initialize palette shapes; add to palette group
    const palletPentagon = new Shape(40, 100, 30, 25, 'pentagon', '#880e4f');
    const palletRectangle = new Shape(40, 145, 30, 25, 'rectangle', '#bf360c');
    const palletInvertedHexagon = new Shape(
      40,
      195,
      35,
      20,
      'invertedHexagon',
      '#0d47a1'
    );
    const palletHexagon = new Shape(40, 245, 40, 25, 'hexagon', '#004d40');
    const palletParallelogram = new Shape(
      40,
      290,
      26,
      17,
      'parallelogram',
      '#4a148c'
    );
    const palletRoundedRectangle = new Shape(
      40,
      335,
      40,
      25,
      'roundedRectangle',
      '#827717'
    );

    const palletRoundedRectangle2 = new Shape(
      40,
      383,
      40,
      25,
      'roundedRectangle2',
      '#33691e'
    );

    const palletSmallCircle = new Shape(
      40,
      433,
      22,
      22,
      'smallCircle',
      '#827717'
    );

    palletGroup.current = new Shapes('palette', [
      palletRectangle,
      palletInvertedHexagon,
      palletHexagon,
      palletParallelogram,
      palletRoundedRectangle,
      palletRoundedRectangle2,
      palletPentagon,
      palletSmallCircle,
    ]);

    contextRef.current = context1;

    const isExistingProject = JSON.parse(
      localStorage.getItem('isExistingProject')
    );

    if (isExistingProject) {
      const current_project = JSON.parse(localStorage.getItem('saved_project'));
      console.log('🚀 ~ initializeCanvas ~ current_project', current_project);

      // load stageGroup
      const stageShapesArray = current_project.map((el) =>
        Shape.createFromObject(el)
      );
      stageGroup.current = new Shapes('stage', stageShapesArray);
    } else {
      // Initialize stageGroup
      // new project
      stageGroup.current = new Shapes('stage', []);
    }

    clearAndDraw();
  }
  function handleMouseMove(e) {
    e.preventDefault();
    const { clientX, clientY } = e;
    const boundingRect = canvasRef.current.getBoundingClientRect();
    const realX = clientX - boundingRect.left;
    const realY = clientY - boundingRect.top;

    if (isDragging) {
      // drag shape - mousemove
      let dx = realX - startX;
      let dy = realY - startY;
      let current_shape = currentShape.current;

      current_shape.x += dx;
      current_shape.y += dy;

      clearAndDraw();
      startX = realX;
      startY = realY;
      return;
    }

    // reset tooltip; place tooltip on mouse pallet shape
    tooltipRef.current.style.visibility = 'hidden';
    palletGroup.current.getShapes().forEach((element) => {
      if (element.isMouseInShape(realX, realY)) {
        console.log(`💃🏻YES in pallet shape ${element.type}`);
        tooltipRef.current.style.top = clientY - 10 + 'px';
        tooltipRef.current.style.left = clientX + 40 + 'px';
        tooltipRef.current.textContent = element.text;
        tooltipRef.current.style.visibility = 'visible';
      }
    });
  }

  function handleMouseDown(e) {
    e.preventDefault();
    const { clientX, clientY } = e;
    const boundingRect = canvasRef.current.getBoundingClientRect();
    const realX = clientX - boundingRect.left;
    const realY = clientY - boundingRect.top;
    console.log('🚀 ~ handleMouseDown ~ realX,realY', realX, realY);

    //Check mouse in stage shape
    stageGroup.current.getShapes().forEach((element, i) => {
      if (element.isMouseInShape(realX, realY)) {
        if (isDeleting) {
          stageGroup.current.removeShape(i);
          clearAndDraw();
          return;
        }
        currentShape.current = element;
        isDragging = true;
        isPalletShape = false;
        startX = realX;
        startY = realY;
        startX1 = realX;
        startY1 = realY;

        return;
      }
    });

    // check mouse in palette shape
    palletGroup.current.getShapes().forEach((element) => {
      if (element.isMouseInShape(realX, realY)) {
        console.log(`YES in pallet shape ${element.type}`);
        setIsDeleting(false);
        currentShape.current = element;
        isDragging = true;
        isPalletShape = true;
        startX = realX;
        startY = realY;

        return;
      }
    });
  }

  function handleMouseUp(e) {
    e.preventDefault();
    const { clientX, clientY } = e;
    const boundingRect = canvasRef.current.getBoundingClientRect();
    const realX = clientX - boundingRect.left;
    const realY = clientY - boundingRect.top;

    isDragging = false;

    if (isPalletShape) {
      isPalletShape = false;
      console.log('🚀 ~ handleMouseUp ~ isPalletShape', isPalletShape);

      // create new stage shape on dragdrop
      let palletFigureDragged = currentShape.current;
      let stageFigure;
      switch (palletFigureDragged.type) {
        case 'rectangle':
          stageFigure = new Shape(
            realX,
            realY,
            100,
            30,
            'rectangle',
            null,
            true
          );
          break;

        case 'invertedHexagon':
          stageFigure = new Shape(
            realX,
            realY,
            100,
            20,
            'invertedHexagon',
            null,
            true
          );
          break;

        case 'hexagon':
          stageFigure = new Shape(
            realX,
            realY,
            100,
            30,
            'hexagon',
            '#009688',
            true
          );
          break;

        case 'parallelogram':
          stageFigure = new Shape(
            realX,
            realY,
            100,
            30,
            'parallelogram',
            '#9c27b0',
            true
          );
          break;

        case 'roundedRectangle':
          stageFigure = new Shape(
            realX,
            realY,
            125,
            30,
            'roundedRectangle',
            '#c0ca33',
            true
          );
          break;

        case 'roundedRectangle2':
          stageFigure = new Shape(
            realX,
            realY,
            125,
            30,
            'roundedRectangle2',
            '#7cb342',
            true
          );
          break;

        case 'pentagon':
          stageFigure = new Shape(
            realX,
            realY,
            100,
            30,
            'pentagon',
            '#e91e63',
            true
          );
          break;

        case 'smallCircle':
          stageFigure = new Shape(
            realX,
            realY,
            25,
            25,
            'smallCircle',
            '#e91e63',
            true
          );

          break;
      }

      // reset pallet figure to pallet
      palletFigureDragged.x = palletFigureDragged.getInitPos()[0];
      palletFigureDragged.y = palletFigureDragged.getInitPos()[1];

      if (realX > 120) {
        //set unique id; add figure to stage
        stageFigure.setId(stageGroup.current.getShapes().length);
        stageGroup.current.addShape(stageFigure);
        console.log('🚀 ~ handleMouseUp ~ stageFigureAdded', stageFigure);
      }

      clearAndDraw();
      return;
    }

    if (realX == startX1 && realY == startY1) {
      console.log('yaay mouseup same pos');
      // mouse clicked, released same spot in stage shape, check mouse in stage shape
      stageGroup.current.getShapes().forEach((element) => {
        if (
          element.isMouseInShape(realX, realY) &&
          element.type !== 'smallCircle'
        ) {
          console.log(`YES in pallet shape mouseUp ${element.type}`);
          currentShape.current = element;
          currentShape.current.setSelected(true);
          clearAndDraw();
          setIsOpen(true);
          return;
        }
      });
    }
  }
  function handleCloseDrawer() {
    setIsOpen(false);
    clearAndDraw();
  }

  function clearAndDraw() {
    // clear canvas
    contextRef.current.clearRect(0, 0, window.innerWidth, window.innerHeight);
    contextRef.current.lineCap = 'round';
    contextRef.current.strokeStyle = 'black';
    contextRef.current.lineWidth = 2;
    // draw bg rectangle
    contextRef.current.strokeRect(5, 60, 70, 410);

    // draw shapes and lines
    palletGroup.current
      .getShapes()
      .forEach((el) => el.drawShape(contextRef.current));

    stageGroup.current
      .getShapes()
      .forEach((el) => el.drawShape(contextRef.current));

    // // Calculate all connecting lines return array of connections
    // let connectionsArray = stageGroup.current.getConnectionsArray();
    // console.log('🚀 ~ clearAndDraw ~ connectionsArray', connectionsArray);
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
    //     el.lineColor
    //   );
    //   lineGroup.current.addLine(newLine);
    // });

    // lineGroup.current
    //   .getLines()
    //   .forEach((el) => el.connectPoints(contextRef.current));

    // console.log('lineGroup', lineGroup.current);
  }

  return (
    <>
      <CanvasAppbar status={status} />
      <Typography
        sx={{
          mt: 2,
          position: 'fixed',
          width: 'max-content',
          alignItems: 'center',
          display: isDeleting ? 'flex' : 'none',
          fontSize: '1.2rem',
          boxShadow: 1,
          backgroundColor: '#f48fb1',
          px: 2,
        }}
        variant='subtitle2'
      >
        <DeleteIcon /> Delete mode
      </Typography>
      <Typography
        sx={{
          mt: 2,
          position: 'absolute',
          left: 70,
          alignItems: 'center',
          display: 'none',
          fontSize: '1.2rem',
          boxShadow: 1,
          backgroundColor: '#80cbc4',
          px: 2,
        }}
        variant='subtitle2'
      >
        <ArrowRightAltIcon />
        Connect mode
      </Typography>
      <canvas
        style={{ backgroundColor: '#F7FBFE' }}
        width={window.innerWidth * 0.9}
        height={window.innerHeight * 0.9 - 50}
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      ></canvas>

      <Box
        sx={{
          display: 'flex',
        }}
      >
        <Box>
          <Tooltip title='InitVariables' placement='right-start'>
            <SettingsApplicationsIcon
              sx={{ fontSize: '2rem' }}
              onClick={() => setIsOpenVars(true)}
            />
          </Tooltip>
        </Box>
        <Box sx={{ mx: 'auto' }}>
          <Tooltip title='connect shapes' placement='left-start'>
            <ArrowRightAltIcon
              sx={{
                fontSize: '1.9rem',
                boxShadow: 1,
                borderRadius: 2,
                backgroundColor: '#e0f2f1',
              }}
            />
          </Tooltip>
          <Tooltip title='remove item' placement='right-start'>
            <DeleteIcon
              sx={{
                fontSize: isDeleting ? '2rem' : '1.9rem',
                ml: 2,
                boxShadow: 1,
                borderRadius: 2,
                backgroundColor: isDeleting ? '#e91e63' : '#fce4ec',
              }}
              onClick={() => {
                setIsDeleting(!isDeleting);
                console.log('is deleting', isDeleting);
              }}
            />
          </Tooltip>
        </Box>
        <Drawer anchor='left' open={isOpenVars}>
          <InitVariables
            handleCloseDrawer={() => setIsOpenVars(false)}
            userVariables={userVariables.current}
          />
        </Drawer>
        <DrawerComponent
          isOpen={isOpen}
          handleCloseDrawer={handleCloseDrawer}
          shape={currentShape.current}
          userVariables={userVariables.current}
          stageGroup={stageGroup.current}
        />
      </Box>
      <Typography
        sx={{
          visibility: 'hidden',
          position: 'absolute',
          backgroundColor: '#e1f5fe',
          px: 1,
          boxShadow: 1,
        }}
        ref={tooltipRef}
        variant='subtitle2'
      >
        Im a tooltip
      </Typography>
    </>
  );
};

export default CanvasComponent;
