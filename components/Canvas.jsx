import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import InfoIcon from '@mui/icons-material/Info';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
const prettier = require('prettier');
const babelParser = require('@babel/parser');

import {
  Alert,
  Box,
  Drawer,
  IconButton,
  Pagination,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Shape from '../models/Shape';
import Shapes from '../models/Shapes';
import Lines from '../models/Lines';
import DrawerComponent from './Drawer';
import SetVariables from './SetVariables';
import CanvasAppbar from './CanvasAppbar';
import ResetCanvasDialog from './ResetCanvasDialog';
import { useRouter } from 'next/router';
import SaveFileDialog from './SaveFileDialog';

const CanvasComponent = () => {
  const router = useRouter();
  const { projectData } = router.query;

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isOpenVars, setIsOpenVars] = useState(false);
  const [isConnecting, setIsConnecting] = useState(0);
  const [showInfoMessage, setShowInfoMessage] = useState(false);
  const [showCanvasResetDialog, setShowCanvasResetDialog] = useState(false);
  const [showSaveFileDialog, setShowSaveFileDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [ivrName, setIvrName] = useState('');

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
    endFlow: 1,
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
  const isDragging = useRef(false);
  const isPalletShape = useRef(false);

  let startX, startY;
  let startX1, startY1;
  let clickedInShape = false;

  useEffect(() => {
    initializeCanvas();
    const handleScroll = () => {
      // draw palette dynamically on window scrollY
      scrollOffsetY.current = window.scrollY;

      initializePallette();
      clearAndDraw();
    };
    const handleResize = () => {
      // Update the canvas size
      canvasRef.current.width = window.innerWidth - 20;
      canvasRef.current.height = window.innerHeight * 2;

      initializePallette();
      // Redraw the shapes
      clearAndDraw();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isConnecting == 1) {
      canvasRef.current.style.cursor = 'crosshair';
    } else if (isConnecting == 0) {
      deleteTempShape();
      if (connectShape1.current?.nextItem === 'temp')
        connectShape1.current?.setNextItem(null);
      canvasRef.current.style.cursor = 'default';
      connectShape1.current?.setSelected(false);
      connectShape2.current?.setSelected(false);
      clearAndDraw();
      setShowInfoMessage(false);
    }
  }, [isConnecting]);

  function initializeCanvas() {
    const context = canvasRef.current.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 3;

    if (projectData) {
      const {
        userVariables: userVariablesCurrent,
        stageGroup: stageGroupCurrent,
        shapeCount: shapeCountCurrent,
        pageCount: pageCountCurrent,
        ivrName: ivrNameCurrent,
      } = JSON.parse(projectData);

      userVariables.current = userVariablesCurrent;
      shapeCount.current = shapeCountCurrent;
      setPageCount(pageCountCurrent);
      setIvrName(ivrNameCurrent);

      stageGroup.current = stageGroupCurrent.map((stage) => {
        Object.setPrototypeOf(stage, Shapes.prototype);
        Object.values(stage.shapes).forEach((shape) => {
          Object.setPrototypeOf(shape, Shape.prototype);
        });
        return stage;
      });
    } else {
      resetStage();
    }

    initializePallette();
    contextRef.current = context;
    clearAndDraw();
  }

  function resetStage() {
    router.push({ pathname: '/stageCanvas3' });

    stageGroup.current = [];
    for (let i = 1; i <= pageCount; i++) {
      stageGroup.current.push(new Shapes(`p${i}`, {}));
    }

    shapeCount.current = {
      setParams: 1,
      runScript: 1,
      callAPI: 1,
      playMenu: 1,
      getDigits: 1,
      playMessage: 1,
      playConfirm: 1,
      switch: 1,
      endFlow: 1,
      connector: 1,
      jumper: 1,
    };
  }

  function initializePallette() {
    const paletteHeight = window.innerHeight - 95;

    // Calculate the vertical space that each shape should occupy
    const NUMBER_OF_SHAPES = 12;
    const shapeHeight = paletteHeight / NUMBER_OF_SHAPES;

    const setParams = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 1,
      30,
      25,
      'setParams',
      '#880e4f'
    );
    const runScript = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 2,
      30,
      25,
      'runScript',
      '#bf360c'
    );
    const callAPI = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 3,
      30,
      25,
      'callAPI',
      '#0d47a1'
    );
    const playMenu = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 4,
      30,
      25,
      'playMenu',
      '#004d40'
    );
    const getDigits = new Shape(
      42,
      55 + scrollOffsetY.current + shapeHeight * 5,
      25,
      25,
      'getDigits',
      '#4a148c'
    );
    const playMessage = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 6,
      35,
      25,
      'playMessage',
      '#827717'
    );
    const playConfirm = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 7,
      35,
      25,
      'playConfirm',
      '#33691e'
    );
    const switchShape = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 8,
      30,
      25,
      'switch',
      '#3e2723'
    );
    const endFlow = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 9,
      25,
      25,
      'endFlow',
      '#f8bbd0'
    );
    const connector = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 10,
      25,
      25,
      'connector',
      '#b2dfdb'
    );
    const jumper = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 11,
      25,
      25,
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
      9: endFlow,
      10: connector,
      11: jumper,
    });
  }

  function clearAndDraw() {
    const canvas = contextRef.current;
    // clear canvas
    canvas.clearRect(0, 0, window.innerWidth, window.innerHeight * 2);

    canvas.lineCap = 'round';
    canvas.lineWidth = 1;
    canvas.fillStyle = 'white';

    // draw background palette rectangle
    canvas.shadowColor = '#757575';
    canvas.shadowBlur = 4;
    canvas.shadowOffsetX = 0;
    canvas.shadowOffsetY = 2;

    canvas.fillRect(5, 55 + scrollOffsetY.current, 70, window.innerHeight - 95);

    canvas.shadowColor = 'transparent';
    canvas.shadowBlur = 0;
    canvas.shadowOffsetX = 0;
    canvas.shadowOffsetY = 0;
    canvas.fillStyle = '#616161';
    canvas.font = '20px Arial';

    // display page number in top right corner
    canvas.fillText(
      `P${pageNumber.current}`,
      window.innerWidth * 0.9 - 35,
      80 + scrollOffsetY.current
    );

    if (isDragging.current && !isPalletShape.current) {
      const img = new Image();
      img.src = '/icons/delete.png';

      canvas.drawImage(
        img,
        window.innerWidth - 80,
        window.innerHeight - 95 + scrollOffsetY.current,
        50,
        50
      );
    }

    // draw palette and stage on canvas
    palletGroup.current.drawAllShapes(canvas);
    stageGroup.current[pageNumber.current - 1]?.drawAllShapes(canvas);

    // calculate connections between shapes and draw them
    const connectionsArray =
      stageGroup.current[pageNumber.current - 1].getConnectionsArray();
    lineGroup.current = new Lines([]);
    lineGroup.current.setConnections(connectionsArray);
    lineGroup.current.connectAllPoints(canvas);
  }

  function handleCloseDrawer() {
    setIsOpenDrawer(false);
    initializePallette();
    clearAndDraw();
  }

  function checkMouseInPaletteShape(realX, realY) {
    const shapeEntries = palletGroup.current.getShapesEntries();

    shapeEntries.forEach(([, element]) => {
      if (element.isMouseInShape(realX, realY)) {
        setIsConnecting(0);
        setShowInfoMessage(false);

        currentShape.current = element;
        isDragging.current = true;
        isPalletShape.current = true;
        startX = realX;
        startY = realY;
      }
    });
  }

  function checkMouseInStageShape(realX, realY) {
    const shapeEntries =
      stageGroup.current[pageNumber.current - 1].getShapesEntries();

    shapeEntries.forEach(([key, element]) => {
      if (element.isMouseInShape(realX, realY) && element.id !== 'temp') {
        clickedInShape = true;

        setShowInfoMessage(false);

        if (isConnecting === 1) {
          connectShape1.current = element;
          element.setSelected(true);

          if (
            element.type !== 'switch' &&
            element.type !== 'playMenu' &&
            element.type !== 'endFlow' &&
            element.userValues?.type !== 'exit'
          ) {
            stageGroup.current[pageNumber.current - 1].addTempShape(
              realX,
              realY
            );
            element.setNextItem('temp');
          }
          clearAndDraw();
          setIsConnecting(2);

          if (element.type === 'switch') {
            const isNearExitPoint = element.isNearExitPointSwitch(realX, realY);
            if (isNearExitPoint) {
              stageGroup.current[pageNumber.current - 1].addTempShape(
                realX,
                realY
              );
              element.setNextItem('temp');
            }
            isSwitchExitPoint.current = isNearExitPoint;
          }
          if (element.type === 'playMenu') {
            const isNearExitPoint = element.isNearExitPointMenu(realX, realY);
            if (isNearExitPoint) {
              stageGroup.current[pageNumber.current - 1].addTempShape(
                realX,
                realY
              );
              element.setNextItem('temp');
            }
            isMenuExitPoint.current = isNearExitPoint;
          }
        }
        currentShape.current = element;
        isDragging.current = true;
        isPalletShape.current = false;
        startX = realX;
        startY = realY;
        startX1 = realX;
        startY1 = realY;
      }
    });
  }

  function getRealCoordinates(clientX, clientY) {
    const boundingRect = canvasRef.current.getBoundingClientRect();
    const realX = clientX - boundingRect.left;
    const realY = clientY - boundingRect.top;
    return { realX, realY };
  }
  function resetTooltips() {
    const tooltipRefs = [tooltipRef, stageTooltipRef, lineTooltipRef];
    tooltipRefs.forEach((ref) => (ref.current.style.display = 'none'));
  }

  function handleMouseDown(e) {
    e.preventDefault();
    const { clientX, clientY, button } = e;
    const { realX, realY } = getRealCoordinates(clientX, clientY);
    clickedInShape = false;

    // check if right click
    if (button === 2) {
      setIsConnecting(1);
      return;
    }

    // check if mouse in palette shape
    checkMouseInPaletteShape(realX, realY);

    // check if mouse in stage shape
    checkMouseInStageShape(realX, realY);

    if (!clickedInShape) setIsConnecting(0);
  }

  function handleMouseMove(e) {
    e.preventDefault();
    const { clientX, clientY } = e;
    const { realX, realY } = getRealCoordinates(clientX, clientY);

    if (isDragging.current) {
      if (isConnecting === 0) {
        // drag shape - mousemove
        const dx = realX - startX;
        const dy = realY - startY;
        const current_shape = currentShape.current;

        current_shape.x += dx;
        current_shape.y += dy;

        clearAndDraw();
        startX = realX;
        startY = realY;
      }
      resetTooltips();
      return;
    }

    resetTooltips();

    // place tooltip on mouse pallet shape
    palletGroup.current.getShapesAsArray().forEach((shape) => {
      if (shape.isMouseInShape(realX, realY)) {
        tooltipRef.current.style.display = 'block';
        tooltipRef.current.style.top = realY - 5 + 'px';
        tooltipRef.current.style.left = realX + 30 + 'px';
        tooltipRef.current.textContent = shape.text;
        return;
      }
    });

    // check mouse on stage shapes
    stageGroup.current[pageNumber.current - 1]
      .getShapesAsArray()
      .forEach((shape) => {
        if (shape.isMouseInShape(realX, realY)) {
          if (shape.type === 'switch') {
            const exitPoint = shape.isNearExitPointSwitch(realX, realY);
            if (exitPoint) {
              stageTooltipRef.current.style.display = 'block';
              stageTooltipRef.current.style.top = realY + 10 + 'px';
              stageTooltipRef.current.style.left = realX + 10 + 'px';
              stageTooltipRef.current.textContent = exitPoint;
            }
          }
          if (shape.type === 'playMenu') {
            const exitPoint = shape.isNearExitPointMenu(realX, realY);
            if (exitPoint) {
              stageTooltipRef.current.style.display = 'block';
              stageTooltipRef.current.style.top = realY + 10 + 'px';
              stageTooltipRef.current.style.left = realX + 30 + 'px';
              stageTooltipRef.current.textContent = exitPoint;
            }
          }
          if (shape.type === 'jumper') {
            const jumperType = shape.userValues.type;
            const textContent =
              jumperType === 'exit'
                ? `${shape.text}: EXIT`
                : `${shape.userValues.exitPoint}: ENTRY`;
            stageTooltipRef.current.style.display = 'block';
            stageTooltipRef.current.style.top = realY + 10 + 'px';
            stageTooltipRef.current.style.left = realX + 30 + 'px';
            stageTooltipRef.current.textContent = textContent;
          }

          return;
        }
      });

    // place and display line tooltip
    lineGroup.current.getLines().forEach((line) => {
      if (line.lineData?.exitPoint) {
        const isNearLine = line.isPointNearLine(realX, realY);
        if (isNearLine) {
          lineTooltipRef.current.style.display = 'block';
          lineTooltipRef.current.style.top = realY + 10 + 'px';
          lineTooltipRef.current.style.left = realX + 30 + 'px';
          lineTooltipRef.current.textContent = line.lineData.exitPoint;
        }
      }
    });
  }

  function handleMouseUp(e) {
    e.preventDefault();
    const { clientX, clientY, button } = e;
    const { realX, realY } = getRealCoordinates(clientX, clientY);

    if (button !== 0) return;

    // Handle pallet shape
    if (isPalletShape.current) {
      isPalletShape.current = false;
      isDragging.current = false;

      const palletFigureDragged = currentShape.current;
      // reset shape to palette
      [palletFigureDragged.x, palletFigureDragged.y] =
        palletFigureDragged.getInitPos();

      if (realX < 120) {
        clearAndDraw();
        return;
      }

      const count = shapeCount.current[palletFigureDragged.type]++;
      stageGroup.current[pageNumber.current - 1].addShape(
        palletFigureDragged.type,
        realX,
        realY,
        count,
        pageNumber.current
      );
      clearAndDraw();
    }

    // Handle deleting shapes
    if (currentShape.current && !isPalletShape.current) {
      if (
        currentShape.current.y >
          window.innerHeight - 100 + scrollOffsetY.current &&
        currentShape.current.x + currentShape.current.width / 2 >
          window.innerWidth - 60
      ) {
        stageGroup.current[pageNumber.current - 1].removeShape(
          currentShape.current.id
        );
        clearAndDraw();

        if (
          currentShape.current.type === 'connector' ||
          currentShape.current.type === 'endFlow'
        ) {
          snackbarMessage.current = `${currentShape.current.type} deleted.`;
        } else {
          snackbarMessage.current = `${currentShape.current.text} deleted.`;
        }

        setOpenSnackbar(true);
        return;
      }
    }

    // Handle connecting shapes
    if (isDragging.current && isConnecting === 2) {
      stageGroup.current[pageNumber.current - 1]
        .getShapesEntries()
        .forEach(([key, element]) => {
          if (element.isMouseInShape(realX, realY) && element.id !== 'temp') {
            connectShape2.current = element;
            element.setSelected(true);
            clearAndDraw();
            setIsConnecting(1);
            connectShapes();
            return;
          }
        });
    }

    // Reset dragging mode
    isDragging.current = false;

    // Handle clicking on stage shape
    if (realX === startX1 && realY === startY1) {
      stageGroup.current[pageNumber.current - 1]
        .getShapesAsArray()
        .forEach((element) => {
          if (
            element.isMouseInShape(realX, realY) &&
            element.type !== 'connector' &&
            element.type !== 'tinyCircle'
          ) {
            currentShape.current = element;
            console.log(
              'Current shape: ' + JSON.stringify(currentShape.current, null, 2)
            );
            currentShape.current.setSelected(true);
            setIsOpenDrawer(true);
            clearAndDraw();
            return;
          }
        });
    }
  }

  function handleRightClick(e) {
    e.preventDefault();
  }

  function moveTempShape(e) {
    const { clientX, clientY } = e;
    const { realX, realY } = getRealCoordinates(clientX, clientY);

    const tempShape =
      stageGroup.current[pageNumber.current - 1].getShapes().temp;
    if (tempShape) {
      tempShape.x = realX;
      tempShape.y = realY;
      clearAndDraw();
    }
  }

  function deleteTempShape() {
    delete stageGroup.current[pageNumber.current - 1].getShapes().temp;
  }

  function connectShapes() {
    connectShape1.current.setSelected(false);
    connectShape2.current.setSelected(false);
    if (connectShape1.current.nextItem === 'temp') {
      connectShape1.current.setNextItem(null);
    }
    deleteTempShape();
    clearAndDraw();

    if (connectShape1.current === connectShape2.current) {
      return;
    }

    if (connectShape2.current.nextItem === connectShape1.current.id) {
      displayInfoMessage('invalid connection.');
      return;
    }

    if (connectShape1.current.type === 'endFlow') {
      displayInfoMessage('cannot connect from endFlow.');
      return;
    }

    if (
      connectShape1.current.type === 'jumper' &&
      connectShape1.current.userValues?.type === 'exit'
    ) {
      displayInfoMessage('cannot connect exit jumper.');
      return;
    }

    if (
      connectShape2.current.type === 'jumper' &&
      connectShape2.current.userValues?.type === 'entry'
    ) {
      displayInfoMessage('cannot connect to entry jumper.');
      return;
    }

    if (connectShape1.current.type === 'switch') {
      if (isSwitchExitPoint.current) {
        let position = connectShape1.current.userValues.switchArray.findIndex(
          (row) => row.exitPoint == isSwitchExitPoint.current
        );
        if (position !== -1) {
          connectShape1.current.userValues.switchArray[position].nextId =
            connectShape2.current.id;
          clearAndDraw();
          return;
        }
        connectShape1.current.userValues.default.nextId =
          connectShape2.current.id;
        clearAndDraw();
        return;
      }
      displayInfoMessage('Choose a switch action to connect.');
      return;
    }

    if (connectShape1.current.type === 'playMenu') {
      if (isMenuExitPoint.current) {
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
      displayInfoMessage(
        connectShape1.current.userValues.items.length === 0
          ? 'Add a menu action to connect.'
          : 'Choose a menu action to connect.'
      );
      return;
    }

    connectShape1.current.setNextItem(connectShape2.current.id);
    clearAndDraw();
  }

  function displayInfoMessage(message) {
    infoMessage.current = message;
    setShowInfoMessage(true);
    setTimeout(() => setShowInfoMessage(false), 3000);
  }

  function handleAddPage() {
    const lastPageShapes =
      stageGroup.current[stageGroup.current.length - 1].getShapesAsArray();

    if (lastPageShapes.length === 0) {
      setOpenSnackbar(true);
      snackbarMessage.current = 'Last page is empty. New page cannot be added.';
      return;
    }

    setPageCount((prevCount) => prevCount + 1);
    stageGroup.current.push(new Shapes(`p${pageNumber}`, {}));
  }

  function handleRemovePage() {
    if (pageCount < 2) return;

    const currentStageGroup = stageGroup.current;
    const lastPage = currentStageGroup[currentStageGroup.length - 1];

    if (lastPage.getShapesAsArray().length > 0) {
      snackbarMessage.current = `Cannot remove, page ${currentStageGroup.length} is not empty.`;
      setOpenSnackbar(true);
      return;
    }

    const newPage = Math.min(pageCount - 1, pageNumber.current);
    if (newPage !== pageNumber.current) {
      handlePageChange(null, newPage);
    }
    setPageCount((prevCount) => prevCount - 1);
    currentStageGroup.pop();
  }

  function handlePageChange(e, pageNum) {
    pageNumber.current = pageNum;
    clearAndDraw();
  }

  function setUserVariables(arr) {
    userVariables.current = arr;
  }

  function saveToFile(name) {
    const data = {
      stageGroup: stageGroup.current,
      userVariables: userVariables.current,
      shapeCount: shapeCount.current,
      pageCount: pageCount,
      ivrName: ivrName,
    };

    const file = new Blob([JSON.stringify(data)], { type: 'text/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = `${name}.ivrf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function generateConfigFile() {
    const str = generateJS();
    // if str false; prevent config generation
    if (!str) return;

    const blob = new Blob([str]);
    const href = URL.createObjectURL(blob);

    // create "a" HTML element with href to file & click
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', `${ivrName}.js`); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }

  function generateJS() {
    const entirestageGroup = new Shapes('entireStageGroup');

    // Combine all shapes from current pages
    for (const page of stageGroup.current) {
      entirestageGroup.shapes = {
        ...entirestageGroup.shapes,
        ...page.shapes,
      };
    }

    // Check if there are any shapes added to the stage
    if (!entirestageGroup.getShapesAsArray().length) {
      snackbarMessage.current = `No shapes added to stage.`;
      setOpenSnackbar(true);
      return false;
    }

    // Check if the IVR name is set
    if (!ivrName) {
      snackbarMessage.current = `Please save first to generate script.`;
      setOpenSnackbar(true);
      return false;
    }

    // Check if all shapes have function strings
    const isFunctionStringPresent = entirestageGroup.isFunctionStringPresent();
    if (isFunctionStringPresent) {
      snackbarMessage.current = `Please update ${isFunctionStringPresent}. Default values detected.`;
      setOpenSnackbar(true);
      return false;
    }

    // Global params for the IVR
    const globalParamsString = `function ${ivrName}(IVR){
      IVR.params = {
        maxRetries: 3,
        maxRepeats: 3,
        language: 'enBcx',
        currency: 'SAR',
        terminator: 'X',
        firstTimeout: 10,
        interTimeout: 5,
        menuTimeout: 5,
        maxCallTime: 3600,
        invalidAction: 'disconnect',
        timeoutAction: 'disconnect',
        confirmOption: 1,
        cancelOption: 2,
        invalidPrompt: 'std-invalid',
        timeoutPrompt: 'std-timeout',
        cancelPrompt: 'std-cancel',
        goodbyeMessage: 'std-goodbye',
        terminateMessage: 'std-terminate',
        repeatInfoPrompt: 'std-repeat-info',
        confirmPrompt: 'std-confirm',
        hotkeyMainMenu: 'X',
        hotkeyTransfer: 'X',
        transferPoint: '',
        invalidTransferPoint: '',
        timeoutTransferPoint: '',
        logDB: false
      };
      `;

    // Initialize variables
    const allVariablesString = generateInitVariablesJS();

    // Get all function strings from shapes
    const allFunctionsString = entirestageGroup
      .getShapesAsArray()
      .filter((el) => el.functionString)
      .map((el) => el.functionString)
      .join(' ');

    // Get the ID of the first shape
    const idOfStartShape = entirestageGroup.getIdOfFirstShape();
    if (!idOfStartShape) {
      snackbarMessage.current =
        'Please add a setParams block to start control flow.';
      setOpenSnackbar(true);
      return false;
    }

    // Get driver functions for all shapes
    const allDriverFunctionsString =
      entirestageGroup.traverseShapes(idOfStartShape);

    // End of export statement
    const EndExportString = `} module.exports = ${ivrName} ;`;

    // Combine all strings to create final code
    const finalCodeString =
      globalParamsString +
      allVariablesString +
      allFunctionsString +
      allDriverFunctionsString +
      EndExportString;

    // Format the code using prettier
    const formattedCode = prettier.format(finalCodeString, {
      parser: 'babel',
      parser: (text, options) => babelParser.parse(text, options),
      singleQuote: true,
    });

    return formattedCode;
  }

  function generateInitVariablesJS() {
    let codeString = '';
    userVariables.current.forEach((el) => {
      codeString += `this.${el.name}${el.value ? `=${el.value};` : ';'}`;
    });
    return codeString;
  }

  return (
    <>
      <CanvasAppbar
        isConnecting={isConnecting}
        setIsConnecting={setIsConnecting}
        showResetDialog={() => setShowCanvasResetDialog(true)}
        showSaveFileDialog={() => setShowSaveFileDialog(true)}
        generateFile={generateConfigFile}
        ivrName={ivrName}
      />
      <canvas
        style={{ backgroundColor: '#EFF7FD' }}
        width={window.innerWidth - 20}
        height={window.innerHeight * 2}
        ref={canvasRef}
        onMouseMove={(e) => {
          handleMouseMove(e);
          isConnecting > 0 && moveTempShape(e);
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onContextMenu={handleRightClick}
      ></canvas>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          position: 'fixed',
          bottom: 0,
          backgroundColor: '#eeeeee',
          px: 2,
          height: 35,
          width: '100vw',
        }}
        id='bottomBar'
      >
        <Box sx={{ mt: 1, ml: 1 }}>
          <Tooltip title='setVariables' placement='right-start'>
            <SettingsApplicationsIcon
              sx={{ height: 30 }}
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
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
          <Pagination
            sx={{ height: 30 }}
            count={pageCount}
            shape='rounded'
            onChange={handlePageChange}
            hideNextButton={true}
            hidePrevButton={true}
          />
          <Tooltip title='Add Page'>
            <IconButton onClick={handleAddPage}>
              <AddBoxIcon sx={{ fontSize: 'large' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Remove Page'>
            <IconButton onClick={handleRemovePage}>
              <IndeterminateCheckBoxIcon sx={{ fontSize: 'large' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Drawer
        anchor='left'
        open={isOpenVars}
        onClose={() => setIsOpenVars(false)}
      >
        <SetVariables
          handleCloseDrawer={() => {
            setIsOpenVars(false);
            initializePallette();
            clearAndDraw();
          }}
          userVariables={userVariables.current}
          setUserVariables={setUserVariables}
          entireStageGroup={stageGroup.current}
        />
      </Drawer>
      <DrawerComponent
        isOpen={isOpenDrawer}
        handleCloseDrawer={handleCloseDrawer}
        shape={currentShape.current}
        userVariables={userVariables.current}
        stageGroup={stageGroup.current[pageNumber.current - 1]}
        entireStageGroup={stageGroup.current}
        clearAndDraw={clearAndDraw}
      />
      <ResetCanvasDialog
        open={showCanvasResetDialog}
        handleClose={() => {
          setShowCanvasResetDialog(false);
          clearAndDraw();
        }}
        resetStage={resetStage}
      />
      <SaveFileDialog
        open={showSaveFileDialog}
        handleClose={() => {
          setShowSaveFileDialog(false);
          clearAndDraw();
        }}
        setIvrName={setIvrName}
        saveToFile={saveToFile}
      />
      <Typography
        sx={{
          display: 'none',
          position: 'absolute',
          backgroundColor: '#e1f5fe',
          fontSize: 'small',
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
          backgroundColor: '#dcedc8',
          fontSize: 'small',
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
        sx={{ mt: 5, mr: 1 }}
        open={openSnackbar}
        autoHideDuration={2500}
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
