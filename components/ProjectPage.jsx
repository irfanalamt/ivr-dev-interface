import {Alert, Box, Snackbar} from '@mui/material';
import {useRef, useState} from 'react';
import PromptList from '../newComponents/PromptList';
import VariableManager from '../newComponents/VariableManager';
import BottomBar from './BottomBar';
import CanvasTest from './Canvas2';
import CanvasAppbar2 from './CanvasAppbar2';
import MainToolbar from './Toolbar';
import {replaceDollarString} from '../src/myFunctions';
const prettier = require('prettier');
const babelParser = require('@babel/parser');

function ProjectPage() {
  const [selectedItemToolbar, setSelectedItemToolbar] = useState({});
  const [isVariableManagerOpen, setIsVariableManagerOpen] = useState(false);
  const [isPromptListOpen, setIsPromptListOpen] = useState(false);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [tabs, setTabs] = useState([
    {id: 1, label: 'Page 1'},
    {id: 2, label: 'Page 2'},
  ]);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

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

  function handleTabDoubleClick(tabId) {
    const tabIdx = tabs.findIndex((tab) => tab.id === tabId);
    const updatedTabs = tabs.map((tab, idx) => ({
      ...tab,
      isEditMode: idx === tabIdx,
    }));

    setTabs(updatedTabs);
  }
  function handleLabelChange(tabId) {
    const updatedTabs = tabs.map((tab) =>
      tab.id === tabId ? {...tab, isEditMode: false} : tab
    );
    setTabs(updatedTabs);
  }

  function handleAddTab() {
    const lastTab = tabs[tabs.length - 1];
    const shapeCount = getShapeCountInPageNumber(lastTab.id);

    if (!shapeCount) {
      setShowSnackbar({
        message: `New page creation failed: ${lastTab.label} is empty.`,
        type: 'error',
      });
      return;
    }

    const newTab = {id: Date.now(), label: `Page${tabs.length + 1}`};
    setTabs([...tabs, newTab]);
  }
  function handleChangeTab(id) {
    setActiveTab(id);
  }
  function getShapeCountInPageNumber(id) {
    return shapes.filter((shape) => shape.pageNumber === id).length;
  }
  function handleDeleteTab(id) {
    if (tabs.length === 1) {
      setShowSnackbar({
        message: `Cannot delete page.`,
        type: 'error',
      });
      return;
    }

    const shapeCount = getShapeCountInPageNumber(id);

    if (shapeCount) {
      setShowSnackbar({
        message: `Cannot delete page: ${shapeCount} element${
          shapeCount === 1 ? '' : 's'
        } found.`,
        type: 'error',
      });
      return;
    }

    setTabs((prevTabs) => {
      const filteredTabs = prevTabs.filter((tab) => tab.id !== id);

      if (id === activeTab) {
        setActiveTab(filteredTabs[0].id);
      }

      return filteredTabs;
    });
  }

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
      .map((v) => {
        const defaultValue =
          v.type === 'number' || v.type === 'boolean'
            ? v.defaultValue
            : `'${v.defaultValue}'`;
        return `this.${v.name}=${defaultValue};`;
      })
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

    return '';
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
    const actions = shape.userValues?.actions;

    if (!actions.length) {
      return '';
    }

    let ifCode = '';
    shape.userValues?.actions?.forEach((action) => {
      if (action.nextItem) {
        const actionFlowShapes = getShapesTillMenuOrSwitch(action.nextItem);
        ifCode += `${!ifCode ? 'if' : 'else if'}(${replaceDollarString(
          action.condition
        )}){${actionFlowShapes.map(getDriverFunctionShapeCode).join('')}}`;
      }
    });

    const defaultNextItem = shape.userValues.defaultActionNextItem;
    const defaultFlowShapes = getShapesTillMenuOrSwitch(defaultNextItem);
    const elseFlowShapesCode = defaultFlowShapes
      ? defaultFlowShapes.map(getDriverFunctionShapeCode).join('')
      : '';
    const elseCode = `else{${elseFlowShapesCode}}`;

    const outerCode = `this.${shape.text}= async function(){
      try{
        ${ifCode + elseCode}
      }catch(err){
        IVR.error('Error in ${shape.text}', err);
      }

    };`;

    return outerCode;
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
      shape.userValues?.type === 'exit' &&
      shape.userValues?.nextItem
    ) {
      nextShapes.push(shape.userValues.nextItem);
    } else if (
      shape.type === 'jumper' &&
      shape.userValues?.type === 'entry' &&
      shape.nextItem
    ) {
      nextShapes.push(shape.nextItem);
    } else if (shape.nextItem) {
      nextShapes.push(shape.nextItem);
    }

    return nextShapes;
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
    if (!startShape) return;
    const typesToIgnore = ['connector', 'jumper'];

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
    if (
      shape.type === 'jumper' &&
      shape.userValues?.type === 'exit' &&
      shape.userValues.nextItem
    ) {
      return shape.userValues.nextItem;
    } else if (shape.nextItem) {
      return shape.nextItem;
    } else return null;
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
          pageNumber={activeTab}
          shapes={shapes}
          setShapes={setShapes}
          shapeCount={shapeCount}
        />
      </div>
      <BottomBar
        openVariableManager={() => setIsVariableManagerOpen(true)}
        openPromptList={() => setIsPromptListOpen(true)}
        resetSelectedItemToolbar={resetSelectedItemToolbar}
        tabs={tabs}
        setTabs={setTabs}
        activeTab={activeTab}
        handleChangeTab={handleChangeTab}
        handleAddTab={handleAddTab}
        handleTabDoubleClick={handleTabDoubleClick}
        handleLabelChange={handleLabelChange}
        handleDeleteTab={handleDeleteTab}
      />
      <VariableManager
        isOpen={isVariableManagerOpen}
        handleClose={() => setIsVariableManagerOpen(false)}
        userVariables={userVariables}
      />
      {isPromptListOpen && (
        <PromptList
          isOpen={isPromptListOpen}
          handleClose={() => setIsPromptListOpen(false)}
          shapes={shapes}
        />
      )}

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
