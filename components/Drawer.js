import {
  Button,
  Input,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import { useState } from 'react';

const DrawerComponent = (props) => {
  const [inputList, setInputList] = useState([]);
  const { isOpen, handleCloseDrawer, shape = null } = props;
  function addNewInput() {
    setInputList(
      inputList.concat(
        <ListItem>
          <TextField label='xyz' variant='outlined' />
          <TextField label='abc' variant='outlined' />
        </ListItem>
      )
    );
  }
  const myList = () => {
    if (shape?.type == 'rectangle') {
      return (
        <List>
          <ListItem>
            <Typography variant='h5'>{shape.type}</Typography>
          </ListItem>
          <ListItem>
            <TextField label='ab' variant='outlined' />
            <TextField label='xy' variant='outlined' />
          </ListItem>
          <ListItem
            sx={{
              textAlign: 'center',
              justifyContent: 'center',
              marginTop: 5,
            }}
          ></ListItem>
        </List>
      );
    } else {
      return (
        <List>
          <ListItem>
            <Typography variant='h5'> not rectangle</Typography>
          </ListItem>
          <ListItem>
            <TextField label='prompt type' variant='outlined' />
            <TextField label='pgh' variant='outlined' />
          </ListItem>
        </List>
      );
    }
  };
  return (
    <>
      <Drawer anchor='right' open={isOpen} onClose={handleCloseDrawer}>
        {myList()}
        <List>{inputList}</List>
        <Button
          sx={{ maxWidth: 100, marginX: 'auto' }}
          color='success'
          variant='outlined'
          onClick={addNewInput}
        >
          ADD NEW
        </Button>
      </Drawer>
    </>
  );
};

export default DrawerComponent;
