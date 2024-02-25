import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SaveIcon from '@mui/icons-material/Save';
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  IconButton,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {useState} from 'react';

const EndFlow = ({
  shape,
  handleCloseDrawer,
  openVariableManager,
  openUserGuide,
  userVariables,
}) => {
  const [type, setType] = useState(shape.userValues?.type ?? 'disconnect');
  const [transferPoint, setTransferPoint] = useState(
    shape.userValues?.transferPoint ?? ''
  );
  const [errorMessage, setErrorMessage] = useState('');

  function handleSave() {
    const validationError = checkValidVariable(transferPoint, 'String');
    if (validationError === -1) {
      shape.setUserValues({
        type,
        transferPoint,
      });
    } else {
      setErrorMessage(validationError);
    }
  }

  function getValidVariableNames(type, userVariables) {
    const variableType = 'string';
    const autoCompleteOptions = userVariables
      .filter((userVariable) => userVariable.type === variableType)
      .map((userVariable) => `$${userVariable.name}`);
    return autoCompleteOptions;
  }

  function filterOptions(options, {inputValue}) {
    if (inputValue.startsWith('$')) {
      return options.filter((option) =>
        option.toLowerCase().includes(inputValue.substring(1).toLowerCase())
      );
    }
    return [];
  }

  function checkValidVariable(value, type) {
    const validVariables = getValidVariableNames(type, userVariables);

    if (validVariables.includes(value) || value[0] !== '$') {
      return -1; // Indicates a valid variable
    }

    return `Not a valid ${type.toLowerCase()} variable.`;
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
            pl: 0.5,
            display: 'flex',
            alignItems: 'center',
            fontSize: 'extra-large',
            height: 40,
          }}
          variant='h5'>
          {
            <img
              src='/icons/endFlowBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp;End Flow
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
        <Stack sx={{mt: 4, px: 2}}>
          <Typography fontSize='large' variant='subtitle2'>
            Type
          </Typography>

          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <RadioGroup
              row
              name='radio-endflowType'
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                if (e.target.value === 'disconnect') {
                  setTransferPoint('');
                }
              }}>
              <FormControlLabel
                value='disconnect'
                control={<Radio />}
                label='Disconnect'
              />
              <FormControlLabel
                sx={{ml: 1}}
                value='transfer'
                control={<Radio />}
                label='Transfer'
              />
            </RadioGroup>
            <Button
              onClick={handleSave}
              sx={{ml: 2}}
              size='small'
              variant='contained'>
              <SaveIcon />
            </Button>
          </Box>

          {type === 'transfer' && (
            <Stack sx={{mt: 2}}>
              <Typography fontSize='1rem' variant='subtitle2'>
                Transfer Point
              </Typography>
              <Autocomplete
                options={getValidVariableNames('String', userVariables)}
                freeSolo
                value={transferPoint}
                filterOptions={filterOptions}
                onInputChange={(event, newInputValue) => {
                  setTransferPoint(newInputValue);
                  const error = checkValidVariable(newInputValue, 'String');
                  if (error === -1 || newInputValue === '') {
                    setErrorMessage('');
                  } else {
                    setErrorMessage(error);
                  }
                }}
                onChange={(event, newValue) => {
                  setTransferPoint(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!errorMessage}
                    helperText={errorMessage}
                    name='String'
                    sx={{mr: 3, backgroundColor: '#f5f5f5'}}
                    size='small'
                  />
                )}
              />
            </Stack>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default EndFlow;
