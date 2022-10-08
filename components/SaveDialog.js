import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

const SaveDialog = ({ open, setOpen, fileName }) => {
  const [name, setName] = useState('');

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Generate Configuration</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To create the config.js file, please enter your file name without
          extension.
        </DialogContentText>
        <TextField
          sx={{ mt: 2 }}
          autoFocus
          label='FileName'
          type='text'
          variant='standard'
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button sx={{ mx: 2 }} onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            fileName(name);
            handleClose();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveDialog;
