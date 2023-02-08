import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  Divider,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import {useEffect, useState} from 'react';

const ModuleManager = ({handleCloseDrawer, addModule}) => {
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState('');

  useEffect(() => {
    fetchModules();
  }, []);

  async function fetchModules() {
    try {
      const response = await axios.get('/api/getModules');
      setModules(response.data);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function handleView() {
    if (!currentModule) return;

    try {
      const response = await axios.get(
        `/api/getModule?fileName=${currentModule}`
      );
      const contents = JSON.stringify(response.data);
      const encoded = encodeURIComponent(contents);

      window.open(`/module?projectData=${encoded}`, '_blank');
    } catch (error) {
      console.log(error);
    }
  }

  async function handleAddToWorkspace() {
    if (!currentModule) return;

    try {
      const response = await axios.get(
        `/api/getModule?fileName=${currentModule}`
      );
      addModule(currentModule, {data: JSON.stringify(response.data)});
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <List sx={{minWidth: 400}}>
      <Box
        sx={{
          mt: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Typography
          sx={{
            backgroundColor: '#fff59d',
            px: 2,
            py: 1,
            boxShadow: 1,
            fontSize: '1.5rem',
            width: 'max-content',
          }}
          variant='h6'>
          Module Manager
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
              '&:hover': {backgroundColor: '#e57373'},
            }}
            onClick={handleCloseDrawer}>
            <CloseRoundedIcon sx={{fontSize: 21}} />
          </Button>
        </Tooltip>
      </Box>
      <ListItem sx={{mt: 4, mb: 1}}>
        <InputLabel id='select-label'>module list</InputLabel>
        <Select
          sx={{ml: 2, minWidth: '50%'}}
          labelId='select-label'
          size='small'
          value={currentModule}
          onChange={(e) => setCurrentModule(e.target.value)}>
          {modules.map((m, i) => (
            <MenuItem value={m} key={i}>
              {m}
            </MenuItem>
          ))}
        </Select>
      </ListItem>
      <ListItem>
        <Box sx={{ml: 'auto'}}>
          <Tooltip title='View module in new tab'>
            <Button
              sx={{
                mr: 2,
                color: 'black',
                backgroundColor: '#dcdcdc',
                '&:hover': {backgroundColor: '#b0b0b0'},
              }}
              variant='contained'
              onClick={handleView}>
              View
            </Button>
          </Tooltip>
          <Tooltip title='Add module to workspace'>
            <Button
              sx={{
                mr: 1,
                color: 'black',
                backgroundColor: '#dcdcdc',
                '&:hover': {backgroundColor: '#b0b0b0'},
              }}
              variant='contained'
              onClick={handleAddToWorkspace}>
              Use
            </Button>
          </Tooltip>
        </Box>
      </ListItem>
    </List>
  );
};

export default ModuleManager;
