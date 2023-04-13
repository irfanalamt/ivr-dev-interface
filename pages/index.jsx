import {Avatar, Box, Button, Container, Stack, Typography} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import {useRouter} from 'next/router';

const Home = ({user, updateUser}) => {
  const router = useRouter();

  function handleNewProject() {
    router.push('/project2');
  }

  function handleOpenSavedProjects() {
    router.push('/saved-projects2');
  }
  function handleLogout() {
    localStorage.removeItem('token');
    updateUser(null);
  }

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#f5f5f5',
          alignItems: 'center',
          height: 65,
          px: 3,
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        }}>
        <Avatar sx={{backgroundColor: '#bbdefb', marginRight: 2}}>
          <ArchitectureIcon sx={{fontSize: '2.5rem', color: '#424242'}} />
        </Avatar>
        <Typography
          variant='h5'
          component='div'
          sx={{
            fontFamily: 'Roboto',
            display: 'flex',
            alignItems: 'center',
            color: '#424242',
          }}>
          IVR Studio
        </Typography>
        {user ? (
          <Stack
            sx={{ml: 'auto', alignItems: 'center'}}
            direction='row'
            spacing={2}>
            <Typography sx={{ml: 'auto'}} variant='body1'>
              Welcome <b>{user.name}</b>
            </Typography>
            <Button onClick={handleLogout} variant='outlined' color='warning'>
              Logout
            </Button>
          </Stack>
        ) : (
          <Stack sx={{ml: 'auto'}} direction='row' spacing={2}>
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
        )}
      </Box>

      <Container sx={{py: 10}} maxWidth='sm'>
        <Typography variant='h3' align='center' color='primary' gutterBottom>
          IVR Studio
        </Typography>
        <Typography variant='h5' align='center' color='textSecondary' paragraph>
          Easily design personalized IVR flows using our intuitive, visual
          editor.
        </Typography>
        <Stack sx={{pt: 6}} direction='row' spacing={2} justifyContent='center'>
          <Button
            sx={{textAlign: 'center', fontSize: '1.2rem', px: 4, py: 1}}
            variant='contained'
            color='primary'
            onClick={handleNewProject}>
            Start new project
          </Button>
          <Button
            sx={{textAlign: 'center', fontSize: '1.2rem', px: 4, py: 1}}
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
