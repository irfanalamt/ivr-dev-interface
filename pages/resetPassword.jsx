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
import {validateEmail} from '../src/myFunctions';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import {useRouter} from 'next/router';

const ResetPassword = () => {
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: '',
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

    if (name === 'email') {
      const isValid = validateEmail(value);
      setErrors((prevErrors) => ({...prevErrors, [name]: !isValid}));
    }
  }

  function handleSendOtp() {
    const {email} = formState;

    if (!email) {
      setErrorText('Please complete all required fields.');
      return;
    }

    if (Object.values(errors).some((error) => error)) {
      setErrorText('Email not valid. Please review and resubmit.');
      return;
    }

    setErrorText('');

    sendResetRequest();
  }
  function sendResetRequest() {
    setIsDisabled(true);
    axios
      .get('/api/resetPassword', {
        params: {
          email: formState.email,
        },
      })
      .then(function (response) {
        setSuccessText('OTP successfully sent!');
        console.log(response.data.message);
        setTimeout(() => {
          setStep(2);
          setIsDisabled(false);
        }, 1500);
      })
      .catch(function (error) {
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

  function handleResetPassword() {
    const {email, otp, password, confirmPassword} = formState;

    if (otp.length < 4) {
      setErrorText('Incomplete OTP.');
      return;
    }

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
        token: otp,
      })
      .then((response) => {
        console.log(response.data.message);
        setSuccessText('Password reset complete! Please proceed to login.');
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

    return;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        height: '100vh',
        pt: '10vh',
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
        {step === 1 && (
          <>
            <Typography variant='h5' component='div' sx={{mb: 3}}>
              Reset Password
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

            <Button
              fullWidth
              variant='contained'
              sx={{
                mt: 2,
                mb: 1,
              }}
              onClick={handleSendOtp}
              disabled={isDisabled}>
              Send OTP
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
              sx={{mt: 2}}
              fullWidth
              variant='contained'
              onClick={handleResetPassword}
              disabled={isDisabled}>
              Reset Password
            </Button>
            <Typography sx={{mt: 1}} variant='body2'>
              OTP sent to your email. Valid for 1 hour.
            </Typography>
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

export default ResetPassword;
