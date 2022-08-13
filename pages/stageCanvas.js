import { Box, Typography, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicCanvas = dynamic(() => import('../components/Canvas'), {
  ssr: false,
});

const StageCanvas = () => {
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    const check = JSON.parse(localStorage.getItem('isExisting'));
    if (check == true) {
      setIsExisting(true);
    }
  }, []);

  return (
    <Container
      on
      sx={{ marginX: 'auto', marginY: 2, padding: 2, textAlign: 'center' }}
    >
      <Typography
        sx={{
          marginX: 'auto',
          padding: 1,
          boxShadow: 2,
          maxWidth: 300,
          borderRadius: 3,
          backgroundColor: '#e0f2f1',
        }}
        variant='h5'
      >
        IVR framework canvas
      </Typography>
      {isExisting && <Typography variant='h6'>isExisting project</Typography>}
      <Box>
        <DynamicCanvas />
      </Box>
    </Container>
  );
};

export default StageCanvas;
