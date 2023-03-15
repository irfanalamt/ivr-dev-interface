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
  Stack,
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

const GetDigits = ({
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
  const [messageList, setMessageList] = useState(
    shape.userValues?.messageList ?? []
  );
  const [resultName, setResultName] = useState(
    shape.userValues?.variableName ?? ''
  );
  const [minDigits, setMinDigits] = useState(
    shape.userValues?.params.minDigits ?? 1
  );
  const [maxDigits, setMaxDigits] = useState(
    shape.userValues?.params.maxDigits ?? 20
  );

  const errors = useRef({});

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
    let validMessages = [];
    for (const message of messageList) {
      if (message.error) {
        break;
      }
      validMessages.push(message);
    }
    shape.setUserValues({
      messageList: validMessages,
      variableName: resultName,
      params: {minDigits, maxDigits},
    });

    if (validMessages.length < messageList.length) {
      setSuccessText('');
      setErrorText('Save failed. Message list error.');
    } else {
      setErrorText('');
      setSuccessText('Saved.');
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
              src='/icons/getDigitsBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp;Get Digits
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
              onClick={handleSave}
              sx={{ml: 2}}
              size='small'
              variant='contained'>
              <SaveIcon />
            </Button>
          </ListItem>
          <Stack sx={{pl: 2, py: 1}}>
            <Typography variant='subtitle2'>Result Variable</Typography>
            <Select
              value={resultName}
              sx={{width: '220px', backgroundColor: '#f5f5f5'}}
              onChange={(e) => setResultName(e.target.value)}
              size='small'>
              {userVariables.current
                .filter((v) => v.type === 'number')
                .map((v, i) => (
                  <MenuItem value={`$${v.name}`} key={i}>
                    {v.name}
                  </MenuItem>
                ))}
            </Select>
          </Stack>
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
                minDigits:
              </Typography>
              <Select
                value={minDigits}
                sx={{backgroundColor: '#ededed'}}
                onChange={(e) => {
                  setMinDigits(e.target.value);
                }}
                size='small'>
                {[...Array(21).keys()].slice(1).map((el, i) => (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                ))}
              </Select>
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
                maxDigits:
              </Typography>
              <Select
                value={maxDigits}
                sx={{backgroundColor: '#ededed'}}
                onChange={(e) => {
                  setMaxDigits(e.target.value);
                }}
                size='small'>
                {[...Array(21).keys()].slice(1).map((el, i) => (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                ))}
              </Select>
            </ListItem>
          </List>
        )}
        {tabValue === 2 && <LogDrawer />}
      </Box>
    </>
  );
};

export default GetDigits;
