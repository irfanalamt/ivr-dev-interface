import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  Divider,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { checkValidity } from '../src/helpers';

const SetVariables = ({
  handleCloseDrawer,
  userVariables = [],
  setUserVariables,
}) => {
  const [varList, setVarList] = useState(userVariables);
  const [selectedVarIndex, setSelectedVarIndex] = useState('');
  const [isViewMode, setIsViewMode] = useState(true);
  const [currVariable, setCurrVariable] = useState({});
  const [errorText, setErrorText] = useState('');

  const handleAdd = () => {
    setSelectedVarIndex('');
    setIsViewMode(false);
    setCurrVariable({});
  };

  const handleModify = () => {
    setIsViewMode(false);
  };

  const handleDelete = () => {
    setVarList((v) => {
      const temp = [...v];
      temp.splice(selectedVarIndex, 1);
      setUserVariables(temp);
      return temp;
    });
    setSelectedVarIndex('');
    setCurrVariable({});
  };

  const handleVarChange = (e) => {
    const { value, name } = e.target;

    setCurrVariable((v) => ({ ...currVariable, [name]: value }));
  };

  const handleValidation = (e) => {
    let fieldType = '';
    if (!currVariable) {
      fieldType = 'prompt';
    } else {
      fieldType = currVariable.type;
    }

    const errorM = checkValidity(fieldType, e);
    if (errorM === -1) {
      // No error condition
      setErrorText('');
      return;
    }

    setErrorText(errorM);
  };

  const handleSave = () => {
    if (!currVariable.name || !currVariable.value || errorText !== '') {
      // prevent save if required values absent
      return;
    }

    if (selectedVarIndex === '') {
      setVarList((v) => {
        const temp = [...v];
        temp[varList.length] = currVariable;
        setUserVariables(temp);
        return temp;
      });
      setSelectedVarIndex(varList.length);
    } else {
      setVarList((v) => {
        const temp = [...v];
        temp[selectedVarIndex] = currVariable;
        setUserVariables(temp);
        return temp;
      });
    }
    setIsViewMode(true);
  };

  return (
    <List sx={{ minWidth: 400 }}>
      <Box
        sx={{
          mt: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            backgroundColor: '#ffab91',
            px: 2,
            py: 1,
            boxShadow: 1,
            fontSize: '1.5rem',
            width: 'max-content',
          }}
          variant='h6'
        >
          Set Variables
        </Typography>
        <Tooltip title='CLOSE'>
          <Button
            size='small'
            variant='contained'
            sx={{
              height: 30,
              mr: 1,
              color: 'black',
              backgroundColor: '#dcdcdc',
              '&:hover': { backgroundColor: '#e57373' },
            }}
            onClick={handleCloseDrawer}
          >
            <CloseRoundedIcon sx={{ fontSize: 21 }} />
          </Button>
        </Tooltip>
      </Box>{' '}
      <Typography
        sx={{
          backgroundColor: ' #FFE4E1',
          color: '#FF0000',
          width: 'max-content',
          position: 'absolute',
          px: 1,
          mt: 1,
          left: 0,
          right: 0,
          mx: 'auto',
          fontSize: '0.75rem',
        }}
        variant='subtitle1'
      >
        {errorText}
      </Typography>
      <ListItem sx={{ mt: 4 }}>
        <InputLabel id='select-label'>variable list</InputLabel>
        <Select
          sx={{ ml: 2, minWidth: '50%' }}
          labelId='select-label'
          size='small'
          onChange={(e) => {
            setSelectedVarIndex(e.target.value);

            setCurrVariable(varList[e.target.value]);

            setIsViewMode(true);
          }}
          value={selectedVarIndex}
        >
          {varList.map((v, i) => (
            <MenuItem value={i} key={i}>
              {v.name}
            </MenuItem>
          ))}
        </Select>
      </ListItem>
      <ListItem sx={{ mt: 1 }}>
        <Button
          sx={{
            backgroundColor: '#dcdcdc',
            color: '#1b5e20',
            '&:hover': { backgroundColor: '#b0b0b0' },
          }}
          variant='contained'
          onClick={handleAdd}
        >
          Add
        </Button>
        <Button
          sx={{
            ml: 1,
            backgroundColor: '#dcdcdc',
            color: '#01579b',
            '&:hover': { backgroundColor: '#b0b0b0' },
          }}
          variant='contained'
          color='secondary'
          onClick={handleModify}
          disabled={selectedVarIndex === ''}
        >
          Modify
        </Button>
        <Button
          sx={{
            ml: 1,
            backgroundColor: '#dcdcdc',
            color: '#b71c1c',
            '&:hover': { backgroundColor: '#b0b0b0' },
          }}
          variant='contained'
          color='error'
          onClick={handleDelete}
          disabled={selectedVarIndex === ''}
        >
          Delete
        </Button>
      </ListItem>
      <List sx={{ mt: 4 }}>
        <Divider sx={{ mb: 1 }} />
        <ListItem>
          <Typography sx={{ fontWeight: 'bold', width: '30%' }} variant='body1'>
            type:
          </Typography>
          <Select
            sx={{ ml: 1, width: 'max-content' }}
            name='type'
            value={currVariable.type ?? 'prompt'}
            onChange={(e) => {
              handleVarChange(e);
            }}
            size='small'
            disabled={isViewMode === true}
          >
            <MenuItem value='prompt'>Prompt</MenuItem>
            <MenuItem value='number'>Number</MenuItem>
            <MenuItem value='date'>Date</MenuItem>
            <MenuItem value='day'>Day</MenuItem>
            <MenuItem value='month'>Month</MenuItem>
            <MenuItem value='time'>Time</MenuItem>
          </Select>
        </ListItem>
        <ListItem>
          <Typography sx={{ fontWeight: 'bold', width: '30%' }} variant='body1'>
            name:
          </Typography>
          <TextField
            sx={{ ml: 1, width: '55%' }}
            size='small'
            name='name'
            placeholder={isViewMode === false ? 'required' : ''}
            value={currVariable.name ?? ''}
            onChange={handleVarChange}
            disabled={isViewMode === true}
          />
        </ListItem>
        <ListItem>
          <Typography sx={{ fontWeight: 'bold', width: '30%' }} variant='body1'>
            defaultValue:
          </Typography>
          <TextField
            sx={{ ml: 1, width: '55%' }}
            size='small'
            name='value'
            placeholder={isViewMode === false ? 'required' : ''}
            value={currVariable.value ?? ''}
            onChange={(e) => {
              handleValidation(e);
              handleVarChange(e);
            }}
            disabled={isViewMode === true}
          />
        </ListItem>
        <ListItem>
          <Typography sx={{ fontWeight: 'bold', width: '30%' }} variant='body1'>
            description:
          </Typography>
          <TextField
            sx={{ mx: 1 }}
            size='small'
            name='description'
            multiline
            value={currVariable.description ?? ''}
            onChange={handleVarChange}
            disabled={isViewMode === true}
          />
          <Tooltip title='SAVE'>
            <SaveRoundedIcon
              sx={{
                position: 'relative',
                left: 10,
                fontSize: '1.5rem',
                '&:hover': { color: '#2e7d32', fontSize: '1.6rem' },
              }}
              onClick={handleSave}
            />
          </Tooltip>
        </ListItem>
        <Divider sx={{ mt: 1 }} />
      </List>
    </List>
  );
};

export default SetVariables;
