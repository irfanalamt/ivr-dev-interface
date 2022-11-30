import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const SwitchExitPoint = ({ shape, handleCloseDrawer }) => {
  return (
    <>
      <List sx={{ minWidth: 250 }}>
        <ListItem>
          <Tooltip title='CLOSE'>
            <Button
              size='small'
              variant='outlined'
              color='error'
              sx={{ height: 30 }}
              onClick={handleCloseDrawer}
            >
              <CloseRoundedIcon sx={{ fontSize: 21 }} />
            </Button>
          </Tooltip>
        </ListItem>
        <ListItem>
          <Typography
            sx={{ mx: 'auto', my: 2, backgroundColor: '#aeea00', px: 2 }}
            variant='h5'
          >
            ExitPoint
          </Typography>
        </ListItem>
        <List sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: '1.1rem' }} variant='subtitle1'>
            Name: {shape.userValues.name}
          </Typography>
          <Typography>Position: {shape.userValues.position}</Typography>
        </List>
      </List>
    </>
  );
};

export default SwitchExitPoint;
