import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const SaveChangesDialog = ({
  open,
  handleClose,
  closeDialog = null,
  handleSave,
}) => {
  return (
    <Dialog open={open}>
      <DialogTitle>{'Unsaved Changes'}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{minWidth: 400}}>
          There are unsaved changes in the current element.
          <br /> Do you want to save your changes or discard them?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            if (closeDialog) {
              closeDialog();
              handleClose();
            } else {
              handleClose();
            }
          }}
          color='error'
          variant='outlined'>
          Discard
        </Button>
        <Button
          onClick={() => {
            const saveSuccess = handleSave();
            if (closeDialog) {
              if (saveSuccess) {
                closeDialog();
                handleClose();
              } else {
                closeDialog();
              }
            } else {
              handleClose();
            }
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
