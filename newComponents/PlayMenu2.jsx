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
  const [items, setItems] = useState([]);

  const errors = useRef({});

  const optionalParamList = [
    'invalidAction',
    'timeoutAction',
    'invalidPrompt',
    'timeoutPrompt',
    'maxRetries',
    'interruptible',
    'transferPoint',
    'menuTimeout',
  ];

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
      disable: false,
      silent: false,
      skip: 0,
    });
    setItems(updatedItems);
    setItemDigit('');
  }

  function handleDeleteItem(index) {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  }

  function renderComponentByType(param, index) {
    switch (param) {
      case 'invalidAction':
        return (
          <Stack>
            <Typography fontSize='large' variant='subtitle2'>
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
                  sx={{mx: 1, width: 150, backgroundColor: '#ededed'}}
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
            <Typography fontSize='large' variant='subtitle2'>
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
                  sx={{mx: 1, width: 150, backgroundColor: '#ededed'}}
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
            <Typography fontSize='large' variant='subtitle2'>
              maxRetries
            </Typography>
            <Select
              sx={{backgroundColor: '#ededed'}}
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
            <Typography fontSize='large' variant='subtitle2'>
              invalidPrompt
            </Typography>
            <TextField
              sx={{backgroundColor: '#ededed'}}
              value={addedOptionalParams[index].value ?? ''}
              onChange={(e) => handleOptionalParamFieldChange(e, index)}
              size='small'
              fullWidth
            />
          </Stack>
        );
      case 'timeoutPrompt':
        return (
          <Stack sx={{width: '100%', mr: 1}}>
            <Typography fontSize='large' variant='subtitle2'>
              timeoutPrompt
            </Typography>
            <TextField
              sx={{backgroundColor: '#ededed'}}
              value={addedOptionalParams[index].value ?? ''}
              onChange={(e) => handleOptionalParamFieldChange(e, index)}
              size='small'
              fullWidth
            />
          </Stack>
        );
      case 'interruptible':
        return (
          <Stack>
            <Typography fontSize='large' variant='subtitle2'>
              interruptible
            </Typography>
            <Switch
              sx={{mt: -1}}
              checked={addedOptionalParams[index].value ?? true}
              onChange={(e) => handleOptionalParamFieldChangeSwitch(e, index)}
            />
          </Stack>
        );
      case 'transferPoint':
        return (
          <Stack sx={{width: '100%', mr: 1}}>
            <Typography fontSize='large' variant='subtitle2'>
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
          <Stack sx={{width: '100%', mr: 1}}>
            <Typography fontSize='large' variant='subtitle2'>
              menuTimeout
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
    }
  }

  return (
    <>
      <ListItem
        sx={{
          backgroundColor: '#cfd8dc',
          display: 'flex',
          boxShadow: 2,
          p: 1,
          minWidth: 400,
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
          onClick={() => setOpenGuideDialog(true)}
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
              //   onClick={handleSave}
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
              <Typography fontSize='large' variant='subtitle2'>
                description
              </Typography>
              <TextField
                sx={{backgroundColor: '#f5f5f5', width: 300}}
                size='small'
                multiline
              />
            </Stack>
            <Stack
              sx={{
                px: 2,
                py: 1,
              }}>
              <Typography fontSize='large' variant='subtitle2'>
                previousMenuId
              </Typography>
              <TextField
                sx={{backgroundColor: '#f5f5f5', width: 200}}
                size='small'
              />
            </Stack>
            <Stack
              sx={{
                px: 2,
                py: 1,
              }}>
              <Typography fontSize='large' variant='subtitle2'>
                ignoreBuffer
              </Typography>
              <Switch sx={{mt: -1, ml: -1}} />
            </Stack>
            <Stack
              sx={{
                px: 2,
                pt: 1,
                pb: 2,
              }}>
              <Typography fontSize='large' variant='subtitle2'>
                logDb
              </Typography>
              <Switch sx={{mt: -1, ml: -1}} />
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
                    minWidth: 150,
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
                  backgroundColor: i % 2 == 0 ? '#e0e0e0' : '#eeeeee',
                  borderBottom: '1px solid #bdbdbd',
                  borderTop: i == 0 && '1px solid #bdbdbd',
                }}
                key={i}>
                <Stack sx={{width: '100%', py: 1}}>
                  <Avatar
                    variant='rounded'
                    sx={{
                      mx: 'auto',
                      border: '1px solid #424242',
                      backgroundColor: '#eeeeee',
                    }}>
                    <Typography sx={{color: 'black'}} variant='h6'>
                      {item.digit}
                    </Typography>
                  </Avatar>
                  <Stack sx={{my: 0.5, mt: 1}}>
                    <Typography variant='subtitle2'>
                      use default action
                    </Typography>
                    <Switch sx={{mt: -1, ml: -1}} />
                  </Stack>
                  <Stack sx={{my: 0.5}}>
                    <Typography variant='subtitle2'>action</Typography>
                    <TextField
                      sx={{
                        width: 200,
                        backgroundColor: i % 2 !== 0 ? '#f5f5f5' : '#ededed',
                      }}
                      size='small'
                    />
                  </Stack>
                  <Stack sx={{my: 0.5}}>
                    <Typography variant='subtitle2'>prompt</Typography>
                    <TextField
                      sx={{
                        width: 300,
                        backgroundColor: i % 2 !== 0 ? '#f5f5f5' : '#ededed',
                      }}
                      size='small'
                    />
                  </Stack>
                  <Box sx={{display: 'flex', my: 0.5}}>
                    <Stack sx={{my: 0.5}}>
                      <Typography variant='subtitle2'>disable</Typography>
                      <Switch sx={{mt: -1, ml: -1}} />
                    </Stack>
                    <Stack sx={{my: 0.5, ml: 4}}>
                      <Typography variant='subtitle2'>silent</Typography>
                      <Switch sx={{mt: -1, ml: -1}} />
                    </Stack>
                  </Box>
                  <Stack>
                    <Typography variant='subtitle2'>skip</Typography>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                      <Select
                        sx={{
                          width: 100,
                          backgroundColor: i % 2 !== 0 ? '#f5f5f5' : '#ededed',
                        }}
                        size='small'>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d, i) => (
                          <MenuItem value={d} key={d}>
                            {d}
                          </MenuItem>
                        ))}
                      </Select>
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
                  </Stack>
                </Stack>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </>
  );
};

export default PlayMenu;
