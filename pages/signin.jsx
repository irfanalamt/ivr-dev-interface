import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Button,
  Avatar,
} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import { useRef, useState } from 'react';
import { signIn } from 'next-auth/react';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit() {
    signIn('credentials', {
      email,
      password,
      redirect: false,
    })
      .then((res) => {
        console.log('response', res);
        if (!res.ok) {
          alert(res.error);
        }
      })
      .catch((err) => console.log('error', err));
  }

  return (
    <Container maxWidth='sm'>
      <Typography
        sx={{
          mr: 'auto',
          fontFamily: 'monospace',
          display: 'flex',
          alignItems: 'center',
          color: '#424242',
          mt: '20%',
          mb: 2,
        }}
        variant='h4'
      >
        <Avatar sx={{ backgroundColor: '#bbdefb', mx: 1 }}>
          <ArchitectureIcon sx={{ fontSize: '2.5rem', color: 'black' }} />
        </Avatar>
        IVR canvas
      </Typography>
      <Paper sx={{ p: 2, backgroundColor: '#FDFCFA', maxWidth: 500 }}>
        <Typography sx={{ fontSize: '1.1rem' }} variant='subtitle2'>
          Log In to your account
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            my: 3,
          }}
        >
          <TextField
            sx={{ maxWidth: 300, my: 0.5 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            variant='outlined'
            size='small'
            type='email'
            fullWidth
          />
          <TextField
            sx={{ maxWidth: 300, my: 0.5 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            variant='outlined'
            size='small'
            type='password'
            fullWidth
          />
        </Box>
        <Box sx={{ display: 'flex', mt: 1, justifyContent: 'space-between' }}>
          <Button href='/signup' size='small'>
            {`Don't have an account?`}
          </Button>
          <Button
            onClick={handleSubmit}
            sx={{ borderRadius: 5 }}
            variant='contained'
            color='success'
          >
            Log In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signin;
