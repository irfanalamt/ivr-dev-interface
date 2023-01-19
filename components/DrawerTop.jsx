import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {Box, Button, IconButton, Tooltip, Typography} from '@mui/material';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import DrawerUserGuideDialog from './DrawerUserGuideDialog';
import {useState} from 'react';

const DrawerTop = ({
  saveUserValues,
  shape,
  handleCloseDrawer,
  backgroundColor,
  blockName
}) => {
  const [openGuideDialog, setOpenGuideDialog] = useState(false);

  return (
    <>
      <Box
        sx={{
          mt: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography
          sx={{
            backgroundColor: backgroundColor,
            px: 2,
            py: 1,
            boxShadow: 1,
            fontSize: '1.5rem',
            width: 'max-content'
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
                '&:hover': {backgroundColor: '#aed581'}
              }}
              size='small'
              variant='contained'
              onClick={saveUserValues}
            >
              <SaveRoundedIcon sx={{fontSize: 21}} />
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
                '&:hover': {backgroundColor: '#e57373'}
              }}
              onClick={() => {
                shape.setSelected(false);
                handleCloseDrawer();
              }}
            >
              <CloseRoundedIcon sx={{fontSize: 21}} />
            </Button>
          </Tooltip>
        </Box>
      </Box>
      <Tooltip placement='right' title='guide' arrow>
        <IconButton
          sx={{
            mt: 1,
            ml: 1,
            backgroundColor: '#dcdcdc',
            '&:hover': {backgroundColor: '#80cbc4'},
            width: 'max-content',
            position: 'absolute'
          }}
          aria-label='user-guide'
          size='small'
          onClick={() => setOpenGuideDialog(true)}
        >
          <HelpCenterIcon sx={{color: 'black', fontSize: 'medium'}} />
        </IconButton>
      </Tooltip>
      {openGuideDialog && (
        <DrawerUserGuideDialog
          open={openGuideDialog}
          handleClose={() => setOpenGuideDialog(false)}
          name={shape.type}
        />
      )}
    </>
  );
};

export default DrawerTop;
