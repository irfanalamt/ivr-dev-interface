import {Typography} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import CallApi from '../newComponents/CallApi2';
import EndFlow from '../newComponents/EndFlow2';
import GetDigits from '../newComponents/GetDigits2';
import Jumper from '../newComponents/Jumper2';
import PlayConfirm from '../newComponents/PlayConfirm';
import PlayMenu from '../newComponents/PlayMenu2';
import PlayMessage from '../newComponents/PlayMessage2';
import RunScript from '../newComponents/RunScript2';
import SetParams from '../newComponents/SetParams2';
import SwitchBlock from '../newComponents/SwitchBlock2';
import {useState} from 'react';
import ElementUserGuide from '../newComponents/ElementUserGuide';

const ElementDrawer = ({
  shape,
  isOpen,
  handleCloseDrawer,
  shapes,
  clearAndDraw,
  userVariables,
  openVariableManager,
}) => {
  const [openGuide, setOpenGuide] = useState(false);

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
            openUserGuide={() => setOpenGuide(true)}
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
            openUserGuide={() => setOpenGuide(true)}
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
            openUserGuide={() => setOpenGuide(true)}
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
            openUserGuide={() => setOpenGuide(true)}
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
            openUserGuide={() => setOpenGuide(true)}
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
            openUserGuide={() => setOpenGuide(true)}
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
            openUserGuide={() => setOpenGuide(true)}
          />
        );

      case 'callAPI':
        return (
          <CallApi
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            shapes={shapes}
            clearAndDraw={clearAndDraw}
            userVariables={userVariables}
            openVariableManager={openVariableManager}
            openUserGuide={() => setOpenGuide(true)}
          />
        );

      case 'endFlow':
        return (
          <EndFlow
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            openVariableManager={openVariableManager}
            openUserGuide={() => setOpenGuide(true)}
          />
        );

      case 'jumper':
        return (
          <Jumper
            shape={shape}
            shapes={shapes}
            handleCloseDrawer={handleCloseDrawer}
            openVariableManager={openVariableManager}
            openUserGuide={() => setOpenGuide(true)}
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
    <>
      <Drawer anchor='right' open={isOpen}>
        {renderShape()}
      </Drawer>
      <ElementUserGuide
        open={openGuide}
        handleClose={() => setOpenGuide(false)}
        shapeType={shape.type}
      />
    </>
  );
};

export default ElementDrawer;
