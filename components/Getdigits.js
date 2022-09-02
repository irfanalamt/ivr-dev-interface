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
  RadioGroup,
  Radio,
  FormControlLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import { useEffect, useRef, useState } from 'react';

const GetDigits = ({ shape, handleCloseDrawer, userVariables }) => {
  const [resultName, setResultName] = useState(
    shape.userValues?.variableName || ''
  );
  const [shapeName, setShapeName] = useState(shape.text);
  const [alertError, setAlertError] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [allErrors, setAllErrors] = useState({});
  const [minDigits, setMinDigits] = useState(
    shape.userValues?.params.minDigits || 1
  );
  const [maxDigits, setMaxDigits] = useState(
    shape.userValues?.params.maxDigits || 1
  );
  const [msgObj, setMsgObj] = useState(shape.userValues?.messageList || []);
  const [inputList, setInputList] = useState([]);
  const [msgObjType, setMsgObjType] = useState('prompt');
  const [paramsObjType, setParamsObjType] = useState('');
  const [paramsInputList, setParamsInputList] = useState([]);
  const [paramsObj, setParamsObj] = useState(
    shape.userValues?.params.paramsList || []
  );

  useEffect(() => {
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
    //If errrors present, setAlertError;return
    console.log('Errors before saving:', Object.keys(allErrors).length);
    if (Object.keys(allErrors).length > 0) {
      setAlertError(true);
      return;
    }
    // filter out null values from msg, params array
    let filteredMsgObj = msgObj.filter((element) => {
      return element !== null;
    });
    let filteredParamsObj = paramsObj.filter((element) => {
      return element !== null;
    });
    console.log(
      '🚀 ~ filteredParamsObj ~ filteredParamsObj',
      filteredParamsObj
    );
    //else, save current state to shape
    setAlertError(false);
    setAlertSuccess(true);
    shape.setText(shapeName);
    shape.setUserValues({
      params: { minDigits, maxDigits, paramsList: filteredParamsObj },
      messageList: filteredMsgObj,
      variableName: resultName,
    });

    // let varIndex = userVariables.findIndex((el) => el.name === resultName);
    // if (varIndex === -1) {
    //   console.log('index not found for variable');
    //   userVariables.push({ name: resultName, result: msgObj[0] });
    //   return;
    // }

    // userVariables[varIndex] = { name: resultName, result: msgObj[0] };
    // console.log('after save user vars', userVariables);
    // console.log('shapeSaved: ', shape);
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

  function handleParamsObjChange(e) {
    // update paramsObj when paramsList value changes
    const { value, name } = e.target;
    setParamsObj((prevObj) => {
      let tempParamsObj = [...prevObj];
      tempParamsObj[paramsInputList.length] = {
        ...tempParamsObj[paramsInputList.length],
        [name]: value,
      };
      return tempParamsObj;
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
      else if (curValue?.digit) addNewInput('digits');
      else if (curValue?.month) addNewInput('month');
      else if (curValue?.time) addNewInput('time');
    }
  }

  function fillParamsList() {
    // when loading from saved paramsObj; we update paramsList accordingly
    if (paramsObj.length > paramsInputList.length) {
      let curValue = paramsObj[paramsInputList.length];
      if (curValue?.terminator) addNewParams('terminator');
      else if (curValue?.maxRetries) addNewParams('maxRetries');
      else if (curValue?.invalidAction) addNewParams('invalidAction');
      else if (curValue?.timeoutAction) addNewParams('timeoutAction');
      else if (curValue?.invalidPrompt) addNewParams('invalidPrompt');
    }
  }

  function handleInputValidation(e) {
    // validation conditions for all input fields
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

  function addNewInput(objType) {
    // add input fields to msgList
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
            <Typography sx={{ marginX: 2 }} variant='body1'>
              ordinal:
            </Typography>
            <TextField
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
            <Typography sx={{ marginX: 2 }} variant='body1'>
              number:
            </Typography>
            <TextField
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
            <Typography sx={{ marginX: 2 }} variant='body1'>
              amount:
            </Typography>
            <TextField
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
              onChange={handleMsgObjChange}
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
              defaultValue={msgObj[key]?.day || ''}
              onChange={handleMsgObjChange}
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
            <Typography sx={{ marginX: 2 }} variant='body1'>
              month:
            </Typography>
            <Select
              size='small'
              name='month'
              defaultValue={msgObj[key]?.month || ''}
              onChange={handleMsgObjChange}
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

  function addNewParams(paramsType) {
    const key = paramsInputList.length;

    switch (paramsType) {
      case 'terminator':
        const terminatorCode = (
          <ListItem sx={{ marginTop: 1 }} key={key}>
            <Typography sx={{ marginX: 2 }} variant='body1'>
              terminator:
            </Typography>
            <Select
              size='small'
              name='terminator'
              defaultValue={paramsObj[key]?.terminator || ''}
              onChange={handleParamsObjChange}
              autoFocus
            >
              <MenuItem value='#'>#</MenuItem>
              <MenuItem value='*'>*</MenuItem>
              <MenuItem value='1'>1</MenuItem>
              <MenuItem value='2'>2</MenuItem>
              <MenuItem value='3'>3</MenuItem>
              <MenuItem value='4'>4</MenuItem>
              <MenuItem value='5'>5</MenuItem>
              <MenuItem value='6'>6</MenuItem>
              <MenuItem value='7'>7</MenuItem>
              <MenuItem value='8'>8</MenuItem>
              <MenuItem value='9'>9</MenuItem>
            </Select>
          </ListItem>
        );
        setParamsInputList([...paramsInputList, terminatorCode]);
        break;

      case 'maxRetries':
        const maxRetriesCode = (
          <ListItem key={key}>
            <Typography sx={{ marginX: 2 }} variant='body1'>
              maxRetries:
            </Typography>
            <Select
              size='small'
              name='maxRetries'
              defaultValue={paramsObj[key]?.maxRetries || ''}
              onChange={handleParamsObjChange}
              autoFocus
            >
              <MenuItem value='0'>0</MenuItem>
              <MenuItem value='1'>1</MenuItem>
              <MenuItem value='2'>2</MenuItem>
              <MenuItem value='3'>3</MenuItem>
              <MenuItem value='4'>4</MenuItem>
              <MenuItem value='5'>5</MenuItem>
              <MenuItem value='6'>6</MenuItem>
              <MenuItem value='7'>7</MenuItem>
              <MenuItem value='8'>8</MenuItem>
              <MenuItem value='9'>9</MenuItem>
            </Select>
          </ListItem>
        );
        setParamsInputList([...paramsInputList, maxRetriesCode]);
        break;

      case 'invalidAction':
        const invalidActionCode = (
          <ListItem key={key}>
            <Typography sx={{ marginX: 2 }} variant='body1'>
              invalidAction:
            </Typography>
            <Select
              size='small'
              name='invalidAction'
              defaultValue={paramsObj[key]?.invalidAction || ''}
              onChange={handleParamsObjChange}
              autoFocus
            >
              <MenuItem value='disconnect'>disconnect</MenuItem>
              <MenuItem value='transfer'>transfer</MenuItem>
              <MenuItem value='function'>function</MenuItem>
            </Select>
          </ListItem>
        );
        setParamsInputList([...paramsInputList, invalidActionCode]);
        break;

      case 'timeoutAction':
        const timeoutActionCode = (
          <ListItem key={key}>
            <Typography sx={{ marginX: 2 }} variant='body1'>
              timeoutAction:
            </Typography>
            <Select
              size='small'
              name='timeoutAction'
              defaultValue={paramsObj[key]?.timeoutAction || ''}
              onChange={handleParamsObjChange}
              autoFocus
            >
              <MenuItem value='disconnect'>disconnect</MenuItem>
              <MenuItem value='transfer'>transfer</MenuItem>
              <MenuItem value='function'>function</MenuItem>
            </Select>
          </ListItem>
        );
        setParamsInputList([...paramsInputList, timeoutActionCode]);
        break;

      case 'invalidPrompt':
        const invalidPromptCode = (
          <ListItem key={key}>
            <Typography sx={{ marginX: 2 }} variant='body1'>
              invalidPrompt:
            </Typography>
            <TextField
              defaultValue={paramsObj[key]?.invalidPrompt || ''}
              onChange={handleParamsObjChange}
              variant='outlined'
              size='small'
              name='invalidPrompt'
            />
          </ListItem>
        );
        setParamsInputList([...paramsInputList, invalidPromptCode]);
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
              backgroundColor: '#b39ddb',
              borderRadius: 1,
            }}
            variant='h6'
          >
            Get Digits
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
            sx={{ marginX: 'auto', boxShadow: 1, paddingX: 1, display: 'none' }}
            variant='subtitle2'
            id='name-error-box'
          ></Typography>
        </ListItem>
        <ListItem>
          <Typography variant='button' sx={{ marginX: 1, fontSize: 15 }}>
            Result Variable =
          </Typography>

          {userVariables.length > 0 ? (
            <Select
              value={resultName}
              onChange={(e) => {
                setResultName(e.target.value);
              }}
            >
              {userVariables.map((el, i) => {
                return (
                  <MenuItem key={i} value={el.name}>
                    {el.name}
                  </MenuItem>
                );
              })}
            </Select>
          ) : (
            <Typography variant='h6'>No variables added</Typography>
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
              <MenuItem value='digits'>Digits</MenuItem>
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
                  if (inputList.length === 0) {
                    addNewInput(msgObjType);
                    setMsgObjType('prompt');
                  }
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
                      tempMsgObj.pop();
                      setMsgObj(tempMsgObj);
                      let tempObj = { ...allErrors };
                      delete tempObj[inputList.length - 1];
                      setAllErrors(tempObj);
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
          <ListItem sx={{ marginTop: 2 }}>
            <Typography sx={{ fontSize: 18 }} variant='h6'>
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
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={11}>11</MenuItem>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={13}>13</MenuItem>
              <MenuItem value={14}>14</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={16}>16</MenuItem>
              <MenuItem value={17}>17</MenuItem>
              <MenuItem value={18}>18</MenuItem>
              <MenuItem value={19}>19</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </ListItem>
          <ListItem sx={{ marginTop: 2 }}>
            <Typography sx={{ fontSize: 18 }} variant='h6'>
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
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={11}>11</MenuItem>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={13}>13</MenuItem>
              <MenuItem value={14}>14</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={16}>16</MenuItem>
              <MenuItem value={17}>17</MenuItem>
              <MenuItem value={18}>18</MenuItem>
              <MenuItem value={19}>19</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </ListItem>
          <pre>{JSON.stringify(paramsObj, undefined, 2)}</pre>
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
              sx={{ marginX: 2 }}
              value={paramsObjType}
              onChange={(e) => {
                setParamsObjType(e.target.value);
              }}
            >
              <MenuItem value='terminator'>terminator</MenuItem>
              <MenuItem value='maxRetries'>maxRetries</MenuItem>
              <MenuItem value='invalidAction'>invalidAction</MenuItem>
              <MenuItem value='timeoutAction'>timeoutAction</MenuItem>
              <MenuItem value='invalidPrompt'>invalidPrompt</MenuItem>
            </Select>
            <Tooltip title='Add'>
              <AddBoxRoundedIcon
                sx={{
                  color: '#69f0ae',
                  marginLeft: 'auto',
                  marginRight: 0.5,
                  border: '1.2px solid black',
                  width: 25,
                  height: 25,
                  padding: 0.2,
                  borderRadius: 1,
                }}
                onClick={() => {
                  addNewParams(paramsObjType);
                }}
              />
            </Tooltip>
            <Tooltip title='Remove'>
              <RemoveCircleRoundedIcon
                sx={{
                  color: '#ff5252',
                  marginLeft: 0.5,
                  marginRight: 2,
                  border: '1.2px solid black',
                  width: 25,
                  height: 25,
                  padding: 0.2,
                  borderRadius: 1,
                }}
                onClick={() => {
                  if (paramsInputList.length > 0) {
                    let tempObj = [...paramsInputList];
                    tempObj.pop();
                    setParamsInputList(tempObj);
                    if (paramsObj[paramsInputList.length - 1]) {
                      let tempParamsObj = [...paramsObj];
                      tempParamsObj.pop();
                      setParamsObj(tempParamsObj);
                    }
                  }
                }}
              />
            </Tooltip>
          </ListItem>
          {fillParamsList()}
          {paramsInputList}
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
        <Alert severity='success'>Get Digits saved!</Alert>
      </Snackbar>
    </>
  );
};

export default GetDigits;
