import ArchitectureIcon from '@mui/icons-material/Architecture';
import { Avatar, Box, Container, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

const DynamicCanvas = dynamic(() => import('../components/Canvas3'), {
  ssr: false,
});

const StageCanvas2 = () => {
  return (
    <Container>
      <DynamicCanvas />
    </Container>
  );
};

export default StageCanvas2;
