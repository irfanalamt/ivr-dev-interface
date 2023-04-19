import React, {useState} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

function ResetWorkspaceDialog({open, onClose, onConfirm}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Reset Workspace</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to reset the workspace? All unsaved changes will
          be lost.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={onConfirm} color='primary' autoFocus>
          Reset Workspace
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ResetWorkspaceDialog;
