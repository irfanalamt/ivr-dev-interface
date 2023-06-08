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
import {useState} from 'react';
import {validateEmail, validateUserName} from '../src/myFunctions';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import {useRouter} from 'next/router';

const Signup = () => {
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  function handleChange(name, value) {
    setFormState((prevState) => ({...prevState, [name]: value}));

    if (name === 'name' || name === 'email') {
      const isValid =
        name === 'name' ? validateUserName(value) : validateEmail(value);
      setErrors((prevErrors) => ({...prevErrors, [name]: !isValid}));
    }
  }

  function handleSignup() {
    const {name, email, confirmEmail} = formState;

    if (!name || !email || !confirmEmail) {
      setErrorText('Please complete all required fields to sign up.');
      return;
    }

    if (Object.values(errors).some((error) => error)) {
      setErrorText('Invalid fields detected. Please review and resubmit.');
      return;
    }

    if (email !== confirmEmail) {
      setErrorText('Emails do not match.');
      return;
    }

    setErrorText('');

    const data = {name, email};

    sendSignupData(data);
  }
  function sendSignupData(data) {
    setIsDisabled(true);
    axios
      .post('/api/user', data)
      .then((response) => {
        setSuccessText(response.data.message);
        setTimeout(() => {
          setStep(2);
          setIsDisabled(false);
        }, 1500);
      })
      .catch((error) => {
        setErrorText(error.response.data.message);
        setIsDisabled(false);
      });
  }

  function handleCloseSnackbar(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setErrorText('');
  }

  function handleVerification() {
    setIsDisabled(true);
    axios
      .get('/api/confirm', {
        params: {
          email: formState.email,
          token: formState.otp,
        },
      })
      .then(function (response) {
        setSuccessText('OTP verified successfully!');

        console.log(response.data.message);
        setTimeout(() => {
          setStep(3);
          setIsDisabled(false);
        }, 1500);
      })
      .catch(function (error) {
        console.error(error);
        setErrorText(error.response.data.message);
        setIsDisabled(false);
      });
  }

  function handlePasswordSetup() {
    const {password, confirmPassword, email} = formState;

    if (password.length < 4) {
      setErrorText('Password is too short.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorText("Passwords don't match.");
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    setIsDisabled(true);
    axios
      .post('/api/setPassword', {
        email,
        password: hashedPassword,
        token: formState.otp,
      })
      .then((response) => {
        console.log(response.data.message);
        setSuccessText('Registration complete! Please proceed to login.');
        setTimeout(() => {
          router.push('/');
          setIsDisabled(false);
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
        setErrorText(error.response.data.message);
        setIsDisabled(false);
      });
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        height: '100vh',
        pt: {xs: '2vh', sm: '10vh'},
        px: 2,
      }}>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#f5f5f5',
          alignItems: 'center',
          height: 64,
          px: {xs: 1, sm: 3},
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
          maxWidth: {xs: '100%', sm: 360},
          mt: 2,
          px: {xs: 2, sm: 4},
          pt: 3,
          pb: 4,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: 4,
          backgroundColor: '#ffffff',
        }}>
        {step === 1 && (
          <>
            <Typography
              variant='h5'
              component='div'
              sx={{mb: 3, color: '#424242'}}>
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
              label='Confirm Email'
              variant='outlined'
              sx={{backgroundColor: '#ffffff'}}
              value={formState.confirmEmail}
              onChange={(e) => handleChange('confirmEmail', e.target.value)}
              error={errors.confirmEmail}
            />

            <Button
              fullWidth
              variant='contained'
              sx={{
                mt: 2,
                mb: 1,
              }}
              onClick={handleSignup}
              disabled={isDisabled}>
              Verify Email
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <Typography variant='h5' component='div' sx={{mb: 3}}>
              OTP Verification
            </Typography>
            <TextField
              fullWidth
              margin='normal'
              label='Enter OTP'
              variant='outlined'
              sx={{backgroundColor: '#ffffff'}}
              value={formState.otp}
              onChange={(e) => handleChange('otp', e.target.value)}
              error={errors.otp}
            />
            <Button
              fullWidth
              variant='contained'
              onClick={handleVerification}
              disabled={isDisabled}>
              Verify OTP
            </Button>
            <Typography sx={{mt: 1}} variant='body2'>
              OTP sent to your email. Valid for 1 hour.
            </Typography>
          </>
        )}
        {step === 3 && (
          <>
            <Typography variant='h5' component='div' sx={{mb: 3}}>
              Password Setup
            </Typography>
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
              onClick={handlePasswordSetup}
              fullWidth
              variant='contained'
              disabled={isDisabled}>
              DONE
            </Button>
          </>
        )}
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
