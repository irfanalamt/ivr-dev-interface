import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef } from 'react';

const SaveProjectDialog = ({ open, setOpen, projectName }) => {
  const handleClose = () => setOpen(false);
  const nameRef = useRef('');

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Save project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To save project, please enter projectName
        </DialogContentText>
        <TextField
          sx={{ mt: 2 }}
          autoFocus
          label='FileName'
          type='text'
          variant='standard'
          inputRef={nameRef}
        />
      </DialogContent>
      <DialogActions>
        <Button sx={{ mx: 2 }} onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            projectName(nameRef.current.value);
            handleClose();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveProjectDialog;
