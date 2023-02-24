import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import InfoIcon from '@mui/icons-material/Info';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import {
  Alert,
  Box,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import {useRouter} from 'next/router';
import {useEffect, useRef, useState} from 'react';
import Lines from '../models/Lines';
import Shape from '../models/Shape';
import Shapes from '../models/Shapes';
import CanvasAppbar from './CanvasAppbar';
import DrawerComponent from './Drawer';
import ModuleManager from './ModuleManager';
import PromptList from './PromptList';
import ResetCanvasDialog from './ResetCanvasDialog';
import SaveFileDialog from './SaveFileDialog';
import SetVariables from './SetVariables';
const prettier = require('prettier');
const babelParser = require('@babel/parser');
import {VariableContext} from '../src/context';
import {drawGridLines} from '../src/myFunctions';

const CanvasComponent = ({isModule = false}) => {
  const router = useRouter();
  const {projectData} = router.query;

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isOpenVars, setIsOpenVars] = useState(false);
  const [isOpenModules, setIsOpenModules] = useState(false);

  const [isOpenParamList, setIsOpenParamList] = useState(false);
  const [isConnecting, setIsConnecting] = useState(0);
  const [showInfoMessage, setShowInfoMessage] = useState(false);
  const [showCanvasResetDialog, setShowCanvasResetDialog] = useState(false);
  const [showSaveFileDialog, setShowSaveFileDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [ivrName, setIvrName] = useState('');
  const [contextMenu, setContextMenu] = useState(null);

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
    module: 1,
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
  const promptDescriptionObj = useRef(null);
  const isSuccessToast = useRef(false);

  const multiSelectStartPoint = useRef(null);
  const multiSelectEndPoint = useRef(null);
  const selectedShapes = useRef(null);
  const multiSelectDragStartPoint = useRef(null);

  const contextMenuItem = useRef(null);

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
      deleteConnectShape1NextItem();
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
    if (isModule) router.push('/module');
    else router.push({pathname: '/project'});

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
      module: 1,
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
      36,
      18,
      'setParams',
      '#880e4f'
    );
    const playMessage = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 2,
      40,
      18,
      'playMessage',
      '#827717'
    );
    const getDigits = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 3,
      32,
      16,
      'getDigits',
      '#4a148c'
    );
    const playConfirm = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 4,
      40,
      18,
      'playConfirm',
      '#33691e'
    );
    const playMenu = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 5,
      40,
      18,
      'playMenu',
      '#004d40'
    );
    const runScript = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 6,
      36,
      18,
      'runScript',
      '#bf360c'
    );
    const switchShape = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 7,
      36,
      16,
      'switch',
      '#3e2723'
    );
    const callAPI = new Shape(
      40,
      55 + scrollOffsetY.current + shapeHeight * 8,
      38,
      20,
      'callAPI',
      '#0d47a1'
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
      2: playMessage,
      3: getDigits,
      4: playConfirm,
      5: playMenu,
      6: runScript,
      7: switchShape,
      8: callAPI,
      9: endFlow,
      10: connector,
      11: jumper,
    });
  }

  function clearAndDraw() {
    const ctx = contextRef.current;

    // Clear the canvas
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight * 2);

    // Draw grid lines on the canvas
    drawGridLines(contextRef.current, canvasRef.current);

    // Set the line cap, line width, and fill style
    ctx.lineCap = 'round';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'white';

    // Draw the background palette rectangle with a shadow
    ctx.shadowColor = '#757575';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.fillRect(5, 55 + scrollOffsetY.current, 70, window.innerHeight - 95);

    // Reset the shadow and set the font style
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#616161';
    ctx.font = '20px Arial';

    // Display the current page number in the top right corner
    ctx.fillText(
      `P${pageNumber.current}`,
      window.innerWidth * 0.9 - 35,
      80 + scrollOffsetY.current
    );

    // If the user is dragging a shape and it's not a palette shape, draw a delete icon
    if (isDragging.current && !isPalletShape.current) {
      const img = new Image();
      img.src = '/icons/delete.png';
      ctx.drawImage(
        img,
        window.innerWidth - 80,
        window.innerHeight - 95 + scrollOffsetY.current,
        50,
        50
      );
    }

    // Draw the palette shapes and stage shapes on the canvas
    palletGroup.current.drawAllShapes(ctx);
    stageGroup.current[pageNumber.current - 1]?.drawAllShapes(ctx);

    if (
      multiSelectStartPoint.current &&
      multiSelectEndPoint.current &&
      !selectedShapes.current.pageChanged
    ) {
      const x = multiSelectStartPoint.current.x;

      const y = multiSelectStartPoint.current.y;

      const width =
        multiSelectEndPoint.current.x - multiSelectStartPoint.current.x;
      const height =
        multiSelectEndPoint.current.y - multiSelectStartPoint.current.y;
      //border
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 0.2;
      ctx.strokeRect(x, y, width, height);

      if (contextMenuItem.current == 'Cut') {
        ctx.fillStyle = 'rgba(127,184,226,0.08)';
      } else if (contextMenuItem.current == 'Copy') {
        ctx.fillStyle = 'rgba(0,91,158,0.1)';
      } else {
        ctx.fillStyle = 'rgba(0,114,198,0.08)';
      }

      ctx.fillRect(x, y, width, height);
    }

    // calculate connections between shapes and draw them
    const connectionsArray =
      stageGroup.current[pageNumber.current - 1].getConnectionsArray();
    lineGroup.current = new Lines([]);
    lineGroup.current.setConnections(connectionsArray);
    lineGroup.current.connectAllPoints(ctx);
  }

  function handleCloseDrawer() {
    clearAndDraw();
    setIsOpenDrawer(false);
  }

  function handleContextMenuClick(e, item) {
    const {clientX, clientY} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);
    setContextMenu(null);

    console.log('id:::', item);

    if (item === 'Delete') {
      console.log('delete context');
      handleContextDelete();
      return;
    }

    if (item === 'Cut') {
      // selectedShapes.current.forEach((shape) =>
      //   stageGroup.current[pageNumber.current - 1].removeShape(shape.id)
      // );
      selectedShapes.current.cutPage = pageNumber.current;
      contextMenuItem.current = 'Cut';
      clearAndDraw();
      return;
    }

    if (item === 'Copy') {
      contextMenuItem.current = 'Copy';
      clearAndDraw();
      return;
    }

    if (item === 'Paste') {
      console.log('paste🔥', item);

      if (contextMenuItem.current == 'Copy') {
        handleContextCopyPaste(realX, realY);
      } else if (contextMenuItem.current == 'Cut') {
        console.log('cut-paste🔥', item);
        handleContextCutPaste(realX, realY);
      }
    }
    contextMenuItem.current = null;
  }

  function handleContextDelete() {
    console.log('deleteeee');
    selectedShapes.current.forEach((shape) =>
      stageGroup.current[pageNumber.current - 1].removeShape(shape.id)
    );

    const num = selectedShapes.current.length;

    snackbarMessage.current = `${num} element${num > 1 ? 's' : ''} deleted.`;
    setOpenSnackbar(true);

    resetMultiSelect();

    contextMenuItem.current = null;
  }
  function handleContextCutPaste(realX, realY) {
    const MIN_X = 75;
    const MAX_X = canvasRef.current.width;
    const MIN_Y = 55;
    const MAX_Y = canvasRef.current.height;

    let offsetX = realX - multiSelectStartPoint.current.x;
    let offsetY = realY - multiSelectStartPoint.current.y;

    if (multiSelectStartPoint.current.x + offsetX < MIN_X) {
      offsetX = MIN_X - multiSelectStartPoint.current.x;
    }
    if (multiSelectStartPoint.current.y + offsetY < MIN_Y) {
      offsetY = MIN_Y - multiSelectStartPoint.current.y;
    }
    if (multiSelectEndPoint.current.x + offsetX > MAX_X) {
      offsetX = MAX_X - multiSelectEndPoint.current.x;
    }
    if (multiSelectEndPoint.current.y + offsetY > MAX_Y) {
      offsetY = MAX_Y - multiSelectEndPoint.current.y;
    }

    multiSelectStartPoint.current.x += offsetX;
    multiSelectStartPoint.current.y += offsetY;

    multiSelectEndPoint.current.x += offsetX;
    multiSelectEndPoint.current.y += offsetY;

    selectedShapes.current.forEach((shape) => {
      shape.x += offsetX;
      shape.y += offsetY;
    });

    selectedShapes.current.forEach((shape) =>
      stageGroup.current[selectedShapes.current.cutPage - 1].removeShape(
        shape.id
      )
    );

    if (selectedShapes.current.cutPage !== pageNumber.current) {
      stageGroup.current[
        selectedShapes.current.cutPage - 1
      ].removeConnectionsTo(selectedShapes.current);
    }

    stageGroup.current[pageNumber.current - 1].moveShapes(
      selectedShapes.current
    );

    console.log('selectedShapes:', selectedShapes.current);
    contextMenuItem.current = null;
    clearAndDraw();
  }

  function handleContextCopyPaste(realX, realY) {
    console.log('copy-paste🔥');

    const MIN_X = 75;
    const MAX_X = canvasRef.current.width;
    const MIN_Y = 55;
    const MAX_Y = canvasRef.current.height;

    let offsetX = realX - multiSelectStartPoint.current.x;
    let offsetY = realY - multiSelectStartPoint.current.y;

    if (multiSelectStartPoint.current.x + offsetX < MIN_X) {
      offsetX = MIN_X - multiSelectStartPoint.current.x;
    }
    if (multiSelectStartPoint.current.y + offsetY < MIN_Y) {
      offsetY = MIN_Y - multiSelectStartPoint.current.y;
    }
    if (multiSelectEndPoint.current.x + offsetX > MAX_X) {
      offsetX = MAX_X - multiSelectEndPoint.current.x;
    }
    if (multiSelectEndPoint.current.y + offsetY > MAX_Y) {
      offsetY = MAX_Y - multiSelectEndPoint.current.y;
    }

    multiSelectStartPoint.current.x += offsetX;
    multiSelectStartPoint.current.y += offsetY;

    multiSelectEndPoint.current.x += offsetX;
    multiSelectEndPoint.current.y += offsetY;

    stageGroup.current[pageNumber.current - 1].copyShapes(
      selectedShapes.current,
      offsetX,
      offsetY,
      shapeCount.current,
      pageNumber.current,
      getEntireShapeNames()
    );

    contextMenuItem.current = null;
    resetMultiSelect();
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
            const isNearPoint = element.isNearExitPointSwitch(realX, realY);
            if (isNearPoint) {
              stageGroup.current[pageNumber.current - 1].addTempShape(
                realX,
                realY
              );

              const {position, totalPoints} = isNearPoint;

              console.log('position', position, 'totalPoints', totalPoints);
              if (position < totalPoints - 1) {
                element.userValues.switchArray[position].nextId = 'temp';
              } else {
                element.userValues.default.nextId = 'temp';
              }
            }
            isSwitchExitPoint.current = isNearPoint;
          }
          if (element.type === 'playMenu') {
            const isNearPoint = element.isNearExitPointMenu(realX, realY);
            if (isNearPoint) {
              stageGroup.current[pageNumber.current - 1].addTempShape(
                realX,
                realY
              );

              const {exitPoint} = isNearPoint;

              const index = element.userValues.items.findIndex(
                (row) => row.action === exitPoint
              );
              if (index !== -1) {
                element.userValues.items[index].nextId = 'temp';
              }
            }
            isMenuExitPoint.current = isNearPoint;
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

  function isPointInSelectRectangle(x, y) {
    if (!multiSelectStartPoint.current || !multiSelectEndPoint.current) {
      return false;
    }

    const {x: x1, y: y1} = multiSelectStartPoint.current;
    const {x: x2, y: y2} = multiSelectEndPoint.current;

    return (
      x >= Math.min(x1, x2) &&
      x <= Math.max(x1, x2) &&
      y >= Math.min(y1, y2) &&
      y <= Math.max(y1, y2)
    );
  }

  function getRealCoordinates(clientX, clientY) {
    const boundingRect = canvasRef.current.getBoundingClientRect();
    const realX = clientX - boundingRect.left;
    const realY = clientY - boundingRect.top;
    return {realX, realY};
  }
  function resetTooltips() {
    const tooltipRefs = [tooltipRef, stageTooltipRef, lineTooltipRef];
    tooltipRefs.forEach((ref) => (ref.current.style.display = 'none'));
  }

  function handleMouseDown(e) {
    e.preventDefault();
    const {clientX, clientY, button} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);
    clickedInShape = false;

    if (button === 2) {
      // check if right click
      if (multiSelectEndPoint.current) {
        if (isPointInSelectRectangle(realX, realY)) {
          let items = ['Cut', 'Copy', 'Delete'];
          // drawContextMenu(contextRef.current, realX, realY, items);
          contextMenuItem.current = null;
          clearAndDraw();
          setContextMenu(
            contextMenu === null
              ? {
                  mouseX: realX,
                  mouseY: realY,
                  items: items,
                }
              : null
          );
        } else {
          if (
            contextMenuItem.current == 'Cut' ||
            contextMenuItem.current == 'Copy'
          ) {
            let items = ['Paste'];

            // drawContextMenu(contextRef.current, realX, realY, items);
            setContextMenu(
              contextMenu === null
                ? {
                    mouseX: realX,
                    mouseY: realY,
                    items: items,
                  }
                : null
            );
          }
        }
      } else {
        setIsConnecting(1);
      }

      return;
    }

    if (multiSelectEndPoint.current) {
      if (isPointInSelectRectangle(realX, realY)) {
        multiSelectDragStartPoint.current = {x: realX, y: realY};
      } else {
        resetMultiSelect();
      }

      return;
    }

    // check if mouse in palette shape
    checkMouseInPaletteShape(realX, realY);

    // check if mouse in stage shape
    checkMouseInStageShape(realX, realY);

    if (!clickedInShape) {
      setIsConnecting(0);

      if (!multiSelectEndPoint.current && realX > 75) {
        multiSelectStartPoint.current = {x: realX, y: realY};
      }
    }
  }

  function handleMouseMove(e) {
    e.preventDefault();
    const {clientX, clientY} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);
    const MIN_X = 75;
    const MAX_X = canvasRef.current.width;
    const MIN_Y = 55;
    const MAX_Y = canvasRef.current.height;

    const isDraggingShape =
      isDragging.current && isConnecting === 0 && currentShape.current;

    if (multiSelectDragStartPoint.current) {
      const dx = realX - multiSelectDragStartPoint.current.x;
      const dy = realY - multiSelectDragStartPoint.current.y;

      const inBoundsX =
        multiSelectStartPoint.current.x + dx > MIN_X &&
        multiSelectEndPoint.current.x + dx < MAX_X;
      const inBoundsY =
        multiSelectStartPoint.current.y + dy > MIN_Y &&
        multiSelectEndPoint.current.y + dy < MAX_Y;

      if (inBoundsX && inBoundsY) {
        selectedShapes.current?.forEach((shape) => {
          shape.x += dx || 0;
          shape.y += dy || 0;
        });

        multiSelectStartPoint.current.x += dx || 0;
        multiSelectStartPoint.current.y += dy || 0;
        multiSelectEndPoint.current.x += dx || 0;
        multiSelectEndPoint.current.y += dy || 0;

        multiSelectDragStartPoint.current.x = realX;
        multiSelectDragStartPoint.current.y = realY;

        clearAndDraw();
      }

      return;
    }

    if (multiSelectStartPoint.current && !multiSelectEndPoint.current) {
      clearAndDraw();
      drawMultiSelectRectangle(contextRef.current, realX, realY);
      return;
    }

    if (isDraggingShape) {
      // Drag a single shape
      const dx = realX - startX;
      const dy = realY - startY;
      const shape = currentShape.current;

      const inBoundsX =
        shape.x + dx - shape.width / 2 > MIN_X &&
        shape.x + dx + shape.width / 2 < MAX_X;
      const inBoundsY =
        shape.y + dy - shape.height / 2 > MIN_Y &&
        shape.y + dy + shape.height / 2 < MAX_Y;

      if (inBoundsX && inBoundsY) {
        shape.x += dx || 0;
        shape.y += dy || 0;

        clearAndDraw();
        startX = realX;
        startY = realY;
      }
    }

    resetTooltips();

    // place tooltip on mouse pallet shape
    for (const shape of palletGroup.current.getShapesAsArray()) {
      if (shape.isMouseInShape(realX, realY)) {
        tooltipRef.current.style.display = 'block';
        tooltipRef.current.style.top = realY - 5 + 'px';
        tooltipRef.current.style.left = realX + 30 + 'px';
        tooltipRef.current.textContent = shape.text;
        return;
      }
    }

    // // check mouse on stage shapes

    const stageShapes =
      stageGroup.current[pageNumber.current - 1].getShapesAsArray();
    for (const shape of stageShapes) {
      if (shape.isMouseInShape(realX, realY)) {
        if (shape.type === 'switch') {
          const currentPoint = shape.isNearExitPointSwitch(realX, realY);

          if (currentPoint) {
            stageTooltipRef.current.style.display = 'block';
            stageTooltipRef.current.style.top = realY + 10 + 'px';
            stageTooltipRef.current.style.left = realX + 10 + 'px';
            stageTooltipRef.current.textContent = currentPoint.exitPoint;
          }
        }
        if (shape.type === 'playMenu') {
          const currentPoint = shape.isNearExitPointMenu(realX, realY);
          if (currentPoint) {
            stageTooltipRef.current.style.display = 'block';
            stageTooltipRef.current.style.top = realY + 10 + 'px';
            stageTooltipRef.current.style.left = realX + 30 + 'px';
            stageTooltipRef.current.textContent = currentPoint.exitPoint;
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
    }

    // place and display line tooltip
    lineGroup.current.getLines().forEach((line) => {
      if (line.lineData?.exitPoint) {
        const isNearLine = line.isPointNearLine(realX, realY);
        if (isNearLine) {
          lineTooltipRef.current.style.display = 'block';
          lineTooltipRef.current.style.top = realY - 10 + 'px';
          lineTooltipRef.current.style.left = realX + 15 + 'px';
          lineTooltipRef.current.textContent = line.lineData.exitPoint;
        }
      }
    });
  }

  function handleMouseUp(e) {
    e.preventDefault();
    const {clientX, clientY, button} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);

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
        pageNumber.current,
        isModule
      );
      alignShapes();
      clearAndDraw();
      return;
    }

    if (button !== 0) return;

    if (multiSelectDragStartPoint.current) {
      multiSelectDragStartPoint.current = null;
      return;
    }

    if (multiSelectStartPoint.current && multiSelectEndPoint.current) {
      return;
    }

    if (multiSelectStartPoint.current && !multiSelectEndPoint.current) {
      multiSelectEndPoint.current = {x: realX, y: realY};

      if (multiSelectEndPoint.current.x < multiSelectStartPoint.current.x) {
        let tempx = multiSelectStartPoint.current.x;
        multiSelectStartPoint.current.x = multiSelectEndPoint.current.x;

        multiSelectEndPoint.current.x = tempx;
      }

      if (multiSelectEndPoint.current.y < multiSelectStartPoint.current.y) {
        let tempy = multiSelectStartPoint.current.y;
        multiSelectStartPoint.current.y = multiSelectEndPoint.current.y;

        multiSelectEndPoint.current.y = tempy;
      }

      const shapes = stageGroup.current[
        pageNumber.current - 1
      ]?.getSelectedShapesInRectangle(
        multiSelectStartPoint.current.x,
        multiSelectStartPoint.current.y,
        multiSelectEndPoint.current.x,
        multiSelectEndPoint.current.y
      );

      if (!shapes.length) {
        resetMultiSelect();
        return;
      }

      if (shapes) {
        selectedShapes.current = shapes;
        selectedShapes.current.forEach((shape) => {
          shape.setSelected(true);
        });
      }
    }

    alignShapes();

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

        if (
          currentShape.current.type === 'connector' ||
          currentShape.current.type === 'endFlow'
        ) {
          snackbarMessage.current = `${currentShape.current.type} deleted.`;
        } else {
          snackbarMessage.current = `${currentShape.current.text} deleted.`;
        }
        isDragging.current = false;
        currentShape.current = null;
        clearAndDraw();
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
    clearAndDraw();

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

  function drawMultiSelectRectangle(ctx, realX, realY) {
    ctx.lineWidth = 0.3;
    ctx.strokeStyle = 'black';
    ctx.strokeRect(
      multiSelectStartPoint.current.x,
      multiSelectStartPoint.current.y,
      realX - multiSelectStartPoint.current.x,
      realY - multiSelectStartPoint.current.y
    );
  }

  function resetMultiSelect() {
    multiSelectStartPoint.current = null;
    multiSelectEndPoint.current = null;

    if (selectedShapes.current) {
      selectedShapes.current.forEach((shape) => {
        shape.setSelected(false);
      });
    }

    selectedShapes.current = null;
    multiSelectDragStartPoint.current = null;
    clearAndDraw();
  }

  function alignShapes() {
    stageGroup.current[pageNumber.current - 1].alignAllShapes();
  }

  function handleRightClick(e) {
    e.preventDefault();
  }

  function moveTempShape(e) {
    const {clientX, clientY} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);

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

  function deleteConnectShape1NextItem() {
    const shape1 = connectShape1.current;
    if (!shape1) return;

    if (shape1.nextItem === 'temp') {
      shape1.setNextItem(null);
    }

    if (shape1.type === 'switch') {
      if (isSwitchExitPoint.current) {
        const {position, totalPoints} = isSwitchExitPoint.current;
        if (
          position < totalPoints - 1 &&
          shape1.userValues.switchArray[position].nextId == 'temp'
        ) {
          shape1.userValues.switchArray[position].nextId = undefined;
        } else {
          if (shape1.userValues.default.nextId == 'temp') {
            shape1.userValues.default.nextId = undefined;
          }
        }
      }
    }

    if (shape1.type === 'playMenu') {
      if (isMenuExitPoint.current) {
        shape1.userValues.items.forEach((item) => {
          if (item.nextId == 'temp') item.nextId = undefined;
        });
      }
    }
  }

  function connectShapes() {
    connectShape1.current.setSelected(false);
    connectShape2.current.setSelected(false);

    deleteConnectShape1NextItem();
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
        const currentPoint = isSwitchExitPoint.current;

        const {position, totalPoints} = currentPoint;

        if (position < totalPoints - 1) {
          connectShape1.current.userValues.switchArray[position].nextId =
            connectShape2.current.id;
          clearAndDraw();
          return;
        } else {
          connectShape1.current.userValues.default.nextId =
            connectShape2.current.id;
          clearAndDraw();
          return;
        }
      }
      displayInfoMessage('Choose a switch action to connect.');
      return;
    }

    if (connectShape1.current.type === 'playMenu') {
      if (isMenuExitPoint.current) {
        console.log('exit point:☄️', isMenuExitPoint.current.exitPoint);
        const index = connectShape1.current.userValues.items.findIndex(
          (row) => row.action === isMenuExitPoint.current.exitPoint
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
    if (selectedShapes.current) selectedShapes.current.pageChanged = true;

    clearAndDraw();
  }

  function setUserVariables(arr) {
    userVariables.current = arr;
  }

  function addModule(name, data) {
    const count = shapeCount.current.module++;
    console.log('count==', count);
    stageGroup.current[pageNumber.current - 1].addModule(
      200,
      100 + scrollOffsetY.current,
      count,
      pageNumber.current,
      name,
      data
    );
    setIsOpenModules(false);
    clearAndDraw();
  }

  function postToApi(data) {
    const apiEndpoint = isModule ? '/api/saveModule' : '/api/saveProject';
    const successMessage = isModule
      ? 'Module saved successfully.'
      : 'Project saved successfully.';

    axios
      .post(apiEndpoint, data)
      .then((response) => {
        console.log(response.data);
        isSuccessToast.current = true;
        snackbarMessage.current = successMessage;
        setOpenSnackbar(true);
        setTimeout(() => {
          isSuccessToast.current = false;
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function saveToServer(ivrName) {
    const moduleCode = isModule ? generateJS() : undefined;

    const data = {
      stageGroup: stageGroup.current,
      userVariables: userVariables.current,
      shapeCount: shapeCount.current,
      pageCount: pageCount,
      ivrName: ivrName,
      moduleCode: moduleCode,
    };

    postToApi({filename: ivrName, data: JSON.stringify(data)});
  }

  function generateConfigFile() {
    const jsString = generateJS();

    // Exit if generateJS() returns a falsy value
    if (!jsString) return;

    // Create a Blob object from the JS string
    const configFile = new Blob([jsString], {
      type: 'application/javascript',
    });

    // Create a download link for the config file
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(configFile);
    downloadLink.download = `${ivrName}.js`;
    document.body.appendChild(downloadLink);

    // Trigger the download
    downloadLink.click();

    // Clean up by removing the link and revoking the ObjectURL
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadLink.href);

    clearAndDraw();
  }

  function getEntireStageGroup() {
    const entirestageGroup = new Shapes('entireStageGroup');

    // Combine all shapes from current pages
    for (const page of stageGroup.current) {
      entirestageGroup.shapes = {
        ...entirestageGroup.shapes,
        ...page.shapes,
      };
    }

    return entirestageGroup;
  }

  function getEntireShapeNames() {
    const allNames = getEntireStageGroup()
      .getShapesAsArray()
      .map((shape) => shape.text);

    return allNames;
  }

  function generateJS() {
    const entireStageGroup = getEntireStageGroup();
    const shapes = entireStageGroup.getShapesAsArray();

    if (!shapes.length) {
      return handleSnackbarMessage('No shapes added to stage.');
    }

    if (!ivrName) {
      return handleSnackbarMessage('Please save first to generate script.');
    }

    const missingFunctionString = entireStageGroup.isFunctionStringPresent();
    if (missingFunctionString) {
      return handleSnackbarMessage(
        `Please update ${missingFunctionString}. Default values detected.`
      );
    }

    const globalParamsString =
      `function ${ivrName}(IVR${isModule ? ',inputVars' : ''}){
      ${
        isModule
          ? '//MODULE'
          : `IVR.params = {
      maxRetries: 3, maxRepeats: 3,
      lang: 'bcxEn',
      currency: 'SAR',
      terminator: 'X',
      firstTimeout: 10,
      interTimeout: 5,
      menuTimeout: 5,
      maxCallTime: 3600,
      invalidAction: 'Disconnect',
      timeoutAction: 'Disconnect',
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
      hotkeyPreviousMenu: 'X',
      hotkeyTransfer: 'X',
      transferPoint: '',
      invalidTransferPoint: '',
      timeoutTransferPoint: '',
      logDB: false
    };`
      }` + '\n \n';

    const allVariablesString = generateInitVariablesJS() + '\n \n';
    const allFunctionsString =
      shapes
        .filter((shape) => shape.functionString && shape.type !== 'module')
        .map((shape) => shape.functionString)
        .join(' ') + '\n \n';

    const idOfStartShape = entireStageGroup.getIdOfFirstShape();
    if (!idOfStartShape) {
      return handleSnackbarMessage(
        'Please add a setParams block to start control flow.'
      );
    }

    const returnModuleString = isModule ? generateReturnModuleJS() : '';

    const allDriverFunctionsString = entireStageGroup.traverseShapes(
      idOfStartShape,
      isModule
    );

    const endProjectBraces = `} \n\n `;

    const allModulesCode = generateModuleCode(entireStageGroup);

    const endExportString = !isModule
      ? generateExportString(entireStageGroup)
      : '';

    const finalCodeString =
      globalParamsString +
      allVariablesString +
      allFunctionsString +
      allDriverFunctionsString +
      returnModuleString +
      endProjectBraces +
      allModulesCode +
      endExportString;

    return formatCode(finalCodeString);
  }

  function handleSnackbarMessage(message) {
    snackbarMessage.current = message;
    setOpenSnackbar(true);
    return false;
  }

  function formatCode(code) {
    return prettier.format(code, {
      parser: 'babel',
      parser: (text, options) => babelParser.parse(text, options),
      singleQuote: true,
    });
  }

  function generateExportString(entireStageGroup) {
    const uniqueModules = getUniqueModuleNames(entireStageGroup);
    const moduleNames = uniqueModules.join(',');

    return `module.exports = {${ivrName}${
      moduleNames ? ',' + moduleNames : ''
    }}`;
  }

  function getUniqueModuleNames(entireStageGroup) {
    const moduleNames = [
      ...new Set(
        entireStageGroup
          .getShapesAsArray()
          .filter((el) => el.type === 'module')
          .map((el) => el.text)
      ),
    ];

    return moduleNames;
  }

  function generateModuleCode(entireStageGroup) {
    const uniqueModules = getUniqueModuleNames(entireStageGroup).map((name) =>
      entireStageGroup.getShapesAsArray().find((el) => el.text === name)
    );

    let moduleCodeString = '';
    uniqueModules.forEach((module) => {
      const modData = JSON.parse(module.userValues.data);
      const modCode = modData.moduleCode;
      if (modCode) {
        moduleCodeString += modCode + '\n\n';
      }
    });

    return moduleCodeString;
  }

  function generateReturnModuleJS() {
    const outputVariables = userVariables.current.filter((el) => el.isOutput);
    const codeStringInner = outputVariables
      .map((el) => `this.outputVars.${el.name} = this.${el.name};`)
      .join('');

    const codeStringOuter = `this.endModule = async function() {
  ${codeStringInner}
    };`;

    return codeStringOuter;
  }

  function generateInitVariablesJS() {
    let codeString = '';
    userVariables.current.forEach((el) => {
      codeString += `this.${el.name}${
        isModule && el.isInput
          ? `=inputVars.${el.name};`
          : el.value
          ? `='${el.value}';`
          : ';'
      }`;
    });

    let outputVarsString = '';
    if (isModule) {
      let outputVars = userVariables.current
        .filter((variable) => variable.isOutput)
        .map((variable) => `${variable.name}:'${variable.value}'`)
        .join(',');

      outputVars = '{' + outputVars + '}';

      outputVarsString = `\n\n this.outputVars = ${outputVars}`;
    }

    return codeString + outputVarsString;
  }

  return (
    <div onContextMenu={handleRightClick}>
      <CanvasAppbar
        isConnecting={isConnecting}
        setIsConnecting={setIsConnecting}
        showResetDialog={() => setShowCanvasResetDialog(true)}
        showSaveFileDialog={() => setShowSaveFileDialog(true)}
        generateFile={generateConfigFile}
        ivrName={ivrName}
        saveToServer={saveToServer}
      />
      <canvas
        style={{backgroundColor: '#EFF7FD'}}
        width={window.innerWidth - 20}
        height={window.innerHeight * 2}
        ref={canvasRef}
        onMouseMove={(e) => {
          handleMouseMove(e);
          isConnecting > 0 && moveTempShape(e);
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}></canvas>
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
        id='bottomBar'>
        <Tooltip title='variables' arrow>
          <SettingsApplicationsIcon
            sx={{height: 30}}
            onClick={() => setIsOpenVars(true)}
          />
        </Tooltip>
        <Tooltip title='prompt list' arrow>
          <ListAltIcon
            sx={{height: 28, ml: 2}}
            onClick={() => setIsOpenParamList(true)}
          />
        </Tooltip>

        {!isModule && (
          <Tooltip title='module manager' arrow>
            <ViewModuleIcon
              onClick={() => setIsOpenModules(true)}
              sx={{height: 30, ml: 2}}
            />
          </Tooltip>
        )}

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
          variant='subtitle2'>
          <InfoIcon sx={{mr: 0.5, color: '#ef5350'}} />
          {infoMessage.current}
        </Typography>
        <Box sx={{ml: 'auto', display: 'flex', alignItems: 'center'}}>
          <Pagination
            sx={{height: 30}}
            count={pageCount}
            shape='rounded'
            onChange={handlePageChange}
            hideNextButton={true}
            hidePrevButton={true}
          />
          <Tooltip title='Add Page'>
            <IconButton onClick={handleAddPage}>
              <AddBoxIcon sx={{fontSize: 'large'}} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Remove Page'>
            <IconButton onClick={handleRemovePage}>
              <IndeterminateCheckBoxIcon sx={{fontSize: 'large'}} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Drawer
        anchor='left'
        open={isOpenVars}
        onClose={() => setIsOpenVars(false)}>
        <SetVariables
          handleCloseDrawer={() => {
            setIsOpenVars(false);
          }}
          userVariables={userVariables.current}
          setUserVariables={setUserVariables}
          entireStageGroup={stageGroup.current}
          isModule={isModule}
        />
      </Drawer>
      <Drawer
        anchor='left'
        open={isOpenModules}
        onClose={() => setIsOpenModules(false)}>
        <ModuleManager
          handleCloseDrawer={() => {
            setIsOpenModules(false);
          }}
          addModule={addModule}
        />
      </Drawer>
      {isOpenParamList && (
        <PromptList
          open={isOpenParamList}
          handleClose={() => setIsOpenParamList(false)}
          stageGroup={stageGroup.current}
          promptDescriptionObj={promptDescriptionObj}
        />
      )}
      <VariableContext.Provider
        value={{
          openVariablesDrawer: () => setIsOpenVars(true),
          isModule: isModule,
        }}>
        <DrawerComponent
          isOpen={isOpenDrawer}
          handleCloseDrawer={handleCloseDrawer}
          shape={currentShape.current}
          userVariables={userVariables.current}
          stageGroup={getEntireStageGroup()}
          entireStageGroup={stageGroup.current}
          clearAndDraw={clearAndDraw}
        />
      </VariableContext.Provider>

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
        saveToServer={saveToServer}
        isModule={isModule}
      />
      <Typography
        sx={{
          display: 'none',
          position: 'absolute',
          backgroundColor: '#fdf5ef',
          fontSize: 'small',
          px: 1,
          boxShadow: 1,
        }}
        ref={tooltipRef}
        variant='subtitle2'>
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
        variant='subtitle2'>
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
        variant='subtitle2'>
        Im a lineTooltip
      </Typography>
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        sx={{mt: 5, mr: 1}}
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}>
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={isSuccessToast.current ? 'success' : 'warning'}
          sx={{width: '100%'}}>
          {snackbarMessage.current}
        </Alert>
      </Snackbar>
      <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClick}
        anchorReference='anchorPosition'
        anchorPosition={
          contextMenu !== null
            ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
            : undefined
        }>
        {contextMenu?.items.map((item, i) => (
          <MenuItem onClick={(e) => handleContextMenuClick(e, item)} key={i}>
            {item === 'Cut' && (
              <ContentCutIcon
                sx={{mr: 0.5, fontSize: '1.1rem', color: '#424242'}}
              />
            )}
            {item === 'Copy' && (
              <ContentCopyIcon
                sx={{mr: 0.5, fontSize: '1.1rem', color: '#424242'}}
              />
            )}
            {item === 'Delete' && (
              <DeleteIcon
                sx={{mr: 0.5, fontSize: '1.1rem', color: '#424242'}}
              />
            )}
            {item === 'Paste' && (
              <ContentPasteIcon
                sx={{mr: 0.5, fontSize: '1.1rem', color: '#424242'}}
              />
            )}
            <Typography>{item}</Typography>
          </MenuItem>
        ))}
        {/* <MenuItem onClick={handleCloseContextMenu}>Copy</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Print</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Highlight</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Email</MenuItem> */}
      </Menu>
    </div>
  );
};

export default CanvasComponent;
