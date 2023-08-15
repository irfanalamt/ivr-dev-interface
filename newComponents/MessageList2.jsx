import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {useState} from 'react';
import {checkValidity} from '../src/helpers';

const MessageList = ({userVariables, messageList, setMessageList}) => {
  const [currentType, setCurrentType] = useState('Prompt');

  const messageListTypes = [
    'Prompt',
    'Number',
    'Ordinal',
    'Amount',
    'Digits',
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
    setMessageList((prev) => [
      ...prev,
      {type: currentType, item: '', error: 'required'},
    ]);
    setCurrentType('');
  }

  function handleDeleteMessage(index) {
    const newMessages = [...messageList];
    newMessages.splice(index, 1);
    setMessageList(newMessages);
  }

  function handleFieldChangeSwitch(e, index) {
    const {checked} = e.target;

    const newMessages = [...messageList];
    newMessages[index].useVariable = checked;
    newMessages[index].item = '';
    newMessages[index].error = 'required';
    setMessageList(newMessages);
  }
  function handleFieldChange(e, index) {
    const {value, name} = e.target;

    const newMessages = [...messageList];
    newMessages[index].item = value;
    if (value && newMessages[index].error === 'required') {
      newMessages[index].error = undefined;
    }
    if (name) {
      let errorM = -1;
      errorM = checkValidity(name.toLowerCase(), value);
      if (errorM != -1) {
        newMessages[index].error = errorM;
      } else {
        newMessages[index].error = undefined;
      }
    }

    setMessageList(newMessages);
  }

  function handleNamedFieldChangeSwitch(e, index) {
    const {checked, name} = e.target;

    const newMessages = [...messageList];
    newMessages[index][name] = checked;

    setMessageList(newMessages);
  }

  function handleNamedFieldChange(e, index) {
    const {value, name} = e.target;

    const newMessages = [...messageList];
    newMessages[index][name] = value;
    setMessageList(newMessages);
  }

  function renderVariableOptions(type) {
    const variableTypes = {
      Prompt: 'prompt',
      Number: 'number',
      Ordinal: 'number',
      Amount: 'number',
      Digits: 'number',
      Date: 'date',
      Day: 'day',
      Month: 'month',
      Time: 'time',
    };

    const variableType = variableTypes[type];

    return userVariables
      .filter((v) => v.type === variableType)
      .map((v, i) => (
        <MenuItem value={`$${v.name}`} key={i}>
          {v.name}
        </MenuItem>
      ));
  }

  function getTextFieldPlaceholderValue(type) {
    if (type === 'Date') {
      return 'yyyymmdd';
    } else if (type === 'Time') {
      return 'hhmm';
    } else return '';
  }

  function handleAddMessageBelow(index) {
    const newMessages = [...messageList];
    newMessages.splice(index + 1, 0, {
      type: 'Prompt',
      item: '',
      error: 'required',
    });
    setMessageList(newMessages);
  }

  function handleMessageTypeChange(e, index) {
    const newMessages = [...messageList];
    newMessages[index].type = e.target.value;
    newMessages[index].item = '';
    newMessages[index].useVariable = false;
    newMessages[index].error = 'required';
    setMessageList(newMessages);
  }

  return (
    <List sx={{backgroundColor: '#eeeeee', padding: '1rem'}}>
      {messageList.map((m, i) => (
        <ListItem
          sx={{
            borderBottom: '1px solid #bdbdbd',
            pb: 2,
            my: 2,
            px: 1,
          }}
          key={i}>
          <Stack spacing={2} sx={{width: '100%'}}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}>
              <Stack direction='column'>
                <Typography sx={{fontSize: '0.85rem'}} variant='subtitle1'>
                  Type
                </Typography>
                <Stack direction='row' alignItems='center'>
                  <Select
                    value={m.type}
                    onChange={(e) => handleMessageTypeChange(e, i)}
                    sx={{
                      minWidth: 100,
                      backgroundColor: '#f5f5f5',
                      padding: '4px 8px',
                      fontSize: '0.95rem',
                      '& .MuiSelect-icon': {
                        width: '1.5rem',
                        height: '1.5rem',
                      },
                      '& .MuiSelect-select.MuiSelect-select': {
                        padding: '4px 24px 4px 8px',
                      },
                    }}
                    size='small'>
                    {messageListTypes.map((type, idx) => (
                      <MenuItem value={type} key={idx}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography
                    sx={{
                      color: 'red',
                      pl: 2,
                    }}
                    variant='subtitle2'>
                    {m.error}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
              }}>
              {m.useVariable ? (
                <Select
                  value={m.useVariable ? m.item : ''}
                  onChange={(e) => handleFieldChange(e, i)}
                  sx={{minWidth: 150, mr: 3, backgroundColor: '#f5f5f5'}}
                  size='small'>
                  {renderVariableOptions(m.type)}
                </Select>
              ) : (
                m.type !== 'Month' &&
                m.type !== 'Day' && (
                  <TextField
                    name={m.type}
                    sx={{
                      mr: 3,
                      width: m.type !== 'Prompt' ? 150 : undefined,
                      backgroundColor: '#f5f5f5',
                    }}
                    placeholder={getTextFieldPlaceholderValue(m.type)}
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
                  sx={{mr: 3, width: 150, backgroundColor: '#f5f5f5'}}
                  size='small'>
                  {MonthValues.map((m, i) => (
                    <MenuItem value={i + 1} key={i}>
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
                  sx={{mr: 3, width: 150, backgroundColor: '#f5f5f5'}}
                  size='small'>
                  {DayValues.map((m, i) => (
                    <MenuItem value={i + 1} key={i}>
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
                <Stack>
                  <FormControlLabel
                    control={
                      <Switch
                        name='playYear'
                        checked={m.playYear ?? false}
                        onChange={(e) => handleNamedFieldChangeSwitch(e, i)}
                        size='small'
                        color='primary'
                      />
                    }
                    label='playYear'
                    labelPlacement='end'
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        sx={{mt: 0.5}}
                        name='playDay'
                        checked={m.playDay ?? false}
                        onChange={(e) => handleNamedFieldChangeSwitch(e, i)}
                        size='small'
                        color='primary'
                      />
                    }
                    label='playDay'
                    labelPlacement='end'
                  />
                </Stack>
              )}
              {m.type === 'Month' && (
                <FormControlLabel
                  control={
                    <Switch
                      name='isHijri'
                      checked={m.isHijri ?? false}
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
                      checked={m.is24 ?? false}
                      onChange={(e) => handleNamedFieldChangeSwitch(e, i)}
                      size='small'
                      color='primary'
                    />
                  }
                  label='is24'
                  labelPlacement='end'
                />
              )}
            </Box>
            <Box
              sx={{
                mt: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
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
              <Box>
                <Tooltip title='Add Message Below' enterDelay={500}>
                  <IconButton
                    size='small'
                    sx={{
                      backgroundColor: '#e0e0e0',
                      '&:hover': {backgroundColor: '#c1d5c1'},
                    }}
                    onClick={() => handleAddMessageBelow(i)}
                    variant='contained'>
                    <AddIcon sx={{color: '#424242'}} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Delete Message' enterDelay={500}>
                  <IconButton
                    color='error'
                    size='small'
                    onClick={() => handleDeleteMessage(i)}
                    sx={{
                      mx: 1.5,
                      backgroundColor: '#e0e0e0',
                      '&:hover': {
                        backgroundColor: '#d5c1c1',
                      },
                    }}>
                    <DeleteIcon sx={{color: '#424242'}} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Stack>
        </ListItem>
      ))}
      {messageList.length === 0 && (
        <Stack
          sx={{
            padding: '1rem',
            backgroundColor: '#e0e0e0',
            borderRadius: '0.5rem',
          }}>
          <Typography variant='subtitle1'>Type</Typography>
          <Box sx={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
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
        </Stack>
      )}
    </List>
  );
};

export default MessageList;
