import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { Box, Button, Tooltip, Typography } from '@mui/material';

const DrawerTop = ({
  saveUserValues,
  shape,
  handleCloseDrawer,
  backgroundColor,
  blockName,
}) => {
  return (
    <Box
      sx={{
        mt: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography
        sx={{
          backgroundColor: backgroundColor,
          px: 2,
          py: 1,
          boxShadow: 1,
          fontSize: '1.5rem',
          width: 'max-content',
        }}
        variant='h6'
      >
        {blockName}
      </Typography>
      <Box>
        <Tooltip title='SAVE'>
          <Button
            sx={{
              height: 30,
              mr: 1,
              color: 'black',
              backgroundColor: '#dcdcdc',
              '&:hover': { backgroundColor: '#aed581' },
            }}
            size='small'
            variant='contained'
            onClick={saveUserValues}
          >
            <SaveRoundedIcon sx={{ fontSize: 21 }} />
          </Button>
        </Tooltip>
        <Tooltip title='CLOSE'>
          <Button
            size='small'
            variant='contained'
            sx={{
              height: 30,
              mr: 1,
              color: 'black',
              backgroundColor: '#dcdcdc',
              '&:hover': { backgroundColor: '#e57373' },
            }}
            onClick={() => {
              shape.setSelected(false);
              handleCloseDrawer();
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 21 }} />
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default DrawerTop;
