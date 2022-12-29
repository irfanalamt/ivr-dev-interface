import { ListItem, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { checkValidity } from '../src/helpers';

const DrawerName = ({
  shapeName,
  setShapeName,
  errorText,
  setErrorText,
  stageGroup = null,
  successText = '',
}) => {
  const handleNameValidation = (e) => {
    if (
      stageGroup?.getShapesAsArray().some((el) => el.text === e.target.value)
    ) {
      setErrorText('name NOT unique');
      return;
    }

    const errorM = checkValidity('object', e);
    if (errorM === -1) {
      // No error condition
      setErrorText('');
      return;
    }

    setErrorText(errorM);
  };

  return (
    <>
      <Typography
        sx={{
          backgroundColor: ' #FFE4E1',
          color: '#FF0000',
          width: 'max-content',
          position: 'absolute',
          px: 1,
          mt: 1,
          left: 0,
          right: 0,
          mx: 'auto',
          fontSize: '0.75rem',
        }}
        variant='subtitle1'
      >
        {errorText}
      </Typography>
      <Typography
        sx={{
          backgroundColor: '#7eca8f',
          color: '#ffffff',
          width: 'max-content',
          position: 'absolute',
          px: 1,
          mt: 1,
          left: 0,
          right: 0,
          mx: 'auto',
          fontSize: '0.75rem',
        }}
        variant='subtitle1'
      >
        {successText}
      </Typography>
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
          onChange={(e) => {
            handleNameValidation(e);
            setShapeName(e.target.value);
          }}
        />
      </ListItem>
    </>
  );
};

export default DrawerName;
