import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import {checkValidity} from '../src/helpers';
import {stringifySafe} from '../src/myFunctions';

const VariableManager = ({
  isOpen,
  handleClose,
  variables,
  setVariables,
  saveToDb,
  renameVariablesInUse,
  shapes,
}) => {
  const [currentVariable, setCurrentVariable] = useState('');
  const [type, setType] = useState('prompt');
  const [name, setName] = useState('');
  const [defaultValue, setDefaultValue] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState('');
  const [successText, setSuccessText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [allowLeadingZeroes, setAllowLeadingZeroes] = useState(false);

  const errorObj = useRef({});

  useEffect(() => {
    if (type === 'number') revalidateDefaultValue();
  }, [allowLeadingZeroes]);

  const DayValues = [
    '1 Sunday',
    '2 Monday',
    '3 Tuesday',
    '4 Wednesday',
    '5 Thursday',
    '6 Friday',
    '7 Saturday',
  ];

  const MonthValues = [
    '01 January',
    '02 February',
    '03 March',
    '04 April',
    '05 May',
    '06 June',
    '07 July',
    '08 August',
    '09 September',
    '10 October',
    '11 November',
    '12 December',
  ];

  function handleSave() {
    if (errorText !== '') return;

    if (!name) {
      setErrorText('Name is required.');
      return;
    }
    if (defaultValue === '' && type !== 'string') {
      setErrorText('Default value is required.');
      return;
    }

    if (errorObj.current.name) {
      setErrorText('Name not valid.');
      return;
    }

    if (errorObj.current.value && type !== 'string') {
      setErrorText('Default value not valid.');
      return;
    }

    if (mode == 'modify') {
      const index = variables.findIndex((v) => v == currentVariable);

      if (index !== -1) {
        const updatedVariables = [...variables];
        const oldName = updatedVariables[index].name;

        updatedVariables[index] =
          type === 'number'
            ? {type, name, defaultValue, description, allowLeadingZeroes}
            : {type, name, defaultValue, description};

        const newName = updatedVariables[index].name;
        if (oldName != newName) {
          console.log('name changed!!');
          renameVariablesInUse(oldName, newName);
        }
        setVariables(updatedVariables);
        setSuccessText('Update successful.');
      } else {
        setErrorText('Update error.');
      }
    } else if (mode == 'add') {
      setVariables([
        ...variables,
        type === 'number'
          ? {type, name, defaultValue, description, allowLeadingZeroes}
          : {type, name, defaultValue, description},
      ]);

      setSuccessText('New variable added.');
    }

    setMode('');
    setCurrentVariable('');
    setName('');
    setDefaultValue('');
    setDescription('');
  }

  function handleDelete() {
    const index = variables.findIndex((v) => v === currentVariable);

    setErrorText('');

    if (index !== -1) {
      const shapeIndex = findVariableUsedIndex(currentVariable.name, shapes);

      if (shapeIndex !== -1) {
        setErrorText(
          `Cannot delete. Variable used in ${shapes[shapeIndex].text}`
        );
      } else {
        const updatedVariables = [...variables];
        updatedVariables.splice(index, 1);
        setVariables(updatedVariables);
        setSuccessText('Delete successful.');
      }
    } else {
      setErrorText('Delete error.');
    }

    setMode('');
    setType('prompt');
    setCurrentVariable('');
    setName('');
    setDefaultValue('');
    setDescription('');
  }

  function findVariableUsedIndex(name, shapes) {
    return shapes.findIndex((shape) => shape.isVariableNameUsed(name));
  }

  function handleAddNewVariable() {
    setMode('add');
    setCurrentVariable('');
    setName('');
    setDefaultValue('');
    setDescription('');
    setSuccessText('');
    setErrorText('');
    setAllowLeadingZeroes(false);
  }

  function isVariableNameUnique(name, variables, shapes) {
    // check if name exists in variables
    const existsInVariables = variables.some(
      (variable) => variable.name === name
    );

    // check if name exists in shapes
    const existsInShapes = shapes.some((shape) => shape.text === name);

    // return true if name is unique in both arrays, false otherwise
    return !(existsInVariables || existsInShapes);
  }

  function validate(objType, value, variables) {
    let errorMessage = -1;

    if (objType === 'name' && value) {
      errorMessage = checkValidity('name', value);

      if (
        errorMessage === -1 &&
        !isVariableNameUnique(value, variables, shapes)
      ) {
        errorMessage = 'Name must be unique.';
      }
    } else if (objType === 'value') {
      if (type === 'json') {
        errorMessage = checkIfJsonIsValid(value);
      } else if (type === 'number' && allowLeadingZeroes === false) {
        errorMessage = checkNumberWithNoLeadingZeros(value);
      } else errorMessage = checkValidity(type, value);
    }

    return errorMessage;
  }

  function checkIfJsonIsValid(input) {
    try {
      JSON.parse(input);
      return -1;
    } catch (e) {
      return 'JSON is not in valid format.';
    }
  }

  function checkNumberWithNoLeadingZeros(input) {
    if (isNaN(input)) {
      return 'Not a valid number.';
    }

    if (/^0[0-9]+/.test(input)) {
      return 'Number has leading zeroes.';
    }

    return -1;
  }

  function revalidateDefaultValue() {
    handleValidation('value', defaultValue);
  }

  function handleValidation(objType, value) {
    const errorMessage = validate(objType, value, variables);

    if (errorMessage === -1) {
      // No error condition
      setErrorText('');
      errorObj.current[objType] = false;
    } else {
      errorObj.current[objType] = true;
      setErrorText(errorMessage);
    }
  }

  function getTextFieldPlaceholderValue(type) {
    if (type === 'date') {
      return 'yyyymmdd';
    } else if (type === 'time') {
      return 'hhmm';
    } else return 'required';
  }

  function doClosingOperations() {
    setMode('');
    setCurrentVariable('');
    setName('');
    setDefaultValue('');
    setDescription('');
    setSuccessText('');
    setErrorText('');
    setType('prompt');
  }

  return (
    <Drawer
      anchor='left'
      open={isOpen}
      onClose={() => {
        doClosingOperations();
        handleClose();
      }}>
      <ListItem
        sx={{
          backgroundColor: '#cfd8dc',
          boxShadow: 2,
          p: 1,
        }}
        disablePadding>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 'auto',
            fontSize: 'extra-large',
            height: 40,
            ml: 1,
          }}
          variant='h5'>
          {
            <img
              src='/icons/variableManager.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp;Variable Manager
        </Typography>
        <IconButton
          onClick={() => {
            doClosingOperations();
            handleClose();
          }}
          sx={{
            ml: 'auto',
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
        <List sx={{minWidth: 380}}>
          <ListItem sx={{mt: 1}}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <Typography fontSize='large' variant='subtitle1'>
                Variables
              </Typography>
              <Select
                labelId='select-label'
                value={currentVariable}
                onChange={(e) => {
                  setCurrentVariable(e.target.value);
                  setType(e.target.value.type);
                  setName(e.target.value.name);
                  setDefaultValue(e.target.value.defaultValue);
                  setDescription(e.target.value.description);
                  setMode('');
                  setAllowLeadingZeroes(e.target.value.allowLeadingZeroes);
                }}
                sx={{
                  minWidth: 220,
                  backgroundColor: '#f5f5f5',
                }}
                size='small'>
                {variables
                  .filter((v) => v.type !== 'system')
                  .map((v, i) => (
                    <MenuItem key={i} value={v}>
                      {v.name}
                    </MenuItem>
                  ))}
              </Select>
            </Box>
          </ListItem>

          <ListItem>
            <Button
              sx={{
                backgroundColor: '#424242',
                color: 'white',
                '&:hover': {backgroundColor: '#9ccc65'},
              }}
              variant='contained'
              onClick={handleAddNewVariable}>
              Add
            </Button>
            <Button
              sx={{
                ml: 2,
                backgroundColor: '#424242',
                color: 'white',
                '&:hover': {backgroundColor: '#42a5f5'},
              }}
              variant='contained'
              onClick={() => {
                setMode('modify');
                setSuccessText('');
                setErrorText('');
              }}
              disabled={mode == 'modify' || !currentVariable}>
              Modify
            </Button>
            <Button
              sx={{
                ml: 2,
                backgroundColor: '#424242',
                color: 'white',
                '&:hover': {backgroundColor: '#ef5350'},
              }}
              variant='contained'
              onClick={handleDelete}
              disabled={mode != 'modify' || !currentVariable}>
              Delete
            </Button>
          </ListItem>
          <Divider sx={{mt: 2}} />
          <Box sx={{py: 1}}>
            <ListItem
              sx={{
                display: 'flex',
                justifyContent: 'center',
                height: '30px',
              }}>
              {successText && (
                <Typography
                  sx={{
                    mx: 'auto',
                    color: 'green',
                    backgroundColor: '#e5f9e5',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    textAlign: 'center',
                    width: 'max-content',
                  }}
                  variant='subtitle2'>
                  {successText}
                </Typography>
              )}
              {errorText && (
                <Typography
                  sx={{
                    mx: 'auto',
                    color: 'red',
                    backgroundColor: '#fce8e6',
                    px: 2,
                    py: 0.5,
                    textAlign: 'center',
                    borderRadius: 1,
                    width: 'max-content',
                  }}
                  variant='subtitle2'>
                  {errorText}
                </Typography>
              )}
            </ListItem>

            <ListItem disablePadding>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  my: 1,
                  px: 2,
                  width: '100%',
                }}>
                <Typography sx={{width: '100px'}} variant='subtitle2'>
                  Type
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Select
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                      setErrorText('');
                      setAllowLeadingZeroes(false);
                      if (e.target.value == 'json') {
                        setDefaultValue('{ }');
                      } else setDefaultValue('');
                    }}
                    size='small'
                    disabled={!(mode == 'add' || mode == 'modify')}
                    sx={{
                      minWidth: 100,
                      backgroundColor:
                        mode == 'add' || mode == 'modify' ? 'white' : '#e0e0e0',
                    }}>
                    <MenuItem value='prompt'>Prompt</MenuItem>
                    <MenuItem value='number'>Number</MenuItem>
                    <MenuItem value='string'>String</MenuItem>
                    <MenuItem value='boolean'>Boolean</MenuItem>
                    <MenuItem value='json'>JSON</MenuItem>
                    <MenuItem value='date'>Date</MenuItem>
                    <MenuItem value='day'>Day</MenuItem>
                    <MenuItem value='month'>Month</MenuItem>
                    <MenuItem value='time'>Time</MenuItem>
                  </Select>
                  {type === 'number' && (
                    <Box
                      id='box2'
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                      <Typography
                        sx={{
                          color:
                            mode == 'add' || mode == 'modify'
                              ? 'black'
                              : 'grey',
                        }}
                        variant='subtitle2'>
                        Allow Leading Zeroes
                      </Typography>
                      <Checkbox
                        size='small'
                        checked={allowLeadingZeroes}
                        onChange={(e) => {
                          setAllowLeadingZeroes(e.target.checked);
                        }}
                        disabled={!(mode == 'add' || mode == 'modify')}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </ListItem>
            <ListItem disablePadding>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  px: 2,
                  my: 1,
                  width: '100%',
                }}>
                <Typography variant='subtitle2'>Name</Typography>
                <TextField
                  value={name}
                  placeholder='required'
                  onChange={(e) => {
                    setName(e.target.value);
                    handleValidation('name', e.target.value);
                  }}
                  sx={{
                    backgroundColor:
                      mode == 'add' || mode == 'modify' ? 'white' : '#e0e0e0',
                  }}
                  size='small'
                  disabled={!(mode == 'add' || mode == 'modify')}
                  fullWidth
                />
              </Box>
            </ListItem>

            <ListItem disablePadding>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  px: 2,
                  my: 1,
                  width: '100%',
                }}>
                <Typography variant='subtitle2'>Default Value</Typography>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  {['day', 'month'].includes(type) ? (
                    <Select
                      sx={{
                        width: 200,
                        backgroundColor:
                          mode == 'add' || mode == 'modify'
                            ? 'white'
                            : '#e0e0e0',
                      }}
                      value={defaultValue}
                      onChange={(e) => setDefaultValue(e.target.value)}
                      disabled={!(mode == 'add' || mode == 'modify')}
                      size='small'>
                      {type == 'day' &&
                        DayValues.map((d, i) => (
                          <MenuItem value={i + 1} key={i}>
                            {d}
                          </MenuItem>
                        ))}
                      {type == 'month' &&
                        MonthValues.map((d, i) => (
                          <MenuItem value={i + 1} key={i}>
                            {d}
                          </MenuItem>
                        ))}
                    </Select>
                  ) : (
                    <TextField
                      value={defaultValue}
                      placeholder={getTextFieldPlaceholderValue(type)}
                      onChange={(e) => {
                        setDefaultValue(e.target.value);
                        handleValidation('value', e.target.value);
                      }}
                      sx={{
                        backgroundColor:
                          mode == 'add' || mode == 'modify'
                            ? 'white'
                            : '#e0e0e0',
                      }}
                      size='small'
                      disabled={!(mode == 'add' || mode == 'modify')}
                      multiline={type === 'json'}
                      rows={6}
                      spellCheck={false}
                      fullWidth
                    />
                  )}
                </Box>
              </Box>
            </ListItem>
            <ListItem disablePadding>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  px: 2,
                  my: 1,
                  width: '100%',
                }}>
                <Typography variant='subtitle2'>Description</Typography>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <TextField
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{
                      backgroundColor:
                        mode == 'add' || mode == 'modify' ? 'white' : '#e0e0e0',
                    }}
                    size='small'
                    multiline
                    disabled={!(mode == 'add' || mode == 'modify')}
                    fullWidth
                  />
                  <Button
                    onClick={handleSave}
                    variant='contained'
                    disabled={!(mode == 'add' || mode == 'modify')}
                    sx={{ml: 2}}>
                    <SaveIcon />
                  </Button>
                </Box>
              </Box>
            </ListItem>
          </Box>
        </List>
      </Box>
    </Drawer>
  );
};

export default VariableManager;
