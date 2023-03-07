import {
  AppBar,
  Toolbar,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Box,
} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import VariableManager from '../newComponents/VariableManager';
import BottomBar from './BottomBar';

import CanvasTest from './Canvas2';
import CanvasAppbar2 from './CanvasAppbar2';
import MainToolbar from './Toolbar';

function TestPage() {
  const [selectedItemToolbar, setSelectedItemToolbar] = useState({});
  const [isVariableManagerOpen, setIsVariableManagerOpen] = useState(false);

  const userVariables = useRef([]);

  function handleSetSelectedItemToolbar(e, name) {
    console.log('name: ' + name);

    setSelectedItemToolbar((prev) => ({[name]: !prev[name]}));

    console.log('yay:', selectedItemToolbar);
  }
  function resetSelectedItemToolbar() {
    setSelectedItemToolbar({});
  }

  return (
    <Box>
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
        />
      </div>
      <BottomBar
        openVariableManager={() => setIsVariableManagerOpen(true)}
        resetSelectedItemToolbar={resetSelectedItemToolbar}
      />
      <VariableManager
        isOpen={isVariableManagerOpen}
        handleClose={() => setIsVariableManagerOpen(false)}
        userVariables={userVariables.current}
      />
    </Box>
  );
}

export default TestPage;
