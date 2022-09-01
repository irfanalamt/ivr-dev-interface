import {
  Button,
  Divider,
  List,
  ListItem,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { useState } from 'react';

const CallApi = ({ shape, handleCloseDrawer, userVariables }) => {
  const [inputArr, setInputArr] = useState([
    {
      value: '',
    },
  ]);
  const [outputArr, setOutputArr] = useState([
    {
      value: '',
    },
  ]);

  function handleInputArrChange(e, i) {
    console.log('🚀 ~ handleInputArrChange ~ e', e);
    e.preventDefault();
    const index = i;
    console.log('🚀 ~ handleInputArrChange ~ index', index);
    setInputArr((s) => {
      const newArr = [...s];
      newArr[index].value = e.target.value;
      return newArr;
    });
  }
  function handleOutputArrChange(e, i) {
    console.log('🚀 ~ handleOutputArrChange ~ e', e);
    e.preventDefault();
    const index = i;
    console.log('🚀 ~ handleOutputArrChange ~ index', index);
    setOutputArr((s) => {
      const newArr = [...s];
      newArr[index].value = e.target.value;
      return newArr;
    });
  }

  function addInput() {
    setInputArr((s) => {
      return [
        ...s,
        {
          value: '',
        },
      ];
    });
  }
  function addOutput() {
    setOutputArr((s) => {
      return [
        ...s,
        {
          value: '',
        },
      ];
    });
  }
  function removeInput() {
    setInputArr((s) => {
      const newArr = [...s];
      newArr.pop();
      return newArr;
    });
  }
  function removeOutput() {
    setOutputArr((s) => {
      const newArr = [...s];
      newArr.pop();
      return newArr;
    });
  }
  return (
    <>
      {console.log(userVariables)}
      <List sx={{ minWidth: 300 }}>
        <ListItem>
          {console.log(userVariables)}
          <Tooltip title='CLOSE'>
            <Button
              size='small'
              variant='contained'
              color='error'
              sx={{ height: 30 }}
              onClick={() => {
                shape.setSelected(false);
                handleCloseDrawer();
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 21 }} />
            </Button>
          </Tooltip>
          <Tooltip title='SAVE'>
            <Button
              sx={{ height: 30, marginLeft: 1, marginRight: 'auto' }}
              size='small'
              variant='contained'
              color='success'
            >
              <SaveRoundedIcon sx={{ fontSize: 20 }} />
            </Button>
          </Tooltip>
        </ListItem>
        <ListItem>
          <Typography
            sx={{
              marginX: 'auto',
              marginY: 1,
              boxShadow: 1,
              paddingX: 3,
              paddingY: 1,
              backgroundColor: '#2196f3',
              borderRadius: 1,
            }}
            variant='h6'
          >
            Call API
          </Typography>
        </ListItem>

        <ListItem>
          <Typography sx={{ fontSize: '1rem', mr: 1 }} variant='h6'>
            Input Variables:
          </Typography>

          <Button
            sx={{ p: 0, mx: 0.5, height: 30, width: 30 }}
            onClick={addInput}
            variant='outlined'
            size='small'
            color='success'
          >
            <AddRoundedIcon />
          </Button>
          <Button
            sx={{ p: 0, mx: 0.5, height: 30, width: 30 }}
            onClick={removeInput}
            variant='outlined'
            size='small'
            color='error'
          >
            <RemoveRoundedIcon />
          </Button>
        </ListItem>
        <ListItem>
          {inputArr?.map((item, i) => {
            return (
              <Select
                sx={{ mr: 0.5 }}
                onChange={(e) => {
                  handleInputArrChange(e, i);
                }}
                value={item.value}
                key={i}
                size='small'
              >
                {userVariables?.map((el, i) => {
                  return (
                    <MenuItem key={i} value={el.name}>
                      {el.name}
                    </MenuItem>
                  );
                })}
              </Select>
            );
          })}
        </ListItem>
        <Divider sx={{ my: 1 }} />
        <ListItem>
          <Typography sx={{ fontSize: '1rem', mr: 1 }} variant='h6'>
            Output Variables:
          </Typography>

          <Button
            sx={{ p: 0, mx: 0.5, height: 30, width: 30 }}
            onClick={addOutput}
            variant='outlined'
            size='small'
            color='success'
          >
            <AddRoundedIcon />
          </Button>
          <Button
            sx={{ p: 0, mx: 0.5, height: 30, width: 30 }}
            onClick={removeOutput}
            variant='outlined'
            size='small'
            color='error'
          >
            <RemoveRoundedIcon />
          </Button>
        </ListItem>
        <ListItem>
          {outputArr?.map((item, i) => {
            return (
              <Select
                sx={{ mr: 0.5 }}
                onChange={(e) => {
                  handleOutputArrChange(e, i);
                }}
                value={item.value}
                key={i}
                size='small'
              >
                {userVariables?.map((el, i) => {
                  return (
                    <MenuItem key={i} value={el.name}>
                      {el.name}
                    </MenuItem>
                  );
                })}
              </Select>
            );
          })}
        </ListItem>
        <Divider sx={{ my: 1 }} />
      </List>
    </>
  );
};

export default CallApi;
