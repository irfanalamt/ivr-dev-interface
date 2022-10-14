import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Typography,
} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { status, data } = useSession();

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

        {status === 'authenticated' ? (
          <Button
            onClick={() => signOut()}
            variant='contained'
            color='secondary'
          >
            Signout <ExitToAppIcon sx={{ mx: 0.5 }} />
          </Button>
        ) : (
          <>
            <Button href='/signin' sx={{ mx: 1, color: 'black' }}>
              Login
            </Button>
            <Button
              href='/signup'
              sx={{ backgroundColor: '#2196f3' }}
              variant='contained'
            >
              Signup
            </Button>
          </>
        )}
      </Box>

      {status === 'authenticated' ? (
        <Box>
          <Chip label='Logged in 🟢' />
          <Typography
            sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
            variant='h6'
          >
            <AccountCircleIcon sx={{ mx: 0.5, fontSize: '1.8rem' }} />
            {data.user.email}
          </Typography>
        </Box>
      ) : (
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
      )}

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
