import React, {useState} from 'react';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import {validateEmail} from '../src/myFunctions';

const LoginPage = () => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [errorText, setErrorText] = useState('');

  function handleChange(name, value) {
    setFormState((prevState) => ({...prevState, [name]: value}));

    if (name === 'email') {
      const isValid = validateEmail(value);
      setErrors((prevErrors) => ({...prevErrors, [name]: !isValid}));
    }
  }

  function handleCloseSnackbar(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setErrorText('');
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

    // all fields are filled and validated at this point
    //TODO: send to api, check in db if user present
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 360,
          mt: 8,
          px: 4,
          py: 6,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: 4,
          backgroundColor: '#ffffff',
        }}>
        <Typography variant='h5' component='div' sx={{mb: 3}}>
          Login
        </Typography>
        <TextField
          fullWidth
          margin='normal'
          label='Email'
          variant='outlined'
          sx={{backgroundColor: '#ffffff'}}
          value={formState.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
        />
        <TextField
          fullWidth
          margin='normal'
          label='Password'
          type='password'
          variant='outlined'
          sx={{backgroundColor: '#ffffff'}}
          value={formState.password}
          onChange={(e) => handleChange('password', e.target.value)}
        />
        <Button
          fullWidth
          variant='contained'
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
          href='/'>
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
          Don't have an account?{' '}
          <Button
            variant='text'
            color='primary'
            sx={{marginLeft: '4px'}}
            href='/signup'>
            Sign Up
          </Button>
        </Typography>
      </Box>
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
    </Box>
  );
};

export default LoginPage;
