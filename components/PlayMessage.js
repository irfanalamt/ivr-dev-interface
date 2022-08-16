import {
  Button,
  FormControlLabel,
  List,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { Container } from '@mui/system';

const PlayMessage = ({ shapeName, setShapeName, shape }) => {
  const [tabValue, setTabValue] = useState(0);
  const [interruptible, setInterruptible] = useState(true);
  const [repeatOption, setRepeatOption] = useState(9);
  const [inputList, setInputList] = useState([]);
  const [msgObjType, setMsgObjType] = useState('prompt');
  const [msgObj, setMsgObj] = useState([]);

  useEffect(() => {
    if (shape.userValues) {
      let { params, messageList } = shape.userValues;
      setInterruptible(params.interruptible);
      setRepeatOption(params.repeatOption);
      setInputList([]);
      setMsgObj(messageList);
      console.log('ue 1');
    }
  }, [tabValue]);

  function fillInputFields() {
    if (msgObj.length > inputList.length) {
      let curValue = msgObj[inputList.length];
      if (curValue.prompt) addNewInput('prompt');
      else if (curValue.ordinal) addNewInput('ordinal');
      else if (curValue.number) addNewInput('number');
      else if (curValue.amount) addNewInput('amount');
      else if (curValue.date) addNewInput('date');
      else if (curValue.day) addNewInput('day');
      else if (curValue.digit) addNewInput('digits');
      else if (curValue.month) addNewInput('month');
      else if (curValue.time) addNewInput('time');
    }
  }

  function handleMsgObjChange(e, key) {
    const { value, name } = e.target;
    console.log('name:', name, 'key', key);

    setMsgObj((prevObj) => {
      let tempMsgObj = [...prevObj];
      tempMsgObj[inputList.length] = {
        ...tempMsgObj[inputList.length],
        [name]: value,
      };
      return tempMsgObj;
    });
  }

  function handleInputValidation(e) {
    e.preventDefault();
    let { name, value } = e.target;
    let messages = [];
    let errorBox = document.getElementById('error-box');
    console.log('onblur name', name);

    switch (name) {
      case 'prompt':
        let promptRegex = /^[a-zA-Z]+(-[a-z]+)+$/g;

        if (value == '' || value == null) {
          messages.push('Prompt is required');
          e.target.style.backgroundColor = '#ffebee';
        } else if (!promptRegex.test(value)) {
          messages.push('prompt not in valid format');
          e.target.style.backgroundColor = '#ffebee';
        }
        break;

      case 'number':
        let numberRegex = /^\d+$/;

        if (value == '' || value == null) {
          messages.push('number is required');
          e.target.style.backgroundColor = '#ffebee';
        } else if (!numberRegex.test(value)) {
          messages.push('number not in valid format');
          e.target.style.backgroundColor = '#ffebee';
        }
        break;

      case 'amount':
        let amountRegex = /^\d+$/;
        if (value == '' || value == null) {
          messages.push('amount is required');
          e.target.style.backgroundColor = '#ffebee';
        } else if (!amountRegex.test(value)) {
          messages.push('amount not in valid format');
          e.target.style.backgroundColor = '#ffebee';
        }
        break;

      case 'ordinal':
        let ordinalRegex = /^\d+$/;
        if (value == '' || value == null) {
          messages.push('ordinal is required');
          e.target.style.backgroundColor = '#ffebee';
        } else if (!ordinalRegex.test(value)) {
          messages.push('ordinal not in valid format');
          e.target.style.backgroundColor = '#ffebee';
        }
        break;

      case 'currency':
        let currencyRegex = /^[a-zA-z]{3}$/;
        if (value == '' || value == null) {
          messages.push('currency is required');
          e.target.style.backgroundColor = '#ffebee';
        } else if (!currencyRegex.test(value)) {
          messages.push('currency not in valid format');
          e.target.style.backgroundColor = '#ffebee';
        }
        break;

      case 'digit':
        let digitRegex = /^\d+$/;
        if (value == '' || value == null) {
          messages.push('digit is required');
          e.target.style.backgroundColor = '#ffebee';
        } else if (!digitRegex.test(value)) {
          messages.push('digit not in valid format');
          e.target.style.backgroundColor = '#ffebee';
        }
        break;

      case 'date':
        let dateRegex = /^\d{8}$/;
        if (value == '' || value == null) {
          messages.push('date is required');
          e.target.style.backgroundColor = '#ffebee';
        } else if (!dateRegex.test(value)) {
          messages.push('date not in valid format');
          e.target.style.backgroundColor = '#ffebee';
        }
        break;

      case 'time':
        let timeRegex = /^([0-1]?[0-9]|2[0-3])[0-5][0-9]$/;
        if (value == '' || value == null) {
          messages.push('time is required');
          e.target.style.backgroundColor = '#ffebee';
        } else if (!timeRegex.test(value)) {
          messages.push('time not in valid format');
          e.target.style.backgroundColor = '#ffebee';
        }
        break;
    }

    if (messages.length > 0) {
      errorBox.style.visibility = 'visible';
      errorBox.innerText = messages.join('.  ');
    } else {
      errorBox.style.visibility = 'hidden';
      e.target.style.backgroundColor = '#f1f8e9';
      errorBox.innerText = '';
    }
  }

  function saveUserValues() {
    shape.setUserValues({
      params: { interruptible, repeatOption },
      messageList: msgObj,
    });
    console.log('PLAYMESSAGE INPUT SAVED');
    console.log(shape.userValues);
  }

  function addNewInput(objType) {
    const key = inputList.length;

    switch (objType) {
      case 'prompt':
        const promptCode = (
          <ListItem key={key}>
            <Typography sx={{ marginX: 2 }} variant='body1'>
              prompt:
            </Typography>
            <TextField
              size='small'
              variant='outlined'
              fullWidth
              name='prompt'
              defaultValue={msgObj[key]?.prompt}
              onChange={(e) => {
                handleMsgObjChange(e, key);
                handleInputValidation(e);
              }}
            />
          </ListItem>
        );

        setInputList([...inputList, promptCode]);
        break;

      case 'ordinal':
        const ordinalCode = (
          <ListItem key={key}>
            <Typography sx={{ marginX: 2 }} variant='body1'>
              ordinal:
            </Typography>
            <TextField
              size='small'
              sx={{ maxWidth: 100 }}
              name='ordinal'
              defaultValue={msgObj[key]?.ordinal}
              onChange={(e) => {
                handleMsgObjChange(e, key);
                handleInputValidation(e);
              }}
            />
          </ListItem>
        );

        setInputList([...inputList, ordinalCode]);
        break;

      case 'number':
        const numberCode = (
          <ListItem key={key}>
            <Typography sx={{ marginX: 2 }} variant='body1'>
              number:
            </Typography>
            <TextField
              size='small'
              sx={{ maxWidth: 100 }}
              name='number'
              defaultValue={msgObj[key]?.number}
              onChange={(e) => {
                handleMsgObjChange(e, key);
                handleInputValidation(e);
              }}
            />
          </ListItem>
        );

        setInputList([...inputList, numberCode]);
        break;

      case 'amount':
        const amountCode = (
          <ListItem key={key}>
            <Typography sx={{ marginX: 2 }} variant='body1'>
              amount:
            </Typography>
            <TextField
              size='small'
              sx={{ maxWidth: 100 }}
              name='amount'
              defaultValue={msgObj[key]?.amount}
              onChange={(e) => {
                handleMsgObjChange(e, key);
                handleInputValidation(e);
              }}
            />
            <Typography sx={{ marginLeft: 4 }} variant='body1'>
              currency:
            </Typography>
            <TextField
              sx={{ maxWidth: 100, marginX: 2 }}
              variant='outlined'
              size='small'
              name='currency'
              defaultValue={msgObj[key]?.currency || 'SAR'}
              onChange={(e) => {
                handleMsgObjChange(e, key);
                handleInputValidation(e);
              }}
            />
          </ListItem>
        );

        setInputList([...inputList, amountCode]);
        break;

      case 'date':
        const dateCode = (
          <ListItem key={key}>
            <Typography sx={{ marginX: 2 }} variant='body1'>
              date:
            </Typography>
            <TextField
              sx={{ maxWidth: 150 }}
              placeholder='yyyymmdd'
              variant='outlined'
              size='small'
              name='date'
              defaultValue={msgObj[key]?.date}
              onChange={(e) => {
                handleMsgObjChange(e, key);
                handleInputValidation(e);
              }}
            />
            <Typography sx={{ marginLeft: 2 }} variant='body1'>
              playYear:
            </Typography>
            <RadioGroup
              row
              name='playYear'
              defaultValue={msgObj[key]?.playYear || false}
              onChange={(e) => {
                handleMsgObjChange(e, key);
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

        setInputList([...inputList, dateCode]);
        break;

      case 'day':
        const dayCode = (
          <ListItem key={key}>
            <Typography sx={{ marginX: 2 }} variant='body1'>
              day:
            </Typography>
            <Select
              placeholder='day'
              size='small'
              name='day'
              defaultValue={msgObj[key]?.day || 'mon'}
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

        setInputList([...inputList, dayCode]);
        break;

      case 'digits':
        const digitCode = (
          <ListItem key={key}>
            <Typography sx={{ marginX: 2 }} variant='body1'>
              digit:
            </Typography>
            <TextField
              sx={{ maxWidth: 100 }}
              size='small'
              name='digit'
              defaultValue={msgObj[key]?.digit}
              onChange={(e) => {
                handleMsgObjChange(e, key);
                handleInputValidation(e);
              }}
            />
          </ListItem>
        );

        setInputList([...inputList, digitCode]);
        break;

      case 'month':
        const monthCode = (
          <ListItem key={key}>
            <Typography sx={{ marginX: 2 }} variant='body1'>
              month:
            </Typography>
            <Select
              size='small'
              name='month'
              defaultValue={msgObj[key]?.month || 1}
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
              defaultValue={msgObj[key]?.isHijri || false}
              onChange={(e) => {
                handleMsgObjChange(e, key);
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
        setInputList([...inputList, monthCode]);
        break;

      case 'time':
        const timeCode = (
          <ListItem key={key}>
            <Typography sx={{ marginX: 2 }} variant='body1'>
              time:
            </Typography>
            <TextField
              sx={{ maxWidth: 100 }}
              variant='outlined'
              placeholder='hhmm'
              size='small'
              name='time'
              defaultValue={msgObj[key]?.time}
              onChange={(e) => {
                handleMsgObjChange(e, key);
                handleInputValidation(e);
              }}
            />
            <Typography sx={{ marginLeft: 2 }} variant='body1'>
              is24:
            </Typography>
            <RadioGroup
              row
              name='is24'
              defaultValue={msgObj[key]?.is24 || false}
              onChange={(e) => {
                handleMsgObjChange(e, key);
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
        setInputList([...inputList, timeCode]);
        break;
    }
  }

  function handleTabChange(e, newVal) {
    setTabValue(newVal);
  }

  return (
    <List>
      <ListItem sx={{ position: 'relative' }}>
        <Typography
          sx={{
            marginX: 'auto',
            marginY: 2,
            boxShadow: 1,
            paddingX: 1,
            borderRadius: 2,
            backgroundColor: '#c0ca33',
          }}
          variant='h5'
        >
          Play Message
        </Typography>
        <Button
          color='info'
          sx={{ position: 'absolute', left: 10, top: 0 }}
          variant='outlined'
          onClick={saveUserValues}
        >
          save <SaveRoundedIcon />
        </Button>
      </ListItem>
      <ListItem sx={{ justifyContent: 'center' }}>
        <Typography variant='h6'>NAME</Typography>
        <TextField
          sx={{ marginX: 2 }}
          value={shapeName}
          onChange={(e) => {
            setShapeName(e.target.value);
          }}
        />
      </ListItem>
      <ListItem>
        <Tabs
          sx={{ marginX: 'auto' }}
          value={tabValue}
          onChange={handleTabChange}
        >
          <Tab onClick={saveUserValues} label='Message List' />
          <Tab onClick={saveUserValues} label='Parameters' />
        </Tabs>
      </ListItem>
      {tabValue == '0' && (
        <>
          <ListItem>
            <Typography variant='subtitle1'>Select object type:</Typography>
            <Select
              defaultValue='prompt'
              value={msgObjType}
              sx={{ marginX: 2 }}
              onChange={(e) => {
                setMsgObjType(e.target.value);
              }}
            >
              <MenuItem value='prompt'>Prompt</MenuItem>
              <MenuItem value='number'>Number</MenuItem>
              <MenuItem value='ordinal'>Ordinal</MenuItem>
              <MenuItem value='amount'>Amount</MenuItem>
              <MenuItem value='digits'>Digits</MenuItem>
              <MenuItem value='date'>Date</MenuItem>
              <MenuItem value='day'>Day</MenuItem>
              <MenuItem value='month'>Month</MenuItem>
              <MenuItem value='time'>Time</MenuItem>
            </Select>
            <Button
              sx={{ maxWidth: 150, marginX: 'auto' }}
              color='success'
              variant='outlined'
              onClick={() => {
                addNewInput(msgObjType);
              }}
            >
              ADD NEW
              <AddBoxRoundedIcon />
            </Button>
          </ListItem>
          <pre>{JSON.stringify(msgObj, undefined, 2)}</pre>
          {fillInputFields()}
          <List>{inputList}</List>
          <Container sx={{ textAlign: 'center' }}>
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
          </Container>
        </>
      )}
      {tabValue == '1' && (
        <>
          <ListItem>
            <Typography variant='h6'>interruptible:</Typography>
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
            <Typography variant='h6'>repeatOption:</Typography>
            <Select
              sx={{ marginX: 1 }}
              id='repeatOption-select'
              label='0-9'
              value={repeatOption}
              defaultValue={9}
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
            <Typography sx={{ marginX: 1 }} variant='subtitle2'>
              0-9
            </Typography>
          </ListItem>
        </>
      )}
    </List>
  );
};

export default PlayMessage;
