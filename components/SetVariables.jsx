import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
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
  const [varType, setVarType] = useState('prompt');
  const [selectedIndex, setSelectedIndex] = useState(null);

  function handleRowClick(e, index) {
    setSelectedIndex(index);
  }

  function handleAddVariable() {
    setVarList((list) => [
      ...list,
      {
        type: varType,
        name: '',
        value: '',
        description: '',
      },
    ]);
    setSelectedIndex(varList.length);
  }

  function handleChange(e) {
    const { value, name } = e.target;

    setVarList((list) => {
      const tempArray = [...list];
      tempArray[selectedIndex][name] = value;
      return tempArray;
    });
  }

  function handleRemoveVariable() {
    setVarList((list) => {
      const tempArray = [...list];
      tempArray.splice(selectedIndex, 1);
      return tempArray;
    });

    setSelectedIndex(null);
  }

  function handleSaveVariable() {
    // only save vars with name and value property
    const filteredVariables = varList.filter((v) => v.name && v.value);
    setVarList(filteredVariables);
    setUserVariables(filteredVariables);
    setSelectedIndex(null);
  }

  return (
    <List sx={{ minWidth: 350 }}>
      <ListItem>
        <Typography
          sx={{
            backgroundColor: '#ffab91',
            px: 2,
            py: 1,
            boxShadow: 1,
            ml: -2,
            fontSize: '1.5rem',
          }}
          variant='h6'
        >
          Init Variables
        </Typography>
        <Tooltip title='SAVE CHANGES'>
          <Button
            size='small'
            variant='outlined'
            color='success'
            sx={{ height: 30, ml: 'auto' }}
            onClick={handleSaveVariable}
          >
            <SaveRoundedIcon />
          </Button>
        </Tooltip>
        <Tooltip title='CLOSE'>
          <Button
            size='small'
            variant='outlined'
            color='error'
            sx={{ height: 30, ml: 1 }}
            onClick={handleCloseDrawer}
          >
            <CloseRoundedIcon sx={{ fontSize: 21 }} />
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem sx={{ mt: 4 }}>
        <Select
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

        <Button
          onClick={handleAddVariable}
          sx={{ ml: 2 }}
          variant='outlined'
          size='small'
          color='success'
        >
          Add variable
        </Button>
      </ListItem>
      <ListItem>
        {varList.length === 0 ? (
          <Typography
            sx={{ mx: 'auto', mt: 2, backgroundColor: '#ffebee', p: 1 }}
            variant='h5'
          >
            No variables added
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table size='small'>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fbe9e7' }}>
                  <TableCell>TYPE</TableCell>
                  <TableCell align='center'>NAME</TableCell>
                  <TableCell align='center'>VALUE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {varList.map((data, i) => (
                  <TableRow
                    onClick={(e) => handleRowClick(e, i)}
                    key={i}
                    hover
                    selected={i == selectedIndex ? true : false}
                  >
                    <TableCell variant='head'>{data.type}</TableCell>
                    <TableCell align='left'>{data.name}</TableCell>
                    <TableCell align='left'>{data.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </ListItem>
      <List
        sx={{
          mt: 1,
          display: selectedIndex !== null ? 'block' : 'none',
          width: 500,
        }}
      >
        <Divider />
        <ListItem>
          <Typography
            sx={{ fontWeight: 'bold', fontSize: '1.05rem' }}
            variant='body1'
          >
            type:
          </Typography>
          <Typography
            sx={{
              ml: 1,
              fontSize: '1.05rem',
              px: 1,
              backgroundColor: '#e3f2fd',
            }}
          >
            {varList[selectedIndex]?.type}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography sx={{ fontWeight: 'bold' }} variant='body1'>
            name:
          </Typography>
          <TextField
            sx={{ ml: 1 }}
            name='name'
            placeholder='required'
            onChange={handleChange}
            value={varList[selectedIndex]?.name ?? ''}
            size='small'
            multiline
            autoFocus
          />
          <Typography sx={{ fontWeight: 'bold', ml: 2 }} variant='body1'>
            defaultValue:
          </Typography>
          <TextField
            sx={{ ml: 1 }}
            name='value'
            placeholder='required'
            onChange={handleChange}
            value={varList[selectedIndex]?.value ?? ''}
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
            name='description'
            onChange={handleChange}
            value={varList[selectedIndex]?.description ?? ''}
            size='small'
          />
          <Button sx={{ ml: 1 }} color='success' onClick={handleSaveVariable}>
            <SaveRoundedIcon />
          </Button>
          <Button color='error' onClick={handleRemoveVariable}>
            <RemoveCircleIcon />
          </Button>
        </ListItem>

        <Divider />
      </List>
    </List>
  );
};

export default SetVariables;
