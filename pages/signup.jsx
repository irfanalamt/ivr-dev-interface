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

const Signup = () => {
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
            variant='outlined'
            size='small'
            type='text'
            fullWidth
          />
          <TextField
            sx={{ maxWidth: 300, my: 0.5 }}
            placeholder='Email'
            variant='outlined'
            size='small'
            type='email'
            fullWidth
          />
          <TextField
            sx={{ maxWidth: 300, my: 0.5 }}
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
          <Button sx={{ borderRadius: 5 }} variant='contained' color='success'>
            Create account
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;
