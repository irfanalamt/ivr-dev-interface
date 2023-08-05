import {Avatar, Box, Button, Container, Stack, Typography} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import {useRouter} from 'next/router';
import axios from 'axios';
import useWindowSize from '../src/hooks/useWindowSize';

const HomePage = ({user, updateUser}) => {
  const router = useRouter();
  const size = useWindowSize();

  function handleNewProject() {
    sessionStorage.removeItem('ivrName');
    router.push('/project');
  }

  function handleOpenSavedProjects() {
    router.push('/saved-projects');
  }
  function handleLogout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('ivrName');
    updateUser(null);
  }

  function handleFileUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.ivrf';
    fileInput.onchange = handleFileSelected;
    fileInput.click();
  }

  function handleFileSelected(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (event) => {
      const fileContent = event.target.result;
      const parsedData = JSON.parse(fileContent);
      saveImportToDB(parsedData);
    };
    reader.onerror = (event) => {
      console.error('Error reading file:', event.target.error);
    };
  }

  async function saveImportToDB(data) {
    try {
      const token = localStorage.getItem('token');

      const {name, description, shapes, tabs, shapeCount, userVariables} = data;

      const newData = {
        email: user?.name ?? 'guest',
        name,
        description,
        shapes,
        tabs,
        shapeCount,
        userVariables,
        token,
      };

      const response = await axios.post('/api/saveProject2', newData);

      router.push('saved-projects');

      return response.data;
    } catch (err) {
      console.log('Failed to insert document', err);
    }
  }

  return (
    <Box
      sx={{
        backgroundImage: 'linear-gradient(45deg, #f5f5f5, #e0e0e0)',
        height: '100vh',
      }}>
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
        {size.width > 700 && (
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
        )}

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

      <Container sx={{py: size.width < 700 ? 4 : 12}} maxWidth='md'>
        <Typography variant='h2' align='center' color='primary' gutterBottom>
          IVR Studio
        </Typography>
        <Typography variant='h5' align='center' color='textSecondary' paragraph>
          Design personalized IVR flows effortlessly with our user-friendly,
          visual editor.
        </Typography>
        <Stack
          sx={{pt: size.width < 700 ? 4 : 8}}
          direction={size.width < 700 ? 'column' : 'row'}
          spacing={2}
          justifyContent='center'>
          <Button
            sx={{textAlign: 'center', fontSize: '1.2rem', px: 4, py: 1}}
            variant='contained'
            color='primary'
            onClick={handleNewProject}>
            Start New Project
          </Button>
          <Button
            sx={{textAlign: 'center', fontSize: '1.2rem', px: 4, py: 1}}
            variant='outlined'
            color='secondary'
            onClick={handleOpenSavedProjects}>
            Open Project
          </Button>

          <Button
            sx={{textAlign: 'center', fontSize: '1.2rem', px: 4, py: 1}}
            variant='outlined'
            color='success'
            onClick={handleFileUpload}>
            Import Project
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default HomePage;
