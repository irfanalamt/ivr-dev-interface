import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Button,
  Chip,
  List,
  ListItem,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { addVariableElements } from '../src/helpers';

const InitVariables = ({ handleCloseDrawer, userVariables = [] }) => {
  const [varObj, setVarObj] = useState(userVariables);
  const [varType, setVarType] = useState('prompt');

  function addVar() {
    setVarObj((s) => {
      return [...s, { type: varType, value: '' }];
    });
  }
  function removeVar() {
    if (varObj === null || varObj === undefined) return;
    setVarObj((s) => {
      const newArr = [...s];
      newArr.pop();
      return newArr;
    });
  }
  function saveValues() {
    // remove variables with no name; save
    const filteredVarObj = varObj.filter((n) => n.name);
    filteredVarObj.forEach((el) => {
      if (userVariables.indexOf(el) == -1) {
        userVariables.push(el);
      }
    });
  }

  return (
    <List sx={{ minWidth: 350 }}>
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
        <Tooltip title='SAVE'>
          <Button
            sx={{ height: 30, marginLeft: 1, marginRight: 'auto' }}
            size='small'
            variant='outlined'
            color='success'
            onClick={saveValues}
          >
            <SaveRoundedIcon sx={{ fontSize: 20 }} />
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem>
        <Chip
          sx={{ backgroundColor: '#b39ddb', mx: 'auto', px: 2, py: 3 }}
          label={<Typography variant='h6'>Init Variables</Typography>}
        />
      </ListItem>
      <ListItem sx={{ mt: 1 }}>
        <Tooltip title='Select variable type'>
          <Select
            value={varType}
            onChange={(e) => {
              setVarType(e.target.value);
            }}
            size='small'
          >
            <MenuItem value='prompt'>Prompt</MenuItem>
            <MenuItem value='number'>Number</MenuItem>
            <MenuItem value='date'>Date</MenuItem>
            <MenuItem value='day'>Day</MenuItem>
            <MenuItem value='month'>Month</MenuItem>
            <MenuItem value='time'>Time</MenuItem>
          </Select>
        </Tooltip>
        <Tooltip title='Add'>
          <Button
            sx={{ backgroundColor: '#69f0ae', ml: 4 }}
            variant='contained'
            size='small'
            color='success'
            onClick={addVar}
          >
            <AddBoxRoundedIcon />
          </Button>
        </Tooltip>
        <Tooltip title='Remove'>
          <Button
            sx={{ backgroundColor: '#ff5252', ml: 2 }}
            variant='contained'
            size='small'
            color='error'
            onClick={removeVar}
          >
            <RemoveCircleRoundedIcon />
          </Button>
        </Tooltip>
      </ListItem>
      {/* <pre>{JSON.stringify(varObj, undefined, 2)}</pre> */}
      <List>
        {varObj?.map((el, i) => {
          return addVariableElements(el.type, i, varObj, setVarObj);
        })}
      </List>
      <ListItem>
        <Typography
          sx={{
            color: '#e53935',
            paddingX: 2,
            boxShadow: 2,
            visibility: 'hidden',
          }}
          id='error-box-var'
          variant='button'
        ></Typography>
      </ListItem>
    </List>
  );
};

export default InitVariables;
