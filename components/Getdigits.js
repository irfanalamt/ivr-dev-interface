import {
  Tabs,
  Button,
  List,
  ListItem,
  Tab,
  TextField,
  Typography,
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { useState } from 'react';

const GetDigits = ({ shape }) => {
  const [shapeName, setShapeName] = useState(shape.text);
  const [tabValue, setTabValue] = useState(0);

  function saveUserValues() {
    shape.setText(shapeName);
  }
  function handleTabChange(e, newVal) {
    setTabValue(newVal);
  }
  return (
    <List>
      <ListItem>
        <Typography
          sx={{
            marginX: 'auto',
            marginY: 2,
            boxShadow: 1,
            paddingX: 1,
            borderRadius: 2,
            backgroundColor: '#9c27b0',
          }}
          variant='h5'
        >
          Get Digits
        </Typography>
        <Button color='info' variant='outlined' onClick={saveUserValues}>
          save <SaveRoundedIcon />
        </Button>
      </ListItem>
      <ListItem sx={{ justifyContent: 'center' }}>
        <Typography variant='h6'>NAME</Typography>
        <TextField
          sx={{ marginX: 2 }}
          value={shapeName}
          onChange={(e) => {
            setShapeName(e.target.value);
          }}
          onBlur={saveUserValues}
        />
      </ListItem>
      <ListItem>
        <Tabs
          sx={{ marginX: 'auto' }}
          value={tabValue}
          onChange={handleTabChange}
        >
          <Tab onClick={saveUserValues} label='Message List' />
          <Tab onClick={saveUserValues} label='Parameters' />
        </Tabs>
      </ListItem>
    </List>
  );
};

export default GetDigits;
