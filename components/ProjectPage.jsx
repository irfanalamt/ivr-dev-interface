import {Alert, Box, Snackbar} from '@mui/material';
import {useRef, useState} from 'react';
import PromptList from '../newComponents/PromptList';
import VariableManager from '../newComponents/VariableManager';
import BottomBar from './BottomBar';
import CanvasTest from './Canvas2';
import CanvasAppbar2 from './CanvasAppbar2';
import MainToolbar from './Toolbar';
const prettier = require('prettier');
const babelParser = require('@babel/parser');

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

    const globalParamsString =
      `function ivrName(IVR){
       IVR.params = {
        maxRetries: 3,
        maxRepeats: 3,
        lang: "bcxEn",
        currency: "SAR",
        terminator: "#",
        firstTimeout: 10,
        interTimeout: 5,
        menuTimeout: 5,
        maxCallTime: 3600,
        invalidAction: "Disconnect",
        timeoutAction: "Disconnect",
        confirmOption: 1,
        cancelOption: 2,
        invalidPrompt: "std-invalid",
        timeoutPrompt: "std-timeout",
        cancelPrompt: "std-cancel",
        goodbyeMessage: "std-goodbye",
        terminateMessage: "std-terminate",
        transferPrompt: "std-to-transfer",
        disconnectPrompt: "std-to-disconnect",
        previousMenuPrompt: "std-to-previous-menu",
        mainMenuPrompt: "std-to-main-menu",
        repeatInfoPrompt: "std-to-repeat",
        confirmPrompt: "std-confirm",
        hotkeyMainMenu: "X",
        hotkeyPreviousMenu: "X",
        hotkeyTransfer: "X",
        transferPoint: "",
        invalidTransferPoint: "",
        timeoutTransferPoint: "",
        allowedDigits: "1234567890",
        logDB: false
  };` + '\n \n';

    const allVariablesString = generateInitVariablesJS() + '\n \n';

    const allFunctionStringsAndDriverFunctions =
      traverseAndReturnString(startShape);

    const endProjectBraces = `} \n\n `;
    const endExportString = `module.exports = {ivrName}`;

    const finalCodeString =
      globalParamsString +
      allVariablesString +
      allFunctionStringsAndDriverFunctions +
      endProjectBraces +
      endExportString;

    return formatCode(finalCodeString);
  }

  function formatCode(code) {
    return prettier.format(code, {
      parser: 'babel',
      parser: (text, options) => babelParser.parse(text, options),
      singleQuote: true,
    });
  }

  function generateInitVariablesJS() {
    const codeString = userVariables.current
      .map((v) => `this.${v.name}=${v.defaultValue};`)
      .join('');

    return codeString;
  }

  function findIsDefaultValuesPresent(shapes) {
    for (let shape of shapes) {
      const typesToIgnore = ['connector', 'jumper', 'endFlow'];
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

  function traverseAndReturnString(startShape) {
    const mainMenuCode = generateMainMenuCode(startShape);
    const visitedShapes = new Set();
    const shapeStack = [startShape];
    let codeAndDrivers = '';

    while (shapeStack.length > 0) {
      const currentShape = shapeStack.pop();
      if (visitedShapes.has(currentShape)) continue;

      visitedShapes.add(currentShape);
      console.log(' ➡️' + currentShape.text);
      //TODO: generate code & driver fns for current shape
      codeAndDrivers += generateCode(currentShape);

      const nextShapes = getNextShapes(currentShape);

      nextShapes.forEach((shape) => {
        shapeStack.push(shape);
      });
    }
    return mainMenuCode + codeAndDrivers;
  }

  function generateCode(shape) {
    if (shape.type === 'playMenu') {
      return generateMenuCode(shape);
    }
    if (shape.type === 'switch') {
      return generateSwitchCode(shape);
    }
    const typesToInclude = [
      'setParams',
      'playMessage',
      'playConfirm',
      'getDigits',
      'runScript',
      'callAPI',
    ];
    if (typesToInclude.includes(shape.type)) {
      return shape.functionString;
    }
  }

  function generateMenuCode(shape) {
    let driverFunctionsString = '';
    const items = shape.userValues?.items;

    if (!items.length) {
      return shape.functionString;
    }

    items.forEach((item) => {
      if (item.nextItem) {
        const shapesTillMenuOrSwitch = getShapesTillMenuOrSwitch(item.nextItem);
        const code = `this.${shape.text}_${item.action}=async function(){
          try{${shapesTillMenuOrSwitch
            .map(getDriverFunctionShapeCode)
            .join('')}}catch(err){ IVR.error('Error in ${shape.text}_${
          item.action
        }', err);}
                    };`;
        driverFunctionsString += code;
      }
    });

    return shape.functionString + driverFunctionsString;
  }

  function generateSwitchCode(shape) {
    //TODO: return driver function based on all conditions and connected action
    return '';
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
        shape.userValues.exitItem === exitJumper
    );
  }

  function generateMainMenuCode(startShape) {
    const shapesTillMenuOrSwitch = getShapesTillMenuOrSwitch(startShape);

    const mainMenuString = `this.ivrMain = async function(){
try{${shapesTillMenuOrSwitch.map(getDriverFunctionShapeCode).join('')}}
catch(err) { IVR.error('Error in ivrMain', err); }
    };`;

    return mainMenuString;
  }

  function getShapesTillMenuOrSwitch(startShape) {
    // Avoid shapes that are not relevant for final script
    const typesToIgnore = ['playMenu', 'switch', 'connector', 'jumper'];

    let shapesArray = [];
    if (!typesToIgnore.includes(startShape.type)) {
      shapesArray.push(startShape);
    }

    let nextShape = getNextShapeForSingleExit(startShape);

    while (nextShape) {
      if (!typesToIgnore.includes(nextShape.type)) {
        shapesArray.push(nextShape);
      }
      nextShape = getNextShapeForSingleExit(nextShape);
      if (!nextShape) break;
    }
    return shapesArray;
  }
  function getDriverFunctionShapeCode(shape) {
    if (shape.type === 'endFlow') {
      if (shape.userValues?.type === 'disconnect') {
        return 'IVR.doDisconnect();';
      } else if (shape.userValues?.transferPoint) {
        return `IVR.doTransfer('${shape.userValues.transferPoint}');`;
      }
    } else {
      return `await this.${shape.text}();`;
    }
  }

  function getNextShapeForSingleExit(shape) {
    if (shape.type === 'jumper' && shape.userValues?.type === 'exit') {
      return findEntryJumper(shape, shapes);
    } else if (shape.nextItem) {
      return shape.nextItem;
    }
  }

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
          autoHideDuration={5000}
          onClose={() => setShowSnackbar(false)}>
          <Alert severity={showSnackbar.type}>{showSnackbar.message}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default ProjectPage;
