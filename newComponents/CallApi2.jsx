import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  ListItem,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {useEffect, useMemo, useRef, useState} from 'react';
import {checkValidity} from '../src/helpers';
import {isNameUnique} from '../src/myFunctions';
import UrlTextfield from './UrlTextfield';

const CallApi = ({
  shape,
  handleCloseDrawer,
  shapes,
  clearAndDraw,
  userVariables,
  openVariableManager,
  openUserGuide,
}) => {
  const [name, setName] = useState(shape.text);
  const [successText, setSuccessText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [endpoint, setEndpoint] = useState(shape.userValues?.endpoint ?? '');
  const [inputVars, setInputVars] = useState(
    shape.userValues?.inputVars ?? [{}]
  );
  const [outputVars, setOutputVars] = useState(
    shape.userValues?.outputVars ?? [{}]
  );
  const [playWaitMessage, setPlayWaitMessage] = useState(
    shape.userValues?.playWaitMessage ?? false
  );
  const [endpointError, setEndpointError] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSuccessText('');
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [successText]);

  const allStringVariableNames = useMemo(() => {
    return userVariables
      .filter((variable) => variable.type === 'string')
      .map((variable) => `$${variable.name}`);
  }, [userVariables]);

  const allStringVariables = useMemo(() => {
    return userVariables.filter((variable) => variable.type === 'string');
  }, [userVariables]);

  const errors = useRef({});

  function handleSave() {
    if (errors.current.name) {
      setErrorText('Id not valid.');
      return;
    }
    shape.setText(name);
    clearAndDraw();

    shape.setUserValues({endpoint, inputVars, outputVars, playWaitMessage});

    setErrorText('');
    setSuccessText('Saved.');
    if (
      endpoint.length > 1 &&
      inputVars[0].name &&
      outputVars[0].name &&
      !endpointError
    ) {
      shape.isComplete = true;
    } else {
      shape.isComplete = false;
    }
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

    const isUnique = isNameUnique(value, shape, shapes, userVariables);
    if (!isUnique) {
      setErrorText('Id not unique.');
      errors.current.name = true;
    } else {
      setErrorText('');
      errors.current.name = undefined;
    }
  }

  function handleAddInputVariable() {
    const updatedInputVars = [...inputVars];
    updatedInputVars.push({});
    setInputVars(updatedInputVars);
  }
  function handleAddOutputVariable() {
    const updatedOutputVars = [...outputVars];
    updatedOutputVars.push({});
    setOutputVars(updatedOutputVars);
  }

  function handleDeleteInputVar(index) {
    const updatedInputVars = [...inputVars];
    updatedInputVars.splice(index, 1);
    setInputVars(updatedInputVars);
  }

  function handleDeleteOutputVar(index) {
    const updatedOutputVars = [...outputVars];
    updatedOutputVars.splice(index, 1);
    setOutputVars(updatedOutputVars);
  }

  function handleChangeSelectInput(value, index) {
    const updatedInputVars = [...inputVars];
    updatedInputVars[index].name = value;
    setInputVars(updatedInputVars);
  }
  function handleChangeSelectOutput(value, index) {
    const updatedOutputVars = [...outputVars];
    updatedOutputVars[index].name = value;
    setOutputVars(updatedOutputVars);
  }

  function handleEndpointChange(value) {
    setEndpoint(value);
    validateEndpoint(value);
  }

  function validateEndpoint(textInput) {
    const variablesInText = extractVariables(textInput);

    if (variablesInText.length > 0) {
      const invalidVariable = findInvalidVariable(variablesInText);
      if (invalidVariable) {
        setEndpointError(`${invalidVariable} is not a valid string variable.`);
        return;
      }
    }

    if (!isValidURLWithVariables(textInput) && textInput) {
      setEndpointError('Not a valid URL');
      return;
    }

    setEndpointError('');
  }

  function extractVariables(textInput) {
    return textInput.match(/\$\w+/g) || [];
  }

  function findInvalidVariable(variablesInText) {
    return variablesInText.find(
      (variable) => !allStringVariableNames.includes(variable)
    );
  }

  function isValidURLWithVariables(textInput) {
    const replacedInput = textInput.replace(
      /\$\w+/g,
      getVariableValueOrDefault
    );

    return isValidURL(replacedInput);
  }

  function getVariableValueOrDefault(match) {
    const nameWithoutDollar = match.slice(1);
    const foundVariable = allStringVariables.find(
      (variable) => variable.name === nameWithoutDollar
    );
    return foundVariable ? foundVariable.defaultValue : match;
  }

  function isValidURL(str) {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
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
              src='/icons/callAPIBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp;Call API
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
          onClick={openUserGuide}
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
        <Stack
          sx={{
            px: 2,
            py: 1,
            mt: 2,
          }}>
          <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
            REST Endpoint
          </Typography>

          <UrlTextfield
            inputValue={endpoint}
            modifyInputValue={handleEndpointChange}
            placeholderText='https://api.example.com/data'
            variableNames={allStringVariableNames}
          />
          <Box sx={{height: 10, textAlign: 'center'}}>
            {endpointError && (
              <Typography variant='body2' sx={{color: 'red', mt: 1}}>
                {endpointError}
              </Typography>
            )}
          </Box>
        </Stack>

        <Box
          sx={{
            px: 2,
            py: 1,

            display: 'flex',
            alignItems: 'center',
          }}>
          <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
            Play Wait Message
          </Typography>
          <Checkbox
            checked={playWaitMessage}
            onChange={(e) => setPlayWaitMessage(e.target.checked)}
          />
        </Box>

        <Divider />
        <Stack
          sx={{
            px: 2,
            py: 1,
            my: 2,
          }}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
              Input Variables
            </Typography>
            <Button
              sx={{
                ml: 'auto',
                mr: 1,
                backgroundColor: '#bdbdbd',
                color: 'black',
                '&:hover': {backgroundColor: '#9ccc65'},
              }}
              size='small'
              onClick={handleAddInputVariable}
              variant='contained'>
              Add
            </Button>
          </Box>

          <Stack>
            {inputVars.map((v, i) => (
              <Box sx={{display: 'flex', alignItems: 'center', mt: 1}} key={i}>
                <Select
                  sx={{
                    minWidth: 120,
                    my: 0.5,
                    backgroundColor: '#f5f5f5',
                  }}
                  value={v.name ?? ''}
                  onChange={(e) => handleChangeSelectInput(e.target.value, i)}
                  size='small'>
                  {userVariables.map((v, i) => (
                    <MenuItem value={v.name} key={i}>
                      {v.name}
                    </MenuItem>
                  ))}
                </Select>
                {i > 0 && (
                  <IconButton
                    color='error'
                    size='small'
                    onClick={() => handleDeleteInputVar(i)}
                    sx={{
                      ml: 4,
                      mr: 1,
                      backgroundColor: '#cfcfcf',
                      '&:hover': {backgroundColor: '#c7c1bd'},
                      height: 30,
                      width: 30,
                    }}>
                    <DeleteIcon sx={{color: '#424242'}} />
                  </IconButton>
                )}
              </Box>
            ))}
          </Stack>
        </Stack>
        <Divider />
        <Stack
          sx={{
            px: 2,
            py: 1,
            my: 2,
          }}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
              Output Variables
            </Typography>
            <Button
              sx={{
                ml: 'auto',
                mr: 1,
                backgroundColor: '#bdbdbd',
                color: 'black',
                '&:hover': {backgroundColor: '#9ccc65'},
              }}
              size='small'
              variant='contained'
              onClick={handleAddOutputVariable}>
              Add
            </Button>
          </Box>

          <Stack>
            {outputVars.map((v, i) => (
              <Box sx={{display: 'flex', alignItems: 'center', mt: 1}} key={i}>
                <Select
                  sx={{
                    minWidth: 120,
                    my: 0.5,
                    backgroundColor: '#f5f5f5',
                  }}
                  value={v.name ?? ''}
                  onChange={(e) => handleChangeSelectOutput(e.target.value, i)}
                  size='small'>
                  {userVariables.map((v, i) => (
                    <MenuItem value={v.name} key={i}>
                      {v.name}
                    </MenuItem>
                  ))}
                </Select>
                {i > 0 && (
                  <IconButton
                    color='error'
                    size='small'
                    onClick={() => handleDeleteOutputVar(i)}
                    sx={{
                      ml: 4,
                      mr: 1,
                      backgroundColor: '#cfcfcf',
                      '&:hover': {backgroundColor: '#c7c1bd'},
                      height: 30,
                      width: 30,
                    }}>
                    <DeleteIcon sx={{color: '#424242'}} />
                  </IconButton>
                )}
              </Box>
            ))}
          </Stack>
        </Stack>
        <Divider />
      </Box>
    </>
  );
};

export default CallApi;
