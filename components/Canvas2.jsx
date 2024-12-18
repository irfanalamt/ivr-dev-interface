import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import {Menu, MenuItem, Typography} from '@mui/material';
import {useEffect, useMemo, useRef, useState} from 'react';
import PeekMenu from '../newComponents/PeekMenu';
import Shape from '../newModels/Shape';
import {
  alignAllShapes,
  drawFilledArrow,
  drawGridLines2,
  drawMultiSelectRect,
  getConnectingLines,
  isPointInRectangle,
} from '../src/myFunctions';
import ElementDrawer from './ElementDrawer';

const CanvasTest = ({
  toolBarObj,
  resetSelectedItemToolbar,
  userVariables,
  openVariableManager,
  pageNumber,
  shapes,
  setShapes,
  shapeCount,
  saveToDb,
  isLoadFromDb,
  resetTabLabelChange,
}) => {
  const [contextMenu, setContextMenu] = useState(null);
  const [isOpenElementDrawer, setIsOpenElementDrawer] = useState(false);
  const [openPeekMenu, setOpenPeekMenu] = useState(false);
  const [connectingMode, setConnectingMode] = useState(0);
  const [exitPointTooltip, setExitPointTooltip] = useState(false);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isToolBarItemSelected = Object.values(toolBarObj)[0];
  const selectedItemToolbar = isToolBarItemSelected
    ? Object.keys(toolBarObj)[0]
    : null;

  const currentShape = useRef(null);
  const isDragging = useRef(false);

  const connectingShapes = useRef(null);

  const selectedShapes = useRef(null);
  const contextMenuItem = useRef(null);

  const isMultiSelectMode = useRef(false);
  const drawnMultiSelectRectangle = useRef(null);

  const multiSelectDragStart = useRef(null);

  const startX = useRef(0);
  const startY = useRef(0);

  const buttonState = useRef(null);

  const shapesInPage = useMemo(
    () => shapes.filter((shape) => shape.pageNumber === pageNumber),
    [pageNumber, shapes]
  );

  useEffect(() => {
    if (contextRef.current) {
      clearAndDraw();
      setTimeout(() => {
        clearAndDraw();
      }, 50);
    }
  }, [pageNumber]);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    contextRef.current = context;

    setTimeout(() => {
      clearAndDraw();
    }, 100);

    if (isLoadFromDb.current === true) {
      isLoadFromDb.current = false;
      setTimeout(() => {
        clearAndDraw();
      }, 100);
    }
  }, [shapes]);

  function clearAndDraw() {
    const ctx = contextRef.current;

    clearCanvas();

    drawGridLines2(ctx, canvasRef.current);

    // Get shapes on the current page
    const shapesToDraw = shapesInPage;

    // Get connecting lines between shapes and draw arrows
    const connectionsArray = getConnectingLines(shapesToDraw);
    connectionsArray.forEach((connection) => {
      drawFilledArrow(
        ctx,
        connection.x1,
        connection.y1,
        connection.x2,
        connection.y2
      );
    });

    // Draw all shapes on the current page
    shapesToDraw.forEach((shape) => shape.drawShape(ctx));

    // Draw the multi-select rectangle if it exists
    if (drawnMultiSelectRectangle.current) {
      const {
        x,
        y,
        width,
        height,
        pageNumber: pnum,
      } = drawnMultiSelectRectangle.current;

      if (pnum === pageNumber)
        drawMultiSelectRect(ctx, x, y, width, height, contextMenuItem.current);
    }
  }

  function clearCanvas() {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  }

  function addNewShape(x, y, type) {
    // to add a new shape to state variable
    const count = shapeCount.current[type]++;
    const newShape = new Shape(x, y, type, pageNumber);
    newShape.setTextAndId(count);
    if (newShape.type === 'setParams' && !hasShapeByText('start')) {
      newShape.text = 'start';
      newShape.isComplete = true;
    }

    setShapes([...shapes, newShape]);
  }

  function deleteShape(shapeToDelete) {
    const index = shapes.indexOf(shapeToDelete);

    if (index === -1) {
      return;
    }

    if (
      shapeToDelete.type === 'jumper' &&
      shapeToDelete.userValues?.type === 'entry'
    ) {
      deleteMatchingExitJumpers(shapeToDelete);
    }

    clearShapesWithNextItem(shapeToDelete);

    setShapes((prevShapes) => {
      return prevShapes.filter((shape) => shape !== shapeToDelete);
    });
  }

  function hasShapeByText(text) {
    return shapes.some((shape) => shape.text === text);
  }

  function deleteMatchingExitJumpers(entryJumper) {
    const updatedShapes = shapes.filter((shape) => {
      if (
        shape.type === 'jumper' &&
        shape.userValues?.type === 'exit' &&
        shape.userValues?.nextItem === entryJumper
      ) {
        clearShapesWithNextItem(shape);
        return false;
      }

      return true;
    });

    setShapes(updatedShapes);
  }

  function clearShapesWithNextItem(deletedShape) {
    shapes.forEach((shape) => {
      if (shape.type === 'playMenu') {
        shape.userValues?.items?.forEach((item) => {
          if (item.nextItem === deletedShape) {
            delete item.nextItem;
          }
        });
      } else if (shape.type === 'switch') {
        shape.userValues?.actions?.forEach((action) => {
          if (action.nextItem === deletedShape) {
            delete action.nextItem;
          }
        });
        if (shape.userValues?.defaultActionNextItem === deletedShape) {
          delete shape.userValues.defaultActionNextItem;
        }
      } else {
        if (shape.nextItem === deletedShape) delete shape.nextItem;
      }
    });
  }
  function clearNextItem(shape) {
    if (shape.type === 'playMenu') {
      shape.userValues?.actions?.forEach((action) => {
        if (action.nextItem) {
          delete action.nextItem;
        }
      });
    } else if (shape.type === 'switch') {
      shape.userValues?.actions?.forEach((action) => {
        if (action.nextItem) {
          delete action.nextItem;
        }
      });
      if (shape.userValues?.defaultActionNextItem) {
        delete shape.userValues.defaultActionNextItem;
      }
    } else {
      if (shape.nextItem) {
        shape.nextItem = null;
      }
    }
  }

  function getRealCoordinates(clientX, clientY) {
    const boundingRect = canvasRef.current.getBoundingClientRect();
    const realX = clientX - boundingRect.left;
    const realY = clientY - boundingRect.top;
    return {realX, realY};
  }

  function handleMouseDown(e) {
    e.preventDefault();

    const {clientX, clientY, button} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);

    if (button !== 0) {
      return;
    }

    resetTabLabelChange();

    if (
      drawnMultiSelectRectangle.current &&
      drawnMultiSelectRectangle.current.pageNumber === pageNumber
    ) {
      // Check if mouse down outside rect; reset this if inside.
      if (isPointInRectangle(realX, realY, drawnMultiSelectRectangle.current)) {
        multiSelectDragStart.current = {x: realX, y: realY};
      } else {
        resetMultiSelect();
      }
      return;
    }

    for (const shape of shapesInPage) {
      if (shape.isMouseInShape(realX, realY)) {
        const exitPoint = shape.isMouseNearExitPoint(realX, realY);
        if (exitPoint && connectingMode === 0) {
          connectingShapes.current = {shape1: shape, exitPoint};
          setConnectingMode(1);
          return;
        }
        isDragging.current = true;
        currentShape.current = shape;
        startX.current = realX;
        startY.current = realY;
        return;
      }
    }

    if (button === 0) {
      resetSelectedElement();

      if (connectingMode === 0) {
        // for multi select
        isMultiSelectMode.current = true;
        startX.current = realX;
        startY.current = realY;
      }
    }
  }

  function handleMouseUp(e) {
    e.preventDefault();

    const {clientX, clientY, button} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);

    // Reset dragging mode
    isDragging.current = false;

    if (multiSelectDragStart.current) {
      multiSelectDragStart.current = false;
      return;
    }

    if (connectingMode === 1) {
      // Check if mouse is inside a shape
      for (const shape of shapesInPage) {
        if (shape.isMouseInShape(realX, realY)) {
          connectingShapes.current.shape2 = shape;

          // If both shapes are different, connect them
          if (
            connectingShapes.current.shape2 !== connectingShapes.current.shape1
          ) {
            connectShapes();
          }

          setConnectingMode(0);
          connectingShapes.current = null;
          clearAndDraw();
          return;
        }
      }

      // Reset selection
      if (connectingShapes.current) {
        resetConnection();
      }

      setConnectingMode(0);
      connectingShapes.current = null;
    }

    if (drawnMultiSelectRectangle.current && isMultiSelectMode.current) {
      // Stop drawing
      isMultiSelectMode.current = false;

      // If rectangle is drawn, check if any shapes are inside it
      const {x, y, width, height, pageNumber} =
        drawnMultiSelectRectangle.current;

      let x1 = x;
      let y1 = y;
      let x2 = x + width;
      let y2 = y + height;

      // Swap coordinates if width or height is negative
      if (width < 0) {
        x1 = x + width;
        x2 = startX.current;
      }
      if (height < 0) {
        y1 = y + height;
        y2 = y;
      }

      drawnMultiSelectRectangle.current = {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1,
        pageNumber,
      };

      selectedShapes.current = shapes.filter(
        (shape) =>
          shape.isInRectangle(x, y, width, height) &&
          shape.pageNumber === pageNumber
      );

      // If there are selected shapes, set them as selected
      if (selectedShapes.current.length) {
        selectedShapes.current.forEach((shape) => shape.setSelected(true));
        clearAndDraw();
      } else {
        // If there are no shapes bound, reset multi select
        resetMultiSelect();
      }
    }
    isMultiSelectMode.current = false;

    // Align all shapes
    alignAllShapes(shapes, setShapes);
  }

  function handleMouseMove(e) {
    e.preventDefault();
    const {clientX, clientY} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);
    setOpenPeekMenu(false);
    setExitPointTooltip(false);

    if (isDragging.current) {
      const draggingShape = currentShape.current;
      const dx = realX - startX.current;
      const dy = realY - startY.current;

      const MIN_X = 85;
      const MAX_X = canvasRef.current.width;
      const MIN_Y = 60;
      const MAX_Y = canvasRef.current.height;

      const inBoundsX =
        draggingShape.x + dx - draggingShape.width / 2 > MIN_X &&
        draggingShape.x + dx + draggingShape.width / 2 < MAX_X;
      const inBoundsY =
        draggingShape.y + dy - draggingShape.height / 2 > MIN_Y &&
        draggingShape.y + dy + draggingShape.height / 2 < MAX_Y;

      if (inBoundsX && inBoundsY) {
        draggingShape.x += dx || 0;
        draggingShape.y += dy || 0;

        clearAndDraw();
        startX.current = realX;
        startY.current = realY;
      }
      return;
    }

    if (multiSelectDragStart.current) {
      const MIN_X = 85;
      const MAX_X = canvasRef.current.width;
      const MIN_Y = 60;
      const MAX_Y = canvasRef.current.height;

      let offsetX = realX - multiSelectDragStart.current.x;
      let offsetY = realY - multiSelectDragStart.current.y;

      let newMultiSelectRectX = drawnMultiSelectRectangle.current.x + offsetX;
      let newMultiSelectRectY = drawnMultiSelectRectangle.current.y + offsetY;

      // Check if the new position of the multiselect rectangle is within bounds
      if (newMultiSelectRectX < MIN_X) {
        offsetX = MIN_X - drawnMultiSelectRectangle.current.x;
      } else if (
        newMultiSelectRectX + drawnMultiSelectRectangle.current.width >
        MAX_X
      ) {
        offsetX =
          MAX_X -
          drawnMultiSelectRectangle.current.width -
          drawnMultiSelectRectangle.current.x;
      }

      if (newMultiSelectRectY < MIN_Y) {
        offsetY = MIN_Y - drawnMultiSelectRectangle.current.y;
      } else if (
        newMultiSelectRectY + drawnMultiSelectRectangle.current.height >
        MAX_Y
      ) {
        offsetY =
          MAX_Y -
          drawnMultiSelectRectangle.current.height -
          drawnMultiSelectRectangle.current.y;
      }

      // Update the position of the multiselect rectangle
      drawnMultiSelectRectangle.current.x += offsetX;
      drawnMultiSelectRectangle.current.y += offsetY;

      // Update the position of the selected shapes, making sure they stay within bounds
      selectedShapes.current?.forEach((shape) => {
        let newShapeX = shape.x + offsetX;
        let newShapeY = shape.y + offsetY;

        if (newShapeX < MIN_X) {
          newShapeX = MIN_X;
        } else if (newShapeX + shape.width > MAX_X) {
          newShapeX = MAX_X - shape.width;
        }

        if (newShapeY < MIN_Y) {
          newShapeY = MIN_Y;
        } else if (newShapeY + shape.height > MAX_Y) {
          newShapeY = MAX_Y - shape.height;
        }

        shape.x = newShapeX;
        shape.y = newShapeY;
      });

      // Redraw the canvas
      clearAndDraw();

      // Update the drag start position
      multiSelectDragStart.current.x = realX;
      multiSelectDragStart.current.y = realY;
      return;
    }

    if (isMultiSelectMode.current) {
      if (!drawnMultiSelectRectangle.current) {
        drawnMultiSelectRectangle.current = {
          x: startX.current,
          y: startY.current,
          width: realX - startX.current,
          height: realY - startY.current,
          pageNumber,
        };
      } else {
        // rectangle already there

        drawnMultiSelectRectangle.current.x = startX.current;
        drawnMultiSelectRectangle.current.y = startY.current;
        drawnMultiSelectRectangle.current.width = realX - startX.current;

        drawnMultiSelectRectangle.current.height = realY - startY.current;
      }

      clearAndDraw();
      return;
    }

    if (connectingMode == 1) {
      // draw connecting arrow from shape1
      const shape1 = connectingShapes.current.shape1;
      let x1, y1;
      if (['connector', 'endFlow', 'jumper'].includes(shape1.type)) {
        [x1, y1] = shape1.getCircularCoordinates(realX, realY);
      } else if (
        shape1.type === 'playMenu' ||
        shape1.type === 'switch' ||
        shape1.type === 'playConfirm'
      ) {
        [x1, y1] = [
          connectingShapes.current.exitPoint.exitX,
          connectingShapes.current.exitPoint.exitY,
        ];
      } else {
        if (shape1.exitPoint) {
          [x1, y1] = [shape1.exitPoint.x, shape1.exitPoint.y];
        } else {
          [x1, y1] = shape1.getBottomCoordinates();
        }
      }

      clearAndDraw();
      drawFilledArrow(contextRef.current, x1, y1, realX, realY);
    }

    if (connectingMode === 0) {
      // change cursor when in element and near exit point
      canvasRef.current.style.cursor = 'default';

      for (const shape of shapesInPage) {
        if (shape.isMouseInShape(realX, realY)) {
          canvasRef.current.style.cursor = 'pointer';
          shouldDisplayPeekMenu(shape);

          const exitPoint = shape.isMouseNearExitPoint(realX, realY);
          if (exitPoint) {
            canvasRef.current.style.cursor = 'crosshair';
            if (
              shape.type == 'playMenu' ||
              shape.type == 'switch' ||
              shape.type == 'playConfirm'
            ) {
              setExitPointTooltip({
                text: exitPoint.name,
                mouseX: clientX + window.scrollX,
                mouseY: clientY + 20 + window.scrollY,
              });
            }
          } else if (shape.type === 'jumper') {
            const type = shape.userValues.type;
            let name = '';

            if (type == 'entry' && shape.userValues.name) {
              name = shape.userValues.name;
            } else if (shape.userValues.nextItem) {
              const nextItem = shape.userValues.nextItem;
              if (nextItem.userValues.name) {
                name = nextItem.userValues.name;
              }
            }

            const capitalizedType = type.toUpperCase();

            setExitPointTooltip({
              text: `${capitalizedType}${name ? `: ${name}` : ''}`,
              mouseX: clientX + window.scrollX,
              mouseY: clientY + 20 + window.scrollY,
            });
          }

          break;
        }
      }
    }
  }

  function handleMouseEnter(e) {
    if (buttonState.current != 0 && e.buttons == 0) {
      // to reset if mouse gone outside while multiselect
      // come back without left mouse down
      handleMouseUp(e);
      resetMultiSelect();
    }
  }

  function handleMouseLeave(e) {
    buttonState.current = e.buttons;
  }

  function handleDoubleClick(e) {
    const {clientX, clientY} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);

    for (const shape of shapesInPage) {
      if (shape.isMouseInShape(realX, realY)) {
        currentShape.current = shape;
        if (shape.type !== 'connector') {
          setIsOpenElementDrawer(true);
        }
        return;
      }
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const itemType = e.dataTransfer.getData('application/reactflow');
    const {clientX, clientY} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);

    addNewShape(realX, realY, itemType);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function resetConnection() {
    const {shape1} = connectingShapes.current;

    if (shape1.type === 'playMenu') {
      const exitPointName = connectingShapes.current.exitPoint.name;

      const index = shape1.userValues?.items.findIndex(
        (item) => item.action === exitPointName
      );

      if (index !== -1) {
        shape1.userValues.items[index].nextItem = undefined;
      }
    } else if (shape1.type === 'switch') {
      const {exitPoint} = connectingShapes.current;

      if (exitPoint.position === exitPoint.totalPoints) {
        shape1.userValues.defaultActionNextItem = undefined;
      } else {
        const exitPointName = exitPoint.name;

        const index = shape1.userValues.actions.findIndex(
          (a) => a.action === exitPointName
        );

        if (index !== -1) {
          shape1.userValues.actions[index].nextItem = undefined;
        }
      }
    } else if (shape1.type === 'playConfirm') {
      const {name} = connectingShapes.current.exitPoint;

      if (name === 'yes') {
        delete shape1.yes.nextItem;
      }
      if (name === 'no') {
        delete shape1.no.nextItem;
      }
    } else {
      shape1.nextItem = undefined;
    }
  }

  function connectShapes() {
    const {shape1, shape2} = connectingShapes.current;

    if (shape1.type === 'jumper' && shape1.userValues?.type !== 'entry') return;

    if (shape2.type === 'jumper' && shape2.userValues?.type === 'entry') return;

    if (shape1.type === 'playMenu') {
      const exitPointName = connectingShapes.current.exitPoint.name;
      const item = shape1.userValues?.items.find(
        (item) => item.action === exitPointName
      );

      if (item) {
        item.nextItem = shape2;
      }
    } else if (shape1.type === 'switch') {
      const {exitPoint} = connectingShapes.current;

      if (exitPoint.position === exitPoint.totalPoints) {
        shape1.userValues.defaultActionNextItem = shape2;
      } else {
        const exitPointName = exitPoint.name;
        const action = shape1.userValues.actions.find(
          (a) => a.action === exitPointName
        );

        if (action) {
          action.nextItem = shape2;
        }
      }
    } else if (shape1.type === 'playConfirm') {
      const exitPointName = connectingShapes.current.exitPoint.name;
      if (exitPointName === 'yes') {
        shape1.yes.nextItem = shape2;
      } else {
        shape1.no.nextItem = shape2;
      }
    } else if (shape2.nextItem === shape1) {
      return;
    } else {
      shape1.nextItem = shape2;
    }
  }

  function shouldDisplayPeekMenu(shape) {
    if (['endFlow', 'connector', 'jumper'].includes(shape.type)) {
      return;
    }

    if (
      ['playMessage', 'playConfirm', 'getDigits'].includes(shape.type) &&
      shape.userValues?.messageList.length > 0
    ) {
      setOpenPeekMenu(shape);
      return;
    }

    if (shape.type === 'playMenu' && shape.userValues?.items.length > 0) {
      setOpenPeekMenu(shape);
      return;
    }

    if (shape.type === 'switch' && shape.userValues?.actions.length > 0) {
      setOpenPeekMenu(shape);
      return;
    }
    if (shape.type === 'runScript' && shape.userValues?.script.length > 0) {
      setOpenPeekMenu(shape);
      return;
    }

    if (shape.type === 'setParams' && shape.userValues?.params.length > 0) {
      setOpenPeekMenu(shape);
      return;
    }

    if (shape.type === 'dial' && shape.userValues?.phoneNum) {
      setOpenPeekMenu(shape);
      return;
    }
  }

  function handleContextMenu(e) {
    e.preventDefault();
    const {clientX, clientY} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);
    if (selectedItemToolbar) return;

    if (drawnMultiSelectRectangle.current) {
      if (
        isPointInRectangle(realX, realY, drawnMultiSelectRectangle.current) &&
        drawnMultiSelectRectangle.current.pageNumber === pageNumber
      ) {
        let items = ['Cut', 'Copy', 'Delete'];
        setContextMenu(
          contextMenu === null
            ? {
                mouseX: clientX,
                mouseY: clientY,
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
          setContextMenu(
            contextMenu === null
              ? {
                  mouseX: clientX,
                  mouseY: clientY,
                  items: items,
                }
              : null
          );
        }
      }

      return;
    }

    for (const shape of shapesInPage) {
      if (shape.isMouseInShape(realX, realY)) {
        if (!contextMenuItem.current) {
          currentShape.current = shape;
          let items = ['Settings', 'Cut', 'Copy', 'Delete'];
          if (shape.type === 'connector') {
            // no settings for connector
            items.splice(0, 1);
          }

          setContextMenu(
            contextMenu === null
              ? {
                  mouseX: clientX,
                  mouseY: clientY,
                  items: items,
                }
              : null
          );
        }
        resetSelectedElement();
        return;
      }
    }

    if (contextMenuItem.current) {
      let items = ['Paste'];
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: clientX,
              mouseY: clientY,
              items: items,
            }
          : null
      );
    }
  }

  function handleContextMenuClick(e, item) {
    e.preventDefault();
    const {clientX, clientY} = e;
    const {realX, realY} = getRealCoordinates(clientX, clientY);
    setContextMenu(null);

    if (drawnMultiSelectRectangle.current) {
      if (item === 'Delete') {
        handleContextMultiDelete();
        return;
      }
      if (item === 'Cut') {
        contextMenuItem.current = 'Cut';
        selectedShapes.current.cutPage = pageNumber;
        clearAndDraw();
        return;
      }
      if (item === 'Copy') {
        contextMenuItem.current = 'Copy';
        clearAndDraw();
        return;
      }
      if (item === 'Paste') {
        if (contextMenuItem.current == 'Copy') {
          handleContextMultiCopyPaste(realX, realY);
        } else if (contextMenuItem.current == 'Cut') {
          handleContextMultiCutPaste(realX, realY);
        }
      }
    } else {
      if (item === 'Settings') {
        handleContextSettings();
        return;
      }

      if (item === 'Delete') {
        handleContextDelete();
        return;
      }
      if (item === 'Cut') {
        contextMenuItem.current = 'Cut';
        currentShape.current.setSelected(true);
        selectedShapes.current = [];
        selectedShapes.current.cutPage = pageNumber;
        selectedShapes.current.push(currentShape.current);
        clearAndDraw();
        return;
      }
      if (item === 'Copy') {
        currentShape.current.setSelected(true);
        selectedShapes.current = [];
        selectedShapes.current.push(currentShape.current);
        contextMenuItem.current = 'Copy';
        clearAndDraw();
        return;
      }

      if (item === 'Paste') {
        if (contextMenuItem.current == 'Copy') {
          handleContextCopyPaste(realX, realY);
        } else if (contextMenuItem.current == 'Cut') {
          handleContextCutPaste(realX, realY);
        }
      }
    }
  }

  function handleContextSettings() {
    const shape = currentShape.current;

    if (shape.type !== 'connector') {
      // console.log('Current shape: ' + JSON.stringify(shape, null, 2));

      shape.setSelected(true);
      setIsOpenElementDrawer(true);
      clearAndDraw();
    }
  }

  function handleContextDelete() {
    deleteShape(currentShape.current);
    currentShape.current = null;
  }
  function handleContextCopyPaste(realX, realY) {
    const currShape = selectedShapes.current[0];
    const offsetX = realX - currShape.x;
    const offsetY = realY - currShape.y;

    const newShape = currShape.copyShape(
      shapeCount,
      shapes,
      offsetX,
      offsetY,
      pageNumber
    );

    clearNextItem(newShape);

    setShapes([...shapes, newShape]);
    resetSelectedElement();
  }

  function handleContextCutPaste(realX, realY) {
    const currShape = selectedShapes.current[0];
    const cutPage = selectedShapes.current.cutPage;
    const offsetX = realX - currShape.x;
    const offsetY = realY - currShape.y;

    if (cutPage !== pageNumber) {
      clearShapesWithNextItem(currShape);
      clearNextItem(currShape);
    }

    const updatedShapes = [...shapes];
    const index = updatedShapes.findIndex((shape) => shape.id === currShape.id);

    if (index !== -1) {
      const newShape = updatedShapes[index];
      newShape.x += offsetX;
      newShape.y += offsetY;
      newShape.pageNumber = pageNumber;

      setShapes(updatedShapes);
    }

    resetSelectedElement();
  }

  function handleContextMultiDelete() {
    selectedShapes.current.forEach((shape) => deleteShape(shape));

    resetMultiSelect();
  }

  function handleContextMultiCopyPaste(realX, realY) {
    const MIN_X = 80;
    const MAX_X = canvasRef.current.width;
    const MIN_Y = 60;
    const MAX_Y = canvasRef.current.height;

    const {x, y, width, height} = drawnMultiSelectRectangle.current;

    let offsetX = realX - (x + width / 2);
    let offsetY = realY - (y + height / 2);

    let newX = x + offsetX;
    let newY = y + offsetY;

    // Check if new position is within bounds
    if (newX < MIN_X) {
      offsetX = MIN_X - x;
      newX = MIN_X;
    } else if (newX + width > MAX_X) {
      offsetX = MAX_X - x - width;
      newX = MAX_X - width;
    }

    if (newY < MIN_Y) {
      offsetY = MIN_Y - y;
      newY = MIN_Y;
    } else if (newY + height > MAX_Y) {
      offsetY = MAX_Y - y - height;
      newY = MAX_Y - height;
    }

    const idMap = {};
    const newShapes = selectedShapes.current.map((shape) =>
      shape.copyShape(shapeCount, shapes, offsetX, offsetY, pageNumber, idMap)
    );

    mapAllValidConnectionsCopy(selectedShapes.current, newShapes, idMap);

    contextMenuItem.current = null;
    setShapes([...shapes, ...newShapes]);
  }

  function mapAllValidConnectionsCopy(selectedShapes, newShapes, idMap) {
    function findNewShapeById(shapeId) {
      return newShapes.find((shape) => shape.id === idMap[shapeId]);
    }

    function updateNextItem(nextItem, newItem, index) {
      if (idMap.hasOwnProperty(nextItem?.id)) {
        newItem[index].nextItem = findNewShapeById(nextItem.id);
      } else {
        newItem[index].nextItem = undefined;
      }
    }

    selectedShapes.forEach((oldShape) => {
      const newShape = findNewShapeById(oldShape.id);

      if (oldShape.type === 'playMenu' && oldShape.userValues?.items) {
        oldShape.userValues.items.forEach((item, i) => {
          updateNextItem(item.nextItem, newShape.userValues.items, i);
        });
      } else if (oldShape.type === 'switch' && oldShape.userValues?.actions) {
        oldShape.userValues.actions.forEach((action, i) => {
          updateNextItem(action.nextItem, newShape.userValues.actions, i);
        });

        if (
          idMap.hasOwnProperty(oldShape.userValues?.defaultActionNextItem?.id)
        ) {
          newShape.userValues.defaultActionNextItem = findNewShapeById(
            oldShape.userValues.defaultActionNextItem.id
          );
        }
      } else {
        if (idMap.hasOwnProperty(oldShape.nextItem?.id)) {
          newShape.nextItem = findNewShapeById(oldShape.nextItem.id);
        }
      }
    });
  }

  function handleContextMultiCutPaste(realX, realY) {
    const MIN_X = 80;
    const MAX_X = canvasRef.current.width;
    const MIN_Y = 60;
    const MAX_Y = canvasRef.current.height;

    const {x, y, width, height} = drawnMultiSelectRectangle.current;

    let offsetX = realX - (x + width / 2);
    let offsetY = realY - (y + height / 2);

    let newX = x + offsetX;
    let newY = y + offsetY;

    // Check if new position is within bounds
    if (newX < MIN_X) {
      offsetX = MIN_X - x;
      newX = MIN_X;
    } else if (newX + width > MAX_X) {
      offsetX = MAX_X - x - width;
      newX = MAX_X - width;
    }

    if (newY < MIN_Y) {
      offsetY = MIN_Y - y;
      newY = MIN_Y;
    } else if (newY + height > MAX_Y) {
      offsetY = MAX_Y - y - height;
      newY = MAX_Y - height;
    }

    drawnMultiSelectRectangle.current.x = newX;
    drawnMultiSelectRectangle.current.y = newY;

    selectedShapes.current.forEach((shape) => {
      shape.x += offsetX;
      shape.y += offsetY;
      shape.pageNumber = pageNumber;
      if (selectedShapes.current.cutPage !== pageNumber) {
        clearInvalidShapesWithNextItem(shape, selectedShapes.current);
        clearInvalidNextItems(shape, selectedShapes.current);
      }

      // Check if shape is within bounds
      if (shape.x < MIN_X) {
        shape.x = MIN_X;
      } else if (shape.x + shape.width > MAX_X) {
        shape.x = MAX_X - shape.width;
      }

      if (shape.y < MIN_Y) {
        shape.y = MIN_Y;
      } else if (shape.y + shape.height > MAX_Y) {
        shape.y = MAX_Y - shape.height;
      }
    });

    setShapes([...shapes]);
    contextMenuItem.current = null;
  }

  function clearInvalidNextItems(shape, selectedShapes) {
    const isValidNextItem = (nextItem) => selectedShapes.includes(nextItem);

    if (shape.type === 'playMenu') {
      shape.userValues?.items?.forEach((action) => {
        if (!isValidNextItem(action.nextItem)) {
          delete action.nextItem;
        }
      });
    } else if (shape.type === 'switch') {
      shape.userValues?.actions?.forEach((action) => {
        if (!isValidNextItem(action.nextItem)) {
          delete action.nextItem;
        }
      });

      if (!isValidNextItem(shape.userValues?.defaultActionNextItem)) {
        delete shape.userValues.defaultActionNextItem;
      }
    } else {
      if (!isValidNextItem(shape.nextItem)) {
        shape.nextItem = null;
      }
    }
  }

  function clearInvalidShapesWithNextItem(deletedShape, selectedShapes) {
    const isShapeIncluded = (shape) => selectedShapes.includes(shape);

    shapes.forEach((shape) => {
      if (shape.type === 'playMenu') {
        shape.userValues?.items?.forEach((item) => {
          if (item.nextItem === deletedShape && !isShapeIncluded(shape)) {
            delete item.nextItem;
          }
        });
      } else if (shape.type === 'switch') {
        shape.userValues?.actions?.forEach((action) => {
          if (action.nextItem === deletedShape && !isShapeIncluded(shape)) {
            delete action.nextItem;
          }
        });

        if (
          shape.userValues?.defaultActionNextItem === deletedShape &&
          !isShapeIncluded(shape)
        ) {
          delete shape.userValues.defaultActionNextItem;
        }
      } else {
        if (shape.nextItem === deletedShape && !isShapeIncluded(shape)) {
          delete shape.nextItem;
        }
      }
    });
  }

  function resetSelectedElement() {
    contextMenuItem.current = null;
    if (selectedShapes.current) {
      selectedShapes.current.forEach((shape) => shape.setSelected(false));
    }
    selectedShapes.current = null;
    clearAndDraw();
  }

  function resetMultiSelect() {
    selectedShapes.current?.forEach((shape) => shape.setSelected(false));
    selectedShapes.current = null;
    drawnMultiSelectRectangle.current = null;
    contextMenuItem.current = null;
    clearAndDraw();
  }

  function handleCloseElementDrawer() {
    setIsOpenElementDrawer(false);
    currentShape.current.setSelected(false);
    clearAndDraw();
    saveToDb();
  }

  return (
    <>
      <canvas
        style={{
          backgroundColor: '#EFF7FD',
          cursor: isToolBarItemSelected
            ? 'none'
            : connectingMode > 0
            ? 'crosshair'
            : 'default',
        }}
        width={2000}
        height={4000}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        ref={canvasRef}
      />
      <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClick}
        disableScrollLock={true}
        anchorReference='anchorPosition'
        anchorPosition={
          contextMenu !== null
            ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
            : undefined
        }
        PaperProps={{
          style: {
            backgroundColor: '#CCCCCC',
          },
        }}>
        {contextMenu?.items.map((item, i) => (
          <MenuItem
            key={i}
            sx={{display: 'flex', alignItems: 'center'}}
            onClick={(e) => handleContextMenuClick(e, item)}>
            {item === 'Settings' && <SettingsIcon sx={{fontSize: '13px'}} />}
            {item === 'Cut' && <ContentCutIcon sx={{fontSize: '13px'}} />}
            {item === 'Copy' && <ContentCopyIcon sx={{fontSize: '13px'}} />}
            {item === 'Delete' && <DeleteIcon sx={{fontSize: '13px'}} />}
            {item === 'Paste' && <ContentPasteIcon sx={{fontSize: '13px'}} />}
            <Typography sx={{ml: 0.5}} fontSize='13px' variant='caption'>
              {item}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
      <ElementDrawer
        shape={currentShape.current}
        shapes={shapes}
        isOpen={isOpenElementDrawer}
        handleCloseDrawer={handleCloseElementDrawer}
        clearAndDraw={clearAndDraw}
        userVariables={userVariables}
        openVariableManager={openVariableManager}
      />
      {openPeekMenu && <PeekMenu shape={openPeekMenu} />}
      {exitPointTooltip && (
        <Typography
          sx={{
            position: 'absolute',
            top: exitPointTooltip.mouseY,
            left: exitPointTooltip.mouseX,
            px: 1,
            backgroundColor: '#fdf5ef',
            fontSize: 13,
          }}
          variant='caption'>
          {exitPointTooltip.text}
        </Typography>
      )}
    </>
  );
};

export default CanvasTest;
