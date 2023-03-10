import {
  Divider,
  List,
  ListItem,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

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
    let {checked} = e.target;
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
        newArr[index].value = '';
        return newArr;
      });
      return;
    }
  }

  function handleSwitch(e, index, name) {
    let {checked} = e.target;
    setMsgObj((s) => {
      const newArr = [...s];
      newArr[index][name] = checked;
      return newArr;
    });
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
          <Typography sx={{fontSize: '1.1rem'}} variant='button'>
            V
          </Typography>
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}></Switch>
          </Tooltip>
          <Typography sx={{mx: 1}} variant='body1'>
            prompt:
          </Typography>

          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}
              size='small'>
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

          <TextField
            sx={{mx: 0.5, backgroundColor: msgObj[key].useVar && '#eeeeee'}}
            size='small'
            variant='outlined'
            name='prompt'
            value={msgObj[key].value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
              handleInputValidation('prompt', e);
            }}
            disabled={msgObj[key].useVar}
          />
        </ListItem>
      );
      return promptCode;

    case 'ordinal':
      const ordinalCode = (
        <ListItem key={key}>
          <Typography sx={{fontSize: '1.1rem'}} variant='button'>
            V
          </Typography>
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}></Switch>
          </Tooltip>
          <Typography sx={{marginX: 2}} variant='body1'>
            ordinal:
          </Typography>
          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}>
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

          <TextField
            sx={{
              mx: 0.5,
              backgroundColor: msgObj[key].useVar && '#eeeeee',
              width: 120,
            }}
            size='small'
            name='ordinal'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
              handleInputValidation('ordinal', e);
            }}
            disabled={msgObj[key].useVar}
          />
        </ListItem>
      );
      return ordinalCode;

    case 'number':
      const numberCode = (
        <ListItem key={key}>
          <Typography sx={{fontSize: '1.1rem'}} variant='button'>
            V
          </Typography>
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}></Switch>
          </Tooltip>

          <Typography sx={{marginX: 2}} variant='body1'>
            number:
          </Typography>
          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}>
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

          <TextField
            size='small'
            sx={{
              mx: 0.5,
              backgroundColor: msgObj[key].useVar && '#eeeeee',
              width: 120,
            }}
            name='number'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
              handleInputValidation('number', e);
            }}
            disabled={msgObj[key].useVar}
          />
        </ListItem>
      );
      return numberCode;

    case 'amount':
      const amountCode = (
        <ListItem key={key}>
          <Typography sx={{fontSize: '1.1rem'}} variant='button'>
            V
          </Typography>
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}></Switch>
          </Tooltip>

          <Typography sx={{marginX: 2}} variant='body1'>
            amount:
          </Typography>
          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}>
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

          <TextField
            size='small'
            sx={{
              mx: 0.5,
              backgroundColor: msgObj[key].useVar && '#eeeeee',
              width: 120,
            }}
            name='amount'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
              handleInputValidation('amount', e);
            }}
            disabled={msgObj[key].useVar}
          />
          <Typography sx={{marginX: 1}} variant='body1'>
            currency:
          </Typography>
          <Select
            size='small'
            name='currency'
            value={msgObj[key]?.currency || 'SAR'}
            onChange={(e) => {
              handleMsgObjChange(e, key, 'currency');
            }}>
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
          <Typography sx={{fontSize: '1.1rem'}} variant='button'>
            V
          </Typography>
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}></Switch>
          </Tooltip>

          <Typography sx={{marginX: 2}} variant='body1'>
            date:
          </Typography>
          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}>
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

          <TextField
            sx={{
              mx: 0.5,
              backgroundColor: msgObj[key].useVar && '#eeeeee',
              width: 120,
            }}
            placeholder='yyyymmdd'
            variant='outlined'
            size='small'
            name='date'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
              handleInputValidation('date', e);
            }}
            disabled={msgObj[key].useVar}
          />
          <Typography sx={{marginLeft: 2}} variant='body1'>
            playYear:
          </Typography>
          <Switch
            name='playYear'
            checked={msgObj[key]?.playYear || false}
            onChange={(e) => {
              handleSwitch(e, key, 'playYear');
            }}></Switch>
        </ListItem>
      );
      return dateCode;

    case 'day':
      const dayCode = (
        <ListItem key={key}>
          <Typography sx={{fontSize: '1.1rem'}} variant='button'>
            V
          </Typography>
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}></Switch>
          </Tooltip>

          <Typography sx={{marginX: 2}} variant='body1'>
            day:
          </Typography>
          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}>
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

          <Select
            sx={{mx: 0.5}}
            placeholder='day'
            size='small'
            name='day'
            value={msgObj[key]?.value || ''}
            onChange={(e) => {
              handleMsgObjChange(e, key);
            }}>
            <MenuItem value='sun'>01 &nbsp;Sunday</MenuItem>
            <MenuItem value='mon'>02 &nbsp;Monday</MenuItem>
            <MenuItem value='tue'>03 &nbsp;Tuesday</MenuItem>
            <MenuItem value='wed'>04 &nbsp;Wednesday</MenuItem>
            <MenuItem value='thu'>05 &nbsp;Thursday</MenuItem>
            <MenuItem value='fri'>06 &nbsp;Friday</MenuItem>
            <MenuItem value='sat'>07 &nbsp;Saturday</MenuItem>
          </Select>
        </ListItem>
      );
      return dayCode;

    case 'digit':
      const digitCode = (
        <ListItem key={key}>
          <Typography sx={{fontSize: '1.1rem'}} variant='button'>
            V
          </Typography>
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}></Switch>
          </Tooltip>

          <Typography sx={{marginX: 2}} variant='body1'>
            digit:
          </Typography>
          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}>
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

          <TextField
            id={`digit${key}`}
            sx={{
              mx: 0.5,
              backgroundColor: msgObj[key].useVar && '#eeeeee',
              width: 120,
            }}
            size='small'
            name='digit'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
              handleInputValidation('digit', e);
            }}
            disabled={msgObj[key].useVar}
          />
        </ListItem>
      );

      return digitCode;

    case 'month':
      const monthCode = (
        <ListItem key={key}>
          <Typography sx={{fontSize: '1.1rem'}} variant='button'>
            V
          </Typography>
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}></Switch>
          </Tooltip>

          <Typography sx={{marginX: 2}} variant='body1'>
            month:
          </Typography>
          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}>
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

          <Select
            sx={{mx: 0.5}}
            size='small'
            name='month'
            value={msgObj[key]?.value || ''}
            onChange={(e) => {
              handleMsgObjChange(e, key);
            }}>
            <MenuItem value={1}>01 &nbsp;January</MenuItem>
            <MenuItem value={2}>02 &nbsp;February</MenuItem>
            <MenuItem value={3}>03 &nbsp;March</MenuItem>
            <MenuItem value={4}>04 &nbsp;April</MenuItem>
            <MenuItem value={5}>05 &nbsp;May</MenuItem>
            <MenuItem value={6}>06 &nbsp;June</MenuItem>
            <MenuItem value={7}>07 &nbsp;July</MenuItem>
            <MenuItem value={8}>08 &nbsp;August</MenuItem>
            <MenuItem value={9}>09 &nbsp;September</MenuItem>
            <MenuItem value={10}>10 &nbsp;October</MenuItem>
            <MenuItem value={11}>11 &nbsp;November</MenuItem>
            <MenuItem value={12}>12 &nbsp;December</MenuItem>
          </Select>
          <Typography sx={{marginLeft: 2}} variant='body1'>
            isHijri:
          </Typography>
          <Switch
            name='isHijri'
            checked={msgObj[key]?.isHijri || false}
            onChange={(e) => {
              handleSwitch(e, key, 'isHijri');
            }}></Switch>
        </ListItem>
      );
      return monthCode;

    case 'time':
      const timeCode = (
        <ListItem key={key}>
          <Typography sx={{fontSize: '1.1rem'}} variant='button'>
            V
          </Typography>
          <Tooltip placement='top-end' title='use variable'>
            <Switch
              checked={msgObj[key].useVar || false}
              onChange={(e) => {
                handleUseVar(e, key);
              }}></Switch>
          </Tooltip>

          <Typography sx={{marginX: 2}} variant='body1'>
            time:
          </Typography>
          {msgObj[key].useVar === true && userVariables.length > 0 && (
            <Select
              defaultValue={''}
              onChange={(e) => {
                handleVarSelect(e, key);
              }}>
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

          <TextField
            sx={{
              mx: 0.5,
              backgroundColor: msgObj[key].useVar && '#eeeeee',
              width: 120,
            }}
            variant='outlined'
            placeholder='hhmm'
            size='small'
            name='time'
            value={msgObj[key]?.value}
            onChange={(e) => {
              handleMsgObjChange(e, key);
              handleInputValidation('time', e);
            }}
            disabled={msgObj[key].useVar}
          />
          <Typography sx={{marginLeft: 2}} variant='body1'>
            is24:
          </Typography>
          <Switch
            name='is24'
            checked={msgObj[key]?.is24 || false}
            onChange={(e) => {
              handleSwitch(e, key, 'is24');
            }}></Switch>
        </ListItem>
      );
      return timeCode;
  }
}

export function checkValidity(name, value) {
  const types = {
    object: {
      regex: /^[a-zA-z_]+[a-zA-z0-9_]*$/,
      error: 'Id not in valid format',
    },
    name: {
      regex: /^[a-zA-z_]+[a-zA-z0-9_]*$/,
      error: 'name not in valid format',
    },
    action: {
      regex: /^[a-zA-Z0-9]+$/,
      error: 'action not in valid format',
    },
    prompt: {
      regex: /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
      error: 'prompt not in valid format',
    },
    number: {
      regex: /^\d+$/,
      error: 'number not in valid format',
    },
    string: {
      regex: /^[^'"]*$/,
      error: 'string not in valid format',
    },
    boolean: {
      regex: /^(true|false)$/,
      error: 'boolean not in valid format',
    },
    amount: {
      regex: /^\d+\.?\d+$/,
      error: 'amount not in valid format',
    },
    ordinal: {
      regex: /^\d{1,2}$/,
      error: 'ordinal not in valid format. (0-99)',
    },
    digit: {
      regex: /^\d+$/,
      error: 'digit not in valid format',
    },
    date: {
      regex: /^(1[3-4]|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/,
      error: 'date not in valid format',
    },
    time: {
      regex: /^([0-1]?[0-9]|2[0-3])[0-5][0-9]$/,
      error: 'time not in valid format',
    },
  };

  if (!types[name]) return -1;
  if (!value) return `${name == 'object' ? 'Id' : name} is required`;
  if (!types[name].regex.test(value)) return types[name].error;
  return -1;
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

  function handleParamsObjChangeSwitch(e, index) {
    const {checked} = e.target;
    setParamsObj((s) => {
      const newArr = [...s];
      newArr[index].value = checked;
      return newArr;
    });
  }

  switch (type) {
    case 'interruptible':
      const interruptibleCode = (
        <ListItem sx={{marginTop: 1}} key={key}>
          <Typography sx={{marginX: 2}} variant='body1'>
            interruptible:
          </Typography>
          <Switch
            name='interruptible'
            checked={paramsObj[key]?.value ?? true}
            onChange={(e) => handleParamsObjChangeSwitch(e, key)}></Switch>
        </ListItem>
      );
      return interruptibleCode;

    case 'terminator':
      const terminatorCode = (
        <ListItem sx={{marginTop: 1}} key={key}>
          <Typography sx={{marginX: 2}} variant='body1'>
            terminator:
          </Typography>
          <Select
            size='small'
            name='terminator'
            value={paramsObj[key]?.value || ''}
            onChange={(e) => {
              handleParamsObjChange(e, key);
            }}
            autoFocus>
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
          <Typography sx={{marginX: 2}} variant='body1'>
            maxRetries:
          </Typography>
          <Select
            size='small'
            name='maxRetries'
            value={paramsObj[key]?.value || ''}
            onChange={(e) => {
              handleParamsObjChange(e, key);
            }}
            autoFocus>
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
          <Typography sx={{marginX: 2}} variant='body1'>
            invalidAction:
          </Typography>
          <Select
            size='small'
            name='invalidAction'
            value={paramsObj[key]?.value || ''}
            onChange={(e) => {
              handleParamsObjChange(e, key);
            }}
            autoFocus>
            <MenuItem value='disconnect'>disconnect</MenuItem>
            <MenuItem value='transfer'>transfer</MenuItem>
            <MenuItem value='function'>function</MenuItem>
          </Select>

          {paramsObj[key]?.value === 'transfer' && (
            <TextField
              sx={{mx: 0.5, width: 150}}
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
              sx={{mx: 0.5, width: 150}}
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
          <Typography sx={{marginX: 2}} variant='body1'>
            timeoutAction:
          </Typography>
          <Select
            size='small'
            name='timeoutAction'
            value={paramsObj[key]?.value || ''}
            onChange={(e) => {
              handleParamsObjChange(e, key);
            }}
            autoFocus>
            <MenuItem value='disconnect'>disconnect</MenuItem>
            <MenuItem value='transfer'>transfer</MenuItem>
            <MenuItem value='function'>function</MenuItem>
          </Select>

          {paramsObj[key]?.value === 'transfer' && (
            <TextField
              sx={{mx: 0.5, width: 150}}
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
              sx={{mx: 0.5, width: 150}}
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
          <Typography sx={{marginX: 2}} variant='body1'>
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

function handleVariableValidation(name, e) {
  let errorBox = document.getElementById('error-box-var');
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
          sx={{marginRight: 2, marginLeft: 1, fontWeight: 500}}
          variant='body1'>
          {type}
        </Typography>
        <TextField
          sx={{width: 130}}
          size='small'
          variant='outlined'
          helperText='variable name'
          value={varObj[key]?.name || ''}
          onChange={(e) => {
            handleVarObjChange(e, key, 'name');
            handleVariableValidation('object', e);
          }}
        />
        <TextField
          sx={{width: 130, mx: 1}}
          size='small'
          variant='outlined'
          name='default'
          helperText='initial value'
          value={varObj[key]?.value}
          onChange={(e) => {
            handleVarObjChange(e, key, 'value');
            handleVariableValidation(type, e);
          }}
        />
      </ListItem>
      <ListItem>
        <TextField
          sx={{mx: 1, mb: 2}}
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
