import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Stack,
} from '@mui/material';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

const UserGuideDialog = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography sx={{ display: 'flex', alignItems: 'center' }} variant='h6'>
          <HelpCenterIcon />
          User Guide
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Typography>
            -Draw: drag and drop shapes from the palette located on the left
            side of the screen.
          </Typography>
          <Typography>
            -Delete: drag the shapes to the bottom right delete icon.
          </Typography>
          <Typography>
            -Connect: right-click to switch to connect mode. To switch back to
            drawing mode, left click anywhere on the stage or palette.
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default UserGuideDialog;
