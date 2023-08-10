import {Alert, Box, Snackbar} from '@mui/material';
import axios from 'axios';
import {useEffect, useRef, useState} from 'react';
import PromptList from '../newComponents/PromptList';
import VariableManager from '../newComponents/VariableManager';
import {
  checkForStartShape,
  findEntryCount,
  findIsDefaultValuesPresent,
  findIsErrorsPresent,
  formatCode,
  generateInitVariablesJS,
  traverseAndReturnString,
} from '../src/codeGeneration';
import BottomBar from './BottomBar';
import CanvasTest from './Canvas2';
import CanvasAppbar2 from './CanvasAppbar2';
import MainToolbar from './Toolbar';
import Shape from '../newModels/Shape';
import MainUserGuide from '../newComponents/MainUserGuide';

function ProjectPage({ivrName, user, openIvrDialog, updateUser}) {
  const [selectedItemToolbar, setSelectedItemToolbar] = useState({});
  const [openVariableManager, setOpenVariableManager] = useState(false);
  const [openPromptList, setOpenPromptList] = useState(false);
  const [openUserGuide, setOpenUserGuide] = useState(false);
  const [userVariables, setUserVariables] = useState([]);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [tabs, setTabs] = useState([
    {id: 1, label: 'Page1'},
    {id: 2, label: 'Page2'},
  ]);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const isLoadFromDb = useRef(false);

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

  useEffect(() => {
    fetchProjectFromDB();
  }, []);

  function fetchProjectFromDB() {
    const token = localStorage.getItem('token');
    const storedIvrName = JSON.parse(sessionStorage.getItem('ivrName'));

    let retries = 2;

    const makeRequest = () => {
      if (storedIvrName?.name) {
        axios
          .get('/api/getProject2', {
            params: {
              name: `${storedIvrName.name}_${storedIvrName.version}`,
            },
            headers: {Authorization: token},
          })
          .then((response) => {
            const {
              shapes,
              tabs,
              userVariables: newUserVariables,
              shapeCount: newShapeCount,
            } = response.data;

            shapeCount.current = newShapeCount;

            const newShapes = createShapesFromResponse(shapes);

            isLoadFromDb.current = true;
            setShapes(newShapes);

            updateNextItems(newShapes);

            setUserVariables(newUserVariables);

            setTabs(tabs);
          })
          .catch((error) => {
            // if internal server error; retry twice after 2 seconds
            if (
              error.response &&
              error.response.status === 500 &&
              retries > 0
            ) {
              retries--;
              setTimeout(makeRequest, 2000);
            } else {
              console.error(error);
            }
          });
      }
    };

    makeRequest();
  }

  function createShapesFromResponse(shapes) {
    return shapes.map((shape) => {
      const {
        x,
        y,
        type,
        pageNumber,
        text,
        id,
        functionString,
        nextItemId,
        userValues,
        isComplete,
      } = shape;

      const newShape = new Shape(x, y, type, pageNumber);
      newShape.text = text;
      newShape.id = id;
      newShape.functionString = functionString;
      newShape.nextItemId = nextItemId;
      newShape.isComplete = isComplete;

      if (type === 'playConfirm') {
        newShape.yes = shape.yes ?? {};
        newShape.no = shape.no ?? {};
      }

      if (userValues) {
        newShape.setUserValues(JSON.parse(userValues));
      }

      return newShape;
    });
  }

  function updateNextItems(newShapes) {
    newShapes.forEach((shape) => {
      if (shape.type === 'playMenu') {
        updatePlayMenuNextItems(shape, newShapes);
      } else if (shape.type === 'switch') {
        updateSwitchNextItems(shape, newShapes);
      } else if (shape.type === 'playConfirm') {
        updatePlayConfirmNextItems(shape, newShapes);
      } else if (shape.type === 'jumper' && shape.userValues?.type === 'exit') {
        updateJumperNextItem(shape, newShapes);
      } else if (shape.nextItemId) {
        shape.nextItem = getShapeById(shape.nextItemId, newShapes);
      }
    });
  }

  function updateJumperNextItem(shape, newShapes) {
    if (shape.userValues.nextItemId) {
      shape.userValues.nextItem = getShapeById(
        shape.userValues.nextItemId,
        newShapes
      );
    }
  }

  function updatePlayMenuNextItems(shape, newShapes) {
    shape.userValues?.items?.forEach((item) => {
      if (item.nextItemId) {
        item.nextItem = getShapeById(item.nextItemId, newShapes);
      }
    });
  }

  function updateSwitchNextItems(shape, newShapes) {
    shape.userValues?.actions?.forEach((action) => {
      if (action.nextItemId) {
        action.nextItem = getShapeById(action.nextItemId, newShapes);
      }
    });
    if (shape.userValues?.defaultActionNextItemId) {
      shape.userValues.defaultActionNextItem = getShapeById(
        shape.userValues.defaultActionNextItemId,
        newShapes
      );
    }
  }

  function updatePlayConfirmNextItems(shape, newShapes) {
    if (shape.yes.nextItemId) {
      shape.yes.nextItem = getShapeById(shape.yes.nextItemId, newShapes);
    }

    if (shape.no.nextItemId) {
      shape.no.nextItem = getShapeById(shape.no.nextItemId, newShapes);
    }
  }

  function getShapeById(id, shapes) {
    return shapes.find((shape) => shape.id === id);
  }
  function getLabelById(id) {
    const tab = tabs.find((tab) => tab.id === id);
    return tab ? tab.label : null;
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
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
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
      const label = getLabelById(isDefaultValuesPresent.pageNumber);
      setShowSnackbar({
        message: `Default values detected in page ${label}. Please update ${isDefaultValuesPresent.text}.`,
        type: 'error',
      });
      return;
    }

    const isErrorsPresent = findIsErrorsPresent(shapes);
    if (isErrorsPresent) {
      const label = getLabelById(isErrorsPresent.pageNumber);
      setShowSnackbar({
        message: `Error detected in page ${label}. Please update ${isErrorsPresent.text}.`,
        type: 'error',
      });
      return;
    }

    const elementEntryCount = findEntryCount(shapes);
    console.log('🚀 ~ generateJS ~ elementEntryCount:', elementEntryCount);

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
        waitMessage: "std-wait-message",
        hotkeyMainMenu: "X",
        hotkeyPreviousMenu: "X",
        hotkeyTransfer: "X",
        transferPoint: "",
        invalidTransferPoint: "",
        timeoutTransferPoint: "",
        allowedDigits: "1234567890",
        logDB: false
  };` + '\n \n';

    const allVariablesString = generateInitVariablesJS(userVariables) + '\n \n';

    const allFunctionStringsAndDriverFunctions = traverseAndReturnString(
      startShape,
      userVariables,
      elementEntryCount
    );

    const endProjectBraces = `} \n\n `;
    const endExportString = `module.exports = {${functionName}}`;

    const comments = `/*\nivrName:'${ivrName.name}',\nversion:${
      ivrName.version
    },\ndescription:'${ivrName.description}',\nuser:'${
      user ? user.email : 'guest'
    }',\ntimestamp:${Date.now()}\n*/\n\n`;

    const finalCodeString =
      comments +
      globalParamsString +
      allVariablesString +
      allFunctionStringsAndDriverFunctions +
      endProjectBraces +
      endExportString;

    return formatCode(finalCodeString);
  }

  async function saveToDb(showNotification = false) {
    const shapesForDb = prepareShapesForDb(shapes);

    try {
      const token = localStorage.getItem('token');
      const data = createRequestData(
        user,
        ivrName,
        shapesForDb,
        tabs,
        shapeCount,
        userVariables,
        token
      );
      const response = await axios.post('/api/saveProject2', data);

      if (showNotification) {
        setShowSnackbar({
          message: 'Project saved.',
          type: 'success',
        });
      }
      return response.data;
    } catch (err) {
      console.log('Failed to insert document', err);
    }
  }

  function prepareShapesForDb(shapes) {
    return shapes.map((shape) => shape.prepareForDb());
  }

  function createRequestData(
    user,
    ivrName,
    shapes,
    tabs,
    shapeCount,
    userVariables,
    token
  ) {
    return {
      email: user?.name ?? 'guest',
      name: `${ivrName.name}_${ivrName.version}`,
      description: `${ivrName.description}`,
      shapes: shapes,
      tabs: tabs,
      shapeCount: shapeCount.current,
      userVariables: userVariables,
      token: token,
    };
  }

  function renameVariablesInUse(oldName, newName) {
    setShapes((prevShapes) => {
      return prevShapes.map((shape) => {
        const shapeType = shape.type;
        const oldVar = '$' + oldName;
        const newVar = '$' + newName;
        const regex = new RegExp('\\' + oldVar + '\\b', 'g');

        if (['playMessage', 'playConfirm', 'getDigits'].includes(shapeType)) {
          if (shapeType === 'getDigits') {
            const variableName = shape.userValues.variableName;
            if (variableName === oldVar) {
              shape.userValues.variableName = newVar;
            }
          }

          const messageList = shape.userValues?.messageList;

          if (messageList?.length) {
            shape.userValues.messageList = messageList.map((m) => {
              if (m.item === oldVar) {
                m.item = newVar;
              }
              return m;
            });
          }

          const logs = shape.userValues?.logs;
          if (logs.before.text) {
            shape.userValues.logs.before.text = logs.before.text.replace(
              regex,
              newVar
            );
          }

          if (logs.after.text) {
            shape.userValues.logs.after.text = logs.after.text.replace(
              regex,
              newVar
            );
          }
        } else if (shapeType === 'playMenu') {
          const items = shape.userValues?.items;

          if (items?.length) {
            shape.userValues.items = items.map((item) => {
              if (item.prompt === oldVar) {
                item.prompt = newVar;
              }
              return item;
            });
          }

          const logs = shape.userValues?.logs;
          if (logs.before.text) {
            shape.userValues.logs.before.text = logs.before.text.replace(
              regex,
              newVar
            );
          }

          if (logs.after.text) {
            shape.userValues.logs.after.text = logs.after.text.replace(
              regex,
              newVar
            );
          }
        } else if (shapeType === 'switch') {
          const actions = shape.userValues?.actions;

          if (actions?.length) {
            shape.userValues.actions = actions.map((action) => {
              action.condition = action.condition.replace(regex, newVar);
              return action;
            });
          }
        } else if (shapeType === 'runScript') {
          const script = shape.userValues?.script;

          if (script) {
            shape.userValues.script = script.replace(regex, newVar);
          }
        } else if (shapeType === 'callAPI') {
          const userValues = shape.userValues;

          if (userValues) {
            shape.userValues.inputVars = userValues.inputVars.map((v) => {
              if (v.name === oldName) {
                v.name = newName;
              }
              return v;
            });

            shape.userValues.outputVars = userValues.outputVars.map((v) => {
              if (v.name === oldName) {
                v.name = newName;
              }
              return v;
            });
          }
        } else if (shapeType === 'setParams') {
          const params = shape.userValues?.params;
          if (params?.length) {
            shape.userValues.params = shape.userValues.params.map((p) => {
              if (p.value === oldVar) {
                p.value = newVar;
              }
              return p;
            });
          }
        }

        return shape;
      });
    });
  }

  return (
    <Box onContextMenu={handleContextMenuPage}>
      <CanvasAppbar2
        resetSelectedItemToolbar={resetSelectedItemToolbar}
        handleGenerateConfigFile={handleGenerateConfigFile}
        ivrName={ivrName}
        saveToDb={saveToDb}
        openIvrDialog={openIvrDialog}
        openUserGuide={() => setOpenUserGuide(true)}
        user={user}
        updateUser={updateUser}
        openVariableManager={() => setOpenVariableManager(true)}
        openPromptList={() => setOpenPromptList(true)}
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
          openVariableManager={() => setOpenVariableManager(true)}
          pageNumber={activeTab}
          shapes={shapes}
          setShapes={setShapes}
          shapeCount={shapeCount}
          saveToDb={saveToDb}
          isLoadFromDb={isLoadFromDb}
        />
      </div>
      <BottomBar
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
        isOpen={openVariableManager}
        handleClose={() => {
          setOpenVariableManager(false);
          saveToDb();
        }}
        variables={userVariables}
        setVariables={setUserVariables}
        saveToDb={saveToDb}
        renameVariablesInUse={renameVariablesInUse}
        shapes={shapes}
      />
      {openPromptList && (
        <PromptList
          isOpen={openPromptList}
          handleClose={() => setOpenPromptList(false)}
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
      <MainUserGuide
        open={openUserGuide}
        handleClose={() => setOpenUserGuide(false)}
      />
    </Box>
  );
}

export default ProjectPage;
