import ArchitectureIcon from '@mui/icons-material/Architecture';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useRef, useState } from 'react';

const Signup = () => {
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const errorMessage = useRef('');
  const successMessage = useRef('');

  function handleSignup(e) {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

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

    axios
      .post('/api/auth/signup', { email, password })
      .then((res) => {
        console.log('result:', res.data);
        successMessage.current = res.data.message;
        setOpenSuccess(true);
      })
      .catch((err) => {
        console.log('error:', err.response.data);
        errorMessage.current = err.response.data.message;
        setOpenError(true);
      });

    console.log({ name, email });
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
          Create your account
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
            placeholder='First Name'
            inputRef={nameRef}
            variant='outlined'
            size='small'
            type='text'
            fullWidth
          />
          <TextField
            sx={{ maxWidth: 300, my: 0.5 }}
            inputRef={emailRef}
            placeholder='Email'
            variant='outlined'
            size='small'
            type='email'
            fullWidth
          />
          <TextField
            sx={{ maxWidth: 300, my: 0.5 }}
            inputRef={passwordRef}
            placeholder='Password'
            variant='outlined'
            size='small'
            type='password'
            fullWidth
          />
        </Box>
        <Box sx={{ display: 'flex', mt: 1, justifyContent: 'space-between' }}>
          <Button href='/signin' size='small'>
            Already have an account?
          </Button>
          <Button
            onClick={handleSignup}
            sx={{ borderRadius: 5 }}
            variant='contained'
            color='success'
          >
            Create account
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

export default Signup;
