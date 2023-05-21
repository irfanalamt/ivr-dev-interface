import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const SaveChangesDialog = ({open, handleClose, handleSave}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{'Unsaved Changes'}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{minWidth: 400}}>
          There are unsaved changes in the current element.
          <br /> Do you want to save your changes or discard them?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='error' variant='outlined'>
          Discard
        </Button>
        <Button
          onClick={() => {
            handleSave();
            handleClose();
          }}
          color='success'
          variant='contained'
          autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveChangesDialog;
