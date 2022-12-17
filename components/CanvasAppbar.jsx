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
import ModeIcon from '@mui/icons-material/Mode';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import SaveIcon from '@mui/icons-material/Save';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const CanvasAppbar = ({
  status,
  data,
  isConnecting,
  setIsDeleting,
  setIsConnecting,
  isDeleting,
  stageGroup,
  showResetDialog,
  generateFile,
}) => {
  function getBgColor() {
    if (isConnecting > 0) return '#e0f2f1';
    if (isDeleting) return '#fce4ec';

    return '#e1f5fe';
  }

  return (
    <Box sx={{ position: 'fixed', top: 0 }}>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#f5f5f5',
          alignItems: 'center',
          minHeight: 50,
          height: '5vh',
          px: 3,
          boxShadow: 1,
          width: '100vw',
          mx: 'auto',
        }}
      >
        <Avatar sx={{ backgroundColor: '#bbdefb', mr: 2 }}>
          <ArchitectureIcon sx={{ fontSize: '2rem', color: 'black' }} />
        </Avatar>

        <Box sx={{ ml: 4, display: 'flex', alignItems: 'center' }}>
          <Tooltip title='draw'>
            <ModeIcon
              sx={{
                fontSize:
                  isConnecting == 0 && !isDeleting ? '2.3rem' : '1.8rem',
                boxShadow: 1,
                borderRadius: 2,
                backgroundColor:
                  isConnecting == 0 && !isDeleting ? '#03a9f4' : '#e1f5fe',
              }}
              onClick={() => {
                setIsConnecting(0);
                setIsDeleting(false);
              }}
            />
          </Tooltip>
          <Tooltip title='connect'>
            <ArrowRightAltIcon
              sx={{
                fontSize: isConnecting > 0 ? '2.3rem' : '1.8rem',
                ml: 2,
                boxShadow: 1,
                borderRadius: 2,
                backgroundColor: isConnecting > 0 ? '#00897b' : '#e0f2f1',
              }}
              onClick={() => {
                setIsDeleting(false);
                setIsConnecting(1);
              }}
            />
          </Tooltip>
          <Tooltip title='delete'>
            <DeleteIcon
              sx={{
                fontSize: isDeleting ? '2.3rem' : '1.8rem',
                ml: 2,
                boxShadow: 1,
                borderRadius: 2,
                backgroundColor: isDeleting ? '#e91e63' : '#fce4ec',
              }}
              onClick={() => {
                setIsDeleting(true);
                setIsConnecting(0);
              }}
            />
          </Tooltip>
        </Box>
        <Typography
          sx={{
            ml: 4,
            backgroundColor: getBgColor(),
            px: 1,
            fontWeight: 'bold',
            boxShadow: 1,
          }}
          variant='body1'
        >
          {isConnecting > 0 && 'Connect mode'}
          {isDeleting && 'Delete mode'}
          {isConnecting == 0 && !isDeleting && 'Draw mode'}
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#424242',
            }}
            variant='subtitle2'
          >
            <AccountCircleIcon sx={{ mr: 0.25, fontSize: '1.2rem' }} />
            {status === 'authenticated' ? data.user.email : 'Guest User'}
          </Typography>
        </Box>
        <Box sx={{ ml: 2 }}>
          <Tooltip title='RESET CANVAS'>
            <Button
              sx={{ zIndex: 6, mr: 1, backgroundColor: '#00bcd4' }}
              variant='contained'
              size='small'
              color='info'
              onClick={showResetDialog}
            >
              <RestartAltIcon sx={{ fontSize: '1.2rem' }} />
            </Button>
          </Tooltip>
          <Tooltip title='SAVE'>
            <span>
              <Button
                sx={{ zIndex: 6, mr: 1, backgroundColor: '#2196f3' }}
                variant='contained'
                size='small'
                color='info'
                // onClick={() => {
                //   const serializedShapes =
                //     stageGroup.current.getSerializedShapes();
                //   localStorage.setItem('isExistingProject', true);
                //   localStorage.setItem(
                //     'saved_project',
                //     JSON.stringify(serializedShapes)
                //   );
                // }}
                disabled={status !== 'authenticated'}
              >
                <SaveIcon sx={{ fontSize: '1.2rem' }} />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title='SAVE AS'>
            <span>
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
            </span>
          </Tooltip>

          <Tooltip title='GENERATE CONFIG'>
            <Button
              sx={{ zIndex: 6, backgroundColor: '#4caf50' }}
              size='small'
              color='success'
              variant='contained'
              onClick={generateFile}
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
