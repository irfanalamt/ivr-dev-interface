import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Button,
} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import { useRef, useState } from 'react';
import { signIn } from 'next-auth/react';

const signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    console.log(res);
  }

  return (
    <Container maxWidth='sm'>
      <Typography
        sx={{
          fontFamily: 'monospace',
          display: 'flex',
          alignItems: 'center',
          mt: '20%',
          mb: 2,
        }}
        variant='h4'
      >
        IVR canvas <ArchitectureIcon sx={{ fontSize: '2.5rem' }} />
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
          <Button href='/signUp' size='small'>
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
    </Container>
  );
};

export default signin;
