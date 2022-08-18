import {
  Alert,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  MenuItem,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { useEffect, useRef, useState } from 'react';

const PlayMessage = ({ shape, handleCloseDrawer }) => {
  const [shapeName, setShapeName] = useState(shape.text);
  const [alert, setAlert] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [allErrors, setAllErrors] = useState({});

  function saveUserValues() {
    console.log('Errors before saving:', Object.keys(allErrors).length);
    if (Object.keys(allErrors).length > 0) {
      setAlert(true);
      return;
    }
    setAlert(false);
    shape.setText(shapeName);
  }
  function handleNameValidation(e) {
    let { value } = e.target;
    let messages = [];
    let errorBox = document.getElementById('name-error-box');
    let nameRegex = /^[a-zA-z_]+[a-zA-z0-9_]*$/;
    if (!nameRegex.test(value)) {
      errorBox.style.visibility = 'visible';
      errorBox.innerText = 'name not in valid format';
      e.target.style.backgroundColor = '#ffebee';
      setAllErrors({ ...allErrors, name: true });
      return;
    }
    setAllErrors((obj) => {
      delete obj.name;
      return obj;
    });
    errorBox.style.visibility = 'hidden';
    e.target.style.backgroundColor = '#f1f8e9';
    errorBox.innerText = '';
  }

  useEffect(() => {
    let tabPanel1 = document.getElementById('tabPanel1');
    let tabPanel2 = document.getElementById('tabPanel2');
    if (tabValue === 0) {
      tabPanel2.style.visibility = 'hidden';
      tabPanel1.style.visibility = 'visible';
      return;
    }
    if (tabValue === 1) {
      tabPanel1.style.visibility = 'hidden';
      tabPanel2.style.visibility = 'visible';
    }
  }, [tabValue]);

  return (
    <>
      <List sx={{ minWidth: 350 }}>
        <ListItem>
          <Tooltip title='CLOSE'>
            <Button
              size='small'
              variant='contained'
              color='error'
              sx={{ height: 30 }}
              onClick={handleCloseDrawer}
            >
              <CloseRoundedIcon sx={{ fontSize: 21 }} />
            </Button>
          </Tooltip>
          <Tooltip title='SAVE'>
            <Button
              sx={{ height: 30, marginLeft: 1, marginRight: 'auto' }}
              size='small'
              variant='contained'
              color='success'
              onClick={saveUserValues}
            >
              <SaveRoundedIcon sx={{ fontSize: 20 }} />
            </Button>
          </Tooltip>
        </ListItem>
        <ListItem>
          <Typography
            sx={{
              marginX: 'auto',
              marginY: 1,
              boxShadow: 1,
              paddingX: 3,
              paddingY: 1,
              backgroundColor: '#f0f4c3',
              borderRadius: 1,
            }}
            variant='h6'
          >
            PLAY MESSAGE
          </Typography>
        </ListItem>

        <ListItem sx={{ marginTop: 1 }}>
          <Typography variant='button' sx={{ marginX: 1, fontSize: 15 }}>
            Name:
          </Typography>
          <TextField
            sx={{ width: 180, marginX: 1 }}
            size='small'
            value={shapeName}
            onChange={(e) => {
              setShapeName(e.target.value);
              handleNameValidation(e);
            }}
          ></TextField>
        </ListItem>
        <ListItem>
          <Typography
            sx={{ marginX: 'auto', boxShadow: 1, paddingX: 1 }}
            variant='subtitle2'
            id='name-error-box'
          ></Typography>
        </ListItem>
        <ListItem>
          <Tabs
            sx={{ marginX: 'auto' }}
            value={tabValue}
            onChange={(e, newVal) => {
              setTabValue(newVal);
            }}
          >
            <Tab label='Message List' />
            <Tab label='Parameters' />
          </Tabs>
        </ListItem>

        <ListItem>
          <Box id='tabPanels' sx={{ position: 'relative' }}>
            <Box id='tabPanel1' sx={{ position: 'absolute' }}>
              <Typography variant='subtitle1'>Select object type:</Typography>
              <Select defaultValue='prompt' sx={{ marginX: 2 }}>
                <MenuItem value='prompt'>Prompt</MenuItem>
                <MenuItem value='number'>Number</MenuItem>
                <MenuItem value='ordinal'>Ordinal</MenuItem>
                <MenuItem value='amount'>Amount</MenuItem>
                <MenuItem value='digits'>Digits</MenuItem>
                <MenuItem value='date'>Date</MenuItem>
                <MenuItem value='day'>Day</MenuItem>
                <MenuItem value='month'>Month</MenuItem>
                <MenuItem value='time'>Time</MenuItem>
              </Select>
            </Box>
            <Box
              id='tabPanel2'
              sx={{ position: 'absolute', visibility: 'hidden' }}
            >
              Params coming up
            </Box>
          </Box>
        </ListItem>
      </List>
      {alert && (
        <Snackbar
          open={alert}
          autoHideDuration={6000}
          onClose={() => {
            setAlert(false);
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <Alert severity='error'>
            Save unsuccessfull. Some fields are invalid!
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default PlayMessage;
