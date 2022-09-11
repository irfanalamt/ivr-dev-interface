import {
  Button,
  FormControlLabel,
  Input,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { useEffect, useState } from 'react';

import PlayMessage from './PlayMessage3';

import CallApi from './CallApi';
import GetDigits from './GetDigits2';
import PlayMenu from './PlayMenu';
import SetParams from './SetParams';
import FunctionBlock from './FunctionBlock';

const DrawerComponent = ({
  isOpen,
  handleCloseDrawer,
  shape = null,
  userVariables,
  stageGroup,
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
        />
      );
    } else if (shape?.type == 'circle') {
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
      return <SetParams shape={shape} handleCloseDrawer={handleCloseDrawer} />;
    } else if (shape?.type == 'rectangle') {
      return (
        <FunctionBlock
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
        ></FunctionBlock>
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
