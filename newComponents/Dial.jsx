import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  ListItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {useEffect, useMemo, useRef, useState} from 'react';
import {checkValidity} from '../src/helpers';
import {isNameUnique} from '../src/myFunctions';

const Dial = ({
  shape,
  handleCloseDrawer,
  shapes,
  clearAndDraw,
  userVariables,
  openVariableManager,
  openUserGuide,
}) => {
  const [name, setName] = useState(shape.text);
  const [phoneNum, setPhoneNum] = useState(shape.userValues?.phoneNum ?? '');
  const [trunk, setTrunk] = useState(shape.userValues?.trunk ?? '');
  const [accessCode, setAccessCode] = useState(
    shape.userValues?.accessCode ?? ''
  );
  const [callerId, setCallerId] = useState(shape.userValues?.callerId ?? '');
  const [successText, setSuccessText] = useState('');
  const [errorText, setErrorText] = useState('');

  const errors = useRef({});

  const variableNamesNumber = useMemo(() => {
    return userVariables
      .filter((variable) => variable.type == 'number')
      .map((variable) => `$${variable.name}`);
  }, [userVariables]);

  const variableNamesString = useMemo(() => {
    return userVariables
      .filter((variable) => variable.type == 'string')
      .map((variable) => `$${variable.name}`);
  }, [userVariables]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSuccessText('');
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [successText]);

  function handleSave() {
    if (errors.current.name) {
      setErrorText('Id not valid.');
      return;
    }
    shape.setText(name);
    clearAndDraw();

    if (!phoneNum) {
      setErrorText('Phone number is required.');
      return;
    }
    if (errors.current.phoneNum) {
      setErrorText('Phone number not valid.');
      return;
    }
    if (errors.current.trunk) {
      setErrorText('Trunk not valid.');
      return;
    }
    if (errors.current.accessCode) {
      setErrorText('Access code not valid.');
      return;
    }
    if (errors.current.callerId) {
      setErrorText('Caller Id not valid.');
      return;
    }

    shape.setUserValues({phoneNum, trunk, accessCode, callerId});
    shape.isComplete = true;

    setSuccessText('Saved.');
  }

  function handleSaveAndClose() {
    handleSave();
    handleCloseDrawer();
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

  function filterOptions(options, {inputValue}) {
    if (inputValue.startsWith('$')) {
      return options.filter((option) =>
        option.includes(inputValue.substring(1))
      );
    }
    return [];
  }

  function validateNumber(value) {
    if (!value) {
      errors.current.phoneNum = true;
      setErrorText('Phone number is required.');
      return;
    }

    if (value.startsWith('$')) {
      if (variableNamesNumber.includes(value)) {
        delete errors.current.phoneNum;
        setErrorText('');
        return;
      } else {
        errors.current.phoneNum = true;
        setErrorText(`${value} is not a valid number variable.`);
        return;
      }
    }

    const numberRegex = /^\d+$/;
    if (numberRegex.test(value)) {
      delete errors.current.phoneNum;
      setErrorText('');
    } else {
      errors.current.phoneNum = true;
      setErrorText('Phone number not in valid format.');
    }
  }

  function validateString(value, name) {
    if (value.startsWith('$')) {
      if (!variableNamesString.includes(value)) {
        errors.current[name] = true;
        setErrorText(`${value} is not a valid string variable.`);
        return;
      }
    }
    delete errors.current[name];
    setErrorText('');
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
              src='/icons/dialBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp;Dial
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
          onClick={handleSaveAndClose}
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}>
          <Typography sx={{ml: 2, mt: 1}} fontSize='large' variant='subtitle2'>
            ID
          </Typography>
          <ListItem sx={{mt: -1}}>
            <TextField
              onChange={handleNameChange}
              value={name}
              sx={{minWidth: '220px'}}
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
              <Typography sx={{mt: -1, color: 'red', mx: 'auto'}}>
                {errorText}
              </Typography>
            )}
          </ListItem>
        </Box>
        <Divider />
        <ListItem sx={{mt: 2}}>
          <Stack>
            <Typography variant='subtitle2'>Phone Number</Typography>
            <Autocomplete
              value={phoneNum}
              options={variableNamesNumber}
              freeSolo
              filterOptions={filterOptions}
              clearIcon={null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  sx={{
                    backgroundColor: '#f5f5f5',
                    minWidth: '200px',
                  }}
                  error={errors.current.phoneNum}
                  onChange={(e) => {
                    setPhoneNum(e.target.value);
                    validateNumber(e.target.value);
                  }}
                />
              )}
              onInputChange={(event, newValue) => {
                setPhoneNum(newValue);
                validateNumber(newValue);
              }}
            />
          </Stack>
        </ListItem>
        <ListItem sx={{mt: 1}}>
          <Stack>
            <Typography variant='subtitle2'>Trunk</Typography>
            <Autocomplete
              value={trunk}
              options={variableNamesString}
              freeSolo
              filterOptions={filterOptions}
              clearIcon={null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  sx={{
                    backgroundColor: '#f5f5f5',
                    minWidth: '200px',
                  }}
                  error={errors.current.trunk}
                  onChange={(e) => {
                    setTrunk(e.target.value);
                    validateString(e.target.value, 'trunk');
                  }}
                />
              )}
              onInputChange={(event, newValue) => {
                setTrunk(newValue);
                validateString(newValue, 'trunk');
              }}
            />
          </Stack>
        </ListItem>
        <ListItem sx={{mt: 1}}>
          <Stack>
            <Typography variant='subtitle2'>Access Code</Typography>
            <Autocomplete
              value={accessCode}
              options={variableNamesString}
              freeSolo
              filterOptions={filterOptions}
              clearIcon={null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  sx={{
                    backgroundColor: '#f5f5f5',
                    minWidth: '200px',
                  }}
                  error={errors.current.accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    validateString(e.target.value, 'accessCode');
                  }}
                />
              )}
              onInputChange={(event, newValue) => {
                setAccessCode(newValue);
                validateString(newValue, 'accessCode');
              }}
            />
          </Stack>
        </ListItem>
        <ListItem sx={{mt: 1}}>
          <Stack>
            <Typography variant='subtitle2'>Caller ID</Typography>
            <Autocomplete
              value={callerId}
              options={variableNamesString}
              freeSolo
              filterOptions={filterOptions}
              clearIcon={null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  sx={{
                    backgroundColor: '#f5f5f5',
                    minWidth: '200px',
                  }}
                  error={errors.current.callerId}
                  onChange={(e) => {
                    setCallerId(e.target.value);
                    validateString(e.target.value, 'callerId');
                  }}
                />
              )}
              onInputChange={(event, newValue) => {
                setCallerId(newValue);
                validateString(newValue, 'callerId');
              }}
            />
          </Stack>
        </ListItem>
      </Box>
    </>
  );
};

export default Dial;
