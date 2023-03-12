import {
  Box,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const LogDrawer = () => {
  return (
    <List>
      <ListItem sx={{mt: 2}}>
        <Stack sx={{width: '100%'}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography fontSize='large' variant='subtitle2' sx={{mr: 4}}>
              Before
            </Typography>
            <RadioGroup sx={{ml: 'auto'}} row name='log-before-radio-button'>
              <FormControlLabel
                value='trace'
                control={<Radio />}
                label='Trace'
              />
              <FormControlLabel value='info' control={<Radio />} label='Info' />
            </RadioGroup>
          </Box>
          <Box>
            <TextField
              sx={{backgroundColor: '#f5f5f5'}}
              size='small'
              minRows={3}
              fullWidth
              multiline
            />
          </Box>
        </Stack>
      </ListItem>
      <Divider sx={{my: 2}} />
      <ListItem>
        <Stack sx={{width: '100%'}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography fontSize='large' variant='subtitle2' sx={{mr: 4}}>
              After
            </Typography>
            <RadioGroup sx={{ml: 'auto'}} row name='log-after-radio-button'>
              <FormControlLabel
                value='trace'
                control={<Radio />}
                label='Trace'
              />
              <FormControlLabel value='info' control={<Radio />} label='Info' />
            </RadioGroup>
          </Box>
          <Box>
            <TextField
              sx={{backgroundColor: '#f5f5f5'}}
              size='small'
              minRows={3}
              fullWidth
              multiline
            />
          </Box>
        </Stack>
      </ListItem>
    </List>
  );
};

export default LogDrawer;
