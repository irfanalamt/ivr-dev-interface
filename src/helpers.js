import {
  Box,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

function handleInputValidation(name, e) {
  let errorBox = document.getElementById('error-box');
  let errorMessage = checkValidity(name, e);
  if (errorMessage !== -1) {
    e.target.style.backgroundColor = '#ffebee';
    errorBox.style.visibility = 'visible';
    errorBox.innerText = errorMessage;
    return;
  }
  // no error condition
  e.target.style.backgroundColor = '#f1f8e9';
  errorBox.style.visibility = 'hidden';
  errorBox.innerText = '';
}

export function addInputElements(
  type,
  key,
  msgObj,
  setMsgObj,
  userVariables = null
) {
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

  function handleUseVar(e, index) {
    let { checked } = e.target;
    if (checked === true) {
      console.log('checked true');

      setMsgObj((s) => {
        const newArr = [...s];
        newArr[index].useVar = true;
        return newArr;
      });
      return;
    }
    if (checked === false) {
      console.log('checked false');
      setMsgObj((s) => {
        const newArr = [...s];
        newArr[index].useVar = false;
        return newArr;
      });
      return;
    }
  }

  function handleVarSelect(e, index) {
    setMsgObj((s) => {
      const newArr = [...s];
      newArr[index].value = `$${e.target.value}`;
      return newArr;
    });
  }

  switch (type) {
    case 'prompt':
      const promptCode = (
        <ListItem key={key}>
          <Typography sx={{ fontSize: '1.1rem' }} variant='button'>
            V
          </Typography>
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}
            ></Switch>
          </Tooltip>
          <Typography sx={{ mx: 1 }} variant='body1'>
            prompt:
          </Typography>

          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}
            >
              {userVariables
                .filter((el) => el.type === 'prompt')
                .map((el, i) => {
                  return (
                    <MenuItem key={i} value={el.name || ''}>
                      {el.name}
                    </MenuItem>
                  );
                })}
            </Select>
          )}
          {msgObj[key].useVar === true && userVariables.length == 0 && (
            <Typography
              sx={{ mr: 1, color: '#ef5350', px: 0.5, boxShadow: 1 }}
              variant='subtitle2'
            >
              No variables added
            </Typography>
          )}
          <TextField
            sx={{ mx: 0.5 }}
            size='small'
            variant='outlined'
            name='prompt'
            value={msgObj[key].value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
              handleInputValidation('prompt', e);
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
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}
            ></Switch>
          </Tooltip>
          <Typography sx={{ marginX: 2 }} variant='body1'>
            ordinal:
          </Typography>
          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}
            >
              {userVariables
                .filter((el) => el.type === 'number')
                .map((el, i) => {
                  return (
                    <MenuItem key={i} value={el.name || ''}>
                      {el.name}
                    </MenuItem>
                  );
                })}
            </Select>
          )}
          {msgObj[key].useVar === true && userVariables.length == 0 && (
            <Typography
              sx={{ mr: 1, color: '#ef5350', px: 0.5, boxShadow: 1 }}
              variant='subtitle2'
            >
              No variables added
            </Typography>
          )}
          <TextField
            sx={{ mx: 0.5 }}
            size='small'
            name='ordinal'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
              handleInputValidation('ordinal', e);
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
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}
            ></Switch>
          </Tooltip>

          <Typography sx={{ marginX: 2 }} variant='body1'>
            number:
          </Typography>
          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}
            >
              {userVariables
                .filter((el) => el.type === 'number')
                .map((el, i) => {
                  return (
                    <MenuItem key={i} value={el.name || ''}>
                      {el.name}
                    </MenuItem>
                  );
                })}
            </Select>
          )}
          {msgObj[key].useVar === true && userVariables.length == 0 && (
            <Typography
              sx={{ mr: 1, color: '#ef5350', px: 0.5, boxShadow: 1 }}
              variant='subtitle2'
            >
              No variables added
            </Typography>
          )}
          <TextField
            size='small'
            sx={{ mx: 0.5 }}
            name='number'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
              handleInputValidation('number', e);
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
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}
            ></Switch>
          </Tooltip>

          <Typography sx={{ marginX: 2 }} variant='body1'>
            amount:
          </Typography>
          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}
            >
              {userVariables
                .filter((el) => el.type === 'number')
                .map((el, i) => {
                  return (
                    <MenuItem key={i} value={el.name || ''}>
                      {el.name}
                    </MenuItem>
                  );
                })}
            </Select>
          )}
          {msgObj[key].useVar === true && userVariables.length == 0 && (
            <Typography
              sx={{ mr: 1, color: '#ef5350', px: 0.5, boxShadow: 1 }}
              variant='subtitle2'
            >
              No variables added
            </Typography>
          )}
          <TextField
            size='small'
            sx={{ mx: 0.5 }}
            name='amount'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
              handleInputValidation('amount', e);
            }}
          />
          <Typography sx={{ marginX: 1 }} variant='body1'>
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
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}
            ></Switch>
          </Tooltip>

          <Typography sx={{ marginX: 2 }} variant='body1'>
            date:
          </Typography>
          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}
            >
              {userVariables
                .filter((el) => el.type === 'date')
                .map((el, i) => {
                  return (
                    <MenuItem key={i} value={el.name || ''}>
                      {el.name}
                    </MenuItem>
                  );
                })}
            </Select>
          )}
          {msgObj[key].useVar === true && userVariables.length == 0 && (
            <Typography
              sx={{ mr: 1, color: '#ef5350', px: 0.5, boxShadow: 1 }}
              variant='subtitle2'
            >
              No variables added
            </Typography>
          )}
          <TextField
            sx={{ mx: 0.5 }}
            placeholder='yyyymmdd'
            variant='outlined'
            size='small'
            name='date'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
              handleInputValidation('date', e);
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
            <FormControlLabel value={false} control={<Radio />} label='false' />
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
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}
            ></Switch>
          </Tooltip>

          <Typography sx={{ marginX: 2 }} variant='body1'>
            day:
          </Typography>
          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}
            >
              {userVariables
                .filter((el) => el.type === 'day')
                .map((el, i) => {
                  return (
                    <MenuItem key={i} value={el.name || ''}>
                      {el.name}
                    </MenuItem>
                  );
                })}
            </Select>
          )}
          {msgObj[key].useVar === true && userVariables.length == 0 && (
            <Typography
              sx={{ mr: 1, color: '#ef5350', px: 0.5, boxShadow: 1 }}
              variant='subtitle2'
            >
              No variables added
            </Typography>
          )}
          <Select
            sx={{ mx: 0.5 }}
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
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}
            ></Switch>
          </Tooltip>

          <Typography sx={{ marginX: 2 }} variant='body1'>
            digit:
          </Typography>
          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}
            >
              {userVariables
                .filter((el) => el.type === 'number')
                .map((el, i) => {
                  return (
                    <MenuItem key={i} value={el.name || ''}>
                      {el.name}
                    </MenuItem>
                  );
                })}
            </Select>
          )}
          {msgObj[key].useVar === true && userVariables.length == 0 && (
            <Typography
              sx={{ mr: 1, color: '#ef5350', px: 0.5, boxShadow: 1 }}
              variant='subtitle2'
            >
              No variables added
            </Typography>
          )}
          <TextField
            id={`digit${key}`}
            sx={{ mx: 0.5 }}
            size='small'
            name='digit'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
              handleInputValidation('digit', e);
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
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}
            ></Switch>
          </Tooltip>

          <Typography sx={{ marginX: 2 }} variant='body1'>
            month:
          </Typography>
          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}
            >
              {userVariables
                .filter((el) => el.type === 'month')
                .map((el, i) => {
                  return (
                    <MenuItem key={i} value={el.name || ''}>
                      {el.name}
                    </MenuItem>
                  );
                })}
            </Select>
          )}
          {msgObj[key].useVar === true && userVariables.length == 0 && (
            <Typography
              sx={{ mr: 1, color: '#ef5350', px: 0.5, boxShadow: 1 }}
              variant='subtitle2'
            >
              No variables added
            </Typography>
          )}
          <Select
            sx={{ mx: 0.5 }}
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
            <FormControlLabel value={false} control={<Radio />} label='false' />
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
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}
            ></Switch>
          </Tooltip>

          <Typography sx={{ marginX: 2 }} variant='body1'>
            time:
          </Typography>
          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}
            >
              {userVariables
                .filter((el) => el.type === 'time')
                .map((el, i) => {
                  return (
                    <MenuItem key={i} value={el.name || ''}>
                      {el.name}
                    </MenuItem>
                  );
                })}
            </Select>
          )}
          {msgObj[key].useVar === true && userVariables.length == 0 && (
            <Typography
              sx={{ mr: 1, color: '#ef5350', px: 0.5, boxShadow: 1 }}
              variant='subtitle2'
            >
              No variables added
            </Typography>
          )}
          <TextField
            sx={{ mx: 0.5 }}
            variant='outlined'
            placeholder='hhmm'
            size='small'
            name='time'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
              handleInputValidation('time', e);
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
            <FormControlLabel value={false} control={<Radio />} label='false' />
          </RadioGroup>
        </ListItem>
      );
      return timeCode;
  }
}

export function checkValidity(name, e) {
  let { value } = e.target;
  // return error string if invalid; else returns -1
  switch (name) {
    case 'object':
      let objectRegex = /^[a-zA-z_]+[a-zA-z0-9_]*$/;
      if (!objectRegex.test(value)) return 'name not in valid format';
      return -1;

    case 'prompt':
      let promptRegex = /^[a-zA-z][a-zA-Z0-9]+(-?[a-z0-9]+)+$/;
      if (value == '' || value == null) return 'Prompt is required';
      if (!promptRegex.test(value)) return 'prompt not in valid format';
      return -1;

    case 'number':
      let numberRegex = /^\d+$/;
      if (value == '' || value == null) return 'number is required';
      if (!numberRegex.test(value)) return 'number not in valid format';
      return -1;

    case 'amount':
      let amountRegex = /^\d+\.?\d+$/;
      if (value == '' || value == null) return 'amount is required';
      if (!amountRegex.test(value)) return 'amount not in valid format';
      return -1;

    case 'ordinal':
      let ordinalRegex = /^\d{1,2}$/;
      if (value == '' || value == null) return 'ordinal is required';
      if (!ordinalRegex.test(value))
        return 'ordinal not in valid format. (0-99)';
      return -1;

    case 'digit':
      let digitRegex = /^\d+$/;
      if (value == '' || value == null) return 'digit is required';
      if (!digitRegex.test(value)) return 'digit not in valid format';
      return -1;

    case 'date':
      let dateRegex =
        /^(1[3-4]|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
      if (value == '' || value == null) return 'date is required';
      if (!dateRegex.test(value)) return 'date not in valid format';
      return -1;

    case 'time':
      let timeRegex = /^([0-1]?[0-9]|2[0-3])[0-5][0-9]$/;
      if (value == '' || value == null) return 'time is required';
      if (!timeRegex.test(value)) return 'time not in valid format';
      return -1;
  }
}

export function addParamsElements(type, key, paramsObj, setParamsObj) {
  function handleParamsObjChange(e, index, name = null) {
    e.preventDefault();
    console.log('🚀 ~ handleParamsObjChange ~ index', index);
    if (name === null) {
      setParamsObj((s) => {
        const newArr = [...s];
        newArr[index].value = e.target.value;
        return newArr;
      });
      return;
    }
    setParamsObj((s) => {
      const newArr = [...s];
      newArr[index][name] = e.target.value;
      return newArr;
    });
  }

  switch (type) {
    case 'terminator':
      const terminatorCode = (
        <ListItem sx={{ marginTop: 1 }} key={key}>
          <Typography sx={{ marginX: 2 }} variant='body1'>
            terminator:
          </Typography>
          <Select
            size='small'
            name='terminator'
            value={paramsObj[key]?.value || ''}
            onChange={(e) => {
              handleParamsObjChange(e, key);
            }}
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
      return terminatorCode;

    case 'maxRetries':
      const maxRetriesCode = (
        <ListItem key={key}>
          <Typography sx={{ marginX: 2 }} variant='body1'>
            maxRetries:
          </Typography>
          <Select
            size='small'
            name='maxRetries'
            value={paramsObj[key]?.value || ''}
            onChange={(e) => {
              handleParamsObjChange(e, key);
            }}
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
      return maxRetriesCode;

    case 'invalidAction':
      const invalidActionCode = (
        <ListItem key={key}>
          <Typography sx={{ marginX: 2 }} variant='body1'>
            invalidAction:
          </Typography>
          <Select
            size='small'
            name='invalidAction'
            value={paramsObj[key]?.value || ''}
            onChange={(e) => {
              handleParamsObjChange(e, key);
            }}
            autoFocus
          >
            <MenuItem value='disconnect'>disconnect</MenuItem>
            <MenuItem value='transfer'>transfer</MenuItem>
            <MenuItem value='function'>function</MenuItem>
          </Select>

          {paramsObj[key]?.value === 'transfer' && (
            <TextField
              sx={{ mx: 0.5, width: 150 }}
              size='small'
              placeholder='transferPoint'
              value={paramsObj[key]?.transferPoint || ''}
              onChange={(e) => {
                handleParamsObjChange(e, key, 'transferPoint');
              }}
            />
          )}
          {paramsObj[key]?.value === 'function' && (
            <TextField
              sx={{ mx: 0.5, width: 150 }}
              size='small'
              placeholder='functionName'
              value={paramsObj[key]?.functionName || ''}
              onChange={(e) => {
                handleParamsObjChange(e, key, 'functionName');
              }}
            />
          )}
        </ListItem>
      );
      return invalidActionCode;

    case 'timeoutAction':
      const timeoutActionCode = (
        <ListItem key={key}>
          <Typography sx={{ marginX: 2 }} variant='body1'>
            timeoutAction:
          </Typography>
          <Select
            size='small'
            name='timeoutAction'
            value={paramsObj[key]?.value || ''}
            onChange={(e) => {
              handleParamsObjChange(e, key);
            }}
            autoFocus
          >
            <MenuItem value='disconnect'>disconnect</MenuItem>
            <MenuItem value='transfer'>transfer</MenuItem>
            <MenuItem value='function'>function</MenuItem>
          </Select>

          {paramsObj[key]?.value === 'transfer' && (
            <TextField
              sx={{ mx: 0.5, width: 150 }}
              size='small'
              placeholder='transferPoint'
              value={paramsObj[key]?.transferPoint || ''}
              onChange={(e) => {
                handleParamsObjChange(e, key, 'transferPoint');
              }}
            />
          )}
          {paramsObj[key]?.value === 'function' && (
            <TextField
              sx={{ mx: 0.5, width: 150 }}
              size='small'
              placeholder='functionName'
              value={paramsObj[key]?.functionName || ''}
              onChange={(e) => {
                handleParamsObjChange(e, key, 'functionName');
              }}
            />
          )}
        </ListItem>
      );
      return timeoutActionCode;

    case 'invalidPrompt':
      const invalidPromptCode = (
        <ListItem key={key}>
          <Typography sx={{ marginX: 2 }} variant='body1'>
            invalidPrompt:
          </Typography>
          <TextField
            value={paramsObj[key]?.value || ''}
            onChange={(e) => {
              handleParamsObjChange(e, key);
            }}
            variant='outlined'
            size='small'
            name='invalidPrompt'
          />
        </ListItem>
      );
      return invalidPromptCode;
  }
}

export function addVariableElements(type, key, varObj, setVarObj) {
  function handleVarObjChange(e, index, name) {
    e.preventDefault();
    setVarObj((s) => {
      const newArr = [...s];
      newArr[index][name] = e.target.value;
      return newArr;
    });
  }

  return (
    <List key={key}>
      <ListItem>
        <Typography
          sx={{ marginRight: 2, marginLeft: 1, fontWeight: 500 }}
          variant='body1'
        >
          {type}
        </Typography>
        <TextField
          sx={{ width: 130 }}
          size='small'
          variant='outlined'
          helperText='variable name'
          value={varObj[key]?.name}
          onChange={(e) => {
            handleVarObjChange(e, key, 'name');
          }}
        />
        <TextField
          sx={{ width: 130, mx: 1 }}
          size='small'
          variant='outlined'
          name='default'
          helperText='initial value'
          value={varObj[key]?.value}
          onChange={(e) => {
            handleVarObjChange(e, key, 'value');
          }}
        />
      </ListItem>
      <ListItem>
        <TextField
          sx={{ mx: 1, mb: 2 }}
          size='small'
          variant='outlined'
          name='description'
          placeholder='description'
          value={varObj[key]?.description}
          onChange={(e) => {
            handleVarObjChange(e, key, 'description');
          }}
          fullWidth
        />
      </ListItem>
      <Divider />
    </List>
  );
}
