import {
  Box,
  List,
  ListItem,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {useRef, useState} from 'react';
import DrawerName from './DrawerName';
import DrawerTop from './DrawerTop';
import MessageList from './MessageList';

const ModuleBlock = ({shape, handleCloseDrawer}) => {
  function saveUserValues() {
    console.log('hello save');
  }

  return (
    <List sx={{minWidth: 350}}>
      <DrawerTop
        saveUserValues={saveUserValues}
        shape={shape}
        handleCloseDrawer={handleCloseDrawer}
        backgroundColor='#f5cbab'
        blockName='Module'
      />
      <ListItem sx={{mt: 2}}>
        <Typography sx={{mr: 1}} variant='subtitle2'>
          Name:
        </Typography>
        <Typography>{shape.text}</Typography>
      </ListItem>
    </List>
  );
};

export default ModuleBlock;
