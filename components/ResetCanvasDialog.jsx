import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const ResetCanvasDialog = ({open, handleClose, resetStage}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{'Clear entire workspace?'}</DialogTitle>
      <DialogContent>
        <DialogContentText>All unsaved work will be erased.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{backgroundColor: '#aed581'}}
          variant='contained'
          size='small'
          color='success'
          onClick={handleClose}>
          NO
        </Button>
        <Button
          sx={{backgroundColor: '#e57373'}}
          variant='contained'
          size='small'
          color='error'
          onClick={() => {
            resetStage();
            handleClose();
          }}
          autoFocus>
          YES
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetCanvasDialog;
