import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import DeleteIcon from '@mui/icons-material/Delete';
import defaultParams from '../src/defaultParams';
import {useEffect, useRef, useState} from 'react';
import {isNameUnique} from '../src/myFunctions';
import {checkValidity} from '../src/helpers';
import DrawerUserGuideDialog from '../components/DrawerUserGuideDialog';

const SetParams = ({
  shape,
  handleCloseDrawer,
  shapes,
  clearAndDraw,
  userVariables,
  openVariableManager,
}) => {
  const [name, setName] = useState(shape.text);
  const [selectedParameterIndex, setSelectedParameterIndex] = useState('');
  const [currentParameter, setCurrentParameter] = useState({});
  const [modifiedParameters, setModifiedParameters] = useState(
    shape.userValues?.params ?? []
  );
  const [successText, setSuccessText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [openGuideDialog, setOpenGuideDialog] = useState(false);

  const errors = useRef({});

  useEffect(() => {
    shape.setUserValues({
      params: modifiedParameters,
    });
    generateJS();
  }, [modifiedParameters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSuccessText('');
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [successText]);

  function handleSaveName() {
    if (errors.current.name) {
      setErrorText('Id not valid.');
      return;
    }
    shape.setText(name);
    clearAndDraw();
    setErrorText('');
    setSuccessText('ID Updated.');
    generateJS();
  }

  function generateJS() {
    const functionName = name ? name : `setParams${shape.id}`;

    const codeModifiedParameters = modifiedParameters
      .map(({name, value}) => `${name}: ${JSON.stringify(value)}`)
      .join(', ');

    const codeString = `this.${functionName} = async function() {
      const newParams = { ${codeModifiedParameters} };
      await IVR.setCallParams('${functionName}', newParams);
    };`;

    console.log('codeString☄️', codeString);

    shape.setFunctionString(codeString);
  }

  function handleSelectedParameterIndexChange(e) {
    setSelectedParameterIndex(e.target.value);

    const currentParam = {...defaultParams[e.target.value]};
    const duplicate = modifiedParameters.find(
      (p) => p.name === currentParam.name
    );

    if (duplicate) {
      currentParam.value = duplicate.value;
    }

    setCurrentParameter(currentParam);
    setErrorText('');
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

  function handleFieldChange(e) {
    const {value} = e.target;

    setCurrentParameter({...currentParameter, value});
    if (!currentParameter.type) {
      if (value[0] === '$' && value.length > 1) {
        validateVariableInput(value);
      } else {
        const valid = validateUserInput(value);

        if (valid) setErrorText(valid);
        else setErrorText('');
      }
    }
  }
  function handleFieldChangeSwitch(e) {
    setCurrentParameter({...currentParameter, value: e.target.checked});
  }

  function handleAddModifiedParameter() {
    if (errors.current[currentParameter.name]) {
      setErrorText('Cannot Save.');
      return;
    }

    const index = modifiedParameters.findIndex(
      (param) => param.name === currentParameter.name
    );
    if (index !== -1) {
      const updatedParameters = [...modifiedParameters];
      updatedParameters[index] = {
        name: currentParameter.name,
        value: currentParameter.value,
      };
      setModifiedParameters(updatedParameters);
    } else {
      setModifiedParameters([
        ...modifiedParameters,
        {name: currentParameter.name, value: currentParameter.value},
      ]);
    }
    setErrorText('');
    setSuccessText('Parameter Updated.');
  }

  function handleDeleteModifiedParameter(index) {
    setModifiedParameters((p) => {
      const temp = [...p];
      temp.splice(index, 1);
      return temp;
    });
    setErrorText('');
    setSuccessText('Deleted.');
  }

  function validateUserInput(input) {
    switch (currentParameter.name) {
      case 'menuTimeout':
      case 'interTimeout':
      case 'firstTimeout': {
        errors.current[currentParameter.name] = true;
        const numberRegex = /^[0-9]+$/;
        if (!input || !input.match(numberRegex))
          return 'Enter a valid number between 3 and 30';
        else if (Number(input) < 3) {
          return 'Input too small';
        } else if (Number(input) > 30) {
          return 'Input too big';
        } else {
          errors.current[currentParameter.name] = undefined;
          return false;
        }
      }
      case 'maxCallTime': {
        errors.current[currentParameter.name] = true;
        const numberRegex = /^[0-9]+$/;
        if (!input || !input.match(numberRegex)) return 'Enter a valid number.';
        else if (Number(input) < 60) {
          return 'Input too small';
        } else if (Number(input) > 9999) {
          return 'Input too big';
        } else {
          errors.current[currentParameter.name] = undefined;
          return false;
        }
      }
      case 'timeoutPrompt':
      case 'cancelPrompt':
      case 'goodbyeMessage':
      case 'terminateMessage':
      case 'transferPrompt':
      case 'disconnectPrompt':
      case 'previousMenuPrompt':
      case 'mainMenuPrompt':
      case 'repeatInfoPrompt':
      case 'confirmPrompt':
      case 'invalidPrompt': {
        errors.current[currentParameter.name] = true;
        const promptRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
        if (!input || !input.match(promptRegex))
          return 'Prompt not in valid format.';
        else {
          errors.current[currentParameter.name] = undefined;
          return false;
        }
      }
      case 'allowedDigits': {
        errors.current[currentParameter.name] = true;
        const numberRegex = /^[0-9#*]+$/;
        if (!input || !input.match(numberRegex)) return 'Enter a valid number.';
        else {
          errors.current[currentParameter.name] = undefined;
          return false;
        }
      }
      default:
        errors.current[currentParameter.name] = undefined;
        return false;
    }
  }

  function validateVariableInput(input) {
    const inputWithoutDollar = input.slice(1);
    const isValidName = userVariables.some(
      (variable) => variable.name === inputWithoutDollar
    );

    if (isValidName) {
      setErrorText('');
      setSuccessText(`${inputWithoutDollar} is a valid variable.`);
      errors.current[currentParameter.name] = undefined;
    } else {
      setErrorText(`${inputWithoutDollar} is not a valid variable.`);
      errors.current[currentParameter.name] = true;
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
              src='/icons/setParamsBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp;Set Params
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
              sx={{minWidth: '220px', backgroundColor: '#f5f5f5'}}
              size='small'
              error={errors.current.name}
            />
            <Button
              onClick={handleSaveName}
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
        </Box>

        <Divider />
        <List sx={{minWidth: 350}}>
          <ListItem>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <Typography fontSize='large' variant='subtitle1'>
                Parameters
              </Typography>
              <Select
                value={selectedParameterIndex}
                onChange={handleSelectedParameterIndexChange}
                labelId='paramteter-label'
                sx={{minWidth: '220px', backgroundColor: '#f5f5f5'}}
                size='small'>
                {defaultParams.map((p, i) => (
                  <MenuItem value={i} key={i}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </ListItem>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              pt: 2,
              my: 1,
            }}>
            {currentParameter.name ? (
              <>
                <Typography sx={{ml: 2, mb: -1}} variant='body1'>
                  {currentParameter.name}
                </Typography>
                <ListItem>
                  {currentParameter.type === 'select' && (
                    <Select
                      sx={{minWidth: '220px', backgroundColor: '#f5f5f5'}}
                      size='small'
                      value={currentParameter.value}
                      onChange={handleFieldChange}>
                      {currentParameter.optionList?.map((p, i) => (
                        <MenuItem value={p} key={i}>
                          {p}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  {!currentParameter.type && (
                    <TextField
                      sx={{minWidth: '220px', backgroundColor: '#f5f5f5'}}
                      size='small'
                      name='name'
                      value={currentParameter.value}
                      onChange={handleFieldChange}
                      error={errors.current[currentParameter.name]}
                    />
                  )}
                  {currentParameter.type === 'switch' && (
                    <Box sx={{width: '220px'}}>
                      <Switch
                        onChange={handleFieldChangeSwitch}
                        checked={currentParameter.value}
                      />
                    </Box>
                  )}

                  <Button
                    onClick={handleAddModifiedParameter}
                    sx={{ml: 2}}
                    size='small'
                    variant='contained'>
                    <SaveIcon />
                  </Button>
                </ListItem>
              </>
            ) : (
              <>
                <Typography sx={{ml: 2, mb: -1}} variant='body1'>
                  &nbsp;
                </Typography>
                <ListItem>
                  <Select
                    sx={{minWidth: '220px'}}
                    size='small'
                    value={''}
                    disabled
                  />
                  <Button
                    onClick={handleAddModifiedParameter}
                    sx={{ml: 2}}
                    size='small'
                    variant='contained'
                    disabled>
                    <SaveIcon />
                  </Button>
                </ListItem>
              </>
            )}
          </Box>
        </List>
        <Divider sx={{mb: 1}} />
        <List>
          {modifiedParameters.map((p, i) => (
            <ListItem
              disablePadding
              sx={{
                backgroundColor: i % 2 == 0 ? '#e0e0e0' : '#eeeeee',
                px: 2,
                py: 0.5,
                borderTop: i === 0 && '1px solid #bdbdbd',
                borderBottom: '1px solid #bdbdbd',
              }}
              key={i}>
              <Typography sx={{width: '40%'}} variant='subtitle2'>
                {p.name}
              </Typography>

              <Typography
                sx={{
                  ml: 2,
                }}>
                {typeof p.value === 'boolean' ? `${p.value}` : p.value}
              </Typography>

              <Button
                onClick={() => handleDeleteModifiedParameter(i)}
                sx={{ml: 'auto'}}
                color='error'>
                <DeleteIcon sx={{color: '#424242'}} />
              </Button>
            </ListItem>
          ))}
        </List>
        <DrawerUserGuideDialog
          open={openGuideDialog}
          handleClose={() => setOpenGuideDialog(false)}
          name={shape.type}
        />
      </Box>
    </>
  );
};

export default SetParams;
