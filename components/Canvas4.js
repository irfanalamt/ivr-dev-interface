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
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isOpenVars, setIsOpenVars] = useState(false);
  const [isConnecting, setIsConnecting] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInfoMessage, setShowInfoMessage] = useState(false);
  const [showCanvasResetDialog, setShowCanvasResetDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { status, data } = useSession();

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const scrollOffsetY = useRef(0);
  const pageNumber = useRef(1);
  const snackbarMessage = useRef('');

  const palletGroup = useRef(null);
  const lineGroup = useRef(null);
  const stageGroup = useRef([]);
  const currentShape = useRef(null);
  const connectShape1 = useRef(null),
    connectShape2 = useRef(null);
  const shapeCount = useRef({
    setParams: 1,
    runScript: 1,
    callAPI: 1,
    playMenu: 1,
    getDigits: 1,
    playMessage: 1,
    playConfirm: 1,
    switch: 1,
    connector: 1,
    jumper: 1,
  });
  const userVariables = useRef([]);
  const infoMessage = useRef('');
  const isSwitchExitPoint = useRef(null);
  const isMenuExitPoint = useRef(null);
  const tooltipRef = useRef(null);
  const stageTooltipRef = useRef(null);
  const lineTooltipRef = useRef(null);

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

    if (stageGroup.current.length < 1) {
      // Each stage element is a page
      stageGroup.current = [];
      for (let i = 1; i <= 4; i++) {
        stageGroup.current.push(new Shapes(`p${i}`, {}));
      }
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

    // palette and stage drawn on canvas
    palletGroup.current.drawAllShapes(contextRef.current);
    stageGroup.current[pageNumber.current - 1].drawAllShapes(
      contextRef.current
    );

    // Calculate all connecting lines return array of connections
    const connectionsArray =
      stageGroup.current[pageNumber.current - 1].getConnectionsArray();

    // initialize lineGroup,draw connections
    lineGroup.current = new Lines([]);
    lineGroup.current.setConnections(connectionsArray);
    lineGroup.current.connectAllPoints(contextRef.current);
  }

  function handleCloseDrawer() {
    setIsOpenDrawer(false);
    clearAndDraw();
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
        setIsConnecting(0);
        setIsDeleting(false);
        setShowInfoMessage(false);

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

          // reset infoMsg on stage shape click
          setShowInfoMessage(false);

          if (isDeleting) {
            stageGroup.current[pageNumber.current - 1].removeShape(key);
            clearAndDraw();
            return;
          }
          if (isConnecting === 1) {
            connectShape1.current = element;
            element.setSelected(true);
            clearAndDraw();
            setIsConnecting(2);
            //if shape1 is switch, if on exit point set ref to exit point name
            if (element.type === 'switch') {
              const isNearExitPoint = element.isNearExitPointSwitch(
                realX,
                realY
              );

              isSwitchExitPoint.current = isNearExitPoint;
            }

            if (element.type === 'playMenu') {
              const isNearExitPoint = element.isNearExitPointMenu(realX, realY);

              isMenuExitPoint.current = isNearExitPoint;
            }
            return;
          }
          if (isConnecting === 2) {
            connectShape2.current = element;
            element.setSelected(true);
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
        }
      });

    lineGroup.current.getLines().forEach((el, i) => {
      const linepoint = el.linepointNearestMouse(realX, realY);
      let dx = realX - linepoint.x;
      let dy = realY - linepoint.y;
      // root of dx^2 + dy^2
      let distance = Math.abs(Math.sqrt(dx * dx + dy * dy));
      console.log('🚀 ~ lineGroup.current.getLines ~ distance', distance);
      if (distance < 5) {
        console.log('line current:', el);
      }

      if (distance < 5 && isDeleting) {
        console.log('remove; mouse on line; 🐁');
        console.log('remove el ', el);

        stageGroup.current[pageNumber.current - 1].removeConnectingLine(
          el.startItem,
          el.endItem,
          el.lineData
        );

        clearAndDraw();
        return;
      }
    });
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

    // reset tooltip; place tooltip on mouse pallet shape
    tooltipRef.current.style.display = 'none';
    palletGroup.current.getShapesAsArray().forEach((element) => {
      if (element.isMouseInShape(realX, realY)) {
        console.log(`💃🏻YES in pallet shape ${element.type}`);
        tooltipRef.current.style.display = 'block';
        tooltipRef.current.style.top = realY - 5 + 'px';
        tooltipRef.current.style.left = realX + 60 + 'px';
        tooltipRef.current.textContent = element.text;

        return;
      }
    });

    stageTooltipRef.current.style.display = 'none';
    stageGroup.current[pageNumber.current - 1]
      .getShapesAsArray()
      .forEach((el) => {
        if (el.isMouseInShape(realX, realY)) {
          // mouse on current stageShape
          console.log(`💃🏻YES in stage shape ${el.type}${el.text}`);

          if (el.type === 'switch') {
            // if not false returned; else exitpoint returned
            const isNearExitPoint = el.isNearExitPointSwitch(realX, realY);
            if (isNearExitPoint) {
              stageTooltipRef.current.style.display = 'block';
              stageTooltipRef.current.style.top = realY + 10 + 'px';
              stageTooltipRef.current.style.left = realX + 30 + 'px';
              stageTooltipRef.current.textContent = isNearExitPoint;
            }
          }
          if (el.type === 'playMenu') {
            const isNearExitPoint = el.isNearExitPointMenu(realX, realY);
            if (isNearExitPoint) {
              stageTooltipRef.current.style.display = 'block';
              stageTooltipRef.current.style.top = realY + 10 + 'px';
              stageTooltipRef.current.style.left = realX + 30 + 'px';
              stageTooltipRef.current.textContent = isNearExitPoint;
            }
          }

          return;
        }
      });

    // place and display line tooltip

    lineTooltipRef.current.style.display = 'none';
    // check mouse on line
    lineGroup.current.getLines().forEach((el) => {
      // if exitPoint present; check distance to place tooltip
      if (el.lineData?.exitPoint) {
        const linepoint = el.linepointNearestMouse(realX, realY);
        let dx = realX - linepoint.x;
        let dy = realY - linepoint.y;
        // root of dx^2 + dy^2
        let distance = Math.abs(Math.sqrt(dx * dx + dy * dy));
        if (distance < 5) {
          // mouse on line el
          lineTooltipRef.current.style.display = 'block';
          lineTooltipRef.current.style.top = realY + 10 + 'px';
          lineTooltipRef.current.style.left = realX + 30 + 'px';
          lineTooltipRef.current.textContent = el.lineData.exitPoint;
        }
      }
    });
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

      const count = shapeCount.current[palletFigureDragged.type]++;

      // id = value|pageNumber|count
      stageGroup.current[pageNumber.current - 1].addShape(
        palletFigureDragged.type,
        realX,
        realY,
        count,
        pageNumber.current
      );
      clearAndDraw();
    }

    if (realX == startX1 && realY == startY1) {
      // mouse clicked, released same spot in stage shape, check mouse in stage shape
      stageGroup.current[pageNumber.current - 1]
        .getShapesAsArray()
        .forEach((element) => {
          if (
            element.isMouseInShape(realX, realY) &&
            element.type !== 'connector'
          ) {
            console.log(
              `YES in pallet shape mouseUp ${JSON.stringify(element, null, 2)}`
            );
            currentShape.current = element;
            currentShape.current.setSelected(true);
            clearAndDraw();
            setIsOpenDrawer(true);
            return;
          }
        });
    }
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
      connectShape1.current.type === 'jumper' &&
      connectShape1.current.userValues?.type === 'exit'
    ) {
      infoMessage.current = 'cannot connect exit jumper.';
      setShowInfoMessage(true);

      return;
    }

    // return if 2nd shape is an entry jumper
    if (
      connectShape2.current.type === 'jumper' &&
      connectShape2.current.userValues?.type === 'entry'
    ) {
      infoMessage.current = 'cannot connect to entry jumper.';
      setShowInfoMessage(true);
      return;
    }

    if (connectShape1.current.type === 'switch') {
      // if it is an exit point
      if (isSwitchExitPoint.current) {
        console.log('connect exit point../🟢', isSwitchExitPoint.current);

        let position = connectShape1.current.userValues.switchArray.findIndex(
          (row) => row.exitPoint == isSwitchExitPoint.current
        );
        if (position !== -1) {
          // update switchArray to add id of second shape

          connectShape1.current.userValues.switchArray[position].nextId =
            connectShape2.current.id;
          clearAndDraw();
          return;
        }

        // update defaultExitNextId to add id of 2nd shape
        connectShape1.current.userValues.default.nextId =
          connectShape2.current.id;
        clearAndDraw();
        return;
      }
      infoMessage.current = 'Choose a switch action to connect.';
      setShowInfoMessage(true);
      return;
    }

    // if shape1 playMenu
    if (connectShape1.current.type === 'playMenu') {
      if (isMenuExitPoint.current) {
        console.log('yes menu exit', isMenuExitPoint);
        const index = connectShape1.current.userValues.items.findIndex(
          (row) => row.action === isMenuExitPoint.current
        );
        if (index !== -1) {
          connectShape1.current.userValues.items[index].nextId =
            connectShape2.current.id;
          clearAndDraw();
        }
        return;
      }

      infoMessage.current =
        connectShape1.current.userValues.items.length === 0
          ? 'Add a menu action to connect.'
          : 'Choose a menu action to connect.';
      setShowInfoMessage(true);
      return;
    }

    // playMessage to connector connection; add to connectors array
    if (
      connectShape1.current.type === 'playMenu' &&
      connectShape2.current.type === 'connector'
    ) {
      connectShape1.current.setConnectors(connectShape2.current.id);
      console.log('Connector array:⚡', connectShape1.current);
    }

    // shape1 connector
    if (
      connectShape1.current.type === 'connector' &&
      connectShape2.current.type !== 'connector'
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
    connectShape1.current.setSelected(false);
    connectShape2.current.setSelected(false);
    clearAndDraw();
  }

  function handlePageChange(e, pageNum) {
    console.log('pageNum:📄 ' + pageNum);
    pageNumber.current = pageNum;
    clearAndDraw();
  }
  function generateConfigFile() {
    // setOpenSnackbar(true);
    const str = generateJS();
    // if str false; prevent config generation
    if (!str) return;

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

    if (
      stageGroup.current[pageNumber.current - 1].getShapesAsArray().length === 0
    ) {
      snackbarMessage.current = `No shapes added to stage.`;
      setOpenSnackbar(true);
      return false;
    }

    // function that loops through all shapes except connector, switch or jumper; and check if they have fn string. if no return that shape name else false
    const isFunctionStringPresent =
      stageGroup.current[pageNumber.current - 1].isFunctionStringPresent();
    if (isFunctionStringPresent) {
      snackbarMessage.current = `Please update ${isFunctionStringPresent}. Default values detected.`;
      setOpenSnackbar(true);
      return false;
    }

    const tempString1 = `function customIVR(IVR){
      IVR.menus =  require('/ivrs/customIVR/menus.json');
      IVR.params = {
        lang: 'en-SA',terminator:'#', maxRetries: 3, maxRepeats: 3,maxCallTime: 240, invalidTransferPoint: 'TP8001', timeoutTransferPoint: 'TP8001', goodbyeMessage: 'std-goodbye', firstTimeout: 10, interTimeout: 5,menuTimeout: 5,		terminateMessage: 'std-terminate', invalidPrompt: 'std-invalid',	timeOutPrompt: 'std-timeout', repeatInfoPrompt: 'std-repeat-info', confirmPrompt: 'std-confirm', cancelPrompt: 'std-cancel',	currency: 'SAR', confirmOption: 1,	cancelOption: 2, invalidAction: 'Disconnect',timeoutAction: 'Disconnect',	logDb: true						
      };
     `;

    const tempString2 = generateInitVariablesJS();
    const tempString3 = stageGroup.current[pageNumber.current - 1]
      .getShapesAsArray()
      .filter((el) => el.functionString)
      .map((el) => el.functionString)
      .join(' ');

    const idOfStartShape =
      stageGroup.current[pageNumber.current - 1].getIdOfFirstShape();

    if (idOfStartShape === null) {
      snackbarMessage.current =
        'Please add a setParams block to start control flow.';
      setOpenSnackbar(true);
      return false;
    }

    const tempString4 =
      stageGroup.current[pageNumber.current - 1].traverseShapes(idOfStartShape);

    console.log('tempString4:😊', tempString4);

    //const tempString4 = generateMainJS();

    // if (!tempString4) {
    //   snackbarMessage.current =
    //     'Please add a setParams block to start control flow.';
    //   setOpenSnackbar(true);
    //   return false;
    // }

    // generate code for each menu block; driver fns for all menu items

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

  function generateMainJS() {
    console.log(
      ' stageGroup.current[pageNumber.current - 1]',
      stageGroup.current[pageNumber.current - 1]
    );
    const [arrayShapesTillMenu, isMenuIndex] =
      stageGroup.current[pageNumber.current - 1].getShapesTillMenu();

    if (arrayShapesTillMenu === null) return false;

    const mainMenuString = `this.ivrMain=async function(){${arrayShapesTillMenu
      .map((el) => `await this.${el}();`)
      .join('')}};`;

    console.log('isMenuIndex🎉', isMenuIndex);

    if (isMenuIndex) {
      const menuString =
        stageGroup.current[pageNumber.current - 1].generateMenuCode(
          isMenuIndex
        );
      return mainMenuString + menuString;
    }

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
        style={{ backgroundColor: '#F7FBFE' }}
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
        isOpen={isOpenDrawer}
        handleCloseDrawer={handleCloseDrawer}
        shape={currentShape.current}
        userVariables={userVariables.current}
        stageGroup={stageGroup.current[pageNumber.current - 1]}
        entireStageGroup={stageGroup.current}
      />
      <ResetCanvasDialog
        open={showCanvasResetDialog}
        handleClose={() => setShowCanvasResetDialog(false)}
      />
      <Typography
        sx={{
          display: 'none',
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
      <Typography
        sx={{
          display: 'none',
          position: 'absolute',
          backgroundColor: '#fce4ec',
          px: 1,
          boxShadow: 1,
          borderRadius: 1,
        }}
        ref={stageTooltipRef}
        variant='subtitle2'
      >
        Im a stageTooltip
      </Typography>
      <Typography
        sx={{
          display: 'none',
          position: 'absolute',
          backgroundColor: '#e0f7fa',
          px: 1,
          boxShadow: 1,
          borderRadius: 1,
        }}
        ref={lineTooltipRef}
        variant='subtitle2'
      >
        Im a lineTooltip
      </Typography>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 10, mr: 5 }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity='warning'
          sx={{ width: '100%' }}
        >
          {snackbarMessage.current}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CanvasComponent;
