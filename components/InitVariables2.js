import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { addVariableElements } from '../src/helpers';

const InitVariables = ({
  handleCloseDrawer,
  userVariables = [],
  setUserVariables,
}) => {
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
    setUserVariables(filteredVarObj);
  }

  return (
    <List sx={{ minWidth: 350 }}>
      <ListItem>
        <Tooltip title='SAVE'>
          <Button
            sx={{ height: 30, ml: 'auto' }}
            size='small'
            variant='outlined'
            color='success'
            onClick={saveValues}
          >
            <SaveRoundedIcon sx={{ fontSize: 20 }} />
          </Button>
        </Tooltip>
        <Tooltip title='CLOSE'>
          <Button
            size='small'
            variant='outlined'
            color='error'
            sx={{ height: 30, marginLeft: 1 }}
            onClick={handleCloseDrawer}
          >
            <CloseRoundedIcon sx={{ fontSize: 21 }} />
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
        <Paper sx={{ width: '100%', px: 2, py: 1, backgroundColor: '#f9fbe7' }}>
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

          <Tooltip title='Add'>
            <IconButton
              sx={{ ml: 2 }}
              color='success'
              size='large'
              onClick={addVar}
            >
              <AddBoxRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Remove'>
            <IconButton color='error' size='large' onClick={removeVar}>
              <RemoveCircleRoundedIcon />
            </IconButton>
          </Tooltip>
        </Paper>
      </ListItem>
      {/* <pre>{JSON.stringify(varObj, undefined, 2)}</pre> */}
      <List>
        {varObj?.map((el, i) =>
          addVariableElements(el.type, i, varObj, setVarObj)
        )}
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
