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
import {useState} from 'react';

const ModuleManager = ({handleCloseDrawer, moduleList, addModule}) => {
  const [modules, setModules] = useState(Object.keys(moduleList) || []);
  const [currentModule, setCurrentModule] = useState('');

  async function handleFileSelect(event) {
    const file = event.target.files[0];

    try {
      const contents = await readFile(file);
      const {userVariables, stageGroup, shapeCount, pageCount, ivrName} =
        JSON.parse(contents);

      setModules((prevModules) => [...prevModules, ivrName]);
      setCurrentModule(ivrName);
      moduleList[ivrName] = contents;
    } catch (err) {
      console.error(err);
    }
  }

  function handleImportFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.ivrf';
    fileInput.onchange = handleFileSelect;
    fileInput.click();
  }

  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  function handleDelete() {
    if (!currentModule) return;

    const index = modules.findIndex((m) => m === currentModule);

    if (index !== -1) {
      setModules((m) => {
        const temp = [...m];
        temp.splice(index, 1);
        return temp;
      });

      delete moduleList[currentModule];
      setCurrentModule('');
    }
  }

  function handleView() {
    if (!currentModule) return;

    const contents = moduleList[currentModule];
    const encoded = encodeURIComponent(contents);

    window.open('/module?projectData=' + encoded, '_blank');
  }

  function handleAddToWorkspace() {
    if (!currentModule) return;
    addModule(currentModule, {data: moduleList[currentModule]});
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
        <Tooltip title='Import module from file'>
          <Button
            sx={{
              mr: 1,
              color: 'black',
              backgroundColor: '#dcdcdc',
              '&:hover': {backgroundColor: '#b0b0b0'},
            }}
            variant='contained'
            onClick={handleImportFile}>
            Import
          </Button>
        </Tooltip>
        <Box sx={{ml: 'auto'}}>
          <Tooltip title='Delete module from project'>
            <Button
              sx={{
                mr: 1,
                color: 'black',
                backgroundColor: '#dcdcdc',
                '&:hover': {backgroundColor: '#b0b0b0'},
              }}
              onClick={handleDelete}>
              Delete
            </Button>
          </Tooltip>
          <Tooltip title='View module in new tab'>
            <Button
              sx={{
                mr: 1,
                color: 'black',
                backgroundColor: '#dcdcdc',
                '&:hover': {backgroundColor: '#b0b0b0'},
              }}
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
