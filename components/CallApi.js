import {
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useState } from 'react';

const CallApi = ({ shape, handleCloseDrawer, userVariables }) => {
  const [shapeName, setShapeName] = useState(shape.text);
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
  const [endpoint, setEndpoint] = useState('');

  function handleInputArrChange(e, index) {
    console.log('🚀 ~ handleInputArrChange ~ e', e);
    e.preventDefault();
    console.log('🚀 ~ handleInputArrChange ~ index', index);
    setInputArr((s) => {
      const newArr = [...s];
      newArr[index].value = e.target.value;
      return newArr;
    });
  }
  function handleOutputArrChange(e, index) {
    console.log('🚀 ~ handleOutputArrChange ~ e', e);
    e.preventDefault();
    console.log('🚀 ~ handleOutputArrChange ~ index', index);
    setOutputArr((s) => {
      const newArr = [...s];
      newArr[index].value = e.target.value;
      return newArr;
    });
  }

  function saveUserValues() {
    shape.setText(shapeName || 'callAPI');
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

  function handleApiCall() {
    const inputVarList = inputArr.map((el, i) => {
      return el.value;
    });
    const outputVarList = outputArr.map((el, i) => {
      return el.value;
    });
    console.log('inputVarList', inputVarList);
    console.log('outputVarList', outputVarList);
    console.log('endpoint', endpoint);
  }

  return (
    <>
      <List sx={{ minWidth: 300 }}>
        <ListItem>
          <Tooltip title='CLOSE'>
            <Button
              size='small'
              variant='outlined'
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
              variant='outlined'
              color='success'
              onClick={saveUserValues}
            >
              <SaveRoundedIcon sx={{ fontSize: 20 }} />
            </Button>
          </Tooltip>
        </ListItem>
        <ListItem>
          <Chip
            sx={{ backgroundColor: '#2196f3', mx: 'auto', px: 2, py: 3 }}
            label={<Typography variant='h6'>Call API</Typography>}
          />
        </ListItem>
        <ListItem sx={{ mb: 3 }}>
          <Typography variant='button' sx={{ fontSize: 16, width: '35%' }}>
            Name:
          </Typography>
          <TextField
            value={shapeName || ''}
            onChange={(e) => {
              setShapeName(e.target.value);
            }}
            sx={{
              mx: 0.5,
            }}
            size='small'
          />
        </ListItem>
        <ListItem>
          <Typography sx={{ fontSize: '1.1rem', mr: 1 }} variant='h6'>
            REST endpoint:
          </Typography>
        </ListItem>
        <ListItem>
          <TextField
            size='small'
            placeholder='https://example.com/function'
            fullWidth
            value={endpoint}
            onChange={(e) => {
              setEndpoint(e.target.value);
            }}
          />
        </ListItem>
        <Divider sx={{ my: 1 }} />
        <ListItem>
          <Typography sx={{ fontSize: '1rem', width: '50%' }} variant='h6'>
            Input Variables:
          </Typography>
          <IconButton
            sx={{ mr: 1 }}
            size='large'
            color='success'
            onClick={addInput}
          >
            <AddRoundedIcon />
          </IconButton>
          <IconButton size='large' color='error' onClick={removeInput}>
            <RemoveRoundedIcon />
          </IconButton>
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
          <Typography sx={{ fontSize: '1rem', width: '50%' }} variant='h6'>
            Output Variables:
          </Typography>

          <IconButton
            sx={{ mr: 1 }}
            size='large'
            color='success'
            onClick={addOutput}
          >
            <AddRoundedIcon />
          </IconButton>
          <IconButton size='large' color='error' onClick={removeOutput}>
            <RemoveRoundedIcon />
          </IconButton>
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

        <ListItem>
          <Button
            onClick={handleApiCall}
            sx={{ mx: 'auto' }}
            variant='contained'
            size='small'
          >
            <SendRoundedIcon />
          </Button>
        </ListItem>
      </List>
    </>
  );
};

export default CallApi;
