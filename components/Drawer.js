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

import PlayMessage2 from './PlayMessage2';
import GetDigits from './Getdigits';

const DrawerComponent = ({
  isOpen,
  handleCloseDrawer,
  shape = null,
  userValues,
}) => {
  useEffect(() => {
    console.log('ue drawer');
  }, []);

  const myList = () => {
    if (shape?.type == 'roundedRectangle') {
      return (
        <PlayMessage2 shape={shape} handleCloseDrawer={handleCloseDrawer} />
      );
    } else if (shape?.type == 'parallelogram') {
      return <GetDigits shape={shape} handleCloseDrawer={handleCloseDrawer} />;
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
