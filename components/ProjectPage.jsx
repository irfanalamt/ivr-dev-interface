import {Alert, Box, Snackbar} from '@mui/material';
import axios from 'axios';
import {useEffect, useRef, useState} from 'react';
import PromptList from '../newComponents/PromptList';
import VariableManager from '../newComponents/VariableManager';
import {
  checkForStartShape,
  findIsDefaultValuesPresent,
  formatCode,
  generateInitVariablesJS,
  traverseAndReturnString,
} from '../src/codeGeneration';
import BottomBar from './BottomBar';
import CanvasTest from './Canvas2';
import CanvasAppbar2 from './CanvasAppbar2';
import MainToolbar from './Toolbar';
import Shape from '../newModels/Shape';

function ProjectPage({ivrName, user}) {
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

  useEffect(() => {
    fetchProjectFromDB();
  }, []);

  function fetchProjectFromDB() {
    const token = localStorage.getItem('token');
    const storedIvrName = JSON.parse(localStorage.getItem('ivrName'));

    if (storedIvrName && storedIvrName.name) {
      axios
        .get('/api/getProject2', {
          params: {
            name: `${storedIvrName.name}_${storedIvrName.version}`,
          },
          headers: {Authorization: token},
        })
        .then((response) => {
          console.log(response.data);
          const {shapes, tabs, userVariables: newUserVariables} = response.data;

          const newShapes = shapes.map((shape) => {
            const count = shapeCount.current[shape.type]++;
            const newShape = new Shape(
              shape.x,
              shape.y,
              shape.type,
              shape.pageNumber
            );
            newShape.setTextAndId(count);
            return newShape;
          });
          newUserVariables.forEach((v) => userVariables.current.push(v));

          setShapes(newShapes);
          setTabs(tabs);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

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

    const fileName = `${ivrName.name}_${ivrName.version}.js`;
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

    const functionName = `${ivrName.name}_${ivrName.version}`;

    const globalParamsString =
      `function ${functionName}(IVR){
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

    const allVariablesString =
      generateInitVariablesJS(userVariables.current) + '\n \n';

    const allFunctionStringsAndDriverFunctions =
      traverseAndReturnString(startShape);

    const endProjectBraces = `} \n\n `;
    const endExportString = `module.exports = {${functionName}}`;

    const finalCodeString =
      globalParamsString +
      allVariablesString +
      allFunctionStringsAndDriverFunctions +
      endProjectBraces +
      endExportString;

    return formatCode(finalCodeString);
  }

  async function saveToDb() {
    try {
      const token = localStorage.getItem('token');
      const data = {
        email: user?.name ?? 'guest',
        name: `${ivrName.name}_${ivrName.version}`,
        shapes,
        tabs,
        shapeCount: shapeCount.current,
        userVariables: userVariables.current,
        token,
      };
      const response = await axios.post('/api/saveProject2', data);

      setShowSnackbar({
        message: `Project saved successfully.`,
        type: 'success',
      });
      return response.data;
    } catch (err) {
      console.log('Failed to insert document', err);
    }
  }

  return (
    <Box onContextMenu={handleContextMenuPage}>
      <CanvasAppbar2
        resetSelectedItemToolbar={resetSelectedItemToolbar}
        handleGenerateConfigFile={handleGenerateConfigFile}
        ivrName={ivrName}
        saveToDb={saveToDb}
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
