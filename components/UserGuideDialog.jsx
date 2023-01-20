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
                • Drag and drop elements from the toolbar to the desired
                location on the workspace.
              </ListItem>
              <ListItem disablePadding>
                • Left click on the added element to open its settings panel.
              </ListItem>
            </List>
          </Box>
          <Box>
            <Typography fontSize='medium' variant='subtitle2'>
              Connecting Elements:
            </Typography>
            <List>
              <ListItem disablePadding>
                • Right-click anywhere on the workspace to switch to connect
                mode.
              </ListItem>
              <ListItem disablePadding>
                • Left-click and hold down the mouse on the first element, then
                release it on the second element to connect them.
              </ListItem>
              <ListItem disablePadding>
                • Left-click anywhere on the workspace to switch back to drawing
                mode.
              </ListItem>
            </List>
          </Box>
          <Box>
            <Typography fontSize='medium' variant='subtitle2'>
              Deleting Elements:
            </Typography>
            <List>
              <ListItem disablePadding>
                • Drag the element you wish to delete to the bottom right delete
                icon.
              </ListItem>
            </List>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default UserGuideDialog;
