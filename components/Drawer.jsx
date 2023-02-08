import {Button, Typography} from '@mui/material';
import Drawer from '@mui/material/Drawer';

import CallApi from './CallApi';
import EndFlow from './EndFlow';
import FunctionBlock from './FunctionBlock';
import GetDigits from './GetDigits';
import GoToBlock from './GoToBlock';
import ModuleBlock from './ModuleBlock';
import PlayConfirm from './PlayConfirm';
import PlayMenu from './PlayMenu';
import PlayMessage from './PlayMessage';
import SetParams from './SetParams';
import SwitchBlock from './SwitchBlock';

const DrawerComponent = ({
  isOpen,
  handleCloseDrawer,
  shape,
  userVariables,
  stageGroup,
  entireStageGroup,
  clearAndDraw,
}) => {
  const childRef = {};

  const handleClosing = () => {
    shape.setSelected(false);
    if (!childRef.getCurrentUserValues) {
      handleCloseDrawer();
      return;
    }
    const currentValues = childRef.getCurrentUserValues();
    console.log('🚀currentValues', currentValues);
    const existingValues = JSON.stringify({
      name: shape.text,
      userValues: shape.userValues,
    });
    console.log(' existingValues', existingValues);

    if (currentValues === existingValues) handleCloseDrawer();
  };

  if (!shape) return null;

  const renderShape = () => {
    switch (shape.type) {
      case 'playMessage':
        return (
          <PlayMessage
            {...{
              childRef,
              shape,
              handleCloseDrawer,
              userVariables,
              stageGroup,
              clearAndDraw,
            }}
          />
        );
      case 'playConfirm':
        return (
          <PlayConfirm
            {...{
              shape,
              handleCloseDrawer,
              userVariables,
              stageGroup,
              clearAndDraw,
              childRef,
            }}
          />
        );
      case 'callAPI':
        return (
          <CallApi
            {...{
              shape,
              handleCloseDrawer,
              userVariables,
              clearAndDraw,
              stageGroup,
              childRef,
            }}
          />
        );
      case 'getDigits':
        return (
          <GetDigits
            {...{
              shape,
              handleCloseDrawer,
              userVariables,
              stageGroup,
              clearAndDraw,
              childRef,
            }}
          />
        );
      case 'playMenu':
        return (
          <PlayMenu
            {...{
              shape,
              handleCloseDrawer,
              stageGroup,
              clearAndDraw,
              childRef,
            }}
          />
        );
      case 'setParams':
        return (
          <SetParams
            {...{
              shape,
              handleCloseDrawer,
              stageGroup,
              clearAndDraw,
              childRef,
            }}
          />
        );
      case 'runScript':
        return (
          <FunctionBlock
            {...{
              shape,
              handleCloseDrawer,
              stageGroup,
              clearAndDraw,
              childRef,
              userVariables,
            }}
          />
        );
      case 'jumper':
        return <GoToBlock {...{shape, handleCloseDrawer, entireStageGroup}} />;
      case 'switch':
        return (
          <SwitchBlock
            {...{
              shape,
              handleCloseDrawer,
              userVariables,
              stageGroup,
              clearAndDraw,
              childRef,
            }}
          />
        );
      case 'endFlow':
        return <EndFlow {...{shape, handleCloseDrawer}} />;

      case 'module':
        return (
          <ModuleBlock
            {...{
              shape,
              handleCloseDrawer,
              userVariables,
            }}
          />
        );
      default:
        return (
          <Typography sx={{marginY: 3}} variant='h5'>
            Under Construction 🏗️
          </Typography>
        );
    }
  };

  return (
    <Drawer anchor='right' open={isOpen} onClose={handleClosing}>
      {renderShape()}
    </Drawer>
  );
};

export default DrawerComponent;
