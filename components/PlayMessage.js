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
      setMsgObj(messageList);
      messageList.forEach((el, i) => {
        if (el.prompt) {
          setMsgObjType('prompt');
          addNewInput();
          setMsgObj([...msgObj, messageList]);
        }
      });
    }
  }, []);

  function handleMsgObjChange(e, key) {
    const { value, name } = e.target;
    console.log('name:', name, 'key', key);

    setMsgObj((prevObj) => {
      let tempMsgObj = [...prevObj];
      tempMsgObj[key] = {
        ...tempMsgObj[key],
        [name]: value,
      };
      return tempMsgObj;
    });
  }

  // function handleMsgObjChange(e, key) {
  //   const { value, name } = e.target;
  //   console.log('name:', name, 'key', key);
  //   console.log(msgObj);

  //   setMsgObj((prevObj) => {
  //     return { ...prevObj, [key]: { value: value, name: name } };
  //   });
  // }

  function saveUserValues() {
    shape.setUserValues({
      params: { interruptible, repeatOption },
      messageList: msgObj,
    });
    console.log('PLAYMESSAGE INPUT SAVED');
    console.log(shape.userValues);
  }

  function addNewInput() {
    const key = inputList.length;
    switch (msgObjType) {
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
              value={msgObj[key]?.prompt}
              onChange={(e) => {
                handleMsgObjChange(e, key);
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
              value={msgObj[key]?.ordinal}
              onChange={(e) => {
                handleMsgObjChange(e, key);
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
              value={msgObj[key]?.number}
              onChange={(e) => {
                handleMsgObjChange(e, key);
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
              value={msgObj[key]?.amount}
              onChange={(e) => {
                handleMsgObjChange(e, key);
              }}
            />
            <Typography sx={{ marginLeft: 4 }} variant='body1'>
              currency:
            </Typography>
            <TextField
              sx={{ maxWidth: 100, marginX: 2 }}
              variant='outlined'
              defaultValue='SAR'
              size='small'
              name='currency'
              value={msgObj[key]?.currency}
              onChange={(e) => {
                handleMsgObjChange(e, key);
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
              value={msgObj[key]?.date.value}
              onChange={(e) => {
                handleMsgObjChange(e, key);
              }}
            />
            <Typography sx={{ marginLeft: 2 }} variant='body1'>
              playYear:
            </Typography>
            <RadioGroup
              defaultValue={false}
              row
              name='playYear'
              value={msgObj[key]?.playYear.value}
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
              defaultValue='mon'
              size='small'
              name='day'
              value={msgObj[key]?.day.value}
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
              value={msgObj[key]?.digit.value}
              onChange={(e) => {
                handleMsgObjChange(e, key);
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
              defaultValue={1}
              size='small'
              name='month'
              value={msgObj[key]?.month.value}
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
              defaultValue={false}
              row
              name='isHijri'
              value={msgObj[key]?.isHijri.value}
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
              value={msgObj[key]?.time.value}
              onChange={(e) => {
                handleMsgObjChange(e, key);
              }}
            />
            <Typography sx={{ marginLeft: 2 }} variant='body1'>
              is24:
            </Typography>
            <RadioGroup
              defaultValue={false}
              row
              name='is24'
              value={msgObj[key]?.is24.value}
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
          <Tab label='Message List' />
          <Tab label='Parameters' />
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
              onClick={addNewInput}
            >
              ADD NEW
              <AddBoxRoundedIcon />
            </Button>
          </ListItem>
          <pre>{JSON.stringify(msgObj, undefined, 2)}</pre>
          <List>{inputList}</List>
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
