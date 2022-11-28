import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import InfoIcon from '@mui/icons-material/Info';

import { Box, Drawer, Pagination, Tooltip, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Shape from '../models/ShapeNew';
import Shapes from '../models/Shapes';
import Line from '../models/Line';
import Lines from '../models/Lines';
import DrawerComponent from './Drawer';
import InitVariables from './InitVariables2';
import { useSession } from 'next-auth/react';
import CanvasAppbar from './CanvasAppbar';
import ResetCanvasDialog from './ResetCanvasDialog';

const CanvasComponent = () => {
  const [isOpenVars, setIsOpenVars] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInfoMessage, setShowInfoMessage] = useState(false);

  const [showCanvasResetDialog, setShowCanvasResetDialog] = useState(false);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const { status, data } = useSession();

  const palletGroup = useRef(null);
  const lineGroup = useRef(null);
  const stageGroup = useRef([]);
  const userVariables = useRef([]);
  const currentShape = useRef(null);
  const tooltipRef = useRef(null);
  const infoMessage = useRef(null);
  const connectShape1 = useRef(null),
    connectShape2 = useRef(null);

  const shapeCount = useRef(1);
  const scrollOffsetY = useRef(0);
  const pageNumber = useRef(1);

  let isDragging = false,
    isPalletShape = false;
  let startX, startY;
  let startX1, startY1;

  useEffect(() => {
    initializeCanvas();
    console.log('session data:', data);
  }, []);

  useEffect(() => {
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
    console.log('🚀 ~ initializeCanvas ~ initializeCanvas');
    const context1 = canvasRef.current.getContext('2d');

    context1.lineCap = 'round';
    context1.strokeStyle = 'black';
    context1.lineWidth = 3;

    initializePallette();

    contextRef.current = context1;

    // const isExistingProject = JSON.parse(
    //   localStorage.getItem('isExistingProject')
    // );

    // if (isExistingProject) {
    //   const current_project = JSON.parse(localStorage.getItem('saved_project'));
    //   console.log('🚀 ~ initializeCanvas ~ current_project', current_project);

    //   // load stageGroup
    //   const stageShapesArray = current_project.map((el) =>
    //     Shape.createFromObject(el)
    //   );
    //   stageGroup.current = new Shapes('stage', stageShapesArray);
    // } else {
    //   // Initialize stageGroup
    //   // new project
    //   stageGroup.current = new Shapes('stage', []);
    // }

    if (sessionStorage.getItem('saved-stage')) {
      retrieveFromSession();
    } else {
      stageGroup.current = [];

      for (let i = 1; i <= 4; i++) {
        stageGroup.current.push(new Shapes(`p${i}`, []));
      }
    }

    console.log('InitCanvas:🌟', stageGroup.current);
    clearAndDraw();
  }

  function initializePallette() {
    // Initialize palette shapes; add to palette group
    const palletPentagon = new Shape(
      40,
      110 + scrollOffsetY.current,
      30,
      25,
      'pentagon',
      '#880e4f'
    );
    const palletRectangle = new Shape(
      40,
      155 + scrollOffsetY.current,
      30,
      25,
      'rectangle',
      '#bf360c'
    );
    const palletInvertedHexagon = new Shape(
      40,
      205 + scrollOffsetY.current,
      35,
      20,
      'invertedHexagon',
      '#0d47a1'
    );
    const palletHexagon = new Shape(
      40,
      255 + scrollOffsetY.current,
      40,
      25,
      'hexagon',
      '#004d40'
    );
    const palletParallelogram = new Shape(
      40,
      300 + scrollOffsetY.current,
      26,
      17,
      'parallelogram',
      '#4a148c'
    );
    const palletRoundedRectangle = new Shape(
      40,
      345 + scrollOffsetY.current,
      40,
      25,
      'roundedRectangle',
      '#827717'
    );

    const palletRoundedRectangle2 = new Shape(
      40,
      393 + scrollOffsetY.current,
      40,
      25,
      'roundedRectangle2',
      '#33691e'
    );

    const palletSmallCircle = new Shape(
      40,
      443 + scrollOffsetY.current,
      22,
      22,
      'smallCircle',
      '#827717'
    );

    const palletTriangle = new Shape(
      40,
      490 + scrollOffsetY.current,
      30,
      30,
      'triangle',
      '#ffe0b2'
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
      palletTriangle,
    ]);
  }

  function saveToSession() {
    sessionStorage.setItem('saved-stage', JSON.stringify(stageGroup.current));
    console.log('Session saved!');
  }

  function retrieveFromSession() {
    console.log('Session retrieved!');

    let savedStage = JSON.parse(sessionStorage.getItem('saved-stage'));

    savedStage.forEach((page) => {
      Object.setPrototypeOf(page, Shapes.prototype);
      page.shapes.forEach((shape) =>
        Object.setPrototypeOf(shape, Shape.prototype)
      );
    });

    stageGroup.current = savedStage;
    clearAndDraw();
  }

  function handleMouseMove(e) {
    e.preventDefault();
    const { clientX, clientY } = e;
    const boundingRect = canvasRef.current.getBoundingClientRect();
    const realX = clientX - boundingRect.left;
    const realY = clientY - boundingRect.top;

    // reset cursor if not connecting
    if (isConnecting === 0) canvasRef.current.style.cursor = 'default';

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
        tooltipRef.current.style.top =
          clientY - 10 + scrollOffsetY.current + 'px';
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
    stageGroup.current[pageNumber.current - 1]
      .getShapes()
      .forEach((element, i) => {
        if (element.isMouseInShape(realX, realY)) {
          if (isDeleting) {
            stageGroup.current[pageNumber.current - 1].removeShape(i);
            clearAndDraw();
            return;
          }
          console.log(`YES in stage shape ${element.type}`);
          console.log('InitCanvas:🌟', stageGroup.current);
          console.log(
            '🌟CURRENT stageGroup:',
            stageGroup.current[pageNumber.current - 1].getShapes()
          );
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
        setIsConnecting(0);
        setIsDeleting(false);
        currentShape.current = element;
        isDragging = true;
        isPalletShape = true;
        startX = realX;
        startY = realY;

        return;
      }
    });

    // check mouse on line
    lineGroup.current.getLines().forEach((el, i) => {
      const linepoint = el.linepointNearestMouse(realX, realY);
      let dx = realX - linepoint.x;
      let dy = realY - linepoint.y;
      // root of dx^2 + dy^2
      let distance = Math.abs(Math.sqrt(dx * dx + dy * dy));
      console.log('🚀 ~ lineGroup.current.getLines ~ distance', distance);

      if (distance < 5 && isDeleting) {
        console.log('remove; mouse on line; 🐁');
        console.log('remove el ', el);
        stageGroup.current[pageNumber.current - 1].removeShapeNextById(
          el.startItem
        );
        clearAndDraw();
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
            105,
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
            90,
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
            125,
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
            110,
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
            145,
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
            135,
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
            120,
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

        case 'triangle':
          stageFigure = new Shape(
            realX,
            realY,
            30,
            30,
            'triangle',
            '#f57f17',
            true
          );

          break;
      }

      // reset pallet figure to pallet
      palletFigureDragged.x = palletFigureDragged.getInitPos()[0];
      palletFigureDragged.y = palletFigureDragged.getInitPos()[1];

      if (realX > 120) {
        //set unique id; add figure to stage

        // reset shapeCount if stageGroup empty
        if (stageGroup.current[pageNumber.current - 1].getShapes().length === 0)
          shapeCount.current = 1;
        stageFigure.setId(shapeCount.current++, pageNumber.current);
        stageGroup.current[pageNumber.current - 1].addShape(stageFigure);
        console.log('🚀 ~ handleMouseUp ~ stageFigureAdded', stageFigure);
      }

      clearAndDraw();
      return;
    }

    if (realX == startX1 && realY == startY1) {
      console.log('yaay mouseup same pos');
      // mouse clicked, released same spot in stage shape, check mouse in stage shape
      stageGroup.current[pageNumber.current - 1]
        .getShapes()
        .forEach((element) => {
          if (
            element.isMouseInShape(realX, realY) &&
            element.type !== 'smallCircle'
          ) {
            console.log(
              `YES in pallet shape mouseUp ${JSON.stringify(element, null, 2)}`
            );
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
    saveToSession();
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
    contextRef.current.strokeRect(5, 70 + scrollOffsetY.current, 70, 460);
    contextRef.current.fillRect(5, 70 + scrollOffsetY.current, 70, 460);
    contextRef.current.fillStyle = '#616161';
    contextRef.current.font = '20px Arial';

    // display page number canvas top right
    contextRef.current.fillText(
      `P${pageNumber.current}`,
      window.innerWidth * 0.9 - 35,
      80
    );

    // draw shapes and lines
    palletGroup.current
      .getShapes()
      .forEach((el) => el.drawShape(contextRef.current));

    stageGroup.current[pageNumber.current - 1]
      .getShapes()
      .forEach((el) => el.drawShape(contextRef.current));

    // Calculate all connecting lines return array of connections
    let connectionsArray =
      stageGroup.current[pageNumber.current - 1].getConnectionsArray();
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

  function connectShapes() {
    console.log('🚀 ~ connectShapes ~ connectShape1', connectShape1.current);
    console.log('🚀 ~ connectShapes ~ connectShape2', connectShape2.current);
    connectShape1.current.setSelected(false);
    connectShape2.current.setSelected(false);
    clearAndDraw();

    // return if connecting shapes same
    if (connectShape1.current === connectShape2.current) {
      infoMessage.current = 'connecting shapes are the same.';
      setShowInfoMessage(true);
      setTimeout(() => setShowInfoMessage(false), 3000);
      return;
    }
    // return if 1st shape is an exit jumper
    if (
      connectShape1.current.type === 'triangle' &&
      connectShape1.current.userValues?.type === 'exit'
    ) {
      infoMessage.current = 'cannot connect exit jumper.';
      setShowInfoMessage(true);
      setTimeout(() => setShowInfoMessage(false), 3000);
      return;
    }

    // return if 1st shape is a menu; 2nd shape is not a connector
    if (
      connectShape1.current.type === 'hexagon' &&
      connectShape2.current.type !== 'smallCircle'
    ) {
      infoMessage.current = 'Use playMenu items to connect.';
      setShowInfoMessage(true);
      setTimeout(() => setShowInfoMessage(false), 4000);
      return;
    }

    // playMessage to connector connection; add to connectors array
    if (
      connectShape1.current.type === 'hexagon' &&
      connectShape2.current.type === 'smallCircle'
    ) {
      connectShape1.current.setConnectors(connectShape2.current.id);
      console.log('Connector array:⚡', connectShape1.current);
    }

    // shape1 connector
    if (
      connectShape1.current.type === 'smallCircle' &&
      connectShape2.current.type !== 'smallCircle'
    ) {
      let isPlayMenuConnectorId = stageGroup.current[
        pageNumber.current - 1
      ].isPlayMenuConnector(connectShape1.current.id);
      console.log(
        '🟢✅🐁 ~ connectShapes ~ isPlayMenuConnectorId',
        isPlayMenuConnectorId
      );

      if (isPlayMenuConnectorId) {
        console.log('IsPlayMenuConnector✨💃🏻');
        let isPlayMenuAction = stageGroup.current[
          pageNumber.current - 1
        ].isPlayMenuAction(isPlayMenuConnectorId, connectShape2.current.id);
        if (isPlayMenuAction) {
          connectShape1.current.setNextItem(connectShape2.current.id);
          clearAndDraw();
          return;
        }
        infoMessage.current = 'Invalid connection. Check playMenu items.';
        setShowInfoMessage(true);
        setTimeout(() => setShowInfoMessage(false), 4000);
        return;
      }
    }

    // set nextItem for shape1; create new line to connect shapes
    connectShape1.current.setNextItem(connectShape2.current.id);
    clearAndDraw();
    return;
  }

  function handlePageChange(e, pageNum) {
    console.log('pageNum:📄 ' + pageNum);
    pageNumber.current = pageNum;
    clearAndDraw();
  }

  function generateConfigFile() {
    const str = generateJS();
    const blob = new Blob([str]);
    const href = URL.createObjectURL(blob);

    // create "a" HTML element with href to file & click
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', `config.js`); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }

  function generateJS() {
    // return a JS config code as string

    const tempString1 = `function customIVR(){
      IVR.menus =  require('/ivrs/customIVR/menus.json');
      IVR.params = {
        lang: 'en-SA',terminator:'#', maxRetries: 3, maxRepeats: 3,maxCallTime: 240, invalidTransferPoint: 'TP8001', timeoutTransferPoint: 'TP8001', goodbyeMessage: 'std-goodbye', firstTimeout: 10, interTimeout: 5,menuTimeout: 5,		terminateMessage: 'std-terminate', invalidPrompt: 'std-invalid',	timeOutPrompt: 'std-timeout', repeatInfoPrompt: 'std-repeat-info', confirmPrompt: 'std-confirm', cancelPrompt: 'std-cancel',	currency: 'SAR', confirmOption: 1,	cancelOption: 2, invalidAction: 'Disconnect',timeoutAction: 'Disconnect',	logDb: true						
      };
     `;

    const tempString2 = generateInitVariablesJS();
    const tempString3 = stageGroup.current[pageNumber.current - 1]
      .getShapes()
      .filter((el) => el.functionString && el.type !== 'pentagon')
      .map((el) => el.functionString)
      .join(' ');

    const tempString4 = generateMenuJS();

    const tempStringEnd = '} module.exports = customIVR;';

    return (
      tempString1 + tempString2 + tempString3 + tempString4 + tempStringEnd
    );
  }

  function generateInitVariablesJS() {
    // global variables declared in InitVariables to config JS
    let codeString = userVariables.current
      .map((el) => `this.${el.name}${el.value ? `=${el.value};` : ';'}`)
      .join('');

    console.log('🚀 ~ generateJS ~ codeString', codeString);
    return codeString;
  }

  function generateMenuJS() {
    const arrayShapesTillMenu =
      stageGroup.current[pageNumber.current - 1].getShapesTillMenu();

    if (arrayShapesTillMenu === null) return '//no setParams block found \n';

    const mainMenuString = `this.ivrMain=async function(){${arrayShapesTillMenu
      .map((el) => `await this.${el}();`)
      .join('')}}`;

    return mainMenuString;
  }

  return (
    <>
      <CanvasAppbar
        data={data}
        status={status}
        isDeleting={isDeleting}
        isConnecting={isConnecting}
        stageGroup={stageGroup.current}
        showResetDialog={() => setShowCanvasResetDialog(true)}
        generateFile={generateConfigFile}
      />
      <canvas
        style={{ backgroundColor: '#F7FBFE', overflow: 'auto' }}
        width={window.innerWidth * 0.9}
        height={window.innerHeight * 2}
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      ></canvas>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          position: 'fixed',
          bottom: 0,
          backgroundColor: '#fafafa',
          width: '90vw',
        }}
      >
        <Box sx={{ mt: 1, ml: 1 }}>
          <Tooltip title='InitVariables' placement='right-start'>
            <SettingsApplicationsIcon
              sx={{ fontSize: '2rem' }}
              onClick={() => setIsOpenVars(true)}
            />
          </Tooltip>
        </Box>

        <Typography
          sx={{
            ml: 2,
            mt: 1,
            display: showInfoMessage ? 'flex' : 'none',
            alignItems: 'center',
            boxShadow: 1,
            px: 2,
            mb: 0.5,
            backgroundColor: '#b3e5fc',
            fontSize: '1rem',
            borderRadius: 2,
          }}
          variant='subtitle2'
        >
          <InfoIcon sx={{ mr: 0.5, color: '#ef5350' }} />
          {infoMessage.current}
        </Typography>

        <Box sx={{ ml: '40vw', position: 'fixed', mt: 1 }}>
          <Tooltip title='connect shapes' placement='left-start'>
            <ArrowRightAltIcon
              sx={{
                fontSize: isConnecting > 0 ? '2rem' : '1.9rem',
                boxShadow: 1,
                borderRadius: 2,
                backgroundColor: isConnecting > 0 ? '#00897b' : '#e0f2f1',
              }}
              onClick={() => {
                if (!isDeleting && isConnecting === 0) {
                  setIsConnecting(1);
                  infoMessage.current = 'Click on shapes to connect';
                  setShowInfoMessage(true);
                  setTimeout(() => setShowInfoMessage(false), 3000);
                }
                isConnecting > 0 && setIsConnecting(0);
                setIsDeleting(false);
                canvasRef.current.style.cursor = 'crosshair';
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
                setIsConnecting(0);
                console.log('is deleting', isDeleting);
              }}
            />
          </Tooltip>
        </Box>

        <Pagination
          sx={{ position: 'fixed', right: '5vw', mr: 1 }}
          count={4}
          color='primary'
          shape='rounded'
          onChange={handlePageChange}
          hideNextButton={true}
          hidePrevButton={true}
        />
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
        stageGroup={stageGroup.current[pageNumber.current - 1]}
        entireStageGroup={stageGroup.current}
      />

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
      <ResetCanvasDialog
        open={showCanvasResetDialog}
        handleClose={() => setShowCanvasResetDialog(false)}
      />
    </>
  );
};

export default CanvasComponent;
