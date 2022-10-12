import { Box, Button, Container, Typography } from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import { signIn } from 'next-auth/react';
export default function Home() {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          my: 1,
          backgroundColor: '#f9fbe7',
          alignItems: 'center',
          height: 80,
          px: 2,
        }}
      >
        <Typography
          sx={{
            mr: 'auto',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
          }}
          variant='h4'
        >
          IVR canvas <ArchitectureIcon sx={{ fontSize: '2.5rem' }} />
        </Typography>
        <Button onClick={signIn} sx={{ mx: 1, color: 'black' }}>
          Login
        </Button>
        <Button
          sx={{ backgroundColor: '#2196f3' }}
          href='/signUp'
          variant='contained'
        >
          Signup
        </Button>
      </Box>
      <Box sx={{ textAlign: 'center', px: 3, my: 3 }}>
        <Typography
          sx={{
            fontSize: '3rem',
            fontWeight: 200,
            display: 'inline',
          }}
          variant='subtitle1'
        >
          {`Create custom `}
        </Typography>
        <Typography
          sx={{
            fontSize: '3rem',
            fontWeight: 200,
            display: 'inline',
            color: '#2196f3',
          }}
          variant='subtitle1'
        >
          {`
          IVR experiences `}
        </Typography>
        <Typography
          sx={{
            fontSize: '3rem',
            fontWeight: 200,
            display: 'inline',
          }}
          variant='subtitle1'
        >
          {`using visual, drag-and-drop approaches.`}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Button
          sx={{
            height: 70,
            width: 200,
            backgroundColor: '#1e88e5',
            color: 'white',
            fontSize: '1rem',
          }}
          href='/stageCanvas2'
          variant='contained'
          color='success'
        >
          Create an IVR
        </Button>
      </Box>
    </Container>
  );
}
