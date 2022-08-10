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

const DrawerComponent = ({ isOpen, handleCloseDrawer, shape = null }) => {
  const [inputList, setInputList] = useState([]);
  const [shapeName, setShapeName] = useState(shape.text);
  const [tabValue, setTabValue] = useState(0);
  const [interruptible, setInterruptible] = useState(true);
  const [repeatOption, setRepeatOption] = useState(9);
  function addNewInput() {
    setInputList(
      inputList.concat(
        <ListItem>
          <TextField label='xyz' variant='outlined' />
          <TextField label='abc' variant='outlined' />
        </ListItem>
      )
    );
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
          <ListItem>
            <Typography
              sx={{
                marginX: 'auto',
                marginY: 1,
                boxShadow: 1,
                paddingX: 1,
                borderRadius: 2,
                backgroundColor: '#c0ca33',
              }}
              variant='h5'
            >
              Play Message
            </Typography>
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
                <Typography variant='subtitle1'>msgList</Typography>
              </ListItem>
              <ListItem>
                <Button
                  sx={{ maxWidth: 100, marginX: 'auto' }}
                  color='success'
                  variant='outlined'
                  onClick={addNewInput}
                >
                  ADD NEW
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
              Play Message
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
          handleCloseDrawer();
        }}
      >
        {myList()}
      </Drawer>
    </>
  );
};

export default DrawerComponent;
