import ArchitectureIcon from '@mui/icons-material/Architecture';
import { Avatar, Box, Container, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

const DynamicCanvas = dynamic(() => import('../components/Canvas2'), {
  ssr: false,
});

const StageCanvas2 = () => {
  return (
    <Container sx={{ marginX: 'auto', textAlign: 'center', my: 2 }}>
      <Typography
        sx={{
          mx: 'auto',
          fontFamily: 'monospace',
          display: 'flex',
          justifyContent: 'center',
          color: '#424242',
          backgroundColor: '#f9fbe7',
          width: 'max-content',
          px: 2,
          py: 1,
          boxShadow: 1,
          borderRadius: 2,
        }}
        variant='h4'
      >
        <Avatar sx={{ backgroundColor: '#bbdefb', mx: 1 }}>
          <ArchitectureIcon sx={{ fontSize: '2.5rem', color: 'black' }} />
        </Avatar>
        IVR canvas
      </Typography>

      <Box>
        <DynamicCanvas />
      </Box>
    </Container>
  );
};

export default StageCanvas2;
