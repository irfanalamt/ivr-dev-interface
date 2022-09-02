import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';

const PlayMessage = ({ shape, handleCloseDrawer, userVariables }) => {
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
    shape.setText(shapeName);
    shape.setUserValues({
      params: { interruptible, repeatOption },
      messageList: msgObj,
    });
  }

  function addInput() {
    setMsgObj((s) => {
      return [...s, { type: msgObjType, value: '' }];
    });
  }

  function removeInput() {
    setMsgObj((s) => {
      const newArr = [...s];
      newArr.pop();
      return newArr;
    });
  }

  function handleMsgObjChange(e, index, name = null) {
    e.preventDefault();
    console.log('🚀 ~ handleMsgObjChange ~ index', index);
    if (name === null) {
      setMsgObj((s) => {
        const newArr = [...s];
        newArr[index].value = e.target.value;
        return newArr;
      });
      return;
    }
    setMsgObj((s) => {
      const newArr = [...s];
      newArr[index][name] = e.target.value;
      return newArr;
    });
  }

  function addInputElements(type, key) {
    switch (type) {
      case 'prompt':
        const promptCode = (
          <ListItem key={key}>
            <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
              V
            </Typography>
            <Switch sx={{ ml: 0 }} size='large'></Switch>

            <Typography sx={{ marginRight: 2, marginLeft: 1 }} variant='body1'>
              prompt:
            </Typography>
            <Box id={`prompt${key}-div`}></Box>
            <TextField
              id={`prompt${key}`}
              size='small'
              variant='outlined'
              name='prompt'
              value={msgObj[key].value}
              onChange={(e) => {
                handleMsgObjChange(e, key);
              }}
            />
          </ListItem>
        );
        return promptCode;

      case 'ordinal':
        const ordinalCode = (
          <ListItem key={key}>
            <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
              V
            </Typography>
            <Switch></Switch>
            <Typography sx={{ marginX: 2 }} variant='body1'>
              ordinal:
            </Typography>
            <Box id={`ordinal${key}-div`}></Box>
            <TextField
              id={`ordinal${key}`}
              size='small'
              sx={{ maxWidth: 100 }}
              name='ordinal'
              value={msgObj[key]?.value}
              onChange={(e) => {
                handleMsgObjChange(e, key);
              }}
            />
          </ListItem>
        );
        return ordinalCode;

      case 'number':
        const numberCode = (
          <ListItem key={key}>
            <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
              V
            </Typography>
            <Switch></Switch>

            <Typography sx={{ marginX: 2 }} variant='body1'>
              number:
            </Typography>
            <Box id={`number${key}-div`}></Box>
            <TextField
              id={`number${key}`}
              size='small'
              sx={{ maxWidth: 100 }}
              name='number'
              value={msgObj[key]?.value}
              onChange={(e) => {
                handleMsgObjChange(e, key);
              }}
            />
          </ListItem>
        );
        return numberCode;

      case 'amount':
        const amountCode = (
          <ListItem key={key}>
            <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
              V
            </Typography>
            <Switch></Switch>

            <Typography sx={{ marginX: 2 }} variant='body1'>
              amount:
            </Typography>
            <Box id={`amount${key}-div`}></Box>
            <TextField
              id={`amount${key}`}
              size='small'
              sx={{ maxWidth: 100 }}
              name='amount'
              value={msgObj[key]?.value}
              onChange={(e) => {
                handleMsgObjChange(e, key);
              }}
            />
            <Typography sx={{ marginX: 2, marginLeft: 4 }} variant='body1'>
              currency:
            </Typography>
            <Select
              size='small'
              name='currency'
              value={msgObj[key]?.currency || 'SAR'}
              onChange={(e) => {
                handleMsgObjChange(e, key, 'currency');
              }}
            >
              <MenuItem value='SAR'>SAR</MenuItem>
              <MenuItem value='USD'>USD</MenuItem>
              <MenuItem value='CAD'>CAD</MenuItem>
              <MenuItem value='GBP'>GBP</MenuItem>
              <MenuItem value='AUD'>AUD</MenuItem>
            </Select>
          </ListItem>
        );

        return amountCode;

      case 'date':
        const dateCode = (
          <ListItem key={key}>
            <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
              V
            </Typography>
            <Switch></Switch>

            <Typography sx={{ marginX: 2 }} variant='body1'>
              date:
            </Typography>
            <Box id={`date${key}-div`}></Box>
            <TextField
              id={`date${key}`}
              sx={{ maxWidth: 150 }}
              placeholder='yyyymmdd'
              variant='outlined'
              size='small'
              name='date'
              value={msgObj[key]?.value}
              onChange={(e) => {
                handleMsgObjChange(e, key);
              }}
            />
            <Typography sx={{ marginLeft: 2 }} variant='body1'>
              playYear:
            </Typography>
            <RadioGroup
              row
              name='playYear'
              value={msgObj[key]?.playYear || false}
              onChange={(e) => {
                handleMsgObjChange(e, key, 'playYear');
              }}
            >
              <FormControlLabel
                sx={{ marginLeft: 1 }}
                value={true}
                control={<Radio />}
                label='true'
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label='false'
              />
            </RadioGroup>
          </ListItem>
        );
        return dateCode;

      case 'day':
        const dayCode = (
          <ListItem key={key}>
            <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
              V
            </Typography>
            <Switch></Switch>

            <Typography sx={{ marginX: 2 }} variant='body1'>
              day:
            </Typography>
            <Box id={`day${key}-div`}></Box>
            <Select
              id={`day${key}`}
              placeholder='day'
              size='small'
              name='day'
              value={msgObj[key]?.value || ''}
              onChange={(e) => {
                handleMsgObjChange(e, key);
              }}
            >
              <MenuItem value='mon'>Monday</MenuItem>
              <MenuItem value='tue'>Tuesday</MenuItem>
              <MenuItem value='wed'>Wednesday</MenuItem>
              <MenuItem value='thu'>Thursday</MenuItem>
              <MenuItem value='fri'>Friday</MenuItem>
              <MenuItem value='sat'>Saturday</MenuItem>
              <MenuItem value='sun'>Sunday</MenuItem>
            </Select>
          </ListItem>
        );
        return dayCode;

      case 'digit':
        const digitCode = (
          <ListItem key={key}>
            <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
              V
            </Typography>
            <Switch></Switch>

            <Typography sx={{ marginX: 2 }} variant='body1'>
              digit:
            </Typography>
            <Box id={`digit${key}-div`}></Box>
            <TextField
              id={`digit${key}`}
              sx={{ maxWidth: 100 }}
              size='small'
              name='digit'
              value={msgObj[key]?.value}
              onChange={(e) => {
                handleMsgObjChange(e, key);
              }}
            />
          </ListItem>
        );

        return digitCode;

      case 'month':
        const monthCode = (
          <ListItem key={key}>
            <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
              V
            </Typography>
            <Switch></Switch>

            <Typography sx={{ marginX: 2 }} variant='body1'>
              month:
            </Typography>
            <Box id={`month${key}-div`}></Box>
            <Select
              id={`month${key}`}
              size='small'
              name='month'
              value={msgObj[key]?.value || ''}
              onChange={(e) => {
                handleMsgObjChange(e, key);
              }}
            >
              <MenuItem value={1}>January</MenuItem>
              <MenuItem value={2}>February</MenuItem>
              <MenuItem value={3}>March</MenuItem>
              <MenuItem value={4}>April</MenuItem>
              <MenuItem value={5}>May</MenuItem>
              <MenuItem value={6}>June</MenuItem>
              <MenuItem value={7}>July</MenuItem>
              <MenuItem value={8}>August</MenuItem>
              <MenuItem value={9}>September</MenuItem>
              <MenuItem value={10}>October</MenuItem>
              <MenuItem value={11}>November</MenuItem>
              <MenuItem value={12}>December</MenuItem>
            </Select>
            <Typography sx={{ marginLeft: 2 }} variant='body1'>
              isHijri:
            </Typography>
            <RadioGroup
              row
              name='isHijri'
              value={msgObj[key]?.isHijri || false}
              onChange={(e) => {
                handleMsgObjChange(e, key, 'isHijri');
              }}
            >
              <FormControlLabel
                sx={{ marginLeft: 1 }}
                value={true}
                control={<Radio />}
                label='true'
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label='false'
              />
            </RadioGroup>
          </ListItem>
        );
        return monthCode;

      case 'time':
        const timeCode = (
          <ListItem key={key}>
            <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
              V
            </Typography>
            <Switch></Switch>

            <Typography sx={{ marginX: 2 }} variant='body1'>
              time:
            </Typography>
            <Box id={`time${key}-div`}></Box>
            <TextField
              id={`time${key}`}
              sx={{ maxWidth: 100 }}
              variant='outlined'
              placeholder='hhmm'
              size='small'
              name='time'
              value={msgObj[key]?.value}
              onChange={(e) => {
                handleMsgObjChange(e, key);
              }}
            />
            <Typography sx={{ marginLeft: 2 }} variant='body1'>
              is24:
            </Typography>
            <RadioGroup
              row
              name='is24'
              value={msgObj[key]?.is24 || false}
              onChange={(e) => {
                handleMsgObjChange(e, key, 'is24');
              }}
            >
              <FormControlLabel
                sx={{ marginLeft: 1 }}
                value={true}
                control={<Radio />}
                label='true'
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label='false'
              />
            </RadioGroup>
          </ListItem>
        );
        return timeCode;
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
              setShapeName(e.target.value);
            }}
          ></TextField>
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
          {msgObj.map((el, i) => {
            return addInputElements(el.type, i);
          })}
        </List>
      </Box>
      <Box id='tabPanel2' sx={{ display: 'none' }}>
        <ListItem>
          <Typography sx={{ fontSize: 18 }} variant='h6'>
            interruptible:
          </Typography>
          <RadioGroup
            value={interruptible}
            row
            name='interruptible-radio-buttons-group'
            onChange={(e) => {
              setInterruptible(e.target.value);
            }}
          >
            <FormControlLabel
              sx={{ marginX: 1 }}
              value={true}
              control={<Radio />}
              label='true'
            />
            <FormControlLabel
              sx={{ marginX: 1 }}
              value={false}
              control={<Radio />}
              label='false'
            />
          </RadioGroup>
        </ListItem>
        <ListItem sx={{ marginTop: 3 }}>
          <Typography sx={{ fontSize: 18 }} variant='h6'>
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
