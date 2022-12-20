import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  Divider,
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

const SetVariables = ({
  handleCloseDrawer,
  userVariables = [],
  setUserVariables,
}) => {
  const [varList, setVarList] = useState(userVariables);
  const [selectedVarIndex, setSelectedVarIndex] = useState('');
  const [varType, setVarType] = useState('prompt');

  const [isNewVariable, setIsNewVariable] = useState(false);
  const [newVar, setNewVar] = useState({
    type: '',
    name: '',
    value: '',
    description: '',
  });

  function handleAddVariable() {
    setIsNewVariable(true);
  }
  function handleNewVarChange(e) {
    const { value, name } = e.target;
    setNewVar((v) => ({ ...v, [name]: value }));
  }
  function handleVarChange(e) {
    const { value, name } = e.target;
    setVarList((list) => {
      const tempArray = [...list];
      tempArray[selectedVarIndex][name] = value;
      return tempArray;
    });
  }
  function handleSaveVariable() {
    // only save vars with name and value property
    const filteredVariables = varList.filter((v) => v.name && v.value);
    setVarList(filteredVariables);
    setUserVariables(filteredVariables);

    setIsNewVariable(false);
    setSelectedVarIndex('');
  }

  function handleSaveNewVariable() {
    setVarList((s) => [...s, newVar]);

    setUserVariables([...varList, newVar]);
    setNewVar({});

    setIsNewVariable(false);
    setSelectedVarIndex('');
  }

  function handleRemoveVariable() {
    setVarList((s) => {
      const tempArray = [...s];
      tempArray.splice(selectedVarIndex, 1);
      setUserVariables(tempArray);
      return tempArray;
    });
    setSelectedVarIndex('');
  }
  function handleRemoveNewVariable() {
    setNewVar({});
    setIsNewVariable(false);
  }

  return (
    <List sx={{ minWidth: 350 }}>
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
            variant='outlined'
            color='error'
            sx={{ height: 30, mr: 1 }}
            onClick={handleCloseDrawer}
          >
            <CloseRoundedIcon sx={{ fontSize: 21 }} />
          </Button>
        </Tooltip>
      </Box>
      <ListItem sx={{ mt: 5, ml: 1 }}>
        <Tooltip title='variable list' placement='top-end'>
          <Select
            sx={{ minWidth: '50%' }}
            onChange={(e) => {
              setSelectedVarIndex(e.target.value);
              setIsNewVariable(false);
            }}
            value={isNewVariable ? '' : selectedVarIndex}
          >
            {varList.map((v, i) => (
              <MenuItem value={i} key={i}>
                {v.name}
              </MenuItem>
            ))}
          </Select>
        </Tooltip>
      </ListItem>
      <ListItem>
        <Button
          onClick={() => {
            handleAddVariable();
            setSelectedVarIndex('');
          }}
          sx={{ ml: 1 }}
          variant='outlined'
          color='success'
        >
          Add variable
        </Button>
      </ListItem>

      <List
        sx={{
          width: 450,
          mt: 1,
          display: isNewVariable || selectedVarIndex !== '' ? 'block' : 'none',
        }}
      >
        <Divider sx={{ mb: 1 }} />
        <ListItem>
          <Typography
            sx={{ fontWeight: 'bold', fontSize: '1.05rem' }}
            variant='body1'
          >
            type:
          </Typography>
          <Select
            sx={{ ml: 1, width: 120 }}
            value={varType}
            onChange={(e) => setVarType(e.target.value)}
            size='small'
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
          <Typography sx={{ fontWeight: 'bold' }} variant='body1'>
            name:
          </Typography>
          <TextField
            sx={{ ml: 1 }}
            value={
              (isNewVariable ? newVar.name : varList[selectedVarIndex]?.name) ??
              ''
            }
            onChange={isNewVariable ? handleNewVarChange : handleVarChange}
            name='name'
            placeholder='required'
            size='small'
            multiline
            autoFocus
          />
          <Typography sx={{ fontWeight: 'bold', ml: 2 }} variant='body1'>
            defaultValue:
          </Typography>
          <TextField
            sx={{ ml: 1 }}
            value={
              (isNewVariable
                ? newVar.value
                : varList[selectedVarIndex]?.value) ?? ''
            }
            onChange={isNewVariable ? handleNewVarChange : handleVarChange}
            name='value'
            placeholder='required'
            size='small'
            multiline
          />
        </ListItem>
        <ListItem>
          <Typography sx={{ fontWeight: 'bold' }} variant='body1'>
            description:
          </Typography>
          <TextField
            sx={{ ml: 1, width: '75%' }}
            value={
              (isNewVariable
                ? newVar.description
                : varList[selectedVarIndex]?.description) ?? ''
            }
            onChange={isNewVariable ? handleNewVarChange : handleVarChange}
            name='description'
            size='small'
          />
          <Button
            sx={{ ml: 1 }}
            color='success'
            onClick={() => {
              isNewVariable ? handleSaveNewVariable() : handleSaveVariable();
            }}
          >
            <SaveRoundedIcon />
          </Button>
          <Button
            color='error'
            onClick={() => {
              isNewVariable
                ? handleRemoveNewVariable()
                : handleRemoveVariable();
            }}
          >
            <RemoveCircleIcon />
          </Button>
        </ListItem>
        <Divider sx={{ mt: 1 }} />
      </List>
    </List>
  );
};

export default SetVariables;
