import {
  Avatar,
  Box,
  Typography,
  Button,
  Tooltip,
  IconButton,
} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import UserGuideDialog from './UserGuideDialog';
import { useState } from 'react';

const CanvasAppbar = ({
  isConnecting,
  setIsConnecting,
  showResetDialog,
  generateFile,
  ivrName,
  showSaveFileDialog,
}) => {
  const [openUserGuideDialog, setOpenUserGuideDialog] = useState(false);

  return (
    <Box sx={{ position: 'fixed', top: 0 }}>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#f5f5f5',
          alignItems: 'center',
          height: 50,
          px: 3,
          boxShadow: 1,
          width: '100vw',
          mx: 'auto',
        }}
      >
        <Avatar sx={{ backgroundColor: '#bbdefb', mr: 2 }}>
          <ArchitectureIcon sx={{ fontSize: '2rem', color: 'black' }} />
        </Avatar>
        <Tooltip title='user guide'>
          <IconButton
            sx={{
              mr: 2,
              backgroundColor: '#dcdcdc',
              '&:hover': { backgroundColor: '#80cbc4' },
            }}
            aria-label='user-guide'
            size='small'
            onClick={() => setOpenUserGuideDialog(true)}
          >
            <HelpCenterIcon sx={{ color: 'black', fontSize: 'large' }} />
          </IconButton>
        </Tooltip>
        <Typography
          sx={{ backgroundColor: '#c5e1a5', px: 1, boxShadow: 1, ml: 1 }}
          variant='subtitle2'
        >
          {isConnecting > 0 ? 'Connect Mode' : ''}
        </Typography>

        <Box
          sx={{
            ml: 'auto',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ mr: 3 }} variant='subtitle1'>
            {ivrName}
          </Typography>
          <Tooltip title='SAVE TO FILE'>
            <Button
              sx={{
                zIndex: 6,
                mr: 1,
                backgroundColor: '#dcdcdc',
                color: 'black',
              }}
              variant='contained'
              size='small'
              color='secondary'
              onClick={showSaveFileDialog}
            >
              <SaveAsIcon sx={{ fontSize: '1.2rem' }} />
            </Button>
          </Tooltip>
          <Tooltip title='RESET CANVAS'>
            <Button
              sx={{
                zIndex: 6,
                mr: 1,
                backgroundColor: '#dcdcdc',
                color: 'black',
                '&:hover': { backgroundColor: '#64b5f6' },
              }}
              variant='contained'
              size='small'
              onClick={showResetDialog}
            >
              <RestartAltIcon sx={{ fontSize: '1.2rem' }} />
            </Button>
          </Tooltip>
          <Tooltip title='GENERATE SCRIPT'>
            <Button
              sx={{
                zIndex: 6,
                backgroundColor: '#66bb6a',
                color: 'black',
                '&:hover': {
                  backgroundColor: '#43a047',
                },
              }}
              size='small'
              variant='contained'
              onClick={generateFile}
            >
              <SaveAltIcon sx={{ fontSize: '1.2rem' }} />
            </Button>
          </Tooltip>
        </Box>
      </Box>
      <UserGuideDialog
        open={openUserGuideDialog}
        handleClose={() => setOpenUserGuideDialog(false)}
      />
    </Box>
  );
};

export default CanvasAppbar;
