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
      handleClickLoadFile;
      setIsExisting(true);
    }
  }, []);

  const handleClickLoadFile = () => {
    fetch('/api/getFigures')
      .then((res) => res.json())
      .then((data) => {
        console.log(JSON.stringify(data));

        alert('loaded from JSON');
      })
      .catch((err) => {
        alert('figure fetch api error');
      });
  };

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
        <DynamicCanvas isExisting={isExisting} />
      </Box>
    </Container>
  );
};

export default StageCanvas;
