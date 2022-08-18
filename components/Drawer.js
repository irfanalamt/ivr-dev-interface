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
      return <GetDigits shape={shape} />;
    } else {
      return (
        <List>
          <ListItem>
            <Typography variant='h5'> not playMessage</Typography>
          </ListItem>
          <ListItem>
            <Typography variant='h5'> Work in progress ⚒️⚒️🏗️</Typography>
          </ListItem>
        </List>
      );
    }
  };
  return (
    <>
      <Drawer
        anchor='right'
        open={isOpen}
        // onClose={() => {

        //   shape.setSelected(false);
        //   handleCloseDrawer();
        // }}
      >
        {myList()}
      </Drawer>
    </>
  );
};

export default DrawerComponent;
