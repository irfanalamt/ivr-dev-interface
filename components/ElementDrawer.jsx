import {Typography} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import SetParams from '../newComponents/SetParams2';

const ElementDrawer = ({
  shape,
  isOpen,
  handleCloseDrawer,
  shapes,
  clearAndDraw,
}) => {
  if (!shape) return null;

  const renderShape = () => {
    switch (shape.type) {
      case 'setParams':
        return (
          <SetParams
            {...{
              shape,
              handleCloseDrawer,
              shapes,
              clearAndDraw,
            }}
          />
        );

      default:
        return (
          <Typography sx={{marginY: 3}} variant='h4'>
            {shape.type}dsd
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
