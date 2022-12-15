import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';

const EndFlow = ({ shape, handleCloseDrawer }) => {
  const [type, setType] = useState(shape.userValues?.type ?? 'disconnect');

  const [transferPoint, setTransferPoint] = useState(
    shape.userValues?.transferPoint ?? ''
  );

  function saveUserValues() {
    if (type === 'disconnect') {
      shape.setUserValues({ type, transferPoint: null });
      return;
    }

    shape.setUserValues({ type, transferPoint });
  }

  function handleTypeChange(e) {
    setType(e.target.value);
  }
  function handleTransferPointChange(e) {
    setTransferPoint(e.target.value);
  }

  return (
    <>
      <List sx={{ minWidth: 350 }}>
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
            sx={{ backgroundColor: '#f8bbd0', mx: 'auto', px: 2, py: 3 }}
            label={<Typography variant='h6'>EndFlow</Typography>}
          />
        </ListItem>
        <ListItem>
          <Typography sx={{ fontSize: '1.1rem' }} variant='subtitle2'>
            Type:
          </Typography>
        </ListItem>
        <ListItem>
          <RadioGroup
            row
            name='radio-endflowType'
            value={type}
            onChange={handleTypeChange}
          >
            <FormControlLabel
              sx={{ ml: 1 }}
              value='disconnect'
              control={<Radio />}
              label='DISCONNECT'
            />
            <FormControlLabel
              sx={{ ml: 2 }}
              value='transfer'
              control={<Radio />}
              label='TRANSFER'
            />
          </RadioGroup>
        </ListItem>
        <ListItem sx={{ display: type === 'transfer' ? 'flex' : 'none' }}>
          <Typography variant='subtitle1' sx={{ fontSize: 15 }}>
            transferPoint:
          </Typography>
          <TextField
            sx={{ width: 180, ml: 2 }}
            size='small'
            value={transferPoint}
            onChange={handleTransferPointChange}
          ></TextField>
        </ListItem>
      </List>
    </>
  );
};

export default EndFlow;
