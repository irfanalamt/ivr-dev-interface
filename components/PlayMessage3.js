import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  List,
  ListItem,
  MenuItem,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { addInputElements, checkValidity } from '../src/helpers';

const PlayMessage = ({
  shape,
  handleCloseDrawer,
  userVariables,
  stageGroup,
}) => {
  const [shapeName, setShapeName] = useState(shape.text);
  const [tabValue, setTabValue] = useState(0);
  const [msgObjType, setMsgObjType] = useState('prompt');
  const [msgObj, setMsgObj] = useState(shape.userValues?.messageList || []);
  const [interruptible, setInterruptible] = useState(
    shape.userValues?.params.interruptible || true
  );
  const [repeatOption, setRepeatOption] = useState(
    shape.userValues?.params.repeatOption || 9
  );

  const [nextItem, setNextItem] = useState(shape.nextItem || '');

  const menuActionList = stageGroup.shapes.filter(
    (s) =>
      s.text !== shapeName &&
      s.text !== 'playMenu' &&
      s.text !== 'playMessage' &&
      s.text !== 'function' &&
      s.text !== 'setParams' &&
      s.text !== 'getDigits' &&
      s.text !== 'callAPI'
  );
  if (menuActionList.length > 0) menuActionList.push({ text: 'null' });

  useEffect(() => {
    switchTab();
  }, [tabValue]);

  function switchTab() {
    console.log('userVariables:', userVariables);
    let tabPanel1 = document.getElementById('tabPanel1');
    let tabPanel2 = document.getElementById('tabPanel2');
    if (tabValue === 0) {
      tabPanel1.style.display = 'block';
      tabPanel2.style.display = 'none';
      return;
    }
    if (tabValue === 1) {
      tabPanel1.style.display = 'none';
      tabPanel2.style.display = 'block';
    }
  }

  function saveUserValues() {
    // remove null values; SAVE
    const filteredMsgObj = msgObj.filter((n) => n.value);
    shape.setText(shapeName);
    shape.setNextItem(nextItem);
    shape.setUserValues({
      params: { interruptible, repeatOption },
      messageList: filteredMsgObj,
    });
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
    if (stageGroup.getShapes().some((el) => el.text === e.target.value)) {
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
              backgroundColor: '#f0f4c3',
              borderRadius: 1,
            }}
            variant='h6'
          >
            Play Message
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
              handleNameValidation(e);
              setShapeName(e.target.value);
            }}
          ></TextField>
        </ListItem>
        <ListItem>
          <Typography
            sx={{
              marginX: 'auto',
              boxShadow: 1,
              paddingX: 1,
              backgroundColor: '#ffcdd2',
            }}
            variant='subtitle2'
            id='name-error-box'
          ></Typography>
        </ListItem>
        <ListItem>
          <Typography
            sx={{ width: '35%', fontWeight: 405 }}
            variant='subtitle1'
          >
            nextItem:
          </Typography>
          {menuActionList.length > 0 ? (
            <Select
              size='small'
              value={nextItem}
              onChange={(e) => setNextItem(e.target.value)}
            >
              {menuActionList.map((el, i) => (
                <MenuItem key={i} value={el.text}>
                  <Typography
                    sx={{ display: 'inline', minWidth: '40%', mr: 1 }}
                  >
                    {el.text}
                  </Typography>
                  {el.type === 'pentagon' && (
                    <Typography
                      sx={{ color: '#e91e63', pr: 1 }}
                      variant='subtitle2'
                    >
                      [setParams]
                    </Typography>
                  )}
                  {el.type === 'rectangle' && (
                    <Typography
                      sx={{
                        color: '#ff5722',
                        pr: 1,
                      }}
                      variant='subtitle2'
                    >
                      [function]
                    </Typography>
                  )}
                  {el.type === 'hexagon' && (
                    <Typography
                      sx={{
                        color: '#009688',
                        pr: 1,
                      }}
                      variant='subtitle2'
                    >
                      [playMenu]
                    </Typography>
                  )}
                  {el.type === 'parallelogram' && (
                    <Typography
                      sx={{
                        color: '#9c27b0',
                        pr: 1,
                      }}
                      variant='subtitle2'
                    >
                      [getDigits]
                    </Typography>
                  )}
                  {el.type === 'roundedRectangle' && (
                    <Typography
                      sx={{
                        color: '#c0ca33',
                        pr: 1,
                      }}
                      variant='subtitle2'
                    >
                      [playMessage]
                    </Typography>
                  )}
                  {el.type === 'circle' && (
                    <Typography
                      sx={{
                        color: '#2196f3',
                        pr: 1,
                      }}
                      variant='subtitle2'
                    >
                      [callAPI]
                    </Typography>
                  )}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography
              sx={{ mx: 0.5, color: '#f44336', fontSize: 16 }}
              variant='h6'
            >
              No action added
            </Typography>
          )}
        </ListItem>
        <ListItem>
          <Tabs
            sx={{ marginX: 'auto' }}
            value={tabValue}
            onChange={(e, newVal) => {
              setTabValue(newVal);
            }}
          >
            <Tab label='Message List' />
            <Tab label='Parameters' />
          </Tabs>
        </ListItem>
      </List>
      <Box id='tabPanel1'>
        <ListItem>
          <Typography variant='subtitle1'>Select object type:</Typography>
          <Select
            value={msgObjType}
            onChange={(e) => {
              setMsgObjType(e.target.value);
            }}
            sx={{ marginX: 2 }}
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
                addInput();
                setMsgObjType('prompt');
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
              onClick={removeInput}
            />
          </Tooltip>
        </ListItem>
        <pre>{JSON.stringify(msgObj, null, 2)}</pre>
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
      <Box id='tabPanel2' sx={{ display: 'none' }}>
        <ListItem>
          <Typography sx={{ fontSize: 18, width: '50%' }} variant='h6'>
            interruptible:
          </Typography>
          <Switch
            checked={interruptible}
            onChange={(e) => {
              setInterruptible(e.target.checked);
            }}
          ></Switch>
        </ListItem>
        <ListItem sx={{ marginTop: 3 }}>
          <Typography sx={{ fontSize: 18, width: '50%' }} variant='h6'>
            repeatOption:
          </Typography>
          <Select
            size='small'
            sx={{ marginX: 1 }}
            id='repeatOption-select'
            value={repeatOption}
            onChange={(e) => {
              setRepeatOption(e.target.value);
            }}
          >
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={9}>9</MenuItem>
          </Select>
        </ListItem>
      </Box>
    </>
  );
};

export default PlayMessage;
