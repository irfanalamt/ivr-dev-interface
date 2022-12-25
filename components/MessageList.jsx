import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import {
  Divider,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';

const MessageList = ({ messageList, setMessageList, userVariables }) => {
  const [selectIndex, setSelectIndex] = useState(0);

  const messageListObjects = [
    'prompt',
    'number',
    'ordinal',
    'amount',
    'digit',
    'date',
    'day',
    'month',
    'time',
  ];
  const dayValues = [
    '01 Sunday',
    '02 Monday',
    '03 Tuesday',
    '04 Wednesday',
    '05 Thursday',
    '06 Friday',
    '07 Saturday',
  ];

  const monthValues = [
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

  useEffect(() => {
    console.log(JSON.stringify(messageList, null, 2));
  }, [messageList]);

  const handleAdd = () => {
    const objType = messageListObjects[selectIndex];

    setMessageList((m) => [...m, { type: objType, value: '' }]);
  };

  const handleRemove = () => {
    setMessageList((m) => {
      const temp = [...m];
      temp.splice(-1, 1);
      return temp;
    });
  };

  const handleChange = (e, index) => {
    const { value, name } = e.target;

    setMessageList((m) => {
      const temp = [...m];
      temp[index][name] = value;
      return temp;
    });
  };

  const handleChangeSwitch = (e, index) => {
    const { checked, name } = e.target;

    setMessageList((m) => {
      const temp = [...m];
      temp[index][name] = checked;
      return temp;
    });
  };

  return (
    <>
      <ListItem>
        <InputLabel id='select-label'>object type:</InputLabel>
        <Select
          labelId='select-label'
          sx={{ ml: 2 }}
          size='small'
          value={selectIndex}
          onChange={(e) => setSelectIndex(e.target.value)}
        >
          {messageListObjects.map((el, i) => (
            <MenuItem key={i} value={i}>
              {el}
            </MenuItem>
          ))}
        </Select>

        <Tooltip title='Add'>
          <IconButton sx={{ ml: 1 }} size='large' onClick={handleAdd}>
            <AddBoxRoundedIcon sx={{ '&:hover': { color: '#81c784' } }} />
          </IconButton>
        </Tooltip>
        <Tooltip title='Remove' onClick={handleRemove}>
          <IconButton size='large'>
            <RemoveCircleRoundedIcon sx={{ '&:hover': { color: '#e57373' } }} />
          </IconButton>
        </Tooltip>
      </ListItem>
      <Divider sx={{ mt: 1 }} />
      <List>
        {messageList.map((m, i) => {
          if (['prompt', 'number', 'ordinal', 'digit'].includes(m.type))
            return (
              <ListItem key={i}>
                <Tooltip title='useVariable' placement='top-start'>
                  <Switch
                    name='useVariable'
                    sx={{ mr: 2 }}
                    size='small'
                    checked={m.useVariable ?? false}
                    onChange={(e) => handleChangeSwitch(e, i)}
                  />
                </Tooltip>
                <Typography sx={{ mr: 1 }}>{m.type}:</Typography>
                <TextField
                  name='value'
                  sx={{
                    display: m.useVariable ? 'none' : 'block',
                    width: m.type === 'prompt' ? 180 : 100,
                  }}
                  size='small'
                  value={m.value}
                  onChange={(e) => handleChange(e, i)}
                />
                <Select
                  sx={{ display: m.useVariable ? 'block' : 'none' }}
                  size='small'
                  name='value'
                  value={m.value}
                  onChange={(e) => handleChange(e, i)}
                >
                  {userVariables
                    .filter(
                      (el) =>
                        el.type === (m.type === 'prompt' ? 'prompt' : 'number')
                    )
                    .map((el, i) => {
                      return (
                        <MenuItem key={i} value={`$${el.name}` ?? ''}>
                          {el.name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </ListItem>
            );

          if (m.type === 'amount')
            return (
              <ListItem key={i}>
                <Tooltip title='useVariable' placement='top-start'>
                  <Switch
                    name='useVariable'
                    sx={{ mr: 2 }}
                    size='small'
                    checked={m.useVariable ?? false}
                    onChange={(e) => handleChangeSwitch(e, i)}
                  />
                </Tooltip>
                <Typography sx={{ mr: 1 }}>{m.type}:</Typography>
                <TextField
                  name='value'
                  size='small'
                  sx={{ width: 120, display: m.useVariable ? 'none' : 'block' }}
                  value={m.value}
                  onChange={(e) => handleChange(e, i)}
                />
                <Select
                  sx={{ display: m.useVariable ? 'block' : 'none' }}
                  size='small'
                  name='value'
                  value={m.value}
                  onChange={(e) => handleChange(e, i)}
                >
                  {userVariables
                    .filter((el) => el.type === 'number')
                    .map((el, i) => {
                      return (
                        <MenuItem key={i} value={`$${el.name}` ?? ''}>
                          {el.name}
                        </MenuItem>
                      );
                    })}
                </Select>
                <Typography sx={{ mr: 1, ml: 2 }}>currency:</Typography>
                <TextField
                  name='currency'
                  sx={{ width: 90 }}
                  size='small'
                  value={m.currency ?? ''}
                  onChange={(e) => handleChange(e, i)}
                ></TextField>
              </ListItem>
            );

          if (m.type === 'date')
            return (
              <ListItem key={i}>
                <Tooltip title='useVariable' placement='top-start'>
                  <Switch
                    name='useVariable'
                    sx={{ mr: 2 }}
                    size='small'
                    checked={m.useVariable ?? false}
                    onChange={(e) => handleChangeSwitch(e, i)}
                  />
                </Tooltip>
                <Typography sx={{ mr: 1 }}>{m.type}:</Typography>
                <TextField
                  name='value'
                  sx={{ width: 150, display: m.useVariable ? 'none' : 'block' }}
                  size='small'
                  placeholder='yyyymmdd'
                  value={m.value}
                  onChange={(e) => handleChange(e, i)}
                />
                <Select
                  sx={{ display: m.useVariable ? 'block' : 'none' }}
                  size='small'
                  name='value'
                  value={m.value}
                  onChange={(e) => handleChange(e, i)}
                >
                  {userVariables
                    .filter((el) => el.type === m.type)
                    .map((el, i) => {
                      return (
                        <MenuItem key={i} value={`$${el.name}` ?? ''}>
                          {el.name}
                        </MenuItem>
                      );
                    })}
                </Select>
                <Typography sx={{ ml: 2 }}>playYear:</Typography>
                <Switch
                  name='playYear'
                  checked={m.playYear ?? false}
                  onChange={(e) => handleChangeSwitch(e, i)}
                ></Switch>
              </ListItem>
            );
          if (m.type === 'time')
            return (
              <ListItem key={i}>
                <Tooltip title='useVariable' placement='top-start'>
                  <Switch
                    name='useVariable'
                    sx={{ mr: 2 }}
                    size='small'
                    checked={m.useVariable ?? false}
                    onChange={(e) => handleChangeSwitch(e, i)}
                  />
                </Tooltip>
                <Typography sx={{ mr: 1 }}>{m.type}:</Typography>
                <TextField
                  name='value'
                  sx={{ width: 100, display: m.useVariable ? 'none' : 'block' }}
                  placeholder='hhmm'
                  size='small'
                  value={m.value}
                  onChange={(e) => handleChange(e, i)}
                />
                <Select
                  sx={{ display: m.useVariable ? 'block' : 'none' }}
                  size='small'
                  name='value'
                  value={m.value}
                  onChange={(e) => handleChange(e, i)}
                >
                  {userVariables
                    .filter((el) => el.type === m.type)
                    .map((el, i) => {
                      return (
                        <MenuItem key={i} value={`$${el.name}` ?? ''}>
                          {el.name}
                        </MenuItem>
                      );
                    })}
                </Select>
                <Typography sx={{ ml: 2 }}>is24:</Typography>
                <Switch
                  name='is24'
                  checked={m.is24 ?? false}
                  onChange={(e) => handleChangeSwitch(e, i)}
                ></Switch>
              </ListItem>
            );

          if (m.type === 'day')
            return (
              <ListItem key={i}>
                <Tooltip title='useVariable' placement='top-start'>
                  <Switch
                    name='useVariable'
                    sx={{ mr: 2 }}
                    size='small'
                    checked={m.useVariable ?? false}
                    onChange={(e) => handleChangeSwitch(e, i)}
                  />
                </Tooltip>
                <Typography sx={{ mr: 1 }}>{m.type}:</Typography>
                <Select
                  name='value'
                  sx={{
                    width: 'max-content',
                    minWidth: 100,
                    display: m.useVariable ? 'none' : 'block',
                  }}
                  size='small'
                  value={m.value}
                  onChange={(e) => handleChange(e, i)}
                >
                  {dayValues.map((d, i) => (
                    <MenuItem value={i + 1} key={i}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  sx={{ display: m.useVariable ? 'block' : 'none' }}
                  size='small'
                  name='value'
                  value={m.value}
                  onChange={(e) => handleChange(e, i)}
                >
                  {userVariables
                    .filter((el) => el.type === m.type)
                    .map((el, i) => {
                      return (
                        <MenuItem key={i} value={`$${el.name}` ?? ''}>
                          {el.name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </ListItem>
            );

          if (m.type === 'month')
            return (
              <ListItem key={i}>
                <Tooltip title='useVariable' placement='top-start'>
                  <Switch
                    name='useVariable'
                    sx={{ mr: 2 }}
                    size='small'
                    checked={m.useVariable ?? false}
                    onChange={(e) => handleChangeSwitch(e, i)}
                  />
                </Tooltip>
                <Typography sx={{ mr: 1 }}>{m.type}:</Typography>
                <Select
                  name='value'
                  sx={{
                    width: 'max-content',
                    minWidth: 100,
                    display: m.useVariable ? 'none' : 'block',
                  }}
                  size='small'
                  value={m.value}
                  onChange={(e) => handleChange(e, i)}
                >
                  {monthValues.map((d, i) => (
                    <MenuItem value={i + 1} key={i}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  sx={{ display: m.useVariable ? 'block' : 'none' }}
                  size='small'
                  name='value'
                  value={m.value}
                  onChange={(e) => handleChange(e, i)}
                >
                  {userVariables
                    .filter((el) => el.type === m.type)
                    .map((el, i) => {
                      return (
                        <MenuItem key={i} value={`$${el.name}` ?? ''}>
                          {el.name}
                        </MenuItem>
                      );
                    })}
                </Select>
                <Typography sx={{ ml: 2 }}>isHijri:</Typography>
                <Switch
                  name='isHijri'
                  checked={m.isHijri ?? false}
                  onChange={(e) => handleChangeSwitch(e, i)}
                ></Switch>
              </ListItem>
            );
        })}
      </List>
    </>
  );
};

export default MessageList;
