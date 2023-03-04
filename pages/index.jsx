import {
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import {useRouter} from 'next/router';

const Home = () => {
  const router = useRouter();

  function handleNewProject() {
    router.push('/project');
  }

  function handleNewModule() {
    router.push('/module');
  }

  function handleOpenSavedProjects() {
    router.push('/saved-projects');
  }

  function handleOpenSavedModules() {
    router.push('/saved-modules');
  }

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#f5f5f5',
          alignItems: 'center',
          height: 50,
          px: 3,
          boxShadow: 1,
        }}>
        <Typography
          sx={{
            mr: 'auto',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            color: '#424242',
          }}
          variant='h4'>
          <Avatar sx={{backgroundColor: '#bbdefb', mx: 1}}>
            <ArchitectureIcon sx={{fontSize: '2.5rem', color: 'black'}} />
          </Avatar>
          IVR Studio
        </Typography>
      </Box>
      <Container sx={{py: 8}} maxWidth='sm'>
        <Typography
          variant='h4'
          align='center'
          color='text.primary'
          gutterBottom>
          IVR Studio
        </Typography>
        <Typography
          variant='h5'
          align='center'
          color='text.secondary'
          paragraph>
          Easily design personalized IVR flows using our intuitive, visual
          editor
        </Typography>

        <Stack sx={{pt: 4}} direction='row' spacing={2} justifyContent='center'>
          <Tooltip arrow title='BETA' placement='top'>
            <Button
              sx={{
                justifySelf: 'flex-start',
                justifyItems: 'start',
                backgroundColor: '#e0e0e0',
              }}
              variant='outlined'
              color='primary'
              onClick={() => router.push('/project2')}>
              V2
            </Button>
          </Tooltip>
          <Button
            sx={{textAlign: 'center'}}
            variant='contained'
            onClick={handleNewProject}>
            Start new project
          </Button>
          <Button
            sx={{textAlign: 'center'}}
            variant='outlined'
            onClick={handleOpenSavedProjects}>
            Open project
          </Button>
        </Stack>
        <Stack sx={{pt: 2}} direction='row' spacing={2} justifyContent='center'>
          <Button
            sx={{textAlign: 'center'}}
            variant='contained'
            color='secondary'
            onClick={handleNewModule}>
            Create new module
          </Button>
          <Button
            sx={{textAlign: 'center'}}
            variant='outlined'
            color='secondary'
            onClick={handleOpenSavedModules}>
            Open module
          </Button>
        </Stack>
      </Container>
    </Container>
  );
};

export default Home;
