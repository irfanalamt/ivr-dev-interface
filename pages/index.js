import { Box, Button, Container, Typography } from '@mui/material';

import { useEffect, useState } from 'react';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import FileOpenRoundedIcon from '@mui/icons-material/FileOpenRounded';

export default function Home() {
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    localStorage.setItem('isExisting', JSON.stringify(isExisting));
    console.log('ue index');
  }, [isExisting]);

  return (
    <Container
      on
      sx={{
        marginX: 'auto',
        marginY: 2,
        padding: 2,
        textAlign: 'center',
      }}
    >
      <Typography
        sx={{
          marginX: 'auto',
          boxShadow: 2,
          height: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 80,
          borderRadius: 2,
          backgroundColor: '#e0f2f1',
        }}
        maxWidth='30vw'
        variant='h5'
      >
        IVR framework config builder
      </Typography>
      <Box sx={{ marginTop: 5, justifyContent: 'space-between' }}>
        <Button
          sx={{
            marginX: 2,
            width: 200,
            height: 100,
            position: 'relative',
            top: 150,
            right: 50,
          }}
          href='/stageCanvas'
          variant='outlined'
          color='success'
          onClick={() => {
            // setShowCanvas(true);
            setIsExisting(false);
          }}
        >
          Start new project <NoteAddRoundedIcon sx={{ fontSize: 40 }} />
        </Button>
        <Button
          sx={{
            marginX: 2,
            width: 200,
            height: 100,
            position: 'relative',
            top: 150,
            left: 50,
            color: '#03a9f4',
          }}
          variant='outlined'
          color='info'
          href='/stageCanvas'
          onClick={() => {
            setIsExisting(true);
          }}
        >
          Open existing project <FileOpenRoundedIcon sx={{ fontSize: 40 }} />
        </Button>
      </Box>
    </Container>
  );
}
