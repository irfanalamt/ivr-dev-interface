import {
  Button,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import { useState } from 'react';
import { addVariableElements } from '../src/helpers';

const InitVariables = ({ handleCloseDrawer, userVariables }) => {
  const [varObj, setVarObj] = useState(userVariables || []);
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
    <>
      <List>
        <ListItem>
          <Tooltip title='CLOSE'>
            <Button
              size='small'
              variant='contained'
              color='error'
              sx={{ height: 30 }}
              onClick={() => {
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
              variant='contained'
              color='success'
              onClick={saveValues}
            >
              <SaveRoundedIcon sx={{ fontSize: 20 }} />
            </Button>
          </Tooltip>
        </ListItem>
        <ListItem>
          <Typography
            sx={{
              marginX: 'auto',
              marginY: 1,
              boxShadow: 1,
              paddingX: 3,
              paddingY: 1,
              backgroundColor: '#b39ddb',
              borderRadius: 1,
            }}
            variant='h6'
          >
            Init Variables
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant='subtitle1'>Select variable type:</Typography>
          <Select
            value={varType}
            onChange={(e) => {
              setVarType(e.target.value);
            }}
            sx={{ marginX: 2 }}
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
            <AddBoxRoundedIcon
              sx={{
                color: '#69f0ae',
                marginX: 0.5,
                border: '1.2px solid black',
                width: 30,
                height: 30,
                padding: 0.2,
                borderRadius: 1,
              }}
              onClick={addVar}
            />
          </Tooltip>
          <Tooltip title='Remove'>
            <RemoveCircleRoundedIcon
              sx={{
                color: '#ff5252',
                marginX: 0.5,
                border: '1.2px solid black',
                width: 30,
                height: 30,
                padding: 0.2,
                borderRadius: 1,
              }}
              onClick={removeVar}
            />
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
    </>
  );
};

export default InitVariables;
