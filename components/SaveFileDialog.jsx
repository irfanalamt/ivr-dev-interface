import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { checkValidity } from '../src/helpers';
import SaveAsIcon from '@mui/icons-material/SaveAs';

const SaveFileDialog = ({ open, handleClose, saveToFile }) => {
  const [ivrName, setIVRName] = useState('');
  const [version, setVersion] = useState(1);
  const [errorText, setErrorText] = useState('');

  function handleSaveFile() {
    if (ivrName === '' || errorText !== '') return;

    saveToFile(ivrName, version);
    handleClose();
  }

  function handleNameValidation(value) {
    const errorM = checkValidity('object', value);
    if (errorM === -1) {
      // No error condition
      setErrorText('');
      return;
    }

    setErrorText(errorM);
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='xs'>
      <Typography
        sx={{
          backgroundColor: '#FFE4E1',
          color: '#FF0000',
          width: 'max-content',
          mx: 'auto',
          fontSize: '0.75rem',
        }}
        variant='subtitle1'
      >
        {errorText}
      </Typography>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ width: '35%' }} variant='subtitle2'>
            IVR name:
          </Typography>
          <TextField
            sx={{ width: 200 }}
            value={ivrName}
            onChange={(e) => {
              handleNameValidation(e.target.value);
              setIVRName(e.target.value);
            }}
            size='small'
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography sx={{ width: '35%' }} variant='subtitle2'>
            version:
          </Typography>
          <TextField
            sx={{ width: 80 }}
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            size='small'
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color='primary'
          variant='outlined'
          size='small'
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveFile}
          color='secondary'
          variant='contained'
          size='small'
        >
          Save File
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveFileDialog;
