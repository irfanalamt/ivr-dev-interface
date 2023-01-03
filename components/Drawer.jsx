import { Button, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { useRef } from 'react';
import CallApi from './CallApi';
import EndFlow from './EndFlow';
import FunctionBlock from './FunctionBlock';
import GetDigits from './GetDigits';
import GoToBlock from './GoToBlock';
import PlayConfirm from './PlayConfirm';
import PlayMenu from './PlayMenu';
import PlayMessage from './PlayMessage';
import SetParams from './SetParams3';
import SwitchBlock from './SwitchBlock';

const DrawerComponent = ({
  isOpen,
  handleCloseDrawer,
  shape = null,
  userVariables,
  stageGroup,
  entireStageGroup,
  clearAndDraw,
}) => {
  const childRef = {};

  const handleClosing = () => {
    shape.setSelected(false);
    if (!childRef.getCurrentUserValues) {
      // if function not present in child, close the drawer
      handleCloseDrawer();
      return;
    }
    const currentValues = childRef.getCurrentUserValues();
    const existingValues = JSON.stringify({
      name: shape.text,
      userValues: shape.userValues,
    });
    console.log('childRef.current', childRef);
    console.log('current:', currentValues);
    console.log('existing values:', existingValues);

    // allow closing only if values unchanged
    if (currentValues === existingValues) handleCloseDrawer();
  };

  const myList = () => {
    if (!shape) return;

    switch (shape.type) {
      case 'playMessage':
        return (
          <PlayMessage
            childRef={childRef}
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            userVariables={userVariables}
            stageGroup={stageGroup}
            clearAndDraw={clearAndDraw}
          />
        );

      case 'playConfirm':
        return (
          <PlayConfirm
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            userVariables={userVariables}
            stageGroup={stageGroup}
            clearAndDraw={clearAndDraw}
            childRef={childRef}
          />
        );

      case 'callAPI':
        return (
          <CallApi
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            userVariables={userVariables}
            clearAndDraw={clearAndDraw}
            stageGroup={stageGroup}
            childRef={childRef}
          />
        );
      case 'getDigits':
        return (
          <GetDigits
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            userVariables={userVariables}
            stageGroup={stageGroup}
            clearAndDraw={clearAndDraw}
            childRef={childRef}
          />
        );
      case 'playMenu':
        return (
          <PlayMenu
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            stageGroup={stageGroup}
            clearAndDraw={clearAndDraw}
            childRef={childRef}
          />
        );
      case 'setParams':
        return (
          <SetParams
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            stageGroup={stageGroup}
            clearAndDraw={clearAndDraw}
            childRef={childRef}
          />
        );
      case 'runScript':
        return (
          <FunctionBlock
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            stageGroup={stageGroup}
            clearAndDraw={clearAndDraw}
            childRef={childRef}
            userVariables={userVariables}
          />
        );
      case 'jumper':
        return (
          <GoToBlock
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            entireStageGroup={entireStageGroup}
          />
        );
      case 'switch':
        return (
          <SwitchBlock
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            userVariables={userVariables}
            stageGroup={stageGroup}
            clearAndDraw={clearAndDraw}
            childRef={childRef}
          />
        );

      case 'endFlow':
        return <EndFlow shape={shape} handleCloseDrawer={handleCloseDrawer} />;

      default:
        return (
          <>
            <Typography sx={{ marginY: 3 }} variant='h5'>
              Under Construction 🏗️
            </Typography>
            <Button
              variant='contained'
              sx={{
                width: 200,
                position: 'relative',
                top: 200,
                marginX: 'auto',
              }}
              onClick={handleCloseDrawer}
            >
              Close
            </Button>
          </>
        );
    }
  };

  return (
    <Drawer anchor='right' open={isOpen} onClose={handleClosing}>
      {myList()}
    </Drawer>
  );
};

export default DrawerComponent;
