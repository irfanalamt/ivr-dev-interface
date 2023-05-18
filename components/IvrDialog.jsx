import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {checkValidity} from '../src/helpers';
import {useEffect, useState} from 'react';
import axios from 'axios';

const IvrDialog = ({isOpen, handleClose, setIvrName}) => {
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
        <Stack direction='row' spacing={2}>
          <Box>
            <Typography variant='body2' fontSize='large'>
              IVR name
            </Typography>
            <TextField
              sx={{mt: -0.3}}
              autoFocus
              margin='dense'
              size='small'
              value={dialog.name}
              onChange={(e) => handleNameChange(e, 'name')}
              error={Boolean(errorText)}
              fullWidth
            />
          </Box>
          <Box>
            <Typography variant='body2' fontSize='large'>
              Version
            </Typography>
            <TextField
              sx={{mt: -0.3, maxWidth: 100}}
              type='number'
              value={dialog.version}
              inputProps={{
                min: 1,
                max: 100,
              }}
              onChange={(e) => handleNameChange(e, 'version')}
              margin='dense'
              size='small'
            />
          </Box>
        </Stack>
        <Typography
          sx={{
            visibility: errorText ? 'visible' : 'hidden',
            color: 'red',
            textAlign: 'center',
            fontSize: 'small',
          }}
          variant='body1'>
          {errorText}
        </Typography>

        <Typography sx={{mt: 1}} variant='body2' fontSize='large'>
          Description
        </Typography>
        <TextField
          sx={{mt: -0.3}}
          value={dialog.description}
          onChange={(e) => handleNameChange(e, 'description')}
          margin='dense'
          size='small'
          multiline
          fullWidth
          minRows={2}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color='primary'
          disabled={!dialog.name || Boolean(errorText)}
          onClick={validateAndClose}>
          Open
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IvrDialog;
