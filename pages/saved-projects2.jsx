import {Avatar, Box, Container, Typography} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';

const SavedProjects2 = () => {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#f5f5f5',
          alignItems: 'center',
          height: 64,
          px: 3,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }}>
        <Typography
          sx={{
            mr: 'auto',
            fontFamily: 'Roboto',
            display: 'flex',
            alignItems: 'center',
            color: '#424242',
          }}
          variant='h4'>
          <Avatar sx={{backgroundColor: '#bbdefb', mx: 1}}>
            <ArchitectureIcon sx={{fontSize: '2.5rem', color: '#424242'}} />
          </Avatar>
          IVR Studio
        </Typography>
      </Box>
      <Box>
        <Typography textAlign='center' fontSize='1.7rem' sx={{mt: '20vh'}}>
          ...Under construction 🏗️
        </Typography>
      </Box>
    </Container>
  );
};

export default SavedProjects2;
