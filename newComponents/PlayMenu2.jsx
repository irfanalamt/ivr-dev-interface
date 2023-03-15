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
import {isNameUnique} from '../src/myFunctions';

const PlayMenu = ({
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

  const errors = useRef({});

  const optionalParamList = [
    'invalidAction',
    'timeoutAction',
    'invalidPrompt',
    'timeoutPrompt',
    'maxRetries',
    'interruptible',
    'transferPoint',
    'menuTimeout',
  ];

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
              src='/icons/playMenuBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp;Play Menu
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
              //   onClick={handleSave}
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
        <Tabs
          sx={{backgroundColor: '#e0e0e0'}}
          value={tabValue}
          onChange={handleTabChange}
          centered>
          <Tab label='General' />
          <Tab label='Items' />
        </Tabs>
        {tabValue === 0 && (
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
                desc:
              </Typography>
              <TextField
                sx={{backgroundColor: '#ededed', ml: 1}}
                size='small'
              />
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
                previousMenuId:
              </Typography>
              <TextField
                sx={{backgroundColor: '#ededed', ml: 1}}
                size='small'
              />
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
                ignoreBuffer:
              </Typography>
              <Switch sx={{ml: 1}} />
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
                logDb:
              </Typography>
              <Switch sx={{ml: 1}} />
            </ListItem>
            <Stack sx={{pl: 2, py: 2, mt: 2, mb: 1}}>
              <Typography>Optional Params</Typography>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Select
                  labelId='select-label'
                  sx={{
                    minWidth: 150,
                    backgroundColor: '#f5f5f5',
                  }}
                  size='small'>
                  {optionalParamList.map((p, i) => (
                    <MenuItem key={i}>{p}</MenuItem>
                  ))}
                </Select>
                <Button
                  sx={{
                    ml: 2,
                    backgroundColor: '#bdbdbd',
                    color: 'black',
                    '&:hover': {backgroundColor: '#9ccc65'},
                  }}
                  variant='contained'>
                  Add
                </Button>
              </Box>
            </Stack>
          </List>
        )}
        {tabValue === 1 && (
          <List>
            <Stack sx={{pl: 2, py: 2, mb: 2}}>
              <Typography>Digits</Typography>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Select
                  labelId='select-label'
                  defaultValue='1'
                  sx={{
                    minWidth: 150,
                    backgroundColor: '#f5f5f5',
                  }}
                  size='small'>
                  <MenuItem value='1'>1</MenuItem>
                  <MenuItem value='2'>2</MenuItem>
                  <MenuItem value='3'>3</MenuItem>
                  <MenuItem value='4'>4</MenuItem>
                  <MenuItem value='5'>5</MenuItem>
                  <MenuItem value='6'>6</MenuItem>
                  <MenuItem value='7'>7</MenuItem>
                  <MenuItem value='8'>8</MenuItem>
                  <MenuItem value='9'>9</MenuItem>
                  <MenuItem value='0'>0</MenuItem>
                  <MenuItem value='*'>*</MenuItem>
                  <MenuItem value='#'>#</MenuItem>
                </Select>
                <Button
                  sx={{
                    ml: 2,
                    backgroundColor: '#bdbdbd',
                    color: 'black',
                    '&:hover': {backgroundColor: '#9ccc65'},
                  }}
                  variant='contained'>
                  Add
                </Button>
              </Box>
            </Stack>
            <Divider />
          </List>
        )}
      </Box>
    </>
  );
};

export default PlayMenu;
