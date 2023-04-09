import {Avatar, Box, Button, Container, Stack, Typography} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import {useRouter} from 'next/router';

const Home = () => {
  const router = useRouter();

  function handleNewProject() {
    router.push('/project2');
  }

  function handleOpenSavedProjects() {
    router.push('/saved-projects2');
  }

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
        <Stack direction='row' spacing={2}>
          <Button
            onClick={() => router.push('/login')}
            variant='outlined'
            color='info'>
            Login
          </Button>
          <Button
            onClick={() => router.push('/signup')}
            variant='contained'
            color='info'>
            Signup
          </Button>
        </Stack>
      </Box>
      <Container sx={{py: 8}} maxWidth='sm'>
        <Typography variant='h4' align='center' color='primary' gutterBottom>
          IVR Studio
        </Typography>
        <Typography variant='h5' align='center' color='textSecondary' paragraph>
          Easily design personalized IVR flows using our intuitive, visual
          editor.
        </Typography>
        <Stack sx={{pt: 4}} direction='row' spacing={2} justifyContent='center'>
          <Button
            sx={{textAlign: 'center'}}
            variant='contained'
            color='primary'
            onClick={handleNewProject}>
            Start new project
          </Button>
          <Button
            sx={{textAlign: 'center'}}
            variant='outlined'
            color='secondary'
            onClick={handleOpenSavedProjects}>
            Open project
          </Button>
        </Stack>
      </Container>
    </Container>
  );
};

export default Home;
