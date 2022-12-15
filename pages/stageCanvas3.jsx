import { Container } from '@mui/material';
import dynamic from 'next/dynamic';

const DynamicCanvas = dynamic(() => import('../components/Canvas4'), {
  ssr: false,
});

const TestCanvas = () => {
  return <DynamicCanvas />;
};

export default TestCanvas;
