import { Box, Container, Typography } from '@mui/material';
const DynamicCanvas = dynamic(() => import('../components/Canvas'), {
  ssr: false,
});
import Shapes from '../components/Shapes';
import Shape from '../components/Shape';

import dynamic from 'next/dynamic';

export default function Home() {
  let shape1 = new Shape(20, 100, 50, 30, 'rectangle');
  let shape2 = new Shape(100, 150, 50, 30, 'parallelogram');
  let shapeGroup = new Shapes('palette', [shape1, shape2]);
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
      {shapeGroup.getShapes().map((el) => {
        return <Typography>{el.type}</Typography>;
      })}

      <Box sx={{ display: 'flex' }}>
        <DynamicCanvas />
      </Box>
    </Container>
  );
}
