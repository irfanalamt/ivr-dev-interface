import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Stack,
  List,
  ListItem,
  Box,
} from '@mui/material';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

const UserGuideDialog = ({open, handleClose}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            boxShadow: 1,
            width: 'max-content',
            px: 1,
            borderRadius: 1,
          }}
          variant='h6'>
          <HelpCenterIcon sx={{mr: 0.5}} />
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
                • Choose an element from the toolbar.
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
                • Left-click and hold down the mouse on the first element.
              </ListItem>
              <ListItem disablePadding>
                • Release the mouse on the second element to connect them.
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
          <Box>
            <Typography fontSize='medium' variant='subtitle2'>
              Moving Elements:
            </Typography>
            <List>
              <ListItem disablePadding>
                • Left-click anywhere on the workspace and start dragging to
                create a multi-selection rectangle.
              </ListItem>
              <ListItem disablePadding>
                • Selected elements can be moved together.
              </ListItem>
              <ListItem disablePadding>
                • Left-click and drag elements to move them one by one.
              </ListItem>
            </List>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default UserGuideDialog;
