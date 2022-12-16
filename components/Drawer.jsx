import { Button, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import PlayMessage from './PlayMessage3';
import CallApi from './CallApi';
import FunctionBlock from './FunctionBlock';
import GetDigits from './GetDigits2';
import GoToBlock from './GoToBlock';
import PlayConfirm from './PlayConfirm';
import PlayMenu from './PlayMenu';
import SetParams from './SetParams';
import SwitchBlock from './SwitchBlock';
import EndFlow from './EndFlow';
import { useRef } from 'react';

const DrawerComponent = ({
  isOpen,
  handleCloseDrawer,
  shape = null,
  userVariables,
  stageGroup,
  entireStageGroup,
}) => {
  const myList = () => {
    if (!shape) return;

    switch (shape.type) {
      case 'playMessage':
        return (
          <PlayMessage
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            userVariables={userVariables}
            stageGroup={stageGroup}
          />
        );

      case 'playConfirm':
        return (
          <PlayConfirm
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            userVariables={userVariables}
            stageGroup={stageGroup}
          />
        );

      case 'callAPI':
        return (
          <CallApi
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            userVariables={userVariables}
          />
        );
      case 'getDigits':
        return (
          <GetDigits
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            userVariables={userVariables}
            stageGroup={stageGroup}
          />
        );
      case 'playMenu':
        return (
          <PlayMenu
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            stageGroup={stageGroup}
          />
        );
      case 'setParams':
        return (
          <SetParams
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            stageGroup={stageGroup}
          />
        );
      case 'runScript':
        return (
          <FunctionBlock
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            stageGroup={stageGroup}
          ></FunctionBlock>
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

  function handleClosing() {
    shape.setSelected(false);
    handleCloseDrawer();
  }

  return (
    <Drawer anchor='right' open={isOpen} onClose={handleClosing}>
      {myList()}
    </Drawer>
  );
};

export default DrawerComponent;
