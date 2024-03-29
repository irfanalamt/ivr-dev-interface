import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import {
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
import {isNameUnique, replaceVarNameDollar} from '../src/myFunctions';
import LogDrawer from './LogDrawer';
import MessageList from './MessageList2';
import SaveChangesDialog from './SaveChangesDialog';

const PlayMessage = ({
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
  const [tabValue, setTabValue] = useState(0);
  const [openGuideDialog, setOpenGuideDialog] = useState(false);
  const [messageList, setMessageList] = useState(
    shape.userValues?.messageList ?? []
  );

  const [optionalParam, setOptionalParam] = useState('');
  const [addedOptionalParams, setAddedOptionalParams] = useState(
    shape.userValues?.optionalParams ?? []
  );
  const [logText, setLogText] = useState(
    shape.userValues?.logs ?? {
      before: {type: 'info', text: ''},
      after: {type: 'info', text: ''},
    }
  );
  const [showDialog, setShowDialog] = useState(false);

  const errors = useRef({});

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSuccessText('');
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [successText]);

  const optionalParamList = ['interruptible', 'repeatOption'];
  const optionalParamValues = {interruptible: true, repeatOption: ''};

  function handleSave() {
    if (errors.current.name) {
      setErrorText('Id not valid.');
      return;
    }
    shape.setText(name);
    clearAndDraw();

    let validMessages = [];
    for (const message of messageList) {
      if (message.error) {
        break;
      }
      validMessages.push(message);
    }

    shape.setUserValues({
      messageList,
      optionalParams: addedOptionalParams,
      logs: logText,
    });

    if (validMessages.length < messageList.length) {
      setSuccessText('');
      setErrorText('Save failed. Message list error.');
    } else {
      setErrorText('');
      setSuccessText('Saved.');
      if (messageList.length > 0) {
        shape.isComplete = true;
      } else {
        shape.isComplete = false;
      }
    }
  }
  function handleSaveAndClose() {
    if (!shape.userValues) {
      const expectedString = JSON.stringify({
        messageList,
        optionalParams: addedOptionalParams,
        logs: logText,
      });

      if (expectedString.length === 116) {
        handleCloseDrawer();
      } else {
        setShowDialog(true);
      }
      return;
    }

    const shapeString = JSON.stringify({
      messageList: shape.userValues.messageList,
      optionalParams: shape.userValues.optionalParams,
      logs: shape.userValues.logs,
    });

    const expectedString = JSON.stringify({
      messageList,
      optionalParams: addedOptionalParams,
      logs: logText,
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
      {name: optionalParam, value: optionalParamValues[optionalParam]},
    ];
    setAddedOptionalParams(updatedOptionalParams);
    setOptionalParam('');
  }
  function handleDeleteOptionalParam(index) {
    const currentOptionalParams = [...addedOptionalParams];
    currentOptionalParams.splice(index, 1);
    setAddedOptionalParams(currentOptionalParams);
  }

  function handleOptionalParamFieldChange(e, index) {
    const {value} = e.target;

    const currentOptionalParams = [...addedOptionalParams];
    currentOptionalParams[index].value = value;
    setAddedOptionalParams(currentOptionalParams);
  }
  function handleOptionalParamFieldChangeSwitch(e, index) {
    const {checked} = e.target;

    const currentOptionalParams = [...addedOptionalParams];
    currentOptionalParams[index].value = checked;
    setAddedOptionalParams(currentOptionalParams);
  }

  function renderComponentByType(param, index) {
    switch (param) {
      case 'interruptible':
        return (
          <Stack>
            <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
              interruptible
            </Typography>
            <Switch
              sx={{mt: -1}}
              checked={addedOptionalParams[index].value ?? true}
              onChange={(e) => handleOptionalParamFieldChangeSwitch(e, index)}
            />
          </Stack>
        );
      case 'repeatOption':
        return (
          <Stack>
            <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
              repeatOption
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
              <MenuItem value='#'>#</MenuItem>
              <MenuItem value='*'>*</MenuItem>
            </Select>
          </Stack>
        );

      default:
        return <Typography>{param}</Typography>;
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
              src='/icons/playMessageBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp;Play Message
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
          onClick={openUserGuide}
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
              <Typography
                fontSize='small'
                sx={{mt: -1, color: 'red', mx: 'auto'}}>
                {errorText}
              </Typography>
            )}
          </ListItem>
        </Box>
        <Divider />
        <Tabs
          sx={{backgroundColor: '#e0e0e0'}}
          value={tabValue}
          onChange={handleTabChange}
          centered>
          <Tab label='Message List' />
          <Tab label='Parameters' />
          <Tab label='Log' />
        </Tabs>
        <Divider />
        {tabValue === 0 && (
          <MessageList
            userVariables={userVariables}
            messageList={messageList}
            setMessageList={setMessageList}
          />
        )}
        {tabValue === 1 && (
          <List>
            <Stack sx={{px: 2, py: 1, mb: 1}}>
              <Typography>Optional Params</Typography>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Select
                  labelId='select-label'
                  value={optionalParam}
                  onChange={(e) => setOptionalParam(e.target.value)}
                  sx={{
                    minWidth: 150,
                    backgroundColor: '#f5f5f5',
                  }}
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
        {tabValue === 2 && (
          <LogDrawer logText={logText} setLogText={setLogText} />
        )}
        <SaveChangesDialog
          open={showDialog}
          handleSave={handleSave}
          handleClose={() => {
            setShowDialog(false);
            handleCloseDrawer();
          }}
        />
      </Box>
    </>
  );
};

export default PlayMessage;
