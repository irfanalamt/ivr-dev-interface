import { Box, Container, Typography } from '@mui/material';
const DynamicCanvas = dynamic(() => import('../components/Canvas'), {
  ssr: false,
});

import dynamic from 'next/dynamic';

export default function Home() {
  return (
    <Container
      sx={{ marginX: 'auto', marginY: 4, padding: 2, textAlign: 'center' }}
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
    </Container>
  );
}
