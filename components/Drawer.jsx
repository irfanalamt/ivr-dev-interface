import { Button, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import CallApi from './CallApi';
import EndFlow from './EndFlow';
import FunctionBlock from './FunctionBlock';
import GetDigits from './GetDigits';
import GoToBlock from './GoToBlock';
import PlayConfirm from './PlayConfirm';
import PlayMenu from './PlayMenu';
import PlayMessage from './PlayMessage';
import SetParams from './SetParams2';
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
          />
        );
      case 'playMenu':
        return (
          <PlayMenu
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            stageGroup={stageGroup}
            clearAndDraw={clearAndDraw}
          />
        );
      case 'setParams':
        return (
          <SetParams
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            stageGroup={stageGroup}
            clearAndDraw={clearAndDraw}
          />
        );
      case 'runScript':
        return (
          <FunctionBlock
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            stageGroup={stageGroup}
            clearAndDraw={clearAndDraw}
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
            clearAndDraw={clearAndDraw}
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
