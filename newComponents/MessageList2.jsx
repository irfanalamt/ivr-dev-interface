import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {useState} from 'react';
import {checkValidity} from '../src/helpers';

const MessageList = ({
  updateMessageList,
  userVariables,
  currentMessageList,
}) => {
  const [currentType, setCurrentType] = useState('Prompt');

  const [messageList, setMessageList] = useState(currentMessageList ?? []);

  const messageListTypes = [
    'Prompt',
    'Number',
    'Ordinal',
    'Amount',
    'Digit',
    'Date',
    'Day',
    'Month',
    'Time',
  ];
  const DayValues = [
    '1 Sunday',
    '2 Monday',
    '3 Tuesday',
    '4 Wednesday',
    '5 Thursday',
    '6 Friday',
    '7 Saturday',
  ];

  const MonthValues = [
    '01 January',
    '02 February',
    '03 March',
    '04 April',
    '05 May',
    '06 June',
    '07 July',
    '08 August',
    '09 September',
    '10 October',
    '11 November',
    '12 December',
  ];

  function handleAddNewMessage() {
    setMessageList((prev) => [...prev, {type: currentType, item: ''}]);
    setCurrentType('');
    console.log('🧠', currentType);
  }

  function handleDeleteMessage(index) {
    const newMessages = [...messageList];
    newMessages.splice(index, 1);
    setMessageList(newMessages);
  }

  function handleFieldChangeSwitch(e, index) {
    const {checked} = e.target;

    console.log('checked🔥', checked);

    const newMessages = [...messageList];
    newMessages[index].useVariable = checked;
    setMessageList(newMessages);
  }
  function handleFieldChange(e, index) {
    const {value, name} = e.target;
    let errorM = -1;
    errorM = checkValidity(name.toLowerCase(), value);
    const newMessages = [...messageList];
    newMessages[index].item = value;
    if (errorM != -1) {
      newMessages[index].error = errorM;
    } else {
      newMessages[index].error = undefined;
    }
    setMessageList(newMessages);
  }

  function handleNamedFieldChangeSwitch(e, index) {
    const {checked, name} = e.target;

    console.log('this ⏳ ', name, ' changed', checked);
  }

  function handleNamedFieldChange(e, index) {
    const {value, name} = e.target;

    console.log('this ⏳ ', name, ' changed', value);
  }

  function handleSaveMessageList() {
    const validMessages = messageList.filter((m) => !m.error);

    updateMessageList(validMessages);
  }
  return (
    <List sx={{backgroundColor: '#eeeeee'}}>
      <ListItem sx={{mb: 1}}>
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
          <Typography variant='subtitle1'>Type</Typography>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Select
              labelId='select-label'
              value={currentType}
              onChange={(e) => setCurrentType(e.target.value)}
              sx={{
                minWidth: 150,
                backgroundColor: '#f5f5f5',
              }}
              size='small'>
              {messageListTypes.map((type, i) => (
                <MenuItem value={type} key={i}>
                  {type}
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
              onClick={handleAddNewMessage}
              disabled={!currentType}
              variant='contained'>
              Add
            </Button>
          </Box>
        </Box>
      </ListItem>
      <List>
        {messageList.map((m, i) => (
          <ListItem
            sx={{
              borderTop: i === 0 && '1px solid #bdbdbd',
              borderBottom: '1px solid #bdbdbd',
              pb: 2,
            }}
            key={i}>
            <Stack sx={{width: '100%'}}>
              <Box sx={{display: 'flex'}}>
                <Typography fontSize='16px' variant='subtitle2'>
                  {m.type}
                </Typography>
                <Typography
                  sx={{
                    color: 'red',
                    ml: 2,
                    px: 2,
                    width: 'max-content',
                  }}
                  variant='subtitle2'>
                  {m.error}
                </Typography>
              </Box>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                {m.useVariable ? (
                  <Select value='' sx={{minWidth: 150, mr: 3}} size='small' />
                ) : (
                  m.type !== 'Month' &&
                  m.type !== 'Day' && (
                    <TextField
                      name={m.type}
                      sx={{mr: 3, width: m.type !== 'Prompt' ? 150 : undefined}}
                      size='small'
                      value={m.item}
                      onChange={(e) => handleFieldChange(e, i)}
                      fullWidth={m.type === 'Prompt'}
                    />
                  )
                )}
                {m.type === 'Month' && !m.useVariable && (
                  <Select
                    name={m.type}
                    value={m.item ?? ''}
                    onChange={(e) => handleFieldChange(e, i)}
                    sx={{mr: 3, width: 150}}
                    size='small'>
                    {MonthValues.map((m, i) => (
                      <MenuItem value={m} key={i}>
                        {m}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                {m.type === 'Day' && !m.useVariable && (
                  <Select
                    name={m.type}
                    value={m.item ?? ''}
                    onChange={(e) => handleFieldChange(e, i)}
                    sx={{mr: 3, width: 150}}
                    size='small'>
                    {DayValues.map((m, i) => (
                      <MenuItem value={m} key={i}>
                        {m}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                {m.type === 'Amount' && (
                  <TextField
                    name='currency'
                    placeholder='currency'
                    sx={{width: 100}}
                    size='small'
                    value={m.currency}
                    onChange={(e) => handleNamedFieldChange(e, i)}
                  />
                )}
                {m.type === 'Date' && (
                  <FormControlLabel
                    control={
                      <Switch
                        name='playYear'
                        checked={m.playYear}
                        onChange={(e) => handleNamedFieldChangeSwitch(e, i)}
                        size='small'
                        color='primary'
                      />
                    }
                    label='playYear'
                    labelPlacement='end'
                  />
                )}
                {m.type === 'Month' && (
                  <FormControlLabel
                    control={
                      <Switch
                        name='isHijri'
                        checked={m.isHijri}
                        onChange={(e) => handleNamedFieldChangeSwitch(e, i)}
                        size='small'
                        color='primary'
                      />
                    }
                    label='isHijri'
                    labelPlacement='end'
                  />
                )}
                {m.type === 'Time' && (
                  <FormControlLabel
                    control={
                      <Switch
                        name='is24'
                        checked={m.is24}
                        onChange={(e) => handleNamedFieldChangeSwitch(e, i)}
                        size='small'
                        color='primary'
                      />
                    }
                    label='is24'
                    labelPlacement='end'
                  />
                )}
                <Button
                  sx={{
                    ml: 'auto',
                  }}
                  size='small'
                  variant='contained'
                  onClick={handleSaveMessageList}>
                  <SaveIcon />
                </Button>
              </Box>
              <Box sx={{mt: 1, display: 'flex', alignItems: 'center'}}>
                <FormControlLabel
                  value='end'
                  control={
                    <Switch
                      onChange={(e) => handleFieldChangeSwitch(e, i)}
                      checked={m.useVariable ?? false}
                      color='primary'
                    />
                  }
                  label={<span style={{fontSize: 14}}>Use Variable</span>}
                  labelPlacement='end'
                />

                <IconButton
                  color='error'
                  onClick={() => handleDeleteMessage(i)}
                  sx={{
                    ml: 'auto',
                    mr: 1.5,
                    backgroundColor: '#e0e0e0',
                    '&:hover': {backgroundColor: '#c7c1bd'},
                  }}>
                  <DeleteIcon sx={{color: '#424242'}} />
                </IconButton>
              </Box>
            </Stack>
          </ListItem>
        ))}
      </List>
    </List>
  );
};

export default MessageList;
