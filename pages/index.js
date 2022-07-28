import { Container, Typography } from '@mui/material';

import dynamic from 'next/dynamic';

const DynamicImport = dynamic(() => import('../components/Stage'), {
  ssr: false,
});

export default function Home() {
  return (
    <Container
      sx={{ marginX: 'auto', marginY: 4, padding: 2, textAlign: 'center' }}
    >
      <Typography sx={{ marginX: 'auto' }} variant='h5'>
        IVR framework UI
      </Typography>
      <DynamicImport />
    </Container>
  );
}
