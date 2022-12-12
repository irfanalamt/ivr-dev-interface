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
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import { addInputElements, checkValidity } from '../src/helpers';

const PlayConfirm = ({
  shape,
  handleCloseDrawer,
  userVariables,
  stageGroup,
}) => {
  const [shapeName, setShapeName] = useState(shape.text);
  const [tabValue, setTabValue] = useState(0);
  const [msgObjType, setMsgObjType] = useState('prompt');
  const [msgObj, setMsgObj] = useState(shape.userValues?.messageList || []);
  const [confirmOption, setConfirmOption] = useState(
    shape.userValues?.params.confirmOption ?? 1
  );
  const [cancelOption, setCancelOption] = useState(
    shape.userValues?.params.cancelOption ?? 9
  );
  const [confirmPrompt, setConfirmPrompt] = useState(
    shape.userValues?.params.confirmPrompt ?? ''
  );
  const [cancelPrompt, setCancelPrompt] = useState(
    shape.userValues?.params.cancelPrompt ?? ''
  );

  const nameErrorRef = useRef(null);

  function saveUserValues() {
    const filteredMsgObj = msgObj.filter((n) => n.value);
    shape.setText(shapeName);
    shape.setUserValues({
      params: { confirmOption, cancelOption, confirmPrompt, cancelPrompt },
      messageList: filteredMsgObj,
    });

    if (filteredMsgObj.length > 0) generateJS(filteredMsgObj);
  }

  function generateJS(filteredMsgObj) {
    let codeString = `this.${
      shapeName || `playConfirm${shape.id}`
    }= async function(){let msgList = ${JSON.stringify(
      filteredMsgObj
    )};let params = ${JSON.stringify({
      confirmOption,
      cancelOption,
      confirmPrompt,
      cancelPrompt,
    })};await IVR.playConfirm(msgList,params);};`;

    shape.setFunctionString(codeString);
    console.log('🕺🏻playConfirm code:', codeString);
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
    let errorBox = nameErrorRef.current;
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
            sx={{ backgroundColor: '#dcedc8', mx: 'auto', px: 2, py: 3 }}
            label={<Typography variant='h6'>Play Confirm</Typography>}
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
            ref={nameErrorRef}
            id='name-error-box'
          ></Typography>
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
      <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }} id='tabPanel1'>
        <ListItem>
          <Paper
            sx={{ width: '100%', px: 2, py: 1, backgroundColor: '#f9fbe7' }}
          >
            <Tooltip title='object type:'>
              <Select
                value={msgObjType}
                onChange={(e) => {
                  setMsgObjType(e.target.value);
                }}
                sx={{ width: '35%' }}
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
                size='large'
                color='success'
                onClick={() => {
                  addInput();
                  setMsgObjType('prompt');
                }}
                sx={{ ml: 2 }}
              >
                <AddBoxRoundedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip size='large' color='error' title='Remove'>
              <IconButton onClick={removeInput}>
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
      <Box id='tabPanel2' sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
        <ListItem sx={{ marginTop: 2 }}>
          <Typography sx={{ fontSize: 18, width: '50%' }} variant='h6'>
            confirmOption:
          </Typography>
          <Select
            size='small'
            sx={{ marginX: 1 }}
            value={confirmOption}
            onChange={(e) => {
              setConfirmOption(e.target.value);
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
        <ListItem sx={{ marginTop: 1 }}>
          <Typography sx={{ fontSize: 18, width: '50%' }} variant='h6'>
            cancelOption:
          </Typography>
          <Select
            size='small'
            sx={{ marginX: 1 }}
            value={cancelOption}
            onChange={(e) => {
              setCancelOption(e.target.value);
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
        <ListItem sx={{ marginTop: 1 }}>
          <Typography sx={{ fontSize: 18, width: '50%' }} variant='h6'>
            confirmPrompt:
          </Typography>
          <TextField
            size='small'
            value={confirmPrompt}
            onChange={(e) => {
              setConfirmPrompt(e.target.value);
            }}
          />
        </ListItem>
        <ListItem sx={{ marginTop: 1 }}>
          <Typography sx={{ fontSize: 18, width: '50%' }} variant='h6'>
            cancelPrompt:
          </Typography>
          <TextField
            size='small'
            value={cancelPrompt}
            onChange={(e) => {
              setCancelPrompt(e.target.value);
            }}
          />
        </ListItem>
      </Box>
    </>
  );
};

export default PlayConfirm;
