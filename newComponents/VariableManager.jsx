import {
  Box,
  Button,
  Drawer,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {useState} from 'react';

const VariableManager = ({isOpen, handleClose, userVariables}) => {
  const [variables, setVariables] = useState(userVariables);
  const [currentVariable, setCurrentVariable] = useState('');
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [defaultValue, setDefaultValue] = useState('');
  const [description, setDescription] = useState('');

  const [mode, setMode] = useState('');

  function handleSave() {
    console.log('mode: ' + mode);

    console.log('🔥', type, name, defaultValue, description);

    if (mode == 'modify') {
      const index = variables.findIndex((v) => v == currentVariable);

      if (index !== -1) {
        setVariables((v) => {
          const temp = [...v];
          temp[index] = {type, name, defaultValue, description};
          return temp;
        });
      }
    } else if (mode == 'add') {
      setVariables([...variables, {type, name, defaultValue, description}]);
    }

    setMode('');
    setCurrentVariable('');
    setName('');
    setDefaultValue('');
    setDescription('');
  }

  function handleDelete() {
    const index = variables.findIndex((v) => v == currentVariable);

    if (index !== -1) {
      setVariables((v) => {
        const temp = [...v];
        temp.splice(index, 1);
        return temp;
      });
    }

    setMode('');
    setCurrentVariable('');
    setName('');
    setDefaultValue('');
    setDescription('');
  }

  function handleAddNewVariable() {
    setMode('add');
    setCurrentVariable('');
    setName('');
    setDefaultValue('');
    setDescription('');
  }

  return (
    <Drawer anchor='left' open={isOpen} onClose={handleClose}>
      <List sx={{minWidth: 400}}>
        <ListItem>
          <IconButton
            onClick={handleClose}
            sx={{
              ml: 'auto',
              backgroundColor: '#dcdcdc',
              color: 'black',
              '&:hover': {backgroundColor: '#ffcdd2'},
            }}>
            <CloseIcon sx={{fontSize: '22px'}} />
          </IconButton>
        </ListItem>
        <ListItem>
          <Typography
            sx={{mt: 1, display: 'flex', alignItems: 'center', mx: 'auto'}}
            variant='h5'>
            {
              <img
                src='/icons/variableManager.png'
                alt='Icon'
                height={'22px'}
                width={'22px'}
              />
            }
            &nbsp; VARIABLE MANAGER
          </Typography>
        </ListItem>
        <ListItem>
          <InputLabel sx={{pt: 2}} id='select-label'>
            variable list
          </InputLabel>
          <Select
            labelId='select-label'
            value={currentVariable}
            onChange={(e) => {
              setCurrentVariable(e.target.value);
              setType(e.target.value.type);
              setName(e.target.value.name);
              setDefaultValue(e.target.value.defaultValue);
              setDescription(e.target.value.description);
              setMode('');
            }}
            sx={{width: 200, ml: 1, mt: 2}}
            size='small'>
            {variables.map((v, i) => (
              <MenuItem key={i} value={v}>
                {v.name}
              </MenuItem>
            ))}
          </Select>
          <Button
            sx={{
              mt: 2,
              ml: 1,
              backgroundColor: '#cfd8dc',
              color: 'black',
              '&:hover': {backgroundColor: '#dcedc8'},
            }}
            onClick={handleAddNewVariable}
            size='small'
            endIcon={<AddIcon />}>
            Add
          </Button>
        </ListItem>
        <ListItem>
          <Box sx={{mx: 'auto', display: currentVariable ? 'block' : 'none'}}>
            <Button
              sx={{
                backgroundColor: '#cfd8dc',
                color: 'black',
                '&:hover': {backgroundColor: '#b3e5fc'},
              }}
              onClick={() => setMode('modify')}
              size='small'
              disabled={mode == 'modify'}
              endIcon={<EditIcon />}>
              Modify
            </Button>
            <Button
              sx={{
                ml: 2,
                backgroundColor: '#cfd8dc',
                color: 'black',
                '&:hover': {backgroundColor: '#f8bbd0'},
                display: mode == 'modify' ? 'inline-flex' : 'none',
              }}
              onClick={handleDelete}
              size='small'
              endIcon={<DeleteIcon />}>
              Delete
            </Button>
          </Box>
        </ListItem>
        <ListItem sx={{mt: 2}}>
          <Typography sx={{width: '100px'}} variant='subtitle2'>
            Type:
          </Typography>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            size='small'
            disabled={!(mode == 'add' || mode == 'modify')}
            sx={{
              minWidth: 100,
              backgroundColor:
                mode == 'add' || mode == 'modify' ? 'white' : '#f5f5f5',
            }}>
            <MenuItem value='prompt'>Prompt</MenuItem>
            <MenuItem value='number'>Number</MenuItem>
            <MenuItem value='string'>String</MenuItem>
            <MenuItem value='boolean'>Boolean</MenuItem>
            <MenuItem value='date'>Date</MenuItem>
            <MenuItem value='day'>Day</MenuItem>
            <MenuItem value='month'>Month</MenuItem>
            <MenuItem value='time'>Time</MenuItem>
          </Select>
        </ListItem>
        <ListItem>
          <Typography sx={{width: '100px'}} variant='subtitle2'>
            Name:
          </Typography>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              width: 200,
              backgroundColor:
                mode == 'add' || mode == 'modify' ? 'white' : '#f5f5f5',
            }}
            size='small'
            disabled={!(mode == 'add' || mode == 'modify')}
          />
        </ListItem>
        <ListItem>
          <Typography sx={{width: '100px'}} variant='subtitle2'>
            Default Value:
          </Typography>
          <TextField
            value={defaultValue}
            onChange={(e) => setDefaultValue(e.target.value)}
            sx={{
              width: 200,
              backgroundColor:
                mode == 'add' || mode == 'modify' ? 'white' : '#f5f5f5',
            }}
            size='small'
            disabled={!(mode == 'add' || mode == 'modify')}
          />
          <Button
            onClick={handleSave}
            endIcon={<SaveIcon />}
            variant='contained'
            sx={{ml: 1}}>
            Save
          </Button>
        </ListItem>
        <ListItem>
          <Typography sx={{width: '100px'}} variant='subtitle2'>
            Description:
          </Typography>
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              width: 200,
              backgroundColor:
                mode == 'add' || mode == 'modify' ? 'white' : '#f5f5f5',
            }}
            size='small'
            multiline
            minRows={2}
            disabled={!(mode == 'add' || mode == 'modify')}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default VariableManager;
