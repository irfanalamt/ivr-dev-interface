import {
  Avatar,
  Box,
  Typography,
  Button,
  Tooltip,
  Container,
} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import SaveIcon from '@mui/icons-material/Save';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import DeleteIcon from '@mui/icons-material/Delete';

const CanvasAppbar = ({
  status,
  data,
  isConnecting,
  isDeleting,
  stageGroup,
}) => {
  return (
    <Box sx={{ position: 'fixed', top: 0 }}>
      <Box
        sx={{
          display: 'flex',
          mb: 3,
          backgroundColor: '#f9fbe7',
          alignItems: 'center',
          height: 50,
          px: 2,
          boxShadow: 1,
          width: '90vw',
          mx: 'auto',
        }}
      >
        <Avatar sx={{ backgroundColor: '#bbdefb' }}>
          <ArchitectureIcon sx={{ fontSize: '2rem', color: 'black' }} />
        </Avatar>

        <Typography
          sx={{ display: 'flex', alignItems: 'center', mx: 2 }}
          variant='subtitle2'
        >
          <AccountCircleIcon sx={{ mr: 0.25, fontSize: '1.2rem' }} />
          {status === 'authenticated' ? data.user.email : 'Guest User'}
        </Typography>
        <Typography
          sx={{
            ml: 2,
            width: 'max-content',
            alignItems: 'center',
            display: isDeleting ? 'flex' : 'none',
            fontSize: '1.2rem',
            boxShadow: 1,
            backgroundColor: '#f48fb1',
            px: 2,
          }}
          variant='subtitle2'
        >
          <DeleteIcon /> Delete mode
        </Typography>
        <Typography
          sx={{
            ml: 2,
            width: 'max-content',
            alignItems: 'center',
            display: isConnecting ? 'flex' : 'none',
            fontSize: '1.2rem',
            boxShadow: 1,
            backgroundColor: '#80cbc4',
            px: 2,
          }}
          variant='subtitle2'
        >
          <ArrowRightAltIcon />
          Connect mode
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          <Tooltip title='SAVE'>
            <Button
              sx={{ zIndex: 6, mr: 1, backgroundColor: '#2196f3' }}
              variant='contained'
              size='small'
              color='info'
              onClick={() => {
                const serializedShapes =
                  stageGroup.current.getSerializedShapes();
                localStorage.setItem('isExistingProject', true);
                localStorage.setItem(
                  'saved_project',
                  JSON.stringify(serializedShapes)
                );
              }}
              disabled={status !== 'authenticated'}
            >
              <SaveIcon sx={{ fontSize: '1.2rem' }} />
            </Button>
          </Tooltip>
          <Tooltip title='SAVE AS'>
            <Button
              sx={{ zIndex: 6, mr: 1, backgroundColor: '#3f51b5' }}
              variant='contained'
              size='small'
              color='info'
              // onClick={() => {
              //   setOpenProjectDialog(true);
              // }}
              disabled={status !== 'authenticated'}
            >
              <SaveAsIcon sx={{ fontSize: '1.2rem' }} />
            </Button>
          </Tooltip>

          <Tooltip title='GENERATE CONFIG'>
            <Button
              sx={{ zIndex: 6, backgroundColor: '#4caf50' }}
              size='small'
              color='success'
              variant='contained'
              // onClick={() => setOpenDialog(true)}
            >
              <SaveAltIcon sx={{ fontSize: '1.2rem' }} />
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default CanvasAppbar;
