import { Button, List, ListItem, TextField, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { useState } from 'react';

const DrawerComponent = (props) => {
  const { isOpen, handleCloseDrawer } = props;
  const myList = () => {
    return (
      <div>
        <List>
          <ListItem>
            <Typography variant='h5'>IT workss!</Typography>
          </ListItem>
          <ListItem>
            <TextField label='prompt type' variant='outlined' />
            <TextField label='pgh' variant='outlined' />
          </ListItem>
        </List>
      </div>
    );
  };
  return (
    <>
      <Drawer anchor='right' open={isOpen} onClose={handleCloseDrawer}>
        {myList()}
      </Drawer>
    </>
  );
};

export default DrawerComponent;
