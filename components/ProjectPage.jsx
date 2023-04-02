import {Alert, Box, Snackbar} from '@mui/material';
import {useRef, useState} from 'react';
import PromptList from '../newComponents/PromptList';
import VariableManager from '../newComponents/VariableManager';
import BottomBar from './BottomBar';
import CanvasTest from './Canvas2';
import CanvasAppbar2 from './CanvasAppbar2';
import MainToolbar from './Toolbar';

function ProjectPage() {
  const [selectedItemToolbar, setSelectedItemToolbar] = useState({});
  const [isVariableManagerOpen, setIsVariableManagerOpen] = useState(false);
  const [isPromptListOpen, setIsPromptListOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(2);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [shapes, setShapes] = useState([]);
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

  function handleSetSelectedItemToolbar(e, name) {
    setSelectedItemToolbar((prev) => ({[name]: !prev[name]}));
  }
  function resetSelectedItemToolbar() {
    setSelectedItemToolbar({});
  }

  function handleContextMenuPage(e) {
    e.preventDefault();
  }

  function handleGenerateConfigFile() {
    const jsString = generateJS();
    if (!jsString) return;

    return;
    const fileName = 'ivr.js';
    const fileType = 'application/javascript';

    // Create a Blob object from the JS string
    const configFile = new Blob([jsString], {type: fileType});

    // Create download link for config file
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(configFile);
    downloadLink.download = fileName;

    // Append link to body and trigger download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up
    URL.revokeObjectURL(downloadLink.href);
    document.body.removeChild(downloadLink);
  }

  function generateJS() {
    if (!shapes.length) {
      setShowSnackbar({
        message: 'No elements added to workspace.',
        type: 'error',
      });
      return;
    }

    const startShape = checkForStartShape(shapes);
    if (!startShape) {
      setShowSnackbar({
        message:
          "Start element missing. Please add a setParams element with Id set to 'start' to initiate control flow.",
        type: 'error',
      });
      return;
    }

    const isDefaultValuesPresent = findIsDefaultValuesPresent(shapes);
    if (isDefaultValuesPresent) {
      setShowSnackbar({
        message: `Default values detected in page ${isDefaultValuesPresent.pageNumber}. Please update ${isDefaultValuesPresent.text}.`,
        type: 'error',
      });
      return;
    }

    const allFunctionStringsAndDriverFunctions = traverseAndReturnStrings(
      shapes,
      startShape
    );

    //TODO:
    // multi exit elements script driver function generation
    // add all params and uservars
    // return in specified format
  }

  function findIsDefaultValuesPresent(shapes) {
    for (let shape of shapes) {
      const typesToIgnore = ['connector', 'jumper', 'switch', 'endFlow'];
      if (!typesToIgnore.includes(shape.type) && !shape.functionString) {
        return shape;
      }
    }
    return false;
  }

  function checkForStartShape(shapes) {
    const startShape = shapes.find(
      (shape) => shape.type === 'setParams' && shape.text === 'start'
    );

    return startShape;
  }

  function traverseAndReturnStrings(shapes, startShape) {
    // const mainMenuCode = generateMainMenuCode(startShape);
    const visitedShapes = new Set();
    const shapeStack = [startShape];

    while (shapeStack.length > 0) {
      const currentShape = shapeStack.pop();
      if (visitedShapes.has(currentShape)) continue;

      visitedShapes.add(currentShape);
      console.log(' ➡️' + currentShape.text);
      const nextShapes = getNextShapes(currentShape);

      nextShapes.forEach((shape) => {
        shapeStack.push(shape);
      });
    }
  }
  function getNextShapes(shape) {
    let nextShapes = [];

    if (shape.type === 'playMenu') {
      shape.userValues?.items?.forEach((item) => {
        if (item.nextItem) {
          nextShapes.push(item.nextItem);
        }
      });
    } else if (shape.type === 'switch') {
      shape.userValues?.actions?.forEach((action) => {
        if (action.nextItem) {
          nextShapes.push(action.nextItem);
        }
      });
      if (shape.userValues?.defaultActionNextItem) {
        nextShapes.push(shape.userValues.defaultActionNextItem);
      }
    } else if (
      shape.type === 'jumper' &&
      shape.userValues?.type === 'entry' &&
      shape.nextItem
    ) {
      nextShapes.push(shape.nextItem);
    } else if (shape.type === 'jumper' && shape.userValues?.type === 'exit') {
      const correspondingEntryJumper = findEntryJumper(shape, shapes);
      if (correspondingEntryJumper) {
        nextShapes.push(correspondingEntryJumper);
      }
    } else if (shape.nextItem) {
      nextShapes.push(shape.nextItem);
    }

    return nextShapes;
  }

  function findEntryJumper(exitJumper, shapes) {
    return shapes.find(
      (shape) =>
        shape.type === 'jumper' &&
        shape.userValues?.type === 'entry' &&
        shape.userValues.exitName === exitJumper.userValues.name
    );
  }

  function generateMainMenuCode(startShape) {}

  return (
    <Box onContextMenu={handleContextMenuPage}>
      <CanvasAppbar2
        resetSelectedItemToolbar={resetSelectedItemToolbar}
        handleGenerateConfigFile={handleGenerateConfigFile}
      />
      <div style={{display: 'flex'}}>
        <div
          style={{
            width: 75,
            height: '100%',
            backgroundColor: '#FAFAFA',
            position: 'fixed',
            left: 0,
          }}>
          <MainToolbar
            selectedItemToolbar={selectedItemToolbar}
            handleSetSelectedItemToolbar={handleSetSelectedItemToolbar}
          />
        </div>

        <CanvasTest
          toolBarObj={selectedItemToolbar}
          resetSelectedItemToolbar={resetSelectedItemToolbar}
          userVariables={userVariables}
          openVariableManager={() => setIsVariableManagerOpen(true)}
          pageNumber={pageNumber}
          pageCount={pageCount}
          shapes={shapes}
          setShapes={setShapes}
          shapeCount={shapeCount}
        />
      </div>
      <BottomBar
        openVariableManager={() => setIsVariableManagerOpen(true)}
        openPromptList={() => setIsPromptListOpen(true)}
        resetSelectedItemToolbar={resetSelectedItemToolbar}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageCount={pageCount}
        setPageCount={setPageCount}
      />
      <VariableManager
        isOpen={isVariableManagerOpen}
        handleClose={() => setIsVariableManagerOpen(false)}
        userVariables={userVariables}
      />
      <PromptList
        isOpen={isPromptListOpen}
        handleClose={() => setIsPromptListOpen(false)}
      />
      {showSnackbar && (
        <Snackbar
          anchorOrigin={{vertical: 'top', horizontal: 'right'}}
          sx={{mt: 5, mr: 1}}
          open={Boolean(showSnackbar)}
          autoHideDuration={2500}
          onClose={() => setShowSnackbar(false)}>
          <Alert severity={showSnackbar.type}>{showSnackbar.message}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default ProjectPage;
