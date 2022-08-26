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

const UseVariables = ({ shape, handleCloseDrawer, userVariables }) => {
  const [shapeName, setShapeName] = useState(shape.text || '');
  const [inputList, setInputList] = useState([]);
  const [msgObj, setMsgObj] = useState(userVariables || []);
  const [varType, setVarType] = useState('prompt');

  function saveUserValues() {
    console.log('🚀 ~ saveUserValues ');
    shape.setText(shapeName);
    userVariables.push(...msgObj);
  }
  function handleMsgObjChange(e) {
    // update msgObj when inputList value changes; handle validation
    const { value, name } = e.target;

    setMsgObj((prevObj) => {
      let tempMsgObj = [...prevObj];
      tempMsgObj[inputList.length] = {
        ...tempMsgObj[inputList.length],
        [name]: value,
      };
      return tempMsgObj;
    });
  }
  function fillInputFields() {
    if (msgObj.length > inputList.length) {
      let curValue = msgObj[inputList.length];
      if (curValue?.prompt) addNewVariable('prompt');
      else if (curValue?.number) addNewVariable('number');
    }
  }

  function addNewVariable(objType) {
    console.log('🚀  addNewVariable');
    const key = inputList.length;
    if (objType === 'prompt') {
      console.log('prkkompt');
      const promptCode = (
        <ListItem sx={{ mt: 1 }} key={key}>
          <Typography sx={{ marginRight: 2, marginLeft: 1 }} variant='body1'>
            prompt:
          </Typography>
          <TextField
            sx={{ width: 150 }}
            size='small'
            variant='outlined'
            name='prompt'
            placeholder='variable name'
            helperText='variable name'
            defaultValue={msgObj[key]?.prompt}
            onChange={(e) => {
              handleMsgObjChange(e);
            }}
          />
          <TextField
            sx={{ width: 150, mx: 1 }}
            size='small'
            variant='outlined'
            name='default'
            placeholder='default value'
            helperText='default value'
            defaultValue={msgObj[key]?.default}
            onChange={(e) => {
              handleMsgObjChange(e);
            }}
          />
        </ListItem>
      );
      setInputList([...inputList, promptCode]);
    } else if (objType === 'number') {
      const numberCode = (
        <ListItem key={key}>
          <Typography sx={{ marginRight: 2, marginLeft: 1 }} variant='body1'>
            number:
          </Typography>
          <TextField
            sx={{ width: 150 }}
            size='small'
            variant='outlined'
            name='number'
            placeholder='variable name'
            helperText='variable name'
            defaultValue={msgObj[key]?.number}
            onChange={(e) => {
              handleMsgObjChange(e);
            }}
          />
          <TextField
            sx={{ width: 150, mx: 1 }}
            size='small'
            variant='outlined'
            name='default'
            placeholder='default value'
            helperText='default value'
            defaultValue={msgObj[key]?.default}
            onChange={(e) => {
              handleMsgObjChange(e);
            }}
          />
        </ListItem>
      );
      setInputList([...inputList, numberCode]);
    }
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
              variant='contained'
              color='success'
              onClick={saveUserValues}
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
              backgroundColor: '#90caf9',
              borderRadius: 1,
            }}
            variant='h6'
          >
            Use Variables
          </Typography>
        </ListItem>
        <ListItem sx={{ marginTop: 1 }}>
          <Typography variant='button' sx={{ marginX: 1, fontSize: 15 }}>
            Name:
          </Typography>
          <TextField
            sx={{ width: 180, marginX: 1 }}
            size='small'
            value={shapeName}
            onChange={(e) => {
              setShapeName(e.target.value);
              // handleNameValidation(e);
            }}
          ></TextField>
        </ListItem>
        <ListItem>
          <Typography variant='subtitle1'>Select variable type:</Typography>
          <Select
            value={varType}
            onChange={(e) => {
              setVarType(e.target.value);
            }}
            sx={{ marginX: 2 }}
          >
            <MenuItem value='prompt'>Prompt</MenuItem>
            <MenuItem value='number'>Number</MenuItem>
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
              onClick={() => {
                addNewVariable(varType);
              }}
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
              onClick={() => {
                if (inputList.length > 0) {
                  let tempObj = [...inputList];
                  tempObj.pop();
                  setInputList(tempObj);
                  if (msgObj[inputList.length - 1]) {
                    let tempMsgObj = [...msgObj];
                    console.log('msgObj before pop:', tempMsgObj);

                    // if (allErrors[inputList.length - 1]) {
                    //   console.log('deleted item had error');

                    //   let tempObj = { ...allErrors };
                    //   delete tempObj[inputList.length - 1];
                    //   setAllErrors(tempObj);
                    // }
                    tempMsgObj.pop();
                    setMsgObj(tempMsgObj);
                  }
                }
              }}
            />
          </Tooltip>
        </ListItem>
        <pre>{JSON.stringify(msgObj, undefined, 2)}</pre>
        {fillInputFields()}
        <List>{inputList}</List>
      </List>
    </>
  );
};

export default UseVariables;
