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

const IvrDialog = ({isOpen, handleClose, ivrName, handleInputChange}) => {
  const [isError, setIsError] = useState(false);

  function handleNameChange(e, type) {
    if (type === 'name') {
      validateIvrName(e.target.value);
    }

    handleInputChange(e, type);
  }

  function validateAndClose() {
    if (ivrName.name.length > 1 && !isError) handleClose();
    else setIsError(true);
  }

  function validateIvrName(name) {
    const valid = checkValidity('object', name);
    setIsError(valid !== -1);
  }

  return (
    <Dialog open={isOpen} onClose={validateAndClose}>
      <DialogContent>
        <Typography variant='body2' fontSize='large'>
          IVR name
        </Typography>
        <TextField
          sx={{mt: -0.3}}
          autoFocus
          margin='dense'
          size='small'
          value={ivrName.name}
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
          sx={{mt: -0.3}}
          type='number'
          value={ivrName.version}
          onChange={(e) => handleNameChange(e, 'version')}
          margin='dense'
          size='small'
        />
      </DialogContent>
      <DialogActions>
        <Button
          color='primary'
          disabled={!ivrName.name || isError}
          onClick={validateAndClose}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IvrDialog;
