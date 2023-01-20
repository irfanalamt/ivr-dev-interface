import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Stack,
  List,
  ListItem,
  Box
} from '@mui/material';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

const UserGuideDialog = ({open, handleClose}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography sx={{display: 'flex', alignItems: 'center'}} variant='h6'>
          <HelpCenterIcon />
          User Guide
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Box>
            <Typography fontSize='medium' variant='subtitle2'>
              Adding Elements:
            </Typography>
            <List>
              <ListItem disablePadding>
                • To add elements to the workspace, drag and drop them from the
                toolbar to the desired location.
              </ListItem>
              <ListItem disablePadding>
                • Once an element is added, left click on it to open its
                settings panel.
              </ListItem>
            </List>
          </Box>
          <Box>
            <Typography fontSize='medium' variant='subtitle2'>
              Connecting Elements:
            </Typography>
            <List>
              <ListItem disablePadding>
                • Switch to connect mode by right-clicking anywhere on the
                workspace.
              </ListItem>
              <ListItem disablePadding>
                • To connect two elements, left-click and hold down the mouse on
                the first element and release it on the second element.
              </ListItem>
              <ListItem disablePadding>
                • To switch back to drawing mode, left-click anywhere on the
                workspace.
              </ListItem>
            </List>
          </Box>
          <Box>
            <Typography fontSize='medium' variant='subtitle2'>
              Deleting Elements:
            </Typography>
            <List>
              <ListItem disablePadding>
                • To delete elements, drag them to the bottom right delete icon.
              </ListItem>
            </List>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default UserGuideDialog;
