import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import {checkValidity} from '../src/helpers';
import {useState} from 'react';

const IvrDialog = ({isOpen, handleClose, ivrName, setIvrName}) => {
  const [isError, setIsError] = useState(false);
  const [dialog, setDialog] = useState({name: '', version: 1});

  function handleNameChange(e, type) {
    if (type === 'name') {
      validateIvrName(e.target.value);
    }

    handleInputChange(e, type);
  }

  function handleInputChange(event, type) {
    setDialog({...dialog, [type]: event.target.value});
  }

  function validateAndClose() {
    if (dialog.name.length > 1 && !isError) {
      setIvrName({name: dialog.name, version: dialog.version});
      handleClose();
    } else setIsError(true);
  }

  function validateIvrName(name) {
    const valid = checkValidity('object', name);
    setIsError(valid !== -1);
  }

  return (
    <Dialog open={isOpen} onClose={validateAndClose}>
      <DialogContent sx={{minWidth: 450}}>
        <Typography variant='body2' fontSize='large'>
          IVR name
        </Typography>
        <TextField
          sx={{mt: -0.3, maxWidth: 300}}
          autoFocus
          margin='dense'
          size='small'
          value={dialog.name}
          onChange={(e) => handleNameChange(e, 'name')}
          error={isError}
          fullWidth
        />
        <Typography
          sx={{
            visibility: isError ? 'visible' : 'hidden',
            color: 'red',
            textAlign: 'center',
            fontSize: 'small',
          }}
          variant='body1'>
          Name not in valid format
        </Typography>
        <Typography sx={{mt: 1}} variant='body2' fontSize='large'>
          Version
        </Typography>
        <TextField
          sx={{mt: -0.3, maxWidth: 100}}
          type='number'
          value={dialog.version}
          onChange={(e) => handleNameChange(e, 'version')}
          margin='dense'
          size='small'
        />
      </DialogContent>
      <DialogActions>
        <Button
          color='primary'
          disabled={!dialog.name || isError}
          onClick={validateAndClose}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IvrDialog;
