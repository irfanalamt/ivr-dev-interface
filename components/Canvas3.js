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
import Shape from '../models/Shape';
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

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const { status, data } = useSession();

  const palletGroup = useRef(null);
  const stageGroup = useRef(null);
  const userVariables = useRef([]);

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

    const palletSmallCircle = new Shape(
      40,
      383,
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

  function clearAndDraw() {
    // clear canvas
    contextRef.current.clearRect(0, 0, window.innerWidth, window.innerHeight);
    contextRef.current.lineCap = 'round';
    contextRef.current.strokeStyle = 'black';
    contextRef.current.lineWidth = 2;
    // draw bg rectangle
    contextRef.current.strokeRect(5, 60, 70, 380);

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
          position: 'absolute',
          left: 70,
          alignItems: 'center',
          display: 'none',
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
        style={{ backgroundColor: '#f3f9fe' }}
        width={window.innerWidth * 0.9}
        height={window.innerHeight * 0.9 - 50}
        ref={canvasRef}
        // onMouseMove={handleMouseMove}
        // onMouseDown={handleMouseDown}
        // onMouseUp={handleMouseUp}
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
                fontSize: '2rem',
                boxShadow: 1,
                borderRadius: 2,
                backgroundColor: '#e0f2f1',
              }}
            />
          </Tooltip>
          <Tooltip title='remove item' placement='right-start'>
            <DeleteIcon
              sx={{
                fontSize: '2rem',
                ml: 2,
                boxShadow: 1,
                borderRadius: 2,
                backgroundColor: '#fce4ec',
              }}
            />
          </Tooltip>
        </Box>
        <Drawer anchor='right' open={isOpenVars}>
          <InitVariables
            handleCloseDrawer={() => setIsOpenVars(false)}
            userVariables={userVariables.current}
          />
        </Drawer>
      </Box>
    </>
  );
};

export default CanvasComponent;
