import { Button, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { useEffect } from 'react';

import PlayMessage from './PlayMessage3';

import CallApi from './CallApi';
import FunctionBlock from './FunctionBlock';
import GetDigits from './GetDigits2';
import PlayMenu from './PlayMenu';
import SetParams from './SetParams';
import PlayConfirm from './PlayConfirm';
import GoToBlock from './GoToBlock';
import SwitchBlock from './SwitchBlock';

const DrawerComponent = ({
  isOpen,
  handleCloseDrawer,
  shape = null,
  userVariables,
  stageGroup,
  entireStageGroup,
}) => {
  useEffect(() => {
    console.log('ue drawer');
  }, []);

  const myList = () => {
    if (shape?.type == 'roundedRectangle') {
      return (
        <PlayMessage
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
          userVariables={userVariables}
          stageGroup={stageGroup}
        />
      );
    } else if (shape?.type == 'roundedRectangle2') {
      return (
        <PlayConfirm
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
          userVariables={userVariables}
          stageGroup={stageGroup}
        />
      );
    } else if (shape?.type == 'invertedHexagon') {
      return (
        <CallApi
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
          userVariables={userVariables}
        />
      );
    } else if (shape?.type == 'parallelogram') {
      return (
        <GetDigits
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
          userVariables={userVariables}
          stageGroup={stageGroup}
        />
      );
    } else if (shape?.type == 'hexagon') {
      return (
        <PlayMenu
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
          stageGroup={stageGroup}
        />
      );
    } else if (shape?.type == 'pentagon') {
      return (
        <SetParams
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
          stageGroup={stageGroup}
        />
      );
    } else if (shape?.type == 'rectangle') {
      return (
        <FunctionBlock
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
          stageGroup={stageGroup}
        ></FunctionBlock>
      );
    } else if (shape?.type == 'triangle') {
      return (
        <GoToBlock
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
          entireStageGroup={entireStageGroup}
        />
      );
    } else if (shape?.type == 'rhombus') {
      return (
        <SwitchBlock
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
          userVariables={userVariables}
          stageGroup={stageGroup}
        />
      );
    } else {
      return (
        <>
          <Typography sx={{ marginY: 3 }} variant='h5'>
            Under Construction 🏗️
          </Typography>
          <Button
            variant='contained'
            sx={{ width: 200, position: 'relative', top: 200, marginX: 'auto' }}
            onClick={handleCloseDrawer}
          >
            Close
          </Button>
        </>
      );
    }
  };
  return (
    <>
      <Drawer
        anchor='right'
        open={isOpen}
        // onClose={() => {
        //   handleCloseDrawer();
        // }}
      >
        {myList()}
      </Drawer>
    </>
  );
};

export default DrawerComponent;
