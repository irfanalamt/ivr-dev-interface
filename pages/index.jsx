import ArchitectureIcon from '@mui/icons-material/Architecture';
import CheckIcon from '@mui/icons-material/Check';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import {validateEmail} from '../src/myFunctions';
import {useMediaQuery, useTheme} from '@mui/material';

const IndexPage = ({updateUser, user}) => {
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [user, router]);

  function handleChange(name, value) {
    setFormState((prevState) => ({...prevState, [name]: value}));

    if (name === 'email') {
      const isValid = validateEmail(value);
      setErrors((prevErrors) => ({...prevErrors, [name]: !isValid}));
    }
  }

  function handleLogin() {
    const {email, password} = formState;

    if (!email || !password) {
      setErrorText('Please complete all required fields to sign up.');
      return;
    }

    if (Object.values(errors).some((error) => error)) {
      setErrorText('Invalid email format. Please review and resubmit.');
      return;
    }

    if (password.length < 3) {
      setErrorText('Password must be at least 3 characters.');
      return;
    }

    setErrorText('');

    sendLoginData({email, password});
  }

  async function sendLoginData(data) {
    try {
      const response = await axios.post('/api/login', data);
      const {token} = response.data;
      localStorage.setItem('token', token);
      if (response.data) {
        setSuccessText('Login successful.');
        updateUser(token);
        setTimeout(() => {
          router.push('/home');
        }, [2500]);
      }
      return true;
    } catch (error) {
      setErrorText('Invalid credentials. Please try again.');
      return false;
    }
  }
  function handleCloseSnackbar(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setErrorText('');
  }

  function handleContinueAsGuest() {
    sessionStorage.removeItem('ivrName');
    router.push('/project');
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundImage: 'linear-gradient(45deg, #f5f5f5, #e0e0e0)',
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
      </Box>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          my: '10vh',
          gap: 6,
        }}>
        <Paper
          elevation={3}
          id='box1'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            px: 6,
            py: 4,
            borderRadius: 4,
            backgroundColor: '#FAFAFA',
            width: matches ? '35%' : '95%',
            maxWidth: '500px',
          }}>
          <Typography
            variant='h5'
            component='div'
            sx={{mb: 3, color: theme.palette.text.primary}}>
            Login
          </Typography>
          <TextField
            fullWidth
            margin='normal'
            label='Email'
            variant='outlined'
            sx={{backgroundColor: theme.palette.background.paper}}
            value={formState.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            autoFocus
          />
          <TextField
            fullWidth
            margin='normal'
            label='Password'
            type='password'
            variant='outlined'
            sx={{backgroundColor: theme.palette.background.paper}}
            value={formState.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
          <Typography variant='body2' sx={{alignSelf: 'flex-start', pt: 0.5}}>
            <Link style={{textDecoration: 'none'}} href='/resetPassword'>
              Forgot your password?
            </Link>
          </Typography>
          <Button
            fullWidth
            variant='contained'
            color='primary'
            sx={{
              mt: 2,
              mb: 1,
            }}
            onClick={handleLogin}>
            Sign In
          </Button>
          <Button
            fullWidth
            variant='text'
            sx={{
              mt: 1,
              mb: 1,
            }}
            onClick={handleContinueAsGuest}>
            Continue as Guest
          </Button>
          <Typography
            variant='body2'
            component='div'
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 2,
            }}>
            {`Don't have an account?`}
            <Button
              variant='text'
              color='primary'
              sx={{marginLeft: '4px'}}
              href='/signup'>
              Sign Up
            </Button>
          </Typography>
        </Paper>
        {matches && (
          <Box
            id='box2'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              alignSelf: 'start',
              mt: 8,
            }}>
            <Typography variant='h4' component='div' sx={{mb: 3}}>
              Welcome to IVR Studio
            </Typography>
            <Typography variant='h5' component='div' sx={{mb: 3}}>
              Easily design personalized IVR flows using our intuitive, visual
              editor.
            </Typography>
            <Stack spacing={1}>
              <Typography
                sx={{display: 'flex', alignItems: 'center'}}
                variant='subtitle1'
                fontSize='large'>
                <CheckIcon sx={{mr: 0.5}} />
                Integrated validation functionality
              </Typography>
              <Typography
                sx={{display: 'flex', alignItems: 'center'}}
                variant='subtitle1'
                fontSize='large'>
                <CheckIcon sx={{mr: 0.5}} />
                JavaScript support
              </Typography>
              <Typography
                sx={{display: 'flex', alignItems: 'center'}}
                variant='subtitle1'
                fontSize='large'>
                <CheckIcon sx={{mr: 0.5}} />
                Seamless API integration capabilities
              </Typography>
              <Typography
                sx={{display: 'flex', alignItems: 'center'}}
                variant='subtitle1'
                fontSize='large'>
                <CheckIcon sx={{mr: 0.5}} />
                Multi-language support
              </Typography>
            </Stack>
          </Box>
        )}
      </Container>
      {errorText && (
        <Snackbar
          sx={{mb: 2}}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={errorText !== ''}
          autoHideDuration={3500}
          onClose={handleCloseSnackbar}>
          <Alert
            onClose={handleCloseSnackbar}
            severity='error'
            sx={{width: '100%'}}>
            {errorText}
          </Alert>
        </Snackbar>
      )}
      {successText && (
        <Snackbar
          sx={{mb: 2}}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={successText !== ''}
          autoHideDuration={3500}
          onClose={() => setSuccessText('')}>
          <Alert
            onClose={() => setSuccessText('')}
            severity='success'
            sx={{width: '100%'}}>
            {successText}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default IndexPage;
