import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import {checkValidity} from '../src/helpers';
import {isNameUnique} from '../src/myFunctions';
import LogDrawer from './LogDrawer';

const PlayMenu = ({
  shape,
  handleCloseDrawer,
  shapes,
  clearAndDraw,
  userVariables,
  openVariableManager,
}) => {
  const [name, setName] = useState(shape.text);
  const [successText, setSuccessText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [optionalParam, setOptionalParam] = useState('');
  const [addedOptionalParams, setAddedOptionalParams] = useState(
    shape.userValues?.optionalParams ?? []
  );
  const [itemDigit, setItemDigit] = useState('');
  const [items, setItems] = useState(shape.userValues?.items ?? []);
  const [description, setDescription] = useState(shape.userValues?.description);
  const [previousMenuId, setPreviousMenuId] = useState(
    shape.userValues?.previousMenuId
  );

  const errors = useRef({});

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSuccessText('');
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [successText]);

  const optionalParamList = [
    'ignoreBuffer',
    'logDb',
    'invalidAction',
    'timeoutAction',
    'invalidPrompt',
    'timeoutPrompt',
    'maxRetries',
    'interruptible',
    'transferPoint',
    'menuTimeout',
  ];

  function handleSave() {
    if (errors.current.name) {
      setErrorText('Id not valid.');
      return;
    }
    shape.setText(name);
    clearAndDraw();

    const validItems = items.filter((i) => i.action);
    shape.setUserValues({
      items: validItems,
      description,
      previousMenuId,
      optionalParams: addedOptionalParams,
    });

    setErrorText('');
    setSuccessText('Saved.');
    if (validItems.length > 0) generateJS();
  }

  function generateJS() {
    const functionName = name || `playMenu${shape.id}`;
    const paramsString = addedOptionalParams
      .map(({name, value}) => `${name}: ${JSON.stringify(value)}`)
      .join(', ');

    const modifiedItems = items.map(
      ({actionError, promptError, isDefault, nextItem, ...rest}) => rest
    );

    const menuString = `{menuId: ${name}${
      paramsString ? ',' : ''
    }${paramsString}, items: ${JSON.stringify(modifiedItems)}}`;

    const codeString = `this.${functionName} = async function() {
      let menu =${menuString};await IVR.playMenu(menu);
    };`;

    console.log('codeString 📍', codeString);
    shape.setFunctionString(codeString);
  }

  function handleNameChange(e) {
    const {value} = e.target;

    setName(value);

    const isValidFormat = checkValidity('object', value);
    if (isValidFormat !== -1) {
      setErrorText(isValidFormat);
      errors.current.name = true;
      return;
    }

    const isUnique = isNameUnique(value, shape, shapes);
    if (!isUnique) {
      setErrorText('Id not unique.');
      errors.current.name = true;
    } else {
      setErrorText('');
      errors.current.name = undefined;
    }
  }
  function handleTabChange(e, newValue) {
    setTabValue(newValue);
  }

  function handleAddOptionalParam() {
    if (!optionalParam) {
      return;
    }

    const updatedOptionalParams = [
      ...addedOptionalParams,
      {name: optionalParam},
    ];
    setAddedOptionalParams(updatedOptionalParams);
    setOptionalParam('');
  }
  function handleDeleteOptionalParam(index) {
    const updatedOptionalParams = [...addedOptionalParams];
    updatedOptionalParams.splice(index, 1);
    setAddedOptionalParams(updatedOptionalParams);
  }
  function handleOptionalParamFieldChange(e, index) {
    const {value} = e.target;

    const currentOptionalParams = [...addedOptionalParams];
    currentOptionalParams[index].value = value;
    setAddedOptionalParams(currentOptionalParams);
  }
  function handleOptionalParamNamedFieldChange(e, index) {
    const {value, name} = e.target;

    const currentOptionalParams = [...addedOptionalParams];
    currentOptionalParams[index][name] = value;
    setAddedOptionalParams(currentOptionalParams);
  }
  function handleOptionalParamFieldChangeSwitch(e, index) {
    const {checked} = e.target;

    const currentOptionalParams = [...addedOptionalParams];
    currentOptionalParams[index].value = checked;
    setAddedOptionalParams(currentOptionalParams);
  }

  function handleAddNewItem() {
    if (!itemDigit) return;

    const updatedItems = [...items];
    updatedItems.push({
      digit: itemDigit,
      isDefault: false,
      action: '',
      prompt: '',
      disabled: false,
      silent: false,
      skip: 1,
    });
    setItems(updatedItems);
    setItemDigit('');
  }

  function handleDeleteItem(index) {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  }
  function handleItemFieldChange(name, value, index) {
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);
  }

  function clearItemError(index, type) {
    const updatedItems = [...items];
    updatedItems[index][`${type}Error`] = undefined;
    setItems(updatedItems);
  }

  function setItemError(index, error, type) {
    const updatedItems = [...items];
    updatedItems[index][`${type}Error`] = error;
    setItems(updatedItems);
  }

  function validatePrompt(value, index) {
    const isVariableInput = value.startsWith('$') && value.length > 1;
    const validationFn = isVariableInput
      ? validateVariableInput
      : validateUserInput;
    const result = validationFn(value);

    if (result === -1) {
      clearItemError(index, 'prompt');
    } else {
      setItemError(index, result, 'prompt');
    }
  }

  function validateAction(value, index) {
    const actionRegex = /^[a-zA-Z0-9_$][a-zA-Z0-9_$]*$/;
    const isValid = actionRegex.test(value);
    const isUnique = items.every(
      (item, i) => i === index || item.action !== value
    );

    if (isValid && isUnique) {
      clearItemError(index, 'action');
    } else if (!isUnique) {
      setItemError(index, 'Action not unique', 'action');
    } else {
      setItemError(index, 'Action not in valid format', 'action');
    }
  }

  function validateVariableInput(input) {
    const variableName = input.slice(1);
    const isValidName = userVariables.some(
      (variable) => variable.type === 'prompt' && variable.name === variableName
    );
    return isValidName ? -1 : `${variableName} is not a valid prompt variable.`;
  }

  function validateUserInput(input) {
    const promptRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    return promptRegex.test(input) ? -1 : 'Prompt not in valid format.';
  }

  function validateOptionalPrompt(value, index) {
    const error = checkValidity('prompt', value);
    const currentOptionalParams = [...addedOptionalParams];

    if (error !== -1) {
      currentOptionalParams[index].error =
        value.length > 0 ? 'invalid format' : 'required';
    } else {
      delete currentOptionalParams[index].error;
    }

    setAddedOptionalParams(currentOptionalParams);
  }

  function getPlaceholderValue(action) {
    if (action === 'MainMenu') return 'params.mainMenuPrompt';

    if (action === 'PreviousMenu') return 'params.previousMenuPrompt';

    if (action === 'Disconnect') return 'params.disconnectPrompt';

    if (action === 'Transfer') return 'params.transferPrompt';

    return '';
  }

  function renderComponentByType(param, index) {
    switch (param) {
      case 'invalidAction':
        return (
          <Stack>
            <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
              invalidAction
            </Typography>
            <Stack direction='row'>
              <Select
                sx={{width: 150, backgroundColor: '#ededed'}}
                value={addedOptionalParams[index].value ?? ''}
                onChange={(e) => handleOptionalParamFieldChange(e, index)}
                size='small'>
                <MenuItem value='disconnect'>Disconnect</MenuItem>
                <MenuItem value='transfer'>Transfer</MenuItem>
                <MenuItem value='other'>Other</MenuItem>
              </Select>
              {addedOptionalParams[index].value === 'transfer' && (
                <TextField
                  name='transferPoint'
                  sx={{mx: 1, width: 150}}
                  value={addedOptionalParams[index].transferPoint ?? ''}
                  onChange={(e) =>
                    handleOptionalParamNamedFieldChange(e, index)
                  }
                  placeholder='transferPoint'
                  size='small'
                />
              )}
            </Stack>
          </Stack>
        );
      case 'timeoutAction':
        return (
          <Stack>
            <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
              timeoutAction
            </Typography>
            <Stack direction='row'>
              <Select
                sx={{width: 150, backgroundColor: '#ededed'}}
                value={addedOptionalParams[index].value ?? ''}
                onChange={(e) => handleOptionalParamFieldChange(e, index)}
                size='small'>
                <MenuItem value='disconnect'>Disconnect</MenuItem>
                <MenuItem value='transfer'>Transfer</MenuItem>
                <MenuItem value='other'>Other</MenuItem>
              </Select>
              {addedOptionalParams[index].value === 'transfer' && (
                <TextField
                  name='transferPoint'
                  sx={{mx: 1, width: 150}}
                  value={addedOptionalParams[index].transferPoint ?? ''}
                  onChange={(e) =>
                    handleOptionalParamNamedFieldChange(e, index)
                  }
                  placeholder='transferPoint'
                  size='small'
                />
              )}
            </Stack>
          </Stack>
        );

      case 'maxRetries':
        return (
          <Stack>
            <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
              maxRetries
            </Typography>
            <Select
              sx={{backgroundColor: '#ededed', width: 100}}
              value={addedOptionalParams[index].value ?? ''}
              onChange={(e) => handleOptionalParamFieldChange(e, index)}
              size='small'>
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
          </Stack>
        );
      case 'invalidPrompt':
        return (
          <Stack sx={{width: '100%', mr: 1}}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
                invalidPrompt
              </Typography>
              <Typography sx={{mx: 'auto', color: 'red'}}>
                {addedOptionalParams[index].error}
              </Typography>
            </Box>

            <TextField
              sx={{backgroundColor: '#ededed'}}
              value={addedOptionalParams[index].value ?? ''}
              onChange={(e) => {
                handleOptionalParamFieldChange(e, index);
                validateOptionalPrompt(e.target.value, index);
              }}
              size='small'
              error={Boolean(addedOptionalParams[index].error)}
              fullWidth
            />
          </Stack>
        );
      case 'timeoutPrompt':
        return (
          <Stack sx={{width: '100%', mr: 1}}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
                timeoutPrompt
              </Typography>
              <Typography sx={{mx: 'auto', color: 'red'}}>
                {addedOptionalParams[index].error}
              </Typography>
            </Box>
            <TextField
              sx={{backgroundColor: '#ededed'}}
              value={addedOptionalParams[index].value ?? ''}
              onChange={(e) => {
                handleOptionalParamFieldChange(e, index);
                validateOptionalPrompt(e.target.value, index);
              }}
              size='small'
              error={Boolean(addedOptionalParams[index].error)}
              fullWidth
            />
          </Stack>
        );
      case 'ignoreBuffer':
      case 'logDb':
      case 'interruptible':
        return (
          <Stack>
            <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
              {param}
            </Typography>
            <Switch
              sx={{mt: -1, ml: -1}}
              checked={
                addedOptionalParams[index].value ??
                (param === 'interruptible' ? true : false)
              }
              onChange={(e) => handleOptionalParamFieldChangeSwitch(e, index)}
            />
          </Stack>
        );
      case 'transferPoint':
        return (
          <Stack sx={{width: '100%', mr: 1}}>
            <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
              transferPoint
            </Typography>
            <TextField
              sx={{backgroundColor: '#ededed', width: 200}}
              value={addedOptionalParams[index].value ?? ''}
              onChange={(e) => handleOptionalParamFieldChange(e, index)}
              size='small'
              fullWidth
            />
          </Stack>
        );
      case 'menuTimeout':
        return (
          <Stack>
            <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
              menuTimeout
            </Typography>
            <Select
              sx={{backgroundColor: '#ededed', width: 100}}
              value={addedOptionalParams[index].value ?? ''}
              onChange={(e) => handleOptionalParamFieldChange(e, index)}
              size='small'>
              {[...Array(28)].map((_, i) => (
                <MenuItem key={i} value={`${i + 3}`}>
                  {i + 3}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        );
    }
  }

  return (
    <Box sx={{overflowY: 'scroll', height: '100%'}}>
      <ListItem
        sx={{
          backgroundColor: '#cfd8dc',
          display: 'flex',
          boxShadow: 2,
          p: 1,
          minWidth: 350,
        }}>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 'extra-large',
            height: 40,
          }}
          variant='h5'>
          {
            <img
              src='/icons/playMenuBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp;Play Menu
        </Typography>
        <IconButton
          size='small'
          onClick={openVariableManager}
          sx={{
            ml: 'auto',
            backgroundColor: '#263238',
            color: 'white',
            '&:hover': {backgroundColor: '#26a69a'},
            height: 30,
            width: 30,
          }}>
          <img
            src='/icons/variableManagerWhite.png'
            alt='Icon'
            height={'16px'}
            width={'16px'}
          />
        </IconButton>

        <IconButton
          size='small'
          sx={{
            ml: 1,
            backgroundColor: '#263238',
            color: 'white',
            '&:hover': {backgroundColor: '#29b6f6'},
            height: 30,
            width: 30,
          }}>
          <QuestionMarkIcon sx={{fontSize: '20px'}} />
        </IconButton>
        <IconButton
          onClick={handleCloseDrawer}
          size='small'
          sx={{
            ml: 1,
            backgroundColor: '#263238',
            color: 'white',
            '&:hover': {backgroundColor: '#ef5350'},
            height: 30,
            width: 30,
          }}>
          <CloseIcon sx={{fontSize: '22px'}} />
        </IconButton>
      </ListItem>
      <Box sx={{backgroundColor: '#eeeeee', height: '100%'}}>
        <Stack>
          <Typography sx={{ml: 2, mt: 1}} fontSize='large' variant='subtitle2'>
            ID
          </Typography>
          <ListItem sx={{mt: -1}}>
            <TextField
              onChange={handleNameChange}
              value={name}
              sx={{minWidth: '220px', backgroundColor: '#f5f5f5'}}
              size='small'
              error={errors.current.name}
            />
            <Button
              onClick={handleSave}
              sx={{ml: 2}}
              size='small'
              variant='contained'>
              <SaveIcon />
            </Button>
          </ListItem>

          <ListItem sx={{height: 30}}>
            {successText && (
              <Typography sx={{mt: -1, color: 'green', mx: 'auto'}}>
                {successText}
              </Typography>
            )}
            {!successText && (
              <Typography
                fontSize='small'
                sx={{mt: -1, color: 'red', mx: 'auto'}}>
                {errorText}
              </Typography>
            )}
          </ListItem>
        </Stack>
        <Divider />
        <Tabs
          sx={{backgroundColor: '#e0e0e0'}}
          value={tabValue}
          onChange={handleTabChange}
          centered>
          <Tab label='General' />
          <Tab label='Items' />
          <Tab label='Log' />
        </Tabs>
        <Divider />

        {tabValue === 0 && (
          <List>
            <Stack
              sx={{
                mt: 2,
                px: 2,
                py: 1,
              }}>
              <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
                Description
              </Typography>
              <TextField
                sx={{backgroundColor: '#f5f5f5', width: 300}}
                size='small'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
              />
            </Stack>
            <Stack
              sx={{
                px: 2,
                py: 1,
              }}>
              <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
                previousMenuId
              </Typography>
              <TextField
                sx={{backgroundColor: '#f5f5f5', width: 200}}
                size='small'
                value={previousMenuId}
                onChange={(e) => setPreviousMenuId(e.target.value)}
              />
            </Stack>
            <Divider />
            <Stack sx={{pl: 2, py: 2, mt: 2, mb: 1}}>
              <Typography>Optional Params</Typography>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Select
                  labelId='select-label'
                  sx={{
                    minWidth: 150,
                    backgroundColor: '#f5f5f5',
                  }}
                  value={optionalParam}
                  onChange={(e) => setOptionalParam(e.target.value)}
                  size='small'>
                  {optionalParamList
                    .filter(
                      (p) =>
                        !addedOptionalParams.some((object) => object.name === p)
                    )
                    .map((p, i) => (
                      <MenuItem key={i} value={p}>
                        {p}
                      </MenuItem>
                    ))}
                </Select>
                <Button
                  sx={{
                    ml: 2,
                    backgroundColor: '#bdbdbd',
                    color: 'black',
                    '&:hover': {backgroundColor: '#9ccc65'},
                  }}
                  onClick={handleAddOptionalParam}
                  disabled={!optionalParam}
                  variant='contained'>
                  Add
                </Button>
              </Box>
            </Stack>
            {addedOptionalParams.map((p, i) => (
              <ListItem
                sx={{
                  py: 1,
                  backgroundColor: '#e6e6e6',
                  borderTop: i === 0 && '1px solid #bdbdbd',
                  borderBottom: '1px solid #bdbdbd',
                }}
                key={i}>
                {renderComponentByType(p.name, i)}
                <IconButton
                  color='error'
                  size='small'
                  onClick={() => handleDeleteOptionalParam(i)}
                  sx={{
                    ml: 'auto',
                    backgroundColor: '#cfcfcf',
                    '&:hover': {backgroundColor: '#c7c1bd'},
                    alignSelf: 'end',
                    height: 30,
                    width: 30,
                  }}>
                  <DeleteIcon sx={{color: '#424242'}} />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
        {tabValue === 1 && (
          <List>
            <Stack sx={{pl: 2, py: 2, mb: 2}}>
              <Typography>Digits</Typography>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Select
                  labelId='select-label'
                  value={itemDigit}
                  onChange={(e) => setItemDigit(e.target.value)}
                  sx={{
                    minWidth: 100,
                    backgroundColor: '#f5f5f5',
                  }}
                  size='small'>
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '#']
                    .filter(
                      (menuItemValue) =>
                        !items.some((item) => item.digit === menuItemValue)
                    )
                    .map((menuItemValue) => (
                      <MenuItem value={menuItemValue} key={menuItemValue}>
                        {menuItemValue}
                      </MenuItem>
                    ))}
                </Select>

                <Button
                  sx={{
                    ml: 2,
                    backgroundColor: '#bdbdbd',
                    color: 'black',
                    '&:hover': {backgroundColor: '#9ccc65'},
                  }}
                  onClick={handleAddNewItem}
                  variant='contained'>
                  Add
                </Button>
              </Box>
            </Stack>

            {items.map((item, i) => (
              <ListItem
                sx={{
                  backgroundColor: '#eeeeee',
                  borderBottom: '1px solid #bdbdbd',
                  borderTop: i == 0 && '1px solid #bdbdbd',
                }}
                key={i}>
                <Stack sx={{width: '100%', py: 1}}>
                  <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Avatar
                      variant='rounded'
                      sx={{
                        mb: 1,
                        border: '1px solid #424242',
                        backgroundColor: '#f5f5f5',
                        boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.05)',
                      }}>
                      <Typography sx={{color: 'black'}} variant='h6'>
                        {item.digit}
                      </Typography>
                    </Avatar>
                    <Typography
                      sx={{
                        mx: 'auto',
                        color: 'red',
                        backgroundColor: '#fce8e6',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        width: 'max-content',
                      }}
                      variant='subtitle2'>
                      {item.actionError || item.promptError}
                    </Typography>
                  </Box>

                  <Stack sx={{my: 0.5, mt: 1}}>
                    <Typography variant='subtitle2'>
                      Use Default Action
                    </Typography>
                    <Switch
                      checked={item.isDefault}
                      onChange={(e) => {
                        handleItemFieldChange('isDefault', e.target.checked, i);
                        handleItemFieldChange('action', '', i);
                        handleItemFieldChange('menuName', undefined, i);
                        handleItemFieldChange('transferPoint', undefined, i);
                        handleItemFieldChange('messagePrompt', undefined, i);
                        handleItemFieldChange('prompt', '', i);
                        handleItemFieldChange('actionError', '', i);
                        handleItemFieldChange('promptError', '', i);
                      }}
                      sx={{mt: -1, ml: -1}}
                    />
                  </Stack>
                  <Stack sx={{my: 0.5}}>
                    <Typography variant='subtitle2'>Action</Typography>
                    {item.isDefault ? (
                      <>
                        <Select
                          sx={{
                            width: 150,
                            backgroundColor: '#f5f5f5',
                            mb: 1,
                          }}
                          value={item.action}
                          onChange={(e) =>
                            handleItemFieldChange('action', e.target.value, i)
                          }
                          size='small'>
                          {[
                            'MainMenu',
                            'PreviousMenu',
                            'Disconnect',
                            'Transfer',
                            'Message',
                          ].map((m, i) => (
                            <MenuItem value={m} key={i}>
                              {m}
                            </MenuItem>
                          ))}
                        </Select>

                        {item.action === 'Transfer' && (
                          <Stack sx={{my: 0.5}}>
                            <Typography variant='subtitle2'>
                              Transfer Point
                            </Typography>
                            <TextField
                              size='small'
                              sx={{
                                width: 300,
                                backgroundColor: '#f5f5f5',
                              }}
                              value={item.transferPoint ?? ''}
                              onChange={(e) =>
                                handleItemFieldChange(
                                  'transferPoint',
                                  e.target.value,
                                  i
                                )
                              }
                            />
                          </Stack>
                        )}
                        {item.action === 'Message' && (
                          <Stack sx={{my: 0.5}}>
                            <Typography variant='subtitle2'>
                              Message Prompt
                            </Typography>
                            <TextField
                              size='small'
                              sx={{
                                width: 300,
                                backgroundColor: '#f5f5f5',
                              }}
                              value={item.messagePrompt ?? ''}
                              onChange={(e) =>
                                handleItemFieldChange(
                                  'messagePrompt',
                                  e.target.value,
                                  i
                                )
                              }
                            />
                          </Stack>
                        )}
                      </>
                    ) : (
                      <TextField
                        sx={{
                          width: 200,
                          backgroundColor: '#f5f5f5',
                        }}
                        value={item.action}
                        onChange={(e) => {
                          handleItemFieldChange('action', e.target.value, i);
                          validateAction(e.target.value, i);
                        }}
                        error={Boolean(item.actionError)}
                        size='small'
                      />
                    )}
                  </Stack>
                  <Stack sx={{my: 0.5}}>
                    <Typography variant='subtitle2'>Prompt</Typography>
                    <TextField
                      sx={{
                        width: 300,
                        backgroundColor:
                          item.isDefault &&
                          [
                            'MainMenu',
                            'PreviousMenu',
                            'Disconnect',
                            'Transfer',
                          ].includes(item.action)
                            ? ''
                            : '#f5f5f5',
                      }}
                      value={item.prompt}
                      onChange={(e) => {
                        handleItemFieldChange('prompt', e.target.value, i);
                        validatePrompt(e.target.value, i);
                      }}
                      placeholder={
                        item.isDefault ? getPlaceholderValue(item.action) : ''
                      }
                      disabled={
                        item.isDefault &&
                        [
                          'MainMenu',
                          'PreviousMenu',
                          'Disconnect',
                          'Transfer',
                        ].includes(item.action)
                      }
                      size='small'
                      error={Boolean(item.promptError)}
                    />
                  </Stack>
                  <Box sx={{display: 'flex', alignItems: 'center', my: 0.5}}>
                    <Stack sx={{my: 0.5}}>
                      <Typography variant='subtitle2'>Skip</Typography>
                      <Switch
                        checked={item.isSkip ?? false}
                        onChange={(e) =>
                          handleItemFieldChange('isSkip', e.target.checked, i)
                        }
                        sx={{mt: -1, ml: -1}}
                      />
                    </Stack>
                    <Stack sx={{my: 0.5, ml: 4}}>
                      <Typography variant='subtitle2'>Disabled</Typography>
                      <Switch
                        checked={item.disabled}
                        onChange={(e) =>
                          handleItemFieldChange('disabled', e.target.checked, i)
                        }
                        sx={{mt: -1, ml: -1}}
                      />
                    </Stack>
                    <Stack sx={{my: 0.5, ml: 4}}>
                      <Typography variant='subtitle2'>Silent</Typography>
                      <Switch
                        checked={item.silent}
                        onChange={(e) =>
                          handleItemFieldChange('silent', e.target.checked, i)
                        }
                        sx={{mt: -1, ml: -1}}
                      />
                    </Stack>
                    <IconButton
                      color='error'
                      size='small'
                      onClick={() => handleDeleteItem(i)}
                      sx={{
                        ml: 'auto',
                        backgroundColor: '#cfcfcf',
                        '&:hover': {backgroundColor: '#c7c1bd'},
                        height: 30,
                        width: 30,
                      }}>
                      <DeleteIcon sx={{color: '#424242'}} />
                    </IconButton>
                  </Box>
                  {item.isSkip ? (
                    <Stack>
                      <Typography variant='subtitle2'>
                        Skip N Iterations
                      </Typography>
                      <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Select
                          sx={{
                            width: 100,
                            backgroundColor: '#f5f5f5',
                          }}
                          value={item.skip}
                          onChange={(e) =>
                            handleItemFieldChange('skip', e.target.value, i)
                          }
                          size='small'>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d, i) => (
                            <MenuItem value={d} key={d}>
                              {d}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    </Stack>
                  ) : (
                    <></>
                  )}
                </Stack>
              </ListItem>
            ))}
          </List>
        )}
        {tabValue === 2 && <LogDrawer />}
      </Box>
    </Box>
  );
};

export default PlayMenu;
