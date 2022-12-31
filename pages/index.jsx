import {
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  const handleNewProject = () => {
    router.push('/stageCanvas3');
  };

  const handleOpenProject = () => {
    // Prompt user to select a file
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = handleFileSelect;
    fileInput.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    // Use file to load project data and set it in the component state

    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target.result;
      router.push({
        pathname: '/stageCanvas3',
        query: { projectData: contents },
      });
    };
    reader.readAsText(file);
  };

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
        }}
      >
        <Typography
          sx={{
            mr: 'auto',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            color: '#424242',
          }}
          variant='h4'
        >
          <Avatar sx={{ backgroundColor: '#bbdefb', mx: 1 }}>
            <ArchitectureIcon sx={{ fontSize: '2.5rem', color: 'black' }} />
          </Avatar>
          IVR canvas
        </Typography>
      </Box>
      <Container sx={{ py: 8 }} maxWidth='sm'>
        <Typography
          variant='h4'
          align='center'
          color='text.primary'
          gutterBottom
        >
          IVR canvas
        </Typography>
        <Typography
          variant='h5'
          align='center'
          color='text.secondary'
          paragraph
        >
          Easily design personalized IVR flows using our intuitive, visual
          editor
        </Typography>
        <Stack
          sx={{ pt: 4 }}
          direction='row'
          spacing={2}
          justifyContent='center'
        >
          <Button
            sx={{ textAlign: 'center' }}
            variant='contained'
            onClick={handleNewProject}
          >
            Start new project
          </Button>
          <Button
            sx={{ textAlign: 'center' }}
            variant='outlined'
            onClick={handleOpenProject}
          >
            Open saved project
          </Button>
        </Stack>
      </Container>
    </Container>
  );
};

export default Home;
