import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  ListItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {useState} from 'react';

const Jumper = ({shape, handleCloseDrawer, openVariableManager}) => {
  const [type, setType] = useState(shape.userValues?.type ?? 'exit');
  const [name, setName] = useState(shape.userValues?.name ?? shape.text);

  function handleSave() {
    shape.setUserValues({
      type,
      name,
    });
  }
  return (
    <>
      <ListItem
        sx={{
          backgroundColor: '#cfd8dc',
          display: 'flex',
          boxShadow: 2,
          p: 1,
          minWidth: 350,
        }}>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 'extra-large',
            height: 40,
          }}
          variant='h5'>
          {
            <img
              src='/icons/jumperBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp;Jumper
        </Typography>
        <IconButton
          size='small'
          onClick={openVariableManager}
          sx={{
            ml: 'auto',
            backgroundColor: '#263238',
            color: 'white',
            '&:hover': {backgroundColor: '#26a69a'},
            height: 30,
            width: 30,
          }}>
          <img
            src='/icons/variableManagerWhite.png'
            alt='Icon'
            height={'16px'}
            width={'16px'}
          />
        </IconButton>

        <IconButton
          size='small'
          sx={{
            ml: 1,
            backgroundColor: '#263238',
            color: 'white',
            '&:hover': {backgroundColor: '#29b6f6'},
            height: 30,
            width: 30,
          }}>
          <QuestionMarkIcon sx={{fontSize: '20px'}} />
        </IconButton>
        <IconButton
          onClick={handleCloseDrawer}
          size='small'
          sx={{
            ml: 1,
            backgroundColor: '#263238',
            color: 'white',
            '&:hover': {backgroundColor: '#ef5350'},
            height: 30,
            width: 30,
          }}>
          <CloseIcon sx={{fontSize: '22px'}} />
        </IconButton>
      </ListItem>
      <Box sx={{backgroundColor: '#eeeeee', height: '100%'}}>
        <Stack sx={{mt: 4, px: 2}}>
          <Typography fontSize='large' variant='subtitle2'>
            Type
          </Typography>

          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <RadioGroup
              row
              name='radio-endflowType'
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}>
              <FormControlLabel value='exit' control={<Radio />} label='Exit' />
              <FormControlLabel
                sx={{ml: 1}}
                value='entry'
                control={<Radio />}
                label='Entry'
              />
            </RadioGroup>
            <Button
              onClick={handleSave}
              sx={{ml: 'auto'}}
              size='small'
              variant='contained'>
              <SaveIcon />
            </Button>
          </Box>

          <Typography sx={{fontSize: '1rem', mt: 4}} variant='subtitle2'>
            ID
          </Typography>
          {type === 'exit' ? (
            <TextField
              sx={{width: '220px', backgroundColor: '#f5f5f5'}}
              size='small'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <Select
              sx={{width: '180px', backgroundColor: '#f5f5f5'}}
              size='small'
              value={name}
              onChange={(e) => setName(e.target.value)}></Select>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default Jumper;
