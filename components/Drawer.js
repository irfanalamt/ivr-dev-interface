import { Button, List, ListItem, TextField, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { useState } from 'react';

const DrawerComponent = (props) => {
  const { isOpen, handleCloseDrawer, shape = null } = props;
  const myList = () => {
    if (shape?.type == 'rectangle') {
      return (
        <div>
          <List>
            <ListItem>
              <Typography variant='h5'>{shape.type}</Typography>
            </ListItem>
            <ListItem>
              <TextField label='prompt type' variant='outlined' />
              <TextField label='pgh' variant='outlined' />
            </ListItem>
            <ListItem
              sx={{
                textAlign: 'center',
                justifyContent: 'center',
                marginTop: 5,
              }}
            >
              <Button color='success' variant='outlined'>
                ADD NEW
              </Button>
            </ListItem>
          </List>
        </div>
      );
    } else {
      return (
        <div>
          <List>
            <ListItem>
              <Typography variant='h5'> not rectangle</Typography>
            </ListItem>
            <ListItem>
              <TextField label='prompt type' variant='outlined' />
              <TextField label='pgh' variant='outlined' />
            </ListItem>
          </List>
        </div>
      );
    }
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
