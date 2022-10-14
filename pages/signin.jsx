import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Button,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import { useRef, useState } from 'react';
import { signIn } from 'next-auth/react';
import Router from 'next/router';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const errorMessage = useRef('');
  const successMessage = useRef('');

  function handleSubmit() {
    // basic validation
    if (!email || !password) {
      errorMessage.current = 'Required fields are empty!';
      setOpenError(true);
      return;
    }

    if (!email.includes('@')) {
      errorMessage.current = 'Email address not in valid format!';
      setOpenError(true);
      return;
    }

    signIn('credentials', {
      email,
      password,
      redirect: false,
    })
      .then((res) => {
        console.log('response', res);
        if (!res.ok) {
          errorMessage.current = res.error;
          setOpenError(true);
        }
        if (res.ok && res.error === null) {
          successMessage.current = 'login success!..redirecting to HOME';
          setOpenSuccess(true);
          // onSuccess redirect to home after 2.5 sec
          setTimeout(() => {
            Router.replace('/');
          }, 2500);
        }
      })
      .catch((err) => {
        errorMessage.current = err;
        setOpenError(true);
      });
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
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={() => setOpenError(false)}
      >
        <Alert
          onClose={() => setOpenError(false)}
          severity='error'
          sx={{ width: '100%' }}
        >
          {errorMessage.current}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={() => setOpenSuccess(false)}
      >
        <Alert
          onClose={() => setOpenSuccess(false)}
          severity='success'
          sx={{ width: '100%' }}
        >
          {successMessage.current}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Signin;
