import { ListItem, TextField, Typography } from '@mui/material';

const DrawerName = ({ shapeName, setShapeName }) => {
  return (
    <ListItem sx={{ my: 4 }}>
      <Typography
        sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
        variant='body1'
      >
        Name
      </Typography>
      <TextField
        sx={{ ml: 2, width: 180 }}
        size='small'
        value={shapeName}
        onChange={(e) => setShapeName(e.target.value)}
      />
    </ListItem>
  );
};

export default DrawerName;
