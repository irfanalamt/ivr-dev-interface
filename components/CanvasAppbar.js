import { Avatar, Box, Typography, Button, Tooltip } from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import SaveIcon from '@mui/icons-material/Save';

const CanvasAppbar = ({ status }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        my: 1,
        backgroundColor: '#f9fbe7',
        alignItems: 'center',
        height: 50,
        px: 2,
        boxShadow: 1,
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
      <Box sx={{ ml: 'auto' }}>
        <Tooltip title='SAVE'>
          <Button
            sx={{ zIndex: 6, mr: 1, backgroundColor: '#2196f3' }}
            variant='contained'
            size='small'
            color='info'
            // onClick={() => {
            //   const serializedShapes = stageGroup.current.getSerializedShapes();
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
  );
};

export default CanvasAppbar;