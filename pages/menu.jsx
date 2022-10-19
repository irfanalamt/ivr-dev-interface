import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Typography,
} from '@mui/material';
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
          sx={{
            mt: 2,
            backgroundColor: '#aed581',
            fontSize: '0.9rem',
          }}
          label='Logged in'
        />
      ) : (
        <Chip
          sx={{ mt: 2, backgroundColor: '#90a4ae', fontSize: '0.9rem' }}
          label='Not Logged in'
        />
      )}
      <Paper
        sx={{
          width: '60vw',
          mx: 'auto',
          mt: '10%',
          p: 5,
          textAlign: 'center',
          backgroundColor: '#fdfdf7',
        }}
      >
        <Typography
          sx={{
            mx: 'auto',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#424242',
            mb: 4,
          }}
          variant='h4'
        >
          <Avatar sx={{ backgroundColor: '#bbdefb', mx: 1 }}>
            <ArchitectureIcon sx={{ fontSize: '2.5rem', color: 'black' }} />
          </Avatar>
          IVR canvas
        </Typography>

        <Button
          sx={{ minHeight: 80, mx: 3, my: 1 }}
          variant='outlined'
          size='large'
          color='success'
          onClick={() => {
            localStorage.setItem('isExistingProject', false);
            Router.push('/stageCanvas2');
          }}
        >
          Create new project <NoteAddIcon sx={{ fontSize: '2rem', ml: 1 }} />
        </Button>
        <Button
          sx={{ minHeight: 80, mx: 3, my: 1 }}
          variant='outlined'
          size='large'
          color='secondary'
          onClick={() => {
            Router.push('/showProjects');
          }}
        >
          Open saved project <FileOpenIcon sx={{ fontSize: '2rem', ml: 1 }} />
        </Button>
      </Paper>
    </Container>
  );
};

export default Menu;
