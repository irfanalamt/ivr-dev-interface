import {
  Tabs,
  Button,
  List,
  ListItem,
  Tab,
  TextField,
  Typography,
  Tooltip,
  Box,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Paper,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import { useState } from 'react';
import {
  addInputElements,
  checkValidity,
  addParamsElements,
} from '../src/helpers';

const GetDigits = ({ shape, handleCloseDrawer, userVariables, stageGroup }) => {
  const [resultName, setResultName] = useState(
    shape.userValues?.variableName ?? ''
  );
  const [shapeName, setShapeName] = useState(shape.text);
  const [tabValue, setTabValue] = useState(0);
  const [minDigits, setMinDigits] = useState(
    shape.userValues?.params.minDigits ?? 1
  );
  const [maxDigits, setMaxDigits] = useState(
    shape.userValues?.params.maxDigits ?? 1
  );
  const [msgObj, setMsgObj] = useState(shape.userValues?.messageList || []);
  const [msgObjType, setMsgObjType] = useState('prompt');
  const [paramsObj, setParamsObj] = useState(
    shape.userValues?.params.paramsList ?? []
  );
  const [paramsObjType, setParamsObjType] = useState('');

  const paramsObjOptions = [
    'terminator',
    'maxRetries',
    'invalidAction',
    'timeoutAction',
    'invalidPrompt',
  ];

  function saveUserValues() {
    // remove null values; SAVE
    const filteredMsgObj = msgObj.filter((n) => n.value);
    const filteredParamsObj = paramsObj.filter((n) => n.value);
    const entireParamsObj = {
      minDigits,
      maxDigits,
      paramsList: filteredParamsObj,
    };

    shape.setText(shapeName);
    shape.setUserValues({
      params: entireParamsObj,
      messageList: filteredMsgObj,
      variableName: resultName,
    });

    generateJS(filteredMsgObj, entireParamsObj);
  }

  function generateJS(filteredMsgObj, entireParamsObj) {
    let codeString = `this.${
      shapeName || `getDigits${shape.id}`
    }= async function(){let msgList = ${JSON.stringify(
      filteredMsgObj
    )};let params = ${JSON.stringify(entireParamsObj)};this.${
      resultName || 'default'
    } = await IVR.getDigits(msgList,params); 
};`;
    shape.setFunctionString(codeString);
    console.log('🕺🏻getDigits code:', codeString);
  }

  function handleNameValidation(e) {
    let errorBox = document.getElementById('name-error-box');
    let errorMessage = checkValidity('object', e);
    if (errorMessage !== -1) {
      errorBox.style.display = 'block';
      e.target.style.backgroundColor = '#ffebee';
      errorBox.innerText = errorMessage;
      return;
    }

    // check name unique
    if (
      stageGroup.getShapesAsArray().some((el) => el.text === e.target.value)
    ) {
      errorBox.style.display = 'block';
      e.target.style.backgroundColor = '#ffebee';
      errorBox.innerText = 'name NOT unique';
      return;
    }

    // no error condition
    errorBox.style.display = 'none';
    e.target.style.backgroundColor = '#f1f8e9';
    errorBox.innerText = '';
  }

  function addInput() {
    setMsgObj((s) => {
      return [...s, { type: msgObjType, value: '' }];
    });
  }
  function removeInput() {
    if (msgObj === null || msgObj === undefined) return;
    setMsgObj((s) => {
      const newArr = [...s];
      newArr.pop();
      return newArr;
    });
  }

  function addParamsInput() {
    setParamsObj((s) => {
      return [...s, { type: paramsObjType, value: '' }];
    });
    setParamsObjType('');
  }
  function removeParamsInput() {
    if (paramsObj === null || paramsObj === undefined) return;
    setParamsObj((s) => {
      const newArr = [...s];
      newArr.pop();
      return newArr;
    });
  }

  return (
    <>
      <List sx={{ minWidth: 370 }}>
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
            sx={{ backgroundColor: '#b39ddb', mx: 'auto', px: 2, py: 3 }}
            label={<Typography variant='h6'>Get Digits</Typography>}
          />
        </ListItem>
        <ListItem sx={{ marginTop: 1 }}>
          <Typography variant='button' sx={{ fontSize: 16, width: '40%' }}>
            Name:
          </Typography>
          <TextField
            sx={{ width: 180, marginX: 1 }}
            size='small'
            value={shapeName}
            onChange={(e) => {
              setShapeName(e.target.value);
              handleNameValidation(e);
            }}
          ></TextField>
        </ListItem>
        <ListItem>
          <Typography
            sx={{ marginX: 'auto', boxShadow: 1, paddingX: 1, display: 'none' }}
            variant='subtitle2'
            id='name-error-box'
          ></Typography>
        </ListItem>
        <ListItem>
          <Typography variant='button' sx={{ width: '40%' }}>
            Result Variable:
          </Typography>

          {userVariables.length > 0 ? (
            <Select
              value={resultName}
              onChange={(e) => {
                setResultName(e.target.value);
              }}
              size='small'
            >
              {userVariables
                ?.filter((el) => el.type == 'number')
                .map((el, i) => {
                  return (
                    <MenuItem key={i} value={el.name}>
                      {el.name}
                    </MenuItem>
                  );
                })}
            </Select>
          ) : (
            <Typography sx={{ color: '#f44336', fontSize: 18 }} variant='h6'>
              No variables added
            </Typography>
          )}
        </ListItem>
        <ListItem>
          <Tabs
            sx={{ marginX: 'auto' }}
            value={tabValue}
            onChange={(e, newVal) => {
              setTabValue(newVal);
              console.log('tabVA', tabValue, typeof tabValue);
            }}
          >
            <Tab label='Message List' />
            <Tab label='Parameters' />
          </Tabs>
        </ListItem>
        <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }} id='tabPanel1'>
          <ListItem>
            <Paper
              sx={{ width: '100%', px: 2, py: 1, backgroundColor: '#f9fbe7' }}
            >
              <Tooltip title='object type:'>
                <Select
                  sx={{ width: '40%' }}
                  value={msgObjType}
                  onChange={(e) => {
                    setMsgObjType(e.target.value);
                  }}
                  size='small'
                >
                  <MenuItem value='prompt'>Prompt</MenuItem>
                  <MenuItem value='number'>Number</MenuItem>
                  <MenuItem value='ordinal'>Ordinal</MenuItem>
                  <MenuItem value='amount'>Amount</MenuItem>
                  <MenuItem value='digit'>Digit</MenuItem>
                  <MenuItem value='date'>Date</MenuItem>
                  <MenuItem value='day'>Day</MenuItem>
                  <MenuItem value='month'>Month</MenuItem>
                  <MenuItem value='time'>Time</MenuItem>
                </Select>
              </Tooltip>
              <Tooltip title='Add'>
                <IconButton
                  onClick={() => {
                    setMsgObjType('prompt');
                    addInput();
                  }}
                  sx={{ ml: 2 }}
                  color='success'
                  size='large'
                >
                  <AddBoxRoundedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Remove'>
                <IconButton color='error' size='large' onClick={removeInput}>
                  <RemoveCircleRoundedIcon />
                </IconButton>
              </Tooltip>
            </Paper>
          </ListItem>
          {/* <pre>{JSON.stringify(msgObj, null, 2)}</pre> */}
          <List>
            {msgObj?.map((el, i) => {
              return addInputElements(
                el.type,
                i,
                msgObj,
                setMsgObj,
                userVariables
              );
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
              id='error-box'
              variant='button'
            ></Typography>
          </ListItem>
        </Box>
        <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }} id='tabPanel2'>
          <ListItem sx={{ marginTop: 2 }}>
            <Typography sx={{ fontSize: 18, width: '30%' }} variant='h6'>
              minDigits:
            </Typography>
            <Select
              size='small'
              sx={{ marginX: 2 }}
              id='minDigits-select'
              value={minDigits}
              onChange={(e) => {
                setMinDigits(e.target.value);
              }}
            >
              {
                // Array of 1..20
                [...Array(21).keys()].slice(1).map((el, i) => {
                  return (
                    <MenuItem key={i} value={el}>
                      {el}
                    </MenuItem>
                  );
                })
              }
            </Select>
          </ListItem>
          <ListItem sx={{ marginTop: 2 }}>
            <Typography sx={{ fontSize: 18, width: '30%' }} variant='h6'>
              maxDigits:
            </Typography>
            <Select
              size='small'
              sx={{ marginX: 2 }}
              id='maxDigits-select'
              value={maxDigits}
              onChange={(e) => {
                setMaxDigits(e.target.value);
              }}
            >
              {[...Array(21).keys()].slice(1).map((el, i) => {
                return (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                );
              })}
            </Select>
          </ListItem>
          {/* <pre>{JSON.stringify(paramsObj, undefined, 2)}</pre> */}
          <ListItem>
            <Typography
              sx={{
                fontWeight: 410,
                marginTop: 4,
                borderBottom: 1,
              }}
              variant='subtitle1'
            >
              Optional Params
            </Typography>
          </ListItem>
          <ListItem>
            <Select
              size='small'
              sx={{ minWidth: '40%' }}
              value={paramsObjType}
              onChange={(e) => {
                setParamsObjType(e.target.value);
              }}
            >
              {
                // remove params already added
                paramsObj.length > 0
                  ? paramsObjOptions
                      .filter((el) => {
                        return !paramsObj.some((e) => e.type == el);
                      })
                      .map((el, i) => (
                        <MenuItem key={i} value={el}>
                          {el}
                        </MenuItem>
                      ))
                  : paramsObjOptions.map((el, i) => (
                      <MenuItem key={i} value={el}>
                        {el}
                      </MenuItem>
                    ))
              }
            </Select>
            <Tooltip title='Add'>
              <IconButton
                onClick={addParamsInput}
                sx={{ ml: 2 }}
                color='success'
                size='large'
              >
                <AddBoxRoundedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Remove'>
              <IconButton
                color='error'
                size='large'
                onClick={removeParamsInput}
              >
                <RemoveCircleRoundedIcon />
              </IconButton>
            </Tooltip>
          </ListItem>
          <List>
            {paramsObj?.map((el, i) =>
              addParamsElements(el.type, i, paramsObj, setParamsObj)
            )}
          </List>
        </Box>
      </List>
    </>
  );
};

export default GetDigits;
