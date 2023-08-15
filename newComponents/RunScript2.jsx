import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  IconButton,
  ListItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import {checkValidity} from '../src/helpers';
import {isNameUnique} from '../src/myFunctions';
import SaveChangesDialog from './SaveChangesDialog';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

const RunScript = ({
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
  const [functionString, setFunctionString] = useState(
    shape.userValues?.script || ''
  );
  const [isFunctionError, setIsFunctionError] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const errors = useRef({});

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSuccessText('');
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [successText]);

  function handleSave() {
    if (errors.current.name) {
      setErrorText('Id not valid');
      return;
    }
    shape.setText(name);
    clearAndDraw();

    if (isFunctionError) {
      setSuccessText('');
      setErrorText('Save failed. Script not valid.');
    } else {
      setErrorText('');
      setSuccessText('Saved.');
      shape.setUserValues({script: functionString});
      if (functionString.length > 1) {
        shape.isComplete = true;
      } else {
        shape.isComplete = false;
      }
    }
  }

  function handleSaveAndClose() {
    if (!shape.userValues) {
      const expectedString = JSON.stringify({
        script: functionString,
      });

      if (expectedString.length === 13) {
        handleCloseDrawer();
      } else {
        setShowDialog(true);
      }
      return;
    }

    const shapeString = JSON.stringify({
      script: shape.userValues.script,
    });

    const expectedString = JSON.stringify({
      script: functionString,
    });

    if (shapeString === expectedString) {
      handleCloseDrawer();
    } else {
      setShowDialog(true);
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
      setErrorText('Id not unique');
      errors.current.name = true;
    } else {
      setErrorText('');
      errors.current.name = undefined;
    }
  }
  function getUserVariablesString() {
    const variables = userVariables
      .map(({name, defaultValue}) => `let $${name} = '${defaultValue}';`)
      .join(' ');

    return variables || '';
  }

  function getLogCode() {
    return `
  class log {
    static trace(message) {}
    static info(message) {}
    static error(message) {}
  }`;
  }

  function validateFunctionString(script) {
    const variablesCode = getUserVariablesString();
    const logCode = getLogCode();
    const bottomCode = script;

    try {
      eval(variablesCode + logCode + bottomCode);
    } catch (error) {
      setIsFunctionError(true);
      setSuccessText('');
      setErrorText(error.message);
      return false;
    }
    setIsFunctionError(false);
    setErrorText('');
    setSuccessText('script valid');

    return true;
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
              src='/icons/runScriptBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp;Run Script
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
        <Stack>
          <Typography sx={{ml: 2, mt: 1}} fontSize='large' variant='subtitle2'>
            ID
          </Typography>
          <ListItem sx={{mt: -1, mb: 1}}>
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
        <ListItem sx={{px: 3, py: 1, position: 'relative'}}>
          <TextField
            sx={{
              fontFamily: 'monospace',
              backgroundColor: isFunctionError ? '#ffebee' : '#f5f5f5',
              width: isExpanded ? '80vw' : '100%',
              height: '100%',
              boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
              transition: 'width 0.3s ease, height 0.3s ease',
            }}
            placeholder='Enter JavaScript code here'
            multiline
            minRows={20}
            fullWidth
            inputProps={{spellCheck: 'false'}}
            value={functionString}
            onChange={(e) => {
              setFunctionString(e.target.value);
              validateFunctionString(e.target.value);
            }}
          />
          <Tooltip
            title={isExpanded ? 'Exit Full Screen' : 'Enter Full Screen'}>
            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              size='small'
              sx={{
                position: 'absolute',
                top: 15,
                right: 30,
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.8)',
                },
              }}>
              {isExpanded ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
        </ListItem>
      </Box>
      <SaveChangesDialog
        open={showDialog}
        handleSave={handleSave}
        handleClose={() => {
          setShowDialog(false);
          handleCloseDrawer();
        }}
      />
    </>
  );
};

export default RunScript;
