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

const CanvasComponent = () => {
  const { status, data } = useSession();

  const [isOpenVars, setIsOpenVars] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [openSaveToast, setOpenSaveToast] = useState(false);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const currentLine = useRef(null);
  const currentShape = useRef(null);
  const palletGroup = useRef(null);
  const stageGroup = useRef(null);
  const lineGroup = useRef(null);
  const userVariables = useRef([]);
  const connectorCount = useRef(1);
  const saveFileName = useRef('');
  const projectName = useRef('');

  let startX, startY;
  let startX1, startY1;
  let isDragging = false,
    isPalletShape = false,
    isOnEdge = false,
    isResizing = false,
    isDraggingLine = false;
  const connectShape1 = useRef(null),
    connectShape2 = useRef(null);

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
    const palletPentagon = new Shape(55, 155, 30, 25, 'pentagon', '#880e4f');
    const palletRectangle = new Shape(55, 205, 30, 25, 'rectangle', '#bf360c');
    const palletInvertedHexagon = new Shape(
      55,
      255,
      35,
      20,
      'invertedHexagon',
      '#0d47a1'
    );
    const palletHexagon = new Shape(55, 305, 40, 25, 'hexagon', '#004d40');
    const palletParallelogram = new Shape(
      55,
      350,
      26,
      17,
      'parallelogram',
      '#4a148c'
    );
    const palletRoundedRectangle = new Shape(
      55,
      395,
      40,
      25,
      'roundedRectangle',
      '#827717'
    );

    const palletSmallCircle = new Shape(
      55,
      443,
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
    contextRef.current.strokeRect(20, 80, 70, 470);

    // draw shapes and lines
    palletGroup.current
      .getShapes()
      .forEach((el) => el.drawShape(contextRef.current));

    stageGroup.current
      .getShapes()
      .forEach((el) => el.drawShape(contextRef.current));

    // Calculate all connecting lines return array of connections
    let connectionsArray = stageGroup.current.getConnectionsArray();
    console.log('🚀 ~ clearAndDraw ~ connectionsArray', connectionsArray);
    // init lineGroup
    lineGroup.current = new Lines([]);
    connectionsArray.forEach((el) => {
      let newLine = new Line(
        el.x1,
        el.y1,
        el.x2,
        el.y2,
        el.startItem,
        el.endItem,
        el.lineCap,
        el.lineColor
      );
      lineGroup.current.addLine(newLine);
    });

    lineGroup.current
      .getLines()
      .forEach((el) => el.connectPoints(contextRef.current));

    console.log('lineGroup', lineGroup.current);
  }

  function handleMouseMove(e) {
    e.preventDefault();
    let { clientX, clientY } = e;

    let tooltip = document.getElementById('my-tooltip');
    isOnEdge = false;
    if (isDragging) {
      // drag shape - mousemove
      let dx = clientX - startX;
      let dy = clientY - startY;
      let current_shape = currentShape.current;

      current_shape.x += dx;
      current_shape.y += dy;

      clearAndDraw();
      startX = clientX;
      startY = clientY;
      return;
    }

    if (isResizing) {
      //Change width, height - mousemove
      let current_shape = currentShape.current;
      // if shape is connector , return
      if (current_shape.type === 'smallCircle') return;
      let dx = clientX - startX;
      let dy = clientY - startY;

      let newWidth = Math.abs(current_shape.width + dx);
      let newHeight = Math.abs(current_shape.height + dy);
      //  if resized shape too small or too big
      if (newWidth < 40 || newWidth > 400 || newHeight < 40 || newHeight > 400)
        return;
      current_shape.width = newWidth;
      current_shape.height = newHeight;

      clearAndDraw();
      startX = clientX;
      startY = clientY;
      return;
    }

    if (isDraggingLine) {
      let dx = clientX - startX;
      let dy = clientY - startY;

      let current_line = currentLine.current;
      if (current_line.segments.length === 1) return;
      current_line.segments.at(-1).x1 += dx;
      current_line.segments.at(-1).y1 += dy;
      current_line.segments[0].x2 += dx;
      current_line.segments[0].y2 += dy;
      clearAndDraw();
      startX = clientX;
      startY = clientY;

      return;
    }

    if (isConnecting > 0) return;
    if (isDeleting) return;

    // reset cursor,tooltip; place tooltip on mouse pallet shape
    canvasRef.current.style.cursor = 'default';
    tooltip.style.visibility = 'hidden';
    palletGroup.current.getShapes().forEach((element) => {
      if (element.isMouseInShape(clientX, clientY)) {
        console.log(`YES in pallet shape ${element.type}`);
        canvasRef.current.style.cursor = 'grab';
        tooltip.style.top = element.y - element.height / 2 + 2 + 'px';
        tooltip.style.left = element.x + 45 + 'px';
        tooltip.textContent = element.text;
        tooltip.style.visibility = 'visible';
      }
    });
    // if mouse near left/right edge mid, change cursor; set isOnEdge
    stageGroup.current.getShapes().forEach((element) => {
      if (
        element.isMouseNearVertex(clientX, clientY) &&
        element.type !== 'smallCircle'
      ) {
        console.log('Mouse near vertex');
        canvasRef.current.style.cursor = 'w-resize';
        isOnEdge = true;
        currentShape.current = element;
        return;
      }
      // if in stage shape; change cursor to grab
      if (element.isMouseInShape(clientX, clientY)) {
        canvasRef.current.style.cursor = 'grab';
      }
    });
  }

  function handleMouseDown(e) {
    e.preventDefault();
    let { clientX, clientY } = e;
    console.log('🚀 ~ handleMouseDown ~ clientX, clientY', clientX, clientY);
    // if is onEdge mouseDown, set isResizing
    isResizing = false;
    if (isOnEdge) {
      isResizing = true;
      startX = clientX;
      startY = clientY;
      return;
    }

    //Check mouse in stage shape
    stageGroup.current.getShapes().forEach((element, i) => {
      if (element.isMouseInShape(clientX, clientY)) {
        if (isDeleting) {
          stageGroup.current.removeShape(i);
          clearAndDraw();
        }
        console.log(`YES in stage shape ${element.type}`);
        if (isConnecting === 1) {
          connectShape1.current = element;
          connectShape1.current.setSelected(true);
          clearAndDraw();
          setIsConnecting(2);
          return;
        }
        if (isConnecting === 2) {
          connectShape2.current = element;
          connectShape2.current.setSelected(true);
          clearAndDraw();
          setIsConnecting(0);
          connectShapes();
          return;
        }
        currentShape.current = element;
        isDragging = true;
        isPalletShape = false;
        startX = clientX;
        startY = clientY;
        startX1 = clientX;
        startY1 = clientY;
        return;
      }
    });

    // check mouse in palette shape
    palletGroup.current.getShapes().forEach((element) => {
      if (element.isMouseInShape(clientX, clientY)) {
        console.log(`YES in pallet shape ${element.type}`);
        setIsDeleting(false);
        setIsConnecting(0);
        canvasRef.current.style.cursor = 'grabbing';
        currentShape.current = element;
        isDragging = true;
        isPalletShape = true;
        startX = clientX;
        startY = clientY;
        return;
      }
    });

    // check mouse on line
    lineGroup.current.getLines().forEach((el, i) => {
      const linepoint = el.linepointNearestMouse(clientX, clientY);
      let dx = clientX - linepoint.x;
      let dy = clientY - linepoint.y;
      // root of dx^2 + dy^2
      let distance = Math.abs(Math.sqrt(dx * dx + dy * dy));
      console.log('🚀 ~ lineGroup.current.getLines ~ distance', distance);

      if (distance < 5 && isDeleting) {
        console.log('remove; mouse on line; 🐁');
        console.log('remove el ', el);
        stageGroup.current.removeShapeNextByName(el.startItem);
        clearAndDraw();
        return;
      }
    });
  }
  function handleMouseUp(e) {
    e.preventDefault();
    let { clientX, clientY } = e;
    isDragging = false;
    isDraggingLine = false;

    if (isPalletShape) {
      isPalletShape = false;
      // create new stage shape on dragdrop
      let palletFigureDragged = currentShape.current;
      let stageFigure;
      switch (palletFigureDragged.type) {
        case 'rectangle':
          stageFigure = new Shape(
            clientX,
            clientY,
            120,
            50,
            'rectangle',
            null,
            true
          );
          break;

        case 'invertedHexagon':
          stageFigure = new Shape(
            clientX,
            clientY,
            120,
            50,
            'invertedHexagon',
            null,
            true
          );
          break;

        case 'hexagon':
          stageFigure = new Shape(
            clientX,
            clientY,
            140,
            50,
            'hexagon',
            '#009688',
            true
          );
          break;

        case 'parallelogram':
          stageFigure = new Shape(
            clientX,
            clientY,
            120,
            50,
            'parallelogram',
            '#9c27b0',
            true
          );
          break;

        case 'roundedRectangle':
          stageFigure = new Shape(
            clientX,
            clientY,
            130,
            50,
            'roundedRectangle',
            '#c0ca33',
            true
          );
          break;

        case 'pentagon':
          stageFigure = new Shape(
            clientX,
            clientY,
            135,
            50,
            'pentagon',
            '#e91e63',
            true
          );
          break;

        case 'smallCircle':
          stageFigure = new Shape(
            clientX,
            clientY,
            35,
            35,
            'smallCircle',
            '#e91e63',
            true
          );
          stageFigure.setText(`Connector${connectorCount.current++}`);
          break;
      }

      // reset pallet figure to pallet
      palletFigureDragged.x = palletFigureDragged.getInitPos()[0];
      palletFigureDragged.y = palletFigureDragged.getInitPos()[1];
      //add figure to stage
      if (clientX > 160) stageGroup.current.addShape(stageFigure);
      clearAndDraw();
      return;
    }

    if (isConnecting > 0) return;

    if (clientX == startX1 && clientY == startY1) {
      (startX1 = null), (startY1 = null);
      console.log('isDragging', isDragging);
      // mouse clicked, released same spot in stage shape, check mouse in stage shape
      stageGroup.current.getShapes().forEach((element) => {
        if (
          element.isMouseInShape(clientX, clientY) &&
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

  function setPalletArrowColor() {
    if (isConnecting === 0) return '#37474f';
    if (isConnecting === 1) return '#2e7d32';
    if (isConnecting === 2) return '#1565c0';
  }

  function generateConfigFile() {
    console.log('🕺🏻⚡', saveFileName.current, '.js');

    const tempString1 = `function ${saveFileName.current}(){
      IVR.menus =  require('/ivrs/${saveFileName.current}/menus.json');
      IVR.params = {
        lang: 'en-SA',terminator:'#', maxRetries: 3, maxRepeats: 3,maxCallTime: 240, invalidTransferPoint: 'TP8001', timeoutTransferPoint: 'TP8001', goodbyeMessage: 'std-goodbye', firstTimeout: 10, interTimeout: 5,menuTimeout: 5,		terminateMessage: 'std-terminate', invalidPrompt: 'std-invalid',	timeOutPrompt: 'std-timeout', repeatInfoPrompt: 'std-repeat-info', confirmPrompt: 'std-confirm', cancelPrompt: 'std-cancel',	currency: 'SAR', confirmOption: 1,	cancelOption: 2, invalidAction: 'Disconnect',timeoutAction: 'Disconnect',	logDb: true						
      };
    } `;

    const tempString2 = generateInitVariablesJS();
    const tempString3 = stageGroup.current
      .getShapes()
      .filter((el) => el.functionString && el.type !== 'pentagon')
      .map((el) => el.functionString)
      .join(' ');

    const finalString = tempString1 + tempString2 + tempString3;

    console.log('🕺🏻Config FILE:', finalString);
    saveConfigFile(finalString);
  }

  function generateInitVariablesJS() {
    let codeString = userVariables.current
      .map((el) => `this.${el.name}${el.value ? `=${el.value};` : ';'}`)
      .join('');

    console.log('🚀 ~ generateJS ~ codeString', codeString);
    return codeString;
  }

  function saveConfigFile(tempString) {
    axios
      .post(
        '/api/saveConfig',
        {
          code: tempString,
          fileName: saveFileName.current,
        },
        { responseType: 'blob' }
      )
      .then((res) => {
        console.log('response data:', res.data);
        const href = URL.createObjectURL(res.data);

        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', `${saveFileName.current}.js`); //or any other extension
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .catch((err) => console.log('Error: post saveConfig', err));
  }

  function connectShapes() {
    console.log('🚀 ~ connectShapes ~ connectShape1', connectShape1.current);
    console.log('🚀 ~ connectShapes ~ connectShape2', connectShape2.current);
    connectShape1.current.setSelected(false);
    connectShape2.current.setSelected(false);
    clearAndDraw();

    // return if connecting shapes same
    if (connectShape1.current === connectShape2.current) return;

    // return if shape2 default text
    if (
      [
        'playMenu',
        'playMessage',
        'function',
        'setParams',
        'getDigits',
        'callAPI',
      ].includes(connectShape2.current.text)
    )
      return;

    // set nextItem for shape1; create new line to connect shapes
    connectShape1.current.setNextItem(connectShape2.current.text);
    clearAndDraw();
    return;
  }

  function setFileName(name) {
    saveFileName.current = name;
    generateConfigFile();
  }

  function setProjectName(name) {
    projectName.current = name;
    console.log(
      '🚀 ~ setProjectName ~ projectName.current',
      projectName.current
    );

    const serializedShapes = stageGroup.current.getSerializedShapes();

    axios
      .post('/api/saveProject', {
        email: data.user.email,
        projectName: projectName.current,
        shapes: serializedShapes,
      })
      .then((res) => {
        console.log('post project promise🕺🏻:', res.data);
        setOpenSaveToast(true);
      })
      .catch((err) => console.log(err));
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          my: 1,
          backgroundColor: '#f9fbe7',
          alignItems: 'center',
          height: 50,
          px: 2,
          boxShadow: 1,
        }}
      >
        <Avatar sx={{ backgroundColor: '#bbdefb' }}>
          <ArchitectureIcon sx={{ fontSize: '2rem', color: 'black' }} />
        </Avatar>

        <Typography
          sx={{ display: 'flex', alignItems: 'center', mx: 2 }}
          variant='subtitle2'
        >
          <AccountCircleIcon sx={{ mr: 0.25, fontSize: '1.2rem' }} />
          {status === 'authenticated' ? data.user.email : 'Guest User'}
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          <Tooltip title='SAVE'>
            <Button
              sx={{ zIndex: 6, mr: 1, backgroundColor: '#2196f3' }}
              variant='contained'
              size='small'
              color='info'
              onClick={() => {
                const serializedShapes =
                  stageGroup.current.getSerializedShapes();
                localStorage.setItem('isExistingProject', true);
                localStorage.setItem(
                  'saved_project',
                  JSON.stringify(serializedShapes)
                );
              }}
              disabled={status !== 'authenticated'}
            >
              <SaveIcon sx={{ fontSize: '1.2rem' }} />
            </Button>
          </Tooltip>
          <Tooltip title='SAVE AS'>
            <Button
              sx={{ zIndex: 6, mr: 1, backgroundColor: '#3f51b5' }}
              variant='contained'
              size='small'
              color='info'
              onClick={() => {
                setOpenProjectDialog(true);
              }}
              disabled={status !== 'authenticated'}
            >
              <SaveAsIcon sx={{ fontSize: '1.2rem' }} />
            </Button>
          </Tooltip>

          <Tooltip title='GENERATE CONFIG'>
            <Button
              sx={{ zIndex: 6, backgroundColor: '#4caf50' }}
              size='small'
              color='success'
              variant='contained'
              onClick={() => setOpenDialog(true)}
            >
              <SaveAltIcon sx={{ fontSize: '1.2rem' }} />
            </Button>
          </Tooltip>
        </Box>
      </Box>
      <Typography
        sx={{
          mt: 2,
          alignItems: 'center',
          justifyContent: 'center',
          display: isDeleting ? 'flex' : 'none',
          fontSize: '1.2rem',
          color: '#00897b',
        }}
        variant='subtitle2'
      >
        <DeleteIcon /> Delete mode: Click on items to erase them
      </Typography>
      <Typography
        sx={{
          mt: 2,
          alignItems: 'center',
          justifyContent: 'center',
          display: isConnecting > 0 ? 'flex' : 'none',
          fontSize: '1.2rem',
          color: '#00897b',
        }}
        variant='subtitle2'
      >
        <ArrowRightAltIcon />
        Connect mode: Click on shapes to connect them.
        {isConnecting === 1 && ' Select shape 1'}
        {isConnecting === 2 && ' Select shape 2'}
      </Typography>

      <canvas
        style={{ position: 'absolute', left: 0, bottom: 0, zIndex: 5 }}
        width={window.innerWidth}
        height={window.innerHeight}
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      ></canvas>
      <Drawer anchor='right' open={isOpenVars}>
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

      <Tooltip title='connect shapes' placement='right-end'>
        <ArrowRightAltIcon
          sx={{
            position: 'absolute',
            left: 18,
            top: 455,
            zIndex: 5,
            width: 75,
            fontSize: isConnecting === 0 ? '3rem' : '3.5rem',
            color: setPalletArrowColor(),
          }}
          onClick={() => {
            !isDeleting && isConnecting === 0 && setIsConnecting(1);
            isConnecting > 0 && setIsConnecting(0);
            canvasRef.current.style.cursor = 'crosshair';
          }}
        />
      </Tooltip>
      <Tooltip title='remove item' placement='right-end'>
        <DeleteIcon
          sx={{
            position: 'absolute',
            left: 18,
            top: 501,
            zIndex: 5,
            width: 75,
            color: isDeleting ? '#2e7d32' : '#37474f',
            fontSize: isDeleting ? '2.5rem' : '2rem',
            boxShadow: isDeleting ? 1 : 0,
            borderRadius: 2,
            backgroundColor: isDeleting && '#ffcdd2',
          }}
          onClick={() => {
            !isConnecting && setIsDeleting(!isDeleting);
            console.log('is deleting', isDeleting);
            canvasRef.current.style.cursor = 'pointer';
          }}
        />
      </Tooltip>
      <Tooltip title='InitVariables' placement='right-end'>
        <SettingsApplicationsIcon
          sx={{
            position: 'absolute',
            left: 18,
            top: 95,
            zIndex: 5,
            width: 75,
            fontSize: '2rem',
            color: '#37474f',
          }}
          onClick={() => setIsOpenVars(true)}
        />
      </Tooltip>

      <SaveDialog
        open={openDialog}
        setOpen={setOpenDialog}
        fileName={setFileName}
      />
      <SaveProjectDialog
        open={openProjectDialog}
        setOpen={setOpenProjectDialog}
        projectName={setProjectName}
      />
      <Typography
        sx={{
          visibility: 'hidden',
          position: 'absolute',
          zIndex: 6,
          backgroundColor: '#e1f5fe',
          px: 1,
          boxShadow: 1,
        }}
        id='my-tooltip'
        variant='subtitle2'
      >
        Im a tooltip
      </Typography>
      <Snackbar
        open={openSaveToast}
        autoHideDuration={6000}
        onClose={() => setOpenSaveToast(false)}
      >
        <Alert
          onClose={() => setOpenSaveToast(false)}
          severity='success'
          sx={{ width: '100%' }}
        >
          {`save success! ProjectName: ${projectName.current}`}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CanvasComponent;
