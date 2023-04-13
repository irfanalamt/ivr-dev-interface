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
          height: 64,
          px: 3,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }}>
        <Avatar sx={{backgroundColor: '#bbdefb', marginRight: 1}}>
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
            <Typography sx={{ml: 'auto'}} variant='subtitle1'>
              Welcome {user.name}
            </Typography>
            <Button
              sx={{
                backgroundColor: '#f44336',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#e53935',
                },
              }}
              onClick={handleLogout}
              variant='outlined'
              color='secondary'>
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
