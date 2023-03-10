import {
  AppBar,
  Toolbar,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import PromptList from '../newComponents/PromptList';
import VariableManager from '../newComponents/VariableManager';
import BottomBar from './BottomBar';

import CanvasTest from './Canvas2';
import CanvasAppbar2 from './CanvasAppbar2';
import MainToolbar from './Toolbar';

function TestPage() {
  const [selectedItemToolbar, setSelectedItemToolbar] = useState({});
  const [isVariableManagerOpen, setIsVariableManagerOpen] = useState(false);
  const [isPromptListOpen, setIsPromptListOpen] = useState(false);

  const userVariables = useRef([]);

  useEffect(() => {
    console.log('user vars changed:📍:', userVariables.current);
  }, [userVariables.current]);

  function handleSetSelectedItemToolbar(e, name) {
    console.log('name: ' + name);

    setSelectedItemToolbar((prev) => ({[name]: !prev[name]}));

    console.log('yay:', selectedItemToolbar);
  }
  function resetSelectedItemToolbar() {
    setSelectedItemToolbar({});
  }

  function handleContextMenuPage(e) {
    e.preventDefault();
  }

  return (
    <Box onContextMenu={handleContextMenuPage}>
      <CanvasAppbar2 resetSelectedItemToolbar={resetSelectedItemToolbar} />
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
        />
      </div>
      <BottomBar
        openVariableManager={() => setIsVariableManagerOpen(true)}
        openPromptList={() => setIsPromptListOpen(true)}
        resetSelectedItemToolbar={resetSelectedItemToolbar}
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
    </Box>
  );
}

export default TestPage;
