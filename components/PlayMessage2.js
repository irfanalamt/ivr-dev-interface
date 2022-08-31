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
import { render } from 'react-dom';

const PlayMessage = ({ shape, handleCloseDrawer, userVariables }) => {
  const [shapeName, setShapeName] = useState(shape.text);
  const [alertError, setAlertError] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [allErrors, setAllErrors] = useState({});
  const [interruptible, setInterruptible] = useState(
    shape.userValues?.params.interruptible || true
  );
  const [repeatOption, setRepeatOption] = useState(
    shape.userValues?.params.repeatOption || 9
  );
  const [msgObj, setMsgObj] = useState(shape.userValues?.messageList || []);
  const [inputList, setInputList] = useState([]);
  const [msgObjType, setMsgObjType] = useState('prompt');

  let insertDiv = false;

  useEffect(() => {
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
  }, [tabValue]);

  function saveUserValues() {
    console.log('🚀 ~ saveUserValues ~ allErrors', allErrors);
    //If errrors present, setAlertError;return
    console.log('Errors before saving:', Object.keys(allErrors).length);
    if (Object.keys(allErrors).length > 0) {
      setAlertError(true);
      return;
    }
    // filter out null values from msg array
    let filteredMsgObj = msgObj.filter((element) => {
      return element !== null;
    });

    //else, save current state to shape
    setAlertError(false);
    setAlertSuccess(true);
    shape.setText(shapeName);
    shape.setUserValues({
      params: { interruptible, repeatOption },
      messageList: filteredMsgObj,
    });

    console.log('shapeSaved: ', shape);
  }

  function handleNameValidation(e) {
    let { value } = e.target;
    let messages = [];
    let errorBox = document.getElementById('name-error-box');
    let nameRegex = /^[a-zA-z_]+[a-zA-z0-9_]*$/;
    if (!nameRegex.test(value)) {
      errorBox.style.display = 'block';
      errorBox.innerText = 'name not in valid format';
      e.target.style.backgroundColor = '#ffebee';
      setAllErrors({ ...allErrors, name: true });
      return;
    }
    //if regex match ,then delete error from allErrors
    setAllErrors((obj) => {
      delete obj.name;
      return obj;
    });
    errorBox.style.display = 'none';
    e.target.style.backgroundColor = '#f1f8e9';
    errorBox.innerText = '';
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
    // When loading from saved msgObj, we update our inputList accordingly
    if (msgObj.length > inputList.length) {
      let curValue = msgObj[inputList.length];
      if (curValue?.prompt) addNewInput('prompt');
      else if (curValue?.ordinal) addNewInput('ordinal');
      else if (curValue?.number) addNewInput('number');
      else if (curValue?.amount) addNewInput('amount');
      else if (curValue?.date) addNewInput('date');
      else if (curValue?.day) addNewInput('day');
      else if (curValue?.digit) addNewInput('digit');
      else if (curValue?.month) addNewInput('month');
      else if (curValue?.time) addNewInput('time');
    }
  }
  function handleInputValidation(e) {
    // validation conditions for all input fields
    console.log('handlevalidation e.target', e.target);
    let { name, value } = e.target;
    let messages = [];
    let errorBox = document.getElementById('error-box');
    console.log('ip validation,e.target', e.type);
    switch (name) {
      case 'prompt':
        let promptRegex = /^[a-zA-z][a-zA-Z0-9]+(-?[a-z0-9]+)+$/;

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
        let amountRegex = /^\d+\.?\d+$/;
        if (value == '' || value == null) {
          messages.push('amount is required');
          e.target.style.backgroundColor = '#ffebee';
        } else if (!amountRegex.test(value)) {
          messages.push('amount not in valid format');
          e.target.style.backgroundColor = '#ffebee';
        }
        break;

      case 'ordinal':
        let ordinalRegex = /^\d{1,2}$/;
        if (value == '' || value == null) {
          messages.push('ordinal is required');
          e.target.style.backgroundColor = '#ffebee';
        } else if (!ordinalRegex.test(value)) {
          messages.push('ordinal not in valid format. (0-99)');
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
        let dateRegex =
          /^(1[3-4]|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
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
      setAllErrors({ ...allErrors, [inputList.length]: true });
      errorBox.style.visibility = 'visible';
      errorBox.innerText = messages.join('.  ');
      return;
    }
    // no errors condition
    setAllErrors((obj) => {
      delete obj[inputList.length];
      return obj;
    });
    errorBox.style.visibility = 'hidden';
    e.target.style.backgroundColor = '#f1f8e9';
    errorBox.innerText = '';
  }

  function handleIfVariable(e, id, name, div) {
    //when isVar checked, check if variables of type name present; fill select field
    let { checked } = e.target;
    let tf = document.getElementById(id);
    let boxDiv = document.getElementById(div);
    console.log('🚀 ~ handleIfVariable ~ checked', checked, name);
    if (checked === true) {
      let selectElement = fillSelectFieldVariables(name);
      console.log('🚀 ~ handleIfVariable ~ selectElement', selectElement);
      insertDiv = ReactDOM.createRoot(boxDiv);

      // console.log(typeof selectElement);

      tf.disabled = true;
      tf.style.width = '10px';
      tf.style.backgroundColor = '#cfd8dc';
      if (selectElement === null) return;
      insertDiv.render(selectElement);
      return;
    }
    if (checked === false) {
      tf.disabled = false;
      tf.style.width = null;
      tf.style.backgroundColor = null;
      insertDiv.unmount();
    }
  }

  function fillSelectFieldVariables(name) {
    let valueInVar = [];

    if (
      name === 'number' ||
      name === 'ordinal' ||
      name === 'amount' ||
      name === 'digit'
    ) {
      userVariables.forEach((el) => {
        if (el.number) {
          valueInVar.push({ name: el.number, value: el.default });
        }
      });
    } else if (name === 'prompt') {
      userVariables.forEach((el) => {
        if (el.prompt) {
          valueInVar.push({ name: el.prompt, value: el.default });
        }
      });
    }

    if (valueInVar.length === 0) return null;

    const variableSelectCode = (
      <ListItem>
        <Select
          name={name}
          defaultValue=''
          onChange={handleMsgObjChange}
          onBlur={handleMsgObjChange}
          autoFocus
        >
          {valueInVar.map((el, index) => {
            return (
              <MenuItem key={index} value={el.value}>
                {el.name}
              </MenuItem>
            );
          })}
        </Select>
      </ListItem>
    );
    return variableSelectCode;
  }

  function addNewInput(objType) {
    // add input fields to msgList
    const key = inputList.length;

    switch (objType) {
      case 'prompt':
        const promptCode = (
          <ListItem key={key}>
            <Typography variant='body2'>v:</Typography>
            <Switch
              onChange={(e) => {
                handleIfVariable(
                  e,
                  `prompt${key}`,
                  'prompt',
                  `prompt${key}-div`
                );
              }}
            ></Switch>

            <Typography sx={{ marginRight: 2, marginLeft: 1 }} variant='body1'>
              prompt:
            </Typography>
            <Box id={`prompt${key}-div`}></Box>
            <TextField
              id={`prompt${key}`}
              size='small'
              variant='outlined'
              name='prompt'
              defaultValue={msgObj[key]?.prompt}
              onChange={(e) => {
                handleMsgObjChange(e);
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
            <Typography variant='body2'>v:</Typography>
            <Switch
              onChange={(e) => {
                handleIfVariable(
                  e,
                  `ordinal${key}`,
                  'ordinal',
                  `ordinal${key}-div`
                );
              }}
            ></Switch>
            <Typography sx={{ marginX: 2 }} variant='body1'>
              ordinal:
            </Typography>
            <Box id={`ordinal${key}-div`}></Box>
            <TextField
              id={`ordinal${key}`}
              size='small'
              sx={{ maxWidth: 100 }}
              name='ordinal'
              defaultValue={msgObj[key]?.ordinal}
              onChange={(e) => {
                handleMsgObjChange(e);
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
            <Typography variant='body2'>v:</Typography>
            <Switch
              onChange={(e) => {
                handleIfVariable(
                  e,
                  `number${key}`,
                  'number',
                  `number${key}-div`
                );
              }}
            ></Switch>

            <Typography sx={{ marginX: 2 }} variant='body1'>
              number:
            </Typography>
            <Box id={`number${key}-div`}></Box>
            <TextField
              id={`number${key}`}
              size='small'
              sx={{ maxWidth: 100 }}
              name='number'
              defaultValue={msgObj[key]?.number}
              onChange={(e) => {
                handleMsgObjChange(e);
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
            <Typography variant='body2'>v:</Typography>
            <Switch
              onChange={(e) => {
                handleIfVariable(
                  e,
                  `amount${key}`,
                  'amount',
                  `amount${key}-div`
                );
              }}
            ></Switch>

            <Typography sx={{ marginX: 2 }} variant='body1'>
              amount:
            </Typography>
            <Box id={`amount${key}-div`}></Box>
            <TextField
              id={`amount${key}`}
              size='small'
              sx={{ maxWidth: 100 }}
              name='amount'
              defaultValue={msgObj[key]?.amount}
              onChange={(e) => {
                handleMsgObjChange(e);
                handleInputValidation(e);
              }}
            />
            <Typography sx={{ marginX: 2, marginLeft: 4 }} variant='body1'>
              currency:
            </Typography>
            <Select
              size='small'
              name='currency'
              defaultValue={msgObj[key]?.currency || 'SAR'}
              onChange={(e) => {
                handleMsgObjChange(e);
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

        setInputList([...inputList, amountCode]);
        break;

      case 'date':
        const dateCode = (
          <ListItem key={key}>
            <Typography variant='body2'>v:</Typography>
            <Switch
              onChange={(e) => {
                handleIfVariable(e, `date${key}`, 'date', `date${key}-div`);
              }}
            ></Switch>

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
              defaultValue={msgObj[key]?.date}
              onChange={(e) => {
                handleMsgObjChange(e);
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
                handleMsgObjChange(e);
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
            <Typography variant='body2'>v:</Typography>
            <Switch
              onChange={(e) => {
                handleIfVariable(e, `day${key}`, 'day', `day${key}-div`);
              }}
            ></Switch>

            <Typography sx={{ marginX: 2 }} variant='body1'>
              day:
            </Typography>
            <Box id={`day${key}-div`}></Box>
            <Select
              id={`day${key}`}
              placeholder='day'
              size='small'
              name='day'
              defaultValue={msgObj[key]?.day || ''}
              onChange={(e) => {
                handleMsgObjChange(e);
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

      case 'digit':
        const digitCode = (
          <ListItem key={key}>
            <Typography variant='body2'>v:</Typography>
            <Switch
              onChange={(e) => {
                handleIfVariable(e, `digit${key}`, 'digit', `digit${key}-div`);
              }}
            ></Switch>

            <Typography sx={{ marginX: 2 }} variant='body1'>
              digit:
            </Typography>
            <Box id={`digit${key}-div`}></Box>
            <TextField
              id={`digit${key}`}
              sx={{ maxWidth: 100 }}
              size='small'
              name='digit'
              defaultValue={msgObj[key]?.digit}
              onChange={(e) => {
                handleMsgObjChange(e);
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
            <Typography variant='body2'>v:</Typography>
            <Switch
              onChange={(e) => {
                handleIfVariable(e, `month${key}`, 'month', `month${key}-div`);
              }}
            ></Switch>

            <Typography sx={{ marginX: 2 }} variant='body1'>
              month:
            </Typography>
            <Box id={`month${key}-div`}></Box>
            <Select
              id={`month${key}`}
              size='small'
              name='month'
              defaultValue={msgObj[key]?.month || ''}
              onChange={(e) => {
                handleMsgObjChange(e);
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
              value={msgObj[key]?.isHijri}
              defaultValue={false}
              onChange={(e) => {
                handleMsgObjChange(e);
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
            <Typography variant='body2'>v:</Typography>
            <Switch
              onChange={(e) => {
                handleIfVariable(e, `time${key}`, 'time', `time${key}-div`);
              }}
            ></Switch>

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
              defaultValue={msgObj[key]?.time}
              onChange={(e) => {
                handleMsgObjChange(e);
                handleInputValidation(e);
              }}
            />
            <Typography sx={{ marginLeft: 2 }} variant='body1'>
              is24:
            </Typography>
            <RadioGroup
              row
              name='is24'
              value={msgObj[key]?.is24}
              defaultValue={false}
              onChange={handleMsgObjChange}
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
              handleNameValidation(e);
            }}
          ></TextField>
        </ListItem>
        <ListItem>
          <Typography
            sx={{ marginX: 'auto', boxShadow: 1, paddingX: 1 }}
            variant='subtitle2'
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
                  addNewInput(msgObjType);
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
                onClick={() => {
                  if (inputList.length > 0) {
                    let tempObj = [...inputList];
                    tempObj.pop();
                    setInputList(tempObj);
                    if (msgObj[inputList.length - 1]) {
                      let tempMsgObj = [...msgObj];
                      console.log('msgObj before pop:', tempMsgObj);
                      console.log('errors before pop', allErrors);
                      if (allErrors[inputList.length - 1]) {
                        console.log('deleted item had error');

                        let tempObj = { ...allErrors };
                        delete tempObj[inputList.length - 1];
                        setAllErrors(tempObj);
                      }
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
      </List>

      <Snackbar
        open={alertError}
        autoHideDuration={6000}
        onClose={() => {
          setAlertError(false);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert severity='error'>
          Save unsuccessfull. Some fields are invalid!
        </Alert>
      </Snackbar>
      <Snackbar
        open={alertSuccess}
        autoHideDuration={6000}
        onClose={() => {
          setAlertSuccess(false);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert severity='success'>Play Message saved!</Alert>
      </Snackbar>
    </>
  );
};

export default PlayMessage;
