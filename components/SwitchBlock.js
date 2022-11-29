import {
  Button,
  Chip,
  List,
  ListItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { useState } from 'react';

const SwitchBlock = ({ shape, handleCloseDrawer }) => {
  const [shapeName, setShapeName] = useState(shape.text);

  function saveUserValues() {
    shape.setText(shapeName);
  }
  return (
    <>
      <List sx={{ minWidth: 300 }}>
        <ListItem>
          <Tooltip title='CLOSE'>
            <Button
              size='small'
              variant='outlined'
              color='error'
              sx={{ height: 30 }}
              onClick={() => {
                shape.setSelected(false);
                handleCloseDrawer();
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 21 }} />
            </Button>
          </Tooltip>
          <Tooltip title='SAVE'>
            <Button
              sx={{ height: 30, marginLeft: 1, marginRight: 'auto' }}
              size='small'
              variant='outlined'
              color='success'
              onClick={saveUserValues}
            >
              <SaveRoundedIcon sx={{ fontSize: 20 }} />
            </Button>
          </Tooltip>
        </ListItem>
        <ListItem>
          <Chip
            sx={{ backgroundColor: '#795548', mx: 'auto', px: 2, py: 3 }}
            label={<Typography variant='h6'>Switch</Typography>}
          />
        </ListItem>
        <ListItem sx={{ marginTop: 1 }}>
          <Typography variant='button' sx={{ fontSize: 15, width: '35%' }}>
            Name:
          </Typography>
          <TextField
            sx={{ width: 180, marginX: 1 }}
            size='small'
            value={shapeName}
            onChange={(e) => {
              setShapeName(e.target.value);
            }}
          ></TextField>
        </ListItem>
      </List>
    </>
  );
};

export default SwitchBlock;
