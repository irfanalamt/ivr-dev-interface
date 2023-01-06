import {
  Avatar,
  Box,
  Typography,
  Button,
  Tooltip,
  Container,
} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ModeIcon from '@mui/icons-material/Mode';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SaveIcon from '@mui/icons-material/Save';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const CanvasAppbar = ({
  isConnecting,
  setIsConnecting,
  stageGroup,
  showResetDialog,
  generateFile,
  saveToFile,
}) => {
  function getBgColor() {
    if (isConnecting > 0) return '#e0f2f1';

    return '#e1f5fe';
  }

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

        <Box sx={{ ml: 4, display: 'flex', alignItems: 'center' }}>
          <Tooltip title='draw'>
            <ModeIcon
              sx={{
                fontSize: isConnecting == 0 ? '2.3rem' : '1.8rem',
                boxShadow: 1,
                borderRadius: 2,
                backgroundColor: isConnecting == 0 ? '#03a9f4' : '#dcdcdc',
              }}
              onClick={() => {
                setIsConnecting(0);
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
                backgroundColor: isConnecting > 0 ? '#00897b' : '#dcdcdc',
              }}
              onClick={() => {
                setIsConnecting(1);
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

          {isConnecting == 0 && 'Draw mode'}
        </Typography>
        <Box sx={{ ml: 'auto' }}>
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
              onClick={saveToFile}
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

          <Tooltip title='GENERATE CONFIG'>
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
    </Box>
  );
};

export default CanvasAppbar;
