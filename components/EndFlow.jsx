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
import { useEffect } from 'react';
import { useRef, useState } from 'react';
import DrawerTop from './DrawerTop';

const EndFlow = ({ shape, handleCloseDrawer }) => {
  const [type, setType] = useState(shape.userValues?.type ?? 'disconnect');

  const [transferPoint, setTransferPoint] = useState(
    shape.userValues?.transferPoint ?? ''
  );

  useEffect(() => {
    generateJS();
  }, []);

  function saveUserValues() {
    if (type === 'disconnect') {
      shape.setUserValues({ type, transferPoint: null });
      generateJS();
      return;
    }

    shape.setUserValues({ type, transferPoint });
    generateJS();
  }

  function generateJS() {
    const codeString = `this.${
      shape.text || `EndFlow${shape.id}`
    }=async function(){${
      type === 'disconnect'
        ? `IVR.doDisconnect();`
        : `IVR.doTransfer('${transferPoint}');`
    }};`;

    shape.setFunctionString(codeString);
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
        <DrawerTop
          saveUserValues={saveUserValues}
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
          backgroundColor='#f8bbd0'
          blockName='End Flow'
        />
        <ListItem sx={{ mt: 4 }}>
          <Typography sx={{ fontSize: '1.1rem' }} variant='h6'>
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
        <ListItem
          sx={{ display: type === 'transfer' ? 'flex' : 'none', mt: 2 }}
        >
          <Typography variant='body1' sx={{ fontWeight: 'bold', fontSize: 15 }}>
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
