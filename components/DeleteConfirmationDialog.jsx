import * as React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import Button from '@mui/material/Button';

const DeleteConfirmationDialog = ({open, onClose, onConfirm, itemName}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete {itemName}?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={onConfirm} color='primary' autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
