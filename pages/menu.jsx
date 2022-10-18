import { Avatar, Box, Chip, Container, Typography } from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useSession } from 'next-auth/react';
import Router from 'next/router';

const Menu = () => {
  const { status, data } = useSession();

  return (
    <Container>
      {status === 'authenticated' ? (
        <Chip
          sx={{ mt: 2, backgroundColor: '#aed581', fontSize: '0.9rem' }}
          label='Logged in'
        />
      ) : (
        <Chip
          sx={{ mt: 2, backgroundColor: '#90a4ae', fontSize: '0.9rem' }}
          label='Not Logged in'
        />
      )}
      <Typography
        sx={{
          mx: 'auto',
          fontFamily: 'monospace',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#424242',
          mt: '10%',
          mb: 2,
        }}
        variant='h4'
      >
        <Avatar sx={{ backgroundColor: '#bbdefb', mx: 1 }}>
          <ArchitectureIcon sx={{ fontSize: '2.5rem', color: 'black' }} />
        </Avatar>
        IVR canvas
      </Typography>
      <Box sx={{ mt: '8%', display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            backgroundColor: '#009688',
            px: 3,
            py: 2,
            mx: 5,
            width: 'max-content',
            textAlign: 'center',
            borderRadius: 2,
            boxShadow: 1,
          }}
          onClick={() => {
            Router.replace('/stageCanvas2');
          }}
        >
          <Typography sx={{ fontSize: '1.4rem' }} variant='body2'>
            Create new project
          </Typography>
          <NoteAddIcon sx={{ fontSize: '2.4rem', mt: 2 }} />
        </Box>
        <Box
          sx={{
            backgroundColor: '#3f51b5',
            px: 3,
            py: 2,
            mx: 5,
            width: 'max-content',
            textAlign: 'center',
            borderRadius: 2,
            boxShadow: 1,
          }}
          onClick={() => {
            Router.replace('/showProjects');
          }}
        >
          <Typography sx={{ fontSize: '1.4rem' }} variant='body2'>
            Open saved project
          </Typography>
          <FileOpenIcon sx={{ fontSize: '2.4rem', mt: 2 }} />
        </Box>
      </Box>
    </Container>
  );
};

export default Menu;
