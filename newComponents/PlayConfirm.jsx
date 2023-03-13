import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Select,
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

const PlayConfirm = ({
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
    shape.setUserValues({messageList});
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
              src='/icons/playConfirmBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp;Play Confirm
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
              sx={{minWidth: '220px'}}
              size='small'
              error={errors.current.name}
              onChange={handleNameChange}
              value={name}
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
                confirmOption:
              </Typography>
              <Select sx={{width: 50}} size='small'></Select>
            </ListItem>
            <ListItem
              sx={{
                py: 2,
                backgroundColor: '#e6e6e6',
                borderTop: '1px solid #bdbdbd',
              }}>
              <Typography
                sx={{width: '40%'}}
                fontSize='large'
                variant='subtitle2'>
                cancelOption:
              </Typography>
              <Select sx={{width: 50}} size='small'></Select>
            </ListItem>
            <ListItem
              sx={{
                py: 2,
                backgroundColor: '#e6e6e6',
                borderTop: '1px solid #bdbdbd',
              }}>
              <Typography
                sx={{width: '40%'}}
                fontSize='large'
                variant='subtitle2'>
                confirmPrompt:
              </Typography>
              <TextField sx={{ml: 1}} size='small' />
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
                cancelPrompt:
              </Typography>
              <TextField sx={{ml: 1}} size='small' />
            </ListItem>
          </List>
        )}
        {tabValue === 2 && <LogDrawer />}
      </Box>
    </>
  );
};

export default PlayConfirm;
