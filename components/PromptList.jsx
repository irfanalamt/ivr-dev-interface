import {
  Box,
  Button,
  Dialog,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { useEffect, useState } from 'react';

const PromptList = ({ open, handleClose, stageGroup }) => {
  const [promptArray, setPromptArray] = useState(null);

  useEffect(() => {
    getPromptArray();
  }, []);

  function getPromptArray() {
    let allPrompts = [];

    for (const page of stageGroup) {
      const shapes = page.shapes;
      const shapeValues = Object.values(shapes);

      shapeValues.forEach((shape) => {
        if (['playMessage', 'playConfirm', 'getDigits'].includes(shape.type)) {
          if (shape.userValues?.messageList) {
            allPrompts = allPrompts.concat(
              shape.userValues.messageList
                .filter((message) => message.type === 'prompt')
                .map((message) => message.value)
            );
          }
        } else if (shape.type === 'playMenu') {
          if (shape.userValues?.items) {
            allPrompts = allPrompts.concat(
              shape.userValues.items
                .filter((item) => item.prompt)
                .map((item) => item.prompt)
            );
          }
        }
      });
    }

    let uniquePrompts = [...new Set(allPrompts)];
    setPromptArray(uniquePrompts);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minWidth: 400,
          mt: 1,
        }}
      >
        <Typography
          sx={{
            backgroundColor: '#b0bec5',
            px: 2,
            boxShadow: 1,
            width: 'max-content',
          }}
          variant='h6'
        >
          Prompt List
        </Typography>
        <Box>
          <Tooltip title='SAVE'>
            <Button
              size='small'
              variant='contained'
              sx={{
                height: 30,
                mr: 1,
                color: 'black',
                backgroundColor: '#dcdcdc',
                '&:hover': { backgroundColor: '#81c784' },
              }}
            >
              <SaveRoundedIcon />
            </Button>
          </Tooltip>

          <Tooltip title='CLOSE'>
            <Button
              size='small'
              variant='contained'
              sx={{
                height: 30,
                mr: 1,
                color: 'black',
                backgroundColor: '#dcdcdc',
                '&:hover': { backgroundColor: '#e57373' },
              }}
              onClick={handleClose}
            >
              <CloseRoundedIcon sx={{ fontSize: 21 }} />
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Stack sx={{ my: 2, pl: 2 }} spacing={1}>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <Box sx={{ width: '40%' }}>
            <Typography
              sx={{
                width: 'max-content',
                px: 1,
                fontSize: 'medium',
                backgroundColor: '#eceff1',
              }}
              variant='h6'
            >
              prompt name
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: 'medium',
              width: 'max-content',
              px: 1,
              backgroundColor: '#eceff1',
            }}
            variant='h6'
          >
            description
          </Typography>
        </Box>
        {promptArray?.map((p, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ width: '40%', ml: 1 }} variant='body1'>
              {p}
            </Typography>
            <TextField sx={{ width: 200 }} size='small' multiline />
          </Box>
        ))}
      </Stack>
    </Dialog>
  );
};

export default PromptList;
