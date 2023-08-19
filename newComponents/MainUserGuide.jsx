import {Button, Modal, Paper, Typography} from '@mui/material';

const MainUserGuide = ({open, handleClose}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        mx: 'auto',
        maxHeight: '75vh',
        maxWidth: '75vw',
        overflowY: 'scroll',
        mt: '60px',
      }}>
      <Paper
        sx={{
          padding: '2rem',
          marginTop: '60px',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Typography sx={{mb: 2}} variant='h5'>
          User Guide
        </Typography>
        <Typography variant='body1'>
          <strong>Adding Elements:</strong>
          <ul>
            <li>Click on an element in the toolbar to select it.</li>
            <li>Click on the workspace to add the selected element.</li>
            <li>Double-click the added element to open its settings panel.</li>
            <li>
              Customize the element and save. Invalid entries won't be saved and
              errors will be displayed.
            </li>
          </ul>
          <em>
            Note: The IVR flow must begin with a green 'start' block, found as
            the first element in the toolbar.
          </em>
          <br />
          <br /> <strong>Connecting Elements:</strong>
          <ul>
            <li>
              Left-click and hold the bottom connection point of an element.
            </li>
            <li>Drag and drop onto another element to connect them.</li>
            <li>
              To remove a connection, click, drag, and release in an empty
              workspace area.
            </li>
          </ul>
          <br />
          <strong>Deleting Elements:</strong>
          <ul>
            <li>Right-click on an element to open the context menu.</li>
            <li>Select "delete" to remove the element.</li>
            <li>
              For multiple elements, drag a selection rectangle, right-click,
              and choose "delete".
            </li>
          </ul>
          <br />
          <strong>Managing Variables:</strong>
          <ul>
            <li>
              Access the Variable Manager from the appbar menu as well as the
              settings panel of every element.
            </li>
          </ul>
          <br />
          <strong>Generating IVR Script:</strong>
          <ul>
            <li>
              After customizing all elements, click the green "Generate Script"
              button in the top right corner of the appbar.
            </li>
          </ul>
        </Typography>
        <Button sx={{ml: 'auto', mt: 2}} onClick={handleClose}>
          Close
        </Button>
      </Paper>
    </Modal>
  );
};

export default MainUserGuide;
