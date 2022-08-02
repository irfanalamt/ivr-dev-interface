import { Box, Button, Container, TextField, Typography } from '@mui/material';
const DynamicCanvas = dynamic(() => import('../components/Canvas'), {
  ssr: false,
});

import dynamic from 'next/dynamic';
import { useState } from 'react';

export default function Home() {
  const [test1, setTest1] = useState(false);

  function handleClick() {
    setTest1(!test1);
  }

  return (
    <Container
      on
      sx={{ marginX: 'auto', marginY: 2, padding: 2, textAlign: 'center' }}
    >
      <Typography
        sx={{ marginX: 'auto', padding: 1, boxShadow: 2, maxWidth: 220 }}
        variant='h5'
      >
        IVR framework UI
      </Typography>
      <Box sx={{ display: 'flex' }}>
        <DynamicCanvas />
      </Box>
      <Button onClick={handleClick} style={{ zIndex: 6 }} variant='outlined'>
        TEST
      </Button>
      {test1 && (
        <TextField
          style={{ zIndex: 10 }}
          id='text-box'
          label='input text'
          variant='outlined'
          size='small'
        />
      )}
    </Container>
  );
}
