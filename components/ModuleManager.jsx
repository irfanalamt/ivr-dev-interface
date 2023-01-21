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
  Typography
} from '@mui/material';
import {useState} from 'react';

const ModuleManager = ({handleCloseDrawer}) => {
  function handleImportFile() {
    // Prompt user to select a file
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.ivrf';
    fileInput.onchange = handleFileSelect;
    fileInput.click();
  }

  function handleFileSelect(event) {
    const file = event.target.files[0];
    // Use file to load project data and set it in the component state

    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target.result;
      console.log('File contents: ' + contents);
      const {userVariables, stageGroup, shapeCount, pageCount, ivrName} =
        JSON.parse(contents);

      console.log('ivrName: ' + ivrName);
    };
    reader.readAsText(file);
  }

  return (
    <List sx={{minWidth: 400}}>
      <Box
        sx={{
          mt: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <Typography
          sx={{
            backgroundColor: '#fff59d',
            px: 2,
            py: 1,
            boxShadow: 1,
            fontSize: '1.5rem',
            width: 'max-content'
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
              '&:hover': {backgroundColor: '#e57373'}
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
          size='small'></Select>
      </ListItem>
      <ListItem>
        <Tooltip title='Import module from file'>
          <Button
            sx={{
              mr: 1,
              color: 'black',
              backgroundColor: '#dcdcdc',
              '&:hover': {backgroundColor: '#b0b0b0'}
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
                '&:hover': {backgroundColor: '#b0b0b0'}
              }}>
              Delete
            </Button>
          </Tooltip>
          <Tooltip title='View module in new tab'>
            <Button
              sx={{
                mr: 1,
                color: 'black',
                backgroundColor: '#dcdcdc',
                '&:hover': {backgroundColor: '#b0b0b0'}
              }}>
              View
            </Button>
          </Tooltip>
          <Tooltip title='Add module to workspace'>
            <Button
              sx={{
                mr: 1,
                color: 'black',
                backgroundColor: '#dcdcdc',
                '&:hover': {backgroundColor: '#b0b0b0'}
              }}>
              Use
            </Button>
          </Tooltip>
        </Box>
      </ListItem>
    </List>
  );
};

export default ModuleManager;
