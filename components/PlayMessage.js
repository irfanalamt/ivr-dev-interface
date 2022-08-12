import {
  Button,
  FormControlLabel,
  List,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

const PlayMessage = ({ shapeName, setShapeName }) => {
  const [tabValue, setTabValue] = useState(0);
  const [interruptible, setInterruptible] = useState(true);
  const [repeatOption, setRepeatOption] = useState(9);
  const [inputList, setInputList] = useState([]);
  const [msgObjType, setMsgObjType] = useState('prompt');

  function addNewInput() {
    switch (msgObjType) {
      case 'prompt':
        setInputList(
          inputList.concat(
            <ListItem>
              <Typography sx={{ marginX: 2 }} variant='body1'>
                prompt:
              </Typography>
              <TextField size='small' variant='outlined' fullWidth />
            </ListItem>
          )
        );
        break;

      case 'ordinal':
        setInputList(
          inputList.concat(
            <ListItem>
              <Typography sx={{ marginX: 2 }} variant='body1'>
                ordinal:
              </Typography>
              <TextField size='small' sx={{ maxWidth: 100 }} />
            </ListItem>
          )
        );
        break;

      case 'number':
        setInputList(
          inputList.concat(
            <ListItem>
              <Typography sx={{ marginX: 2 }} variant='body1'>
                number:
              </Typography>
              <TextField size='small' sx={{ maxWidth: 100 }} />
            </ListItem>
          )
        );
        break;

      case 'amount':
        setInputList(
          inputList.concat(
            <ListItem>
              <Typography sx={{ marginX: 2 }} variant='body1'>
                amount:
              </Typography>
              <TextField size='small' sx={{ maxWidth: 100 }} />
              <Typography sx={{ marginLeft: 4 }} variant='body1'>
                currency:
              </Typography>
              <TextField
                sx={{ maxWidth: 100, marginX: 2 }}
                variant='outlined'
                defaultValue='SAR'
                size='small'
              />
            </ListItem>
          )
        );
        break;

      case 'date':
        setInputList(
          inputList.concat(
            <ListItem>
              <Typography sx={{ marginX: 2 }} variant='body1'>
                date:
              </Typography>
              <TextField
                sx={{ maxWidth: 150 }}
                placeholder='yyyymmdd'
                variant='outlined'
                size='small'
              />
              <Typography sx={{ marginLeft: 2 }} variant='body1'>
                playYear:
              </Typography>
              <RadioGroup
                defaultValue={false}
                row
                name='playYear-radio-buttons-group'
              >
                <FormControlLabel
                  sx={{ marginLeft: 1 }}
                  value={true}
                  control={<Radio />}
                  label='true'
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label='false'
                />
              </RadioGroup>
            </ListItem>
          )
        );
        break;

      case 'day':
        setInputList(
          inputList.concat(
            <ListItem>
              <Typography sx={{ marginX: 2 }} variant='body1'>
                day:
              </Typography>
              <Select placeholder='day' defaultValue='mon' size='small'>
                <MenuItem value='mon'>Monday</MenuItem>
                <MenuItem value='tue'>Tuesday</MenuItem>
                <MenuItem value='wed'>Wednesday</MenuItem>
                <MenuItem value='thu'>Thursday</MenuItem>
                <MenuItem value='fri'>Friday</MenuItem>
                <MenuItem value='sat'>Saturday</MenuItem>
                <MenuItem value='sun'>Sunday</MenuItem>
              </Select>
            </ListItem>
          )
        );
        break;

      case 'number':
        setInputList(
          inputList.concat(
            <ListItem>
              <TextField
                sx={{ maxWidth: 100 }}
                label='Enter number'
                variant='outlined'
              />
            </ListItem>
          )
        );
        break;

      case 'digits':
        setInputList(
          inputList.concat(
            <ListItem>
              <Typography sx={{ marginX: 2 }} variant='body1'>
                digit:
              </Typography>
              <TextField sx={{ maxWidth: 100 }} size='small' />
            </ListItem>
          )
        );
        break;

      case 'month':
        setInputList(
          inputList.concat(
            <ListItem>
              <Typography sx={{ marginX: 2 }} variant='body1'>
                month:
              </Typography>
              <Select defaultValue={1} size='small'>
                <MenuItem value={1}>January</MenuItem>
                <MenuItem value={2}>February</MenuItem>
                <MenuItem value={3}>March</MenuItem>
                <MenuItem value={4}>April</MenuItem>
                <MenuItem value={5}>May</MenuItem>
                <MenuItem value={6}>June</MenuItem>
                <MenuItem value={7}>July</MenuItem>
                <MenuItem value={8}>August</MenuItem>
                <MenuItem value={9}>September</MenuItem>
                <MenuItem value={10}>October</MenuItem>
                <MenuItem value={11}>November</MenuItem>
                <MenuItem value={12}>December</MenuItem>
              </Select>
              <Typography sx={{ marginLeft: 2 }} variant='body1'>
                isHijri:
              </Typography>
              <RadioGroup
                defaultValue={false}
                row
                name='isHijri-radio-buttons-group'
              >
                <FormControlLabel
                  sx={{ marginLeft: 1 }}
                  value={true}
                  control={<Radio />}
                  label='true'
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label='false'
                />
              </RadioGroup>
            </ListItem>
          )
        );
        break;

      case 'time':
        setInputList(
          inputList.concat(
            <ListItem>
              <Typography sx={{ marginX: 2 }} variant='body1'>
                time:
              </Typography>
              <TextField
                sx={{ maxWidth: 100 }}
                variant='outlined'
                placeholder='hhmm'
                size='small'
              />
              <Typography sx={{ marginLeft: 2 }} variant='body1'>
                is24:
              </Typography>
              <RadioGroup
                defaultValue={false}
                row
                name='is24-radio-buttons-group'
              >
                <FormControlLabel
                  sx={{ marginLeft: 1 }}
                  value={true}
                  control={<Radio />}
                  label='true'
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label='false'
                />
              </RadioGroup>
            </ListItem>
          )
        );
        break;
    }
  }

  function handleTabChange(e, newVal) {
    setTabValue(newVal);
  }

  return (
    <List>
      <ListItem sx={{ position: 'relative' }}>
        <Typography
          sx={{
            marginX: 'auto',
            marginY: 2,
            boxShadow: 1,
            paddingX: 1,
            borderRadius: 2,
            backgroundColor: '#c0ca33',
          }}
          variant='h5'
        >
          Play Message
        </Typography>
        <Button
          color='info'
          sx={{ position: 'absolute', left: 10, top: 0 }}
          variant='outlined'
        >
          save <SaveRoundedIcon />
        </Button>
      </ListItem>
      <ListItem sx={{ justifyContent: 'center' }}>
        <Typography variant='h6'>NAME</Typography>
        <TextField
          sx={{ marginX: 2 }}
          value={shapeName}
          onChange={(e) => {
            setShapeName(e.target.value);
          }}
        />
      </ListItem>
      <ListItem>
        <Tabs
          sx={{ marginX: 'auto' }}
          value={tabValue}
          onChange={handleTabChange}
        >
          <Tab label='Message List' />
          <Tab label='Parameters' />
        </Tabs>
      </ListItem>
      {tabValue == '0' && (
        <>
          <ListItem>
            <Typography variant='subtitle1'>Select object type:</Typography>
            <Select
              defaultValue='prompt'
              value={msgObjType}
              sx={{ marginX: 2 }}
              onChange={(e) => {
                setMsgObjType(e.target.value);
              }}
            >
              <MenuItem value='prompt'>Prompt</MenuItem>
              <MenuItem value='number'>Number</MenuItem>
              <MenuItem value='ordinal'>Ordinal</MenuItem>
              <MenuItem value='amount'>Amount</MenuItem>
              <MenuItem value='digits'>Digits</MenuItem>
              <MenuItem value='date'>Date</MenuItem>
              <MenuItem value='day'>Day</MenuItem>
              <MenuItem value='month'>Month</MenuItem>
              <MenuItem value='time'>Time</MenuItem>
            </Select>
            <Button
              sx={{ maxWidth: 150, marginX: 'auto' }}
              color='success'
              variant='outlined'
              onClick={addNewInput}
            >
              ADD NEW
              <AddBoxRoundedIcon />
            </Button>
          </ListItem>
          <List>{inputList}</List>
        </>
      )}
      {tabValue == '1' && (
        <>
          <ListItem>
            <Typography variant='h6'>interruptible:</Typography>
            <RadioGroup
              value={interruptible}
              row
              name='interruptible-radio-buttons-group'
              onChange={(e) => {
                setInterruptible(e.target.value);
              }}
            >
              <FormControlLabel
                sx={{ marginX: 1 }}
                value={true}
                control={<Radio />}
                label='true'
              />
              <FormControlLabel
                sx={{ marginX: 1 }}
                value={false}
                control={<Radio />}
                label='false'
              />
            </RadioGroup>
          </ListItem>
          <ListItem sx={{ marginTop: 3 }}>
            <Typography variant='h6'>repeatOption:</Typography>
            <Select
              sx={{ marginX: 1 }}
              id='repeatOption-select'
              label='0-9'
              value={repeatOption}
              defaultValue={9}
              onChange={(e) => {
                setRepeatOption(e.target.value);
              }}
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
            </Select>
            <Typography sx={{ marginX: 1 }} variant='subtitle2'>
              0-9
            </Typography>
          </ListItem>
        </>
      )}
    </List>
  );
};

export default PlayMessage;
