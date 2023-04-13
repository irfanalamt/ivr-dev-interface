import React from 'react';
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
import {useEffect, useState} from 'react';
import {validateEmail, validateUserName} from '../src/myFunctions';
import bcrypt from 'bcryptjs';
import axios from 'axios';

const Signup = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  function handleChange(name, value) {
    setFormState((prevState) => ({...prevState, [name]: value}));

    if (name === 'name' || name === 'email') {
      const isValid =
        name === 'name' ? validateUserName(value) : validateEmail(value);
      setErrors((prevErrors) => ({...prevErrors, [name]: !isValid}));
    }
  }

  function handleSignup() {
    const {name, email, password, confirmPassword} = formState;

    if (!name || !email || !password || !confirmPassword) {
      setErrorText('Please complete all required fields to sign up.');
      return;
    }

    if (Object.values(errors).some((error) => error)) {
      setErrorText('Invalid fields detected. Please review and resubmit.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorText('Passwords do not match.');
      return;
    }

    setErrorText('');

    const hashedPassword = bcrypt.hashSync(password, 10);
    const data = {name, email, password: hashedPassword};

    sendSignupData(data);
  }
  function sendSignupData(data) {
    axios
      .post('/api/user', data)
      .then((response) => {
        setSuccessText(response.data.message);
      })
      .catch((error) => {
        setErrorText(error.response.data.message);
      });
  }

  function handleCloseSnackbar(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setErrorText('');
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
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
          mt: 2,
          px: 4,
          py: 4,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: 4,
          backgroundColor: '#ffffff',
        }}>
        <Typography variant='h5' component='div' sx={{mb: 3}}>
          Sign Up
        </Typography>
        <TextField
          fullWidth
          margin='normal'
          label='Name'
          variant='outlined'
          sx={{backgroundColor: '#ffffff'}}
          value={formState.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
        />
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
        <TextField
          fullWidth
          margin='normal'
          label='Confirm Password'
          type='password'
          variant='outlined'
          sx={{backgroundColor: '#ffffff'}}
          value={formState.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
        />
        <Button
          fullWidth
          variant='contained'
          sx={{
            mt: 2,
            mb: 1,
          }}
          onClick={handleSignup}>
          Sign Up
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
          Already have an account?{' '}
          <Button
            variant='text'
            color='primary'
            sx={{marginLeft: '4px'}}
            href='/login'>
            Login
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
      )}{' '}
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

export default Signup;
