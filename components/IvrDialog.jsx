import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {checkValidity} from '../src/helpers';
import {useEffect, useState} from 'react';
import axios from 'axios';

const IvrDialog = ({isOpen, handleClose, setIvrName, isSaveAsOption}) => {
  const [errorText, setErrorText] = useState(false);
  const [dialog, setDialog] = useState({name: '', version: 1, description: ''});
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    fetchProjectsFromDb();
  }, []);

  function fetchProjectsFromDb() {
    const token = localStorage.getItem('token');
    axios
      .get('/api/getProjects2', {headers: {Authorization: token}})
      .then((response) => {
        setAllProjects(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleNameChange(e, type) {
    if (type === 'name') {
      validateIvrName(e.target.value);
    }

    handleInputChange(e, type);
  }

  function handleInputChange(event, type) {
    if (isSaveAsOption) console.log('yaay is save as🔴');
    setDialog({...dialog, [type]: event.target.value});
    if (type == 'version') {
      if (event.target.value > 0) {
        setErrorText(false);
      }
    }
  }

  function validateAndClose() {
    const isNotValid = validateIvrName(dialog.name);

    if (isNotValid) {
      setErrorText(isNotValid);
      return;
    }
    if (dialog.name.length <= 1 || errorText) {
      setErrorText('Name not in valid format');
      return;
    }

    if (dialog.version < 1) {
      setErrorText('Version not valid');
      return;
    }

    setErrorText(false);

    setIvrName({
      name: dialog.name,
      version: dialog.version,
      description: dialog.description,
    });

    handleClose();
  }

  function checkNameNotExist(name, projects) {
    return !projects.some((project) => project.name === name);
  }

  function validateIvrName(name) {
    const valid = checkValidity('object', name);
    if (valid !== -1) {
      setErrorText('Name not in valid format');
      return 'Name not in valid format';
    }

    const isUnique = checkNameNotExist(
      `${name}_${dialog.version}`,
      allProjects
    );

    if (!isUnique) {
      setErrorText(
        'Project with the specified name and version already exists'
      );
      return 'Project with the specified name and version already exists';
    }

    setErrorText(false);
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={validateAndClose}>
      <DialogContent>
        <Stack direction='row' spacing={3} alignItems='center'>
          <Box sx={{pr: 3}}>
            <Typography variant='subtitle1' fontWeight='medium'>
              IVR name
            </Typography>
            <TextField
              autoFocus
              variant='outlined'
              value={dialog.name}
              onChange={(e) => handleNameChange(e, 'name')}
              error={Boolean(errorText)}
              fullWidth
            />
          </Box>
          <Box sx={{pr: 3}}>
            <Typography variant='subtitle1' fontWeight='medium'>
              Version
            </Typography>
            <TextField
              sx={{width: '100px'}}
              variant='outlined'
              type='number'
              value={dialog.version}
              inputProps={{
                min: 1,
                max: 100,
              }}
              onChange={(e) => handleNameChange(e, 'version')}
            />
          </Box>
        </Stack>
        <Typography
          sx={{
            visibility: errorText ? 'visible' : 'hidden',
            color: 'error.main',
            mt: 2,
            textAlign: 'center',
          }}
          variant='caption'>
          {errorText}
        </Typography>
        <Typography sx={{mt: 3}} variant='subtitle1' fontWeight='medium'>
          Description
        </Typography>
        <TextField
          variant='outlined'
          value={dialog.description}
          onChange={(e) => handleNameChange(e, 'description')}
          multiline
          fullWidth
          minRows={3}
        />
      </DialogContent>
      <DialogActions>
        {isSaveAsOption && (
          <Button color='secondary' variant='outlined' onClick={handleClose}>
            Cancel
          </Button>
        )}
        <Button
          color='primary'
          variant='contained'
          disabled={!dialog.name || Boolean(errorText)}
          onClick={validateAndClose}>
          {isSaveAsOption ? 'Save As' : 'Open'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IvrDialog;
