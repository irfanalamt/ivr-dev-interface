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
import {useState} from 'react';
import {checkValidity} from '../src/helpers';

const MessageList = ({
  messageList,
  setMessageList,
  userVariables,
  setErrorText,
}) => {
  const [selectIndex, setSelectIndex] = useState(0);

  const messageListObjects = [
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
    '1 SunDay',
    '2 MonDay',
    '3 TuesDay',
    '4 WednesDay',
    '5 ThursDay',
    '6 FriDay',
    '7 SaturDay',
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

  const handleAdd = () => {
    if (selectIndex < 0) return;
    const objType = messageListObjects[selectIndex];
    setMessageList((prevList) => [...prevList, {type: objType, item: ''}]);
    setSelectIndex('');
  };

  const handleRemove = () => {
    setMessageList((prevList) => prevList.slice(0, -1));
  };

  const handleChange = (e, index, type = null) => {
    const {value, name} = e.target;
    let isError = false;

    if (type) {
      const errorM = checkValidity(type.toLowerCase(), value);
      if (errorM === -1) {
        setErrorText('');
      } else {
        isError = true;
        setErrorText(errorM);
      }
    }

    setMessageList((prevList) => {
      const newList = [...prevList];
      newList[index][name] = value;
      if (type) newList[index].isError = isError;
      return newList;
    });
  };

  const handleChangeSwitch = (e, index) => {
    const {checked, name} = e.target;
    setMessageList((prevList) => {
      const newList = [...prevList];
      newList[index][name] = checked;
      newList[index].item = '';
      return newList;
    });
  };

  return (
    <>
      <ListItem>
        <InputLabel id='select-label'>Message Type:</InputLabel>
        <Select
          labelId='select-label'
          sx={{ml: 2, minWidth: 100}}
          size='small'
          value={selectIndex}
          onChange={(e) => setSelectIndex(e.target.value)}>
          {messageListObjects.map((el, i) => (
            <MenuItem key={i} value={i}>
              {el}
            </MenuItem>
          ))}
        </Select>

        <Tooltip title='Add'>
          <IconButton sx={{ml: 1}} size='large' onClick={handleAdd}>
            <AddBoxRoundedIcon sx={{'&:hover': {color: '#81c784'}}} />
          </IconButton>
        </Tooltip>
        <Tooltip title='Remove' onClick={handleRemove}>
          <IconButton size='large'>
            <RemoveCircleRoundedIcon sx={{'&:hover': {color: '#e57373'}}} />
          </IconButton>
        </Tooltip>
      </ListItem>
      <Divider sx={{my: 1}} />
      <List>
        {messageList.map((m, i) => {
          if (['Prompt', 'Number', 'Ordinal', 'Digit'].includes(m.type))
            return (
              <ListItem key={i}>
                <Tooltip title='useVariable' placement='top-start'>
                  <Switch
                    name='useVariable'
                    sx={{mr: 2}}
                    size='small'
                    checked={m.useVariable ?? false}
                    onChange={(e) => handleChangeSwitch(e, i)}
                  />
                </Tooltip>
                <Typography sx={{mr: 1}}>{m.type}:</Typography>
                <TextField
                  name='item'
                  sx={{
                    display: m.useVariable ? 'none' : 'block',
                    px: 1,
                    width: m.type === 'Prompt' ? undefined : 120,
                  }}
                  size='small'
                  value={m.item ?? ''}
                  onChange={(e) => handleChange(e, i, m.type)}
                  error={m.isError}
                  fullWidth={m.type === 'Prompt' && true}
                />
                <Select
                  sx={{display: m.useVariable ? 'block' : 'none'}}
                  size='small'
                  name='item'
                  value={m.useVariable ? m.item : ''}
                  onChange={(e) => handleChange(e, i)}>
                  {userVariables
                    .filter(
                      (el) =>
                        el.type === (m.type === 'Prompt' ? 'prompt' : 'number')
                    )
                    .map((el, i) => (
                      <MenuItem key={i} value={`$${el.name}` ?? ''}>
                        {el.name}
                      </MenuItem>
                    ))}
                </Select>
              </ListItem>
            );

          if (m.type === 'Amount')
            return (
              <ListItem key={i}>
                <Tooltip title='useVariable' placement='top-start'>
                  <Switch
                    name='useVariable'
                    sx={{mr: 2}}
                    size='small'
                    checked={m.useVariable ?? false}
                    onChange={(e) => handleChangeSwitch(e, i)}
                  />
                </Tooltip>
                <Typography sx={{mr: 1}}>{m.type}:</Typography>
                <TextField
                  name='item'
                  size='small'
                  sx={{width: 120, display: m.useVariable ? 'none' : 'block'}}
                  value={m.item ?? ''}
                  onChange={(e) => handleChange(e, i, m.type)}
                  error={m.isError}
                />
                <Select
                  sx={{display: m.useVariable ? 'block' : 'none'}}
                  size='small'
                  name='item'
                  value={m.useVariable ? m.item : ''}
                  onChange={(e) => handleChange(e, i)}>
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
                <Typography sx={{mr: 1, ml: 2}}>currency:</Typography>
                <TextField
                  name='currency'
                  sx={{width: 90}}
                  size='small'
                  value={m.currency ?? ''}
                  onChange={(e) => handleChange(e, i)}></TextField>
              </ListItem>
            );

          if (m.type === 'Date')
            return (
              <ListItem key={i}>
                <Tooltip title='useVariable' placement='top-start'>
                  <Switch
                    name='useVariable'
                    sx={{mr: 2}}
                    size='small'
                    checked={m.useVariable ?? false}
                    onChange={(e) => handleChangeSwitch(e, i)}
                  />
                </Tooltip>
                <Typography sx={{mr: 1}}>{m.type}:</Typography>
                <TextField
                  name='item'
                  sx={{width: 150, display: m.useVariable ? 'none' : 'block'}}
                  size='small'
                  placeholder='yyyymmdd'
                  value={m.item ?? ''}
                  onChange={(e) => {
                    handleChange(e, i, m.type);
                  }}
                  error={m.isError}
                />
                <Select
                  sx={{display: m.useVariable ? 'block' : 'none'}}
                  size='small'
                  name='item'
                  value={m.useVariable ? m.item : ''}
                  onChange={(e) => handleChange(e, i)}>
                  {userVariables
                    .filter((el) => el.type === 'date')
                    .map((el, i) => {
                      return (
                        <MenuItem key={i} value={`$${el.name}` ?? ''}>
                          {el.name}
                        </MenuItem>
                      );
                    })}
                </Select>
                <Typography sx={{ml: 2}}>playYear:</Typography>
                <Switch
                  name='playYear'
                  checked={m.playYear ?? false}
                  onChange={(e) => handleChangeSwitch(e, i)}></Switch>
              </ListItem>
            );
          if (m.type === 'Time')
            return (
              <ListItem key={i}>
                <Tooltip title='useVariable' placement='top-start'>
                  <Switch
                    name='useVariable'
                    sx={{mr: 2}}
                    size='small'
                    checked={m.useVariable ?? false}
                    onChange={(e) => handleChangeSwitch(e, i)}
                  />
                </Tooltip>
                <Typography sx={{mr: 1}}>{m.type}:</Typography>
                <TextField
                  name='item'
                  sx={{width: 100, display: m.useVariable ? 'none' : 'block'}}
                  placeholder='hhmm'
                  size='small'
                  value={m.item ?? ''}
                  onChange={(e) => handleChange(e, i, m.type)}
                  error={m.isError}
                />
                <Select
                  sx={{display: m.useVariable ? 'block' : 'none'}}
                  size='small'
                  name='item'
                  value={m.useVariable ? m.item : ''}
                  onChange={(e) => handleChange(e, i)}>
                  {userVariables
                    .filter((el) => el.type === 'time')
                    .map((el, i) => {
                      return (
                        <MenuItem key={i} value={`$${el.name}` ?? ''}>
                          {el.name}
                        </MenuItem>
                      );
                    })}
                </Select>
                <Typography sx={{ml: 2}}>is24:</Typography>
                <Switch
                  name='is24'
                  checked={m.is24 ?? false}
                  onChange={(e) => handleChangeSwitch(e, i)}></Switch>
              </ListItem>
            );

          if (m.type === 'Day')
            return (
              <ListItem key={i}>
                <Tooltip title='useVariable' placement='top-start'>
                  <Switch
                    name='useVariable'
                    sx={{mr: 2}}
                    size='small'
                    checked={m.useVariable ?? false}
                    onChange={(e) => handleChangeSwitch(e, i)}
                  />
                </Tooltip>
                <Typography sx={{mr: 1}}>{m.type}:</Typography>
                <Select
                  name='item'
                  sx={{
                    width: 'max-content',
                    minWidth: 100,
                    display: m.useVariable ? 'none' : 'block',
                  }}
                  size='small'
                  value={m.item ?? ''}
                  onChange={(e) => handleChange(e, i)}>
                  {DayValues.map((d, i) => (
                    <MenuItem value={i + 1} key={i}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  sx={{display: m.useVariable ? 'block' : 'none'}}
                  size='small'
                  name='item'
                  value={m.useVariable ? m.item : ''}
                  onChange={(e) => handleChange(e, i)}>
                  {userVariables
                    .filter((el) => el.type === 'day')
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

          if (m.type === 'Month')
            return (
              <ListItem key={i}>
                <Tooltip title='useVariable' placement='top-start'>
                  <Switch
                    name='useVariable'
                    sx={{mr: 2}}
                    size='small'
                    checked={m.useVariable ?? false}
                    onChange={(e) => handleChangeSwitch(e, i)}
                  />
                </Tooltip>
                <Typography sx={{mr: 1}}>{m.type}:</Typography>
                <Select
                  name='item'
                  sx={{
                    width: 'max-content',
                    minWidth: 100,
                    display: m.useVariable ? 'none' : 'block',
                  }}
                  size='small'
                  value={m.item ?? ''}
                  onChange={(e) => handleChange(e, i)}>
                  {MonthValues.map((d, i) => (
                    <MenuItem value={i + 1} key={i}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  sx={{display: m.useVariable ? 'block' : 'none'}}
                  size='small'
                  name='item'
                  value={m.useVariable ? m.item : ''}
                  onChange={(e) => handleChange(e, i)}>
                  {userVariables
                    .filter((el) => el.type === 'month')
                    .map((el, i) => {
                      return (
                        <MenuItem key={i} value={`$${el.name}` ?? ''}>
                          {el.name}
                        </MenuItem>
                      );
                    })}
                </Select>
                <Typography sx={{ml: 2}}>isHijri:</Typography>
                <Switch
                  name='isHijri'
                  checked={m.isHijri ?? false}
                  onChange={(e) => handleChangeSwitch(e, i)}
                />
              </ListItem>
            );
        })}
      </List>
    </>
  );
};

export default MessageList;
