import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

const Home = () => {
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
          <Button href='/stageCanvas3' variant='contained'>
            Start new project
          </Button>
          <Button variant='outlined'>Open saved project</Button>
        </Stack>
      </Container>
    </Container>
  );
};

export default Home;
