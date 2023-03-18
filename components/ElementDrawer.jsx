import {Typography} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import GetDigits from '../newComponents/GetDigits2';
import PlayConfirm from '../newComponents/PlayConfirm';
import PlayMenu from '../newComponents/PlayMenu2';
import PlayMessage from '../newComponents/PlayMessage2';
import RunScript from '../newComponents/RunScript2';
import SetParams from '../newComponents/SetParams2';
import SwitchBlock from '../newComponents/SwitchBlock2';

const ElementDrawer = ({
  shape,
  isOpen,
  handleCloseDrawer,
  shapes,
  clearAndDraw,
  userVariables,
  openVariableManager,
}) => {
  if (!shape) return null;

  const renderShape = () => {
    switch (shape.type) {
      case 'setParams':
        return (
          <SetParams
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            shapes={shapes}
            clearAndDraw={clearAndDraw}
            userVariables={userVariables}
            openVariableManager={openVariableManager}
          />
        );

      case 'playMessage':
        return (
          <PlayMessage
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            shapes={shapes}
            clearAndDraw={clearAndDraw}
            userVariables={userVariables}
            openVariableManager={openVariableManager}
          />
        );

      case 'playConfirm':
        return (
          <PlayConfirm
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            shapes={shapes}
            clearAndDraw={clearAndDraw}
            userVariables={userVariables}
            openVariableManager={openVariableManager}
          />
        );

      case 'getDigits':
        return (
          <GetDigits
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            shapes={shapes}
            clearAndDraw={clearAndDraw}
            userVariables={userVariables}
            openVariableManager={openVariableManager}
          />
        );

      case 'playMenu':
        return (
          <PlayMenu
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            shapes={shapes}
            clearAndDraw={clearAndDraw}
            userVariables={userVariables}
            openVariableManager={openVariableManager}
          />
        );

      case 'runScript':
        return (
          <RunScript
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            shapes={shapes}
            clearAndDraw={clearAndDraw}
            userVariables={userVariables}
            openVariableManager={openVariableManager}
          />
        );

      case 'switch':
        return (
          <SwitchBlock
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            shapes={shapes}
            clearAndDraw={clearAndDraw}
            userVariables={userVariables}
            openVariableManager={openVariableManager}
          />
        );

      default:
        return (
          <Typography sx={{marginY: 3}} variant='h4'>
            {shape.type}
          </Typography>
        );
    }
  };
  return (
    <Drawer anchor='right' open={isOpen} onClose={handleCloseDrawer}>
      {renderShape()}
    </Drawer>
  );
};

export default ElementDrawer;
