import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import {useEffect, useState} from 'react';
import {validateEmail, validateUserName} from '../src/myFunctions';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState({});
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setErrorText('');
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [errorText]);

  function validateField(name, value) {
    if (name === 'name') {
      const isValid = validateUserName(value);
      setError({...error, [name]: !isValid});
    } else if (name === 'email') {
      const isValid = validateEmail(value);
      setError({...error, [name]: !isValid});
    }
  }

  function handleSignup() {
    if (!name || !email || !password || !confirmPassword) {
      setErrorText('Please complete all required fields to sign up.');
      return;
    }

    for (const value of Object.values(error)) {
      if (value) {
        setErrorText('Invalid fields detected. Please review and resubmit.');
        return;
      }
    }

    if (password != confirmPassword) {
      setErrorText('Passwords do not match.');
      return;
    }

    setErrorText('');

    // all fields are filled and validated at this point
    //TODO: hash password, sent user data to api; save user to db
  }

  return (
    <Container>
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
          marginTop: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Avatar sx={{backgroundColor: '#3f51b5', marginBottom: 2}}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5' sx={{marginBottom: 2}}>
          Sign up
        </Typography>
        <Stack>
          <TextField
            margin='normal'
            fullWidth
            id='name'
            label='Name'
            name='name'
            autoComplete='name'
            autoFocus
            size='small'
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              validateField('name', e.target.value);
            }}
            error={error.name}
            sx={{marginBottom: 1}}
          />
          <TextField
            margin='normal'
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            size='small'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateField('email', e.target.value);
            }}
            error={error.email}
            sx={{marginBottom: 1}}
          />
          <TextField
            margin='normal'
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            size='small'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            sx={{marginBottom: 2}}
          />
          <TextField
            margin='normal'
            fullWidth
            name='confirmPassword'
            label='Confirm Password'
            type='password'
            id='confirmPassword'
            size='small'
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            sx={{marginBottom: 2}}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            onClick={handleSignup}
            sx={{
              backgroundColor: '#3f51b5',
              color: '#fff',
              '&:hover': {backgroundColor: '#2c3e50'},
            }}>
            Sign Up
          </Button>
        </Stack>
        <Typography
          sx={{textAlign: 'center', mt: 1}}
          variant='body1'
          color='error'>
          {errorText}
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;
