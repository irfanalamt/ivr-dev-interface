import {
  Button,
  FormControlLabel,
  Input,
  InputLabel,
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
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import { useState } from 'react';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

const DrawerComponent = ({ isOpen, handleCloseDrawer, shape = null }) => {
  const [inputList, setInputList] = useState([]);
  const [shapeName, setShapeName] = useState(shape.text);
  const [tabValue, setTabValue] = useState(0);
  const [interruptible, setInterruptible] = useState(true);
  const [repeatOption, setRepeatOption] = useState(9);
  const [msgObjType, setMsgObjType] = useState('prompt');
  function addNewInput() {
    switch (msgObjType) {
      case 'prompt':
        setInputList(
          inputList.concat(
            <ListItem>
              <TextField
                label='Enter prompt'
                variant='outlined'
                fullWidth
                focused
              />
            </ListItem>
          )
        );
        break;

      case 'ordinal':
        setInputList(
          inputList.concat(
            <ListItem>
              <TextField
                sx={{ maxWidth: 100 }}
                label='Enter ordinal'
                variant='outlined'
                focused
              />
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
                focused
              />
            </ListItem>
          )
        );
        break;

      case 'amount':
        setInputList(
          inputList.concat(
            <ListItem>
              <TextField
                sx={{ maxWidth: 100 }}
                label='Enter amount'
                variant='outlined'
                focused
              />
              <TextField
                sx={{ maxWidth: 150, marginX: 2 }}
                label='Select currency'
                variant='outlined'
                defaultValue='SAR'
              />
            </ListItem>
          )
        );
        break;

      case 'date':
        setInputList(
          inputList.concat(
            <ListItem>
              <TextField
                sx={{ maxWidth: 150 }}
                label='Enter date'
                placeholder='yyyymmdd'
                variant='outlined'
                focused
              />
              <Typography sx={{ marginX: 1 }} variant='body1'>
                playYear:
              </Typography>
              <RadioGroup
                defaultValue={false}
                row
                name='playYear-radio-buttons-group'
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
          )
        );
        break;

      case 'day':
        setInputList(
          inputList.concat(
            <ListItem>
              <Typography sx={{ marginX: 1 }} variant='body2'>
                select day:
              </Typography>
              <Select placeholder='day' defaultValue='mon'>
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
                focused
              />
            </ListItem>
          )
        );
        break;

      case 'digits':
        setInputList(
          inputList.concat(
            <ListItem>
              <TextField
                sx={{ maxWidth: 100 }}
                label='Enter digit'
                variant='outlined'
                focused
              />
            </ListItem>
          )
        );
        break;

      case 'month':
        setInputList(
          inputList.concat(
            <ListItem>
              <TextField
                sx={{ maxWidth: 150 }}
                label='Enter month'
                variant='outlined'
                focused
              />
              <Typography sx={{ marginX: 1 }} variant='body1'>
                isHijri:
              </Typography>
              <RadioGroup
                defaultValue={false}
                row
                name='isHijri-radio-buttons-group'
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
          )
        );
        break;

      case 'time':
        setInputList(
          inputList.concat(
            <ListItem>
              <TextField
                sx={{ maxWidth: 100 }}
                label='Enter time'
                variant='outlined'
                placeholder='hhmm'
                focused
              />
              <Typography sx={{ marginX: 1 }} variant='body1'>
                is24:
              </Typography>
              <RadioGroup
                defaultValue={false}
                row
                name='is24-radio-buttons-group'
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
          )
        );
        break;
    }
  }
  function handleTabChange(e, newVal) {
    setTabValue(newVal);
  }
  const nameField = () => {
    return (
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
    );
  };
  const myList = () => {
    if (shape?.type == 'roundedRectangle') {
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
          {nameField()}
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
    } else if (shape?.type == 'hexagon') {
      return (
        <List>
          <ListItem>
            <Typography
              sx={{
                marginX: 'auto',
                boxShadow: 1,
                paddingX: 1,
                borderRadius: 2,
                backgroundColor: '#009688',
              }}
              variant='h5'
            >
              Play Menu
            </Typography>
          </ListItem>
          {nameField()}
        </List>
      );
    } else {
      return (
        <List>
          <ListItem>
            <Typography variant='h5'> not playMessage</Typography>
          </ListItem>
          {nameField()}
        </List>
      );
    }
  };
  return (
    <>
      <Drawer
        anchor='right'
        open={isOpen}
        onClose={() => {
          shape.setText(shapeName);
          shape.setSelected(false);
          handleCloseDrawer();
        }}
      >
        {myList()}
      </Drawer>
    </>
  );
};

export default DrawerComponent;
