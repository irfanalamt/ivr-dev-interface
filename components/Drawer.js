import { Button, List, ListItem, TextField, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { useState } from 'react';

const DrawerComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

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
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        CLICK MEE
      </Button>
      <Drawer anchor='right' open={isOpen} onClose={() => setIsOpen(false)}>
        {myList()}
      </Drawer>
    </>
  );
};

export default DrawerComponent;
