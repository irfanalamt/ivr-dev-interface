import {Typography} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import SetParams from '../newComponents/SetParams2';

const ElementDrawer = ({
  shape,
  isOpen,
  handleCloseDrawer,
  shapes,
  clearAndDraw,
  userVariables,
  openVariableManager,
}) => {
  if (!shape) return null;

  const renderShape = () => {
    switch (shape.type) {
      case 'setParams':
        return (
          <SetParams
            shape={shape}
            handleCloseDrawer={handleCloseDrawer}
            shapes={shapes}
            clearAndDraw={clearAndDraw}
            userVariables={userVariables}
            openVariableManager={openVariableManager}
          />
        );

      default:
        return (
          <Typography sx={{marginY: 3}} variant='h4'>
            {shape.type}
          </Typography>
        );
    }
  };
  return (
    <Drawer anchor='right' open={isOpen} onClose={handleCloseDrawer}>
      {renderShape()}
    </Drawer>
  );
};

export default ElementDrawer;
