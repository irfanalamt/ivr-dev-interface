import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SaveIcon from '@mui/icons-material/Save';
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
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import {checkValidity} from '../src/helpers';
import {isNameUnique} from '../src/myFunctions';
import LogDrawer from './LogDrawer';
import MessageList from './MessageList2';

const PlayMessage = ({
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
  const [openGuideDialog, setOpenGuideDialog] = useState(false);
  const [messageList, setMessageList] = useState(
    shape.userValues?.messageList ?? []
  );

  const [interruptible, setInterruptible] = useState(
    shape.userValues?.params.interruptible ?? true
  );
  const [repeatOption, setRepeatOption] = useState(
    shape.userValues?.params.repeatOption || 'X'
  );

  const errors = useRef({});

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

    const validMessages = messageList.filter((m) => !m.error);
    shape.setUserValues({
      messageList: validMessages,
      params: {interruptible, repeatOption},
    });
    console.log('🔥🔥', messageList);
    shape.setText(name);
    clearAndDraw();
    setErrorText('');
    setSuccessText('Saved.');
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
              sx={{minWidth: '220px'}}
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
        <Tabs
          sx={{backgroundColor: '#e0e0e0'}}
          value={tabValue}
          onChange={handleTabChange}
          centered>
          <Tab label='Message List' />
          <Tab label='Parameters' />
          <Tab label='Log' />
        </Tabs>
        {tabValue === 0 && (
          <MessageList
            userVariables={userVariables}
            messageList={messageList}
            setMessageList={setMessageList}
          />
        )}
        {tabValue === 1 && (
          <List>
            <ListItem
              sx={{
                mt: 2,
                py: 2,
                backgroundColor: '#e6e6e6',
                borderTop: '1px solid #bdbdbd',
              }}>
              <Typography
                sx={{width: '40%'}}
                fontSize='large'
                variant='subtitle2'>
                interruptible:
              </Typography>
              <Switch
                checked={interruptible}
                onChange={(e) => {
                  setInterruptible(e.target.checked);
                }}
              />
            </ListItem>
            <ListItem
              sx={{
                py: 2,
                backgroundColor: '#e6e6e6',
                borderTop: '1px solid #bdbdbd',
                borderBottom: '1px solid #bdbdbd',
              }}>
              <Typography
                sx={{width: '40%'}}
                fontSize='large'
                variant='subtitle2'>
                repeatOption:
              </Typography>
              <Select
                size='small'
                value={repeatOption}
                onChange={(e) => {
                  setRepeatOption(e.target.value);
                }}>
                <MenuItem value='X'>X</MenuItem>
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
          </List>
        )}
        {tabValue === 2 && <LogDrawer />}
      </Box>
    </>
  );
};

export default PlayMessage;
