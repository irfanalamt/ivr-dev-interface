import { Box, Typography, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ArchitectureIcon from '@mui/icons-material/Architecture';

const DynamicCanvas = dynamic(() => import('../components/Canvas2'), {
  ssr: false,
});

const StageCanvas2 = () => {
  return (
    <Container sx={{ marginX: 'auto', textAlign: 'center', my: 2 }}>
      <Typography
        sx={{
          backgroundColor: '#03a9f4',
          width: 'max-content',
          mx: 'auto',
          px: 1,
          py: 0.5,
          boxShadow: 1,
          borderRadius: 1,
          display: 'inline',
          alignItems: 'center',
          display: 'flex',
        }}
        variant='h4'
      >
        IVR canvas
        <ArchitectureIcon sx={{ fontSize: '2.5rem' }} />
      </Typography>

      <Box>
        <DynamicCanvas />
      </Box>
    </Container>
  );
};

export default StageCanvas2;
