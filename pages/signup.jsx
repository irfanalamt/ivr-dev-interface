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

const Signup = () => {
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
        <Stack
          component='form'
          noValidate
          // onSubmit={handleSubmit}
        >
          <TextField
            margin='normal'
            required
            fullWidth
            id='name'
            label='Name'
            name='name'
            autoComplete='name'
            autoFocus
            size='small'
            sx={{marginBottom: 1}}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            size='small'
            sx={{marginBottom: 1}}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='new-password'
            size='small'
            sx={{marginBottom: 2}}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{
              backgroundColor: '#3f51b5',
              color: '#fff',
              '&:hover': {backgroundColor: '#2c3e50'},
            }}>
            Sign Up
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Signup;
