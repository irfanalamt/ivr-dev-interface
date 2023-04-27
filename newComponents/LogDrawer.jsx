import {
  List,
  ListItem,
  Stack,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Divider,
} from '@mui/material';

const LogDrawer = ({logText, setLogText}) => {
  function handleLogTextChange(event, type) {
    const newText = event.target.value;
    setLogText((prevLogText) => ({
      ...prevLogText,
      [type]: {
        ...prevLogText[type],
        text: newText,
      },
    }));
  }

  function handleRadioChange(event, type) {
    const newType = event.target.value;
    setLogText((prevLogText) => ({
      ...prevLogText,
      [type]: {
        ...prevLogText[type],
        type: newType,
      },
    }));
  }

  const renderSection = (sectionType) => (
    <>
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        <Typography fontSize='large' variant='subtitle2' sx={{mr: 4}}>
          {sectionType === 'before' ? 'Before' : 'After'}
        </Typography>
        <RadioGroup
          sx={{ml: 'auto'}}
          row
          name={`log-${sectionType}-radio-button`}
          value={logText[sectionType].type}
          onChange={(event) => handleRadioChange(event, sectionType)}>
          <FormControlLabel value='trace' control={<Radio />} label='Trace' />
          <FormControlLabel value='info' control={<Radio />} label='Info' />
        </RadioGroup>
      </Box>
      <Box>
        <TextField
          sx={{backgroundColor: '#f5f5f5'}}
          size='small'
          minRows={3}
          inputProps={{spellCheck: 'false'}}
          fullWidth
          multiline
          value={logText[sectionType].text}
          onChange={(event) => handleLogTextChange(event, sectionType)}
        />
      </Box>
    </>
  );

  return (
    <List>
      <ListItem sx={{mt: 2}}>
        <Stack sx={{width: '100%'}}>{renderSection('before')}</Stack>
      </ListItem>
      <Divider sx={{my: 2}} />
      <ListItem>
        <Stack sx={{width: '100%'}}>{renderSection('after')}</Stack>
      </ListItem>
    </List>
  );
};

export default LogDrawer;
