import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  FormControlLabel,
  List,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

const PlayMenu = ({ shape, handleCloseDrawer }) => {
  const [tabValue, setTabValue] = useState(0);
  const [menuObj, setMenuObj] = useState(shape.userValues || {});

  useEffect(() => {
    switchTab();
  }, [tabValue]);

  function switchTab() {
    let tabPanel1 = document.getElementById('tabPanel1');
    let tabPanel2 = document.getElementById('tabPanel2');
    if (tabValue === 0) {
      tabPanel1.style.display = 'block';
      tabPanel2.style.display = 'none';
      return;
    }
    if (tabValue === 1) {
      tabPanel1.style.display = 'none';
      tabPanel2.style.display = 'block';
    }
  }

  function handleMenuObjChange(value, name) {
    setMenuObj((s) => {
      const newArr = { ...s };
      newArr[name] = value;
      return newArr;
    });
  }

  function saveUserValues() {
    shape.setText(menuObj.menuId);
    shape.setUserValues(menuObj);
  }
  return (
    <>
      <List sx={{ minWidth: 300 }}>
        <ListItem>
          <Tooltip title='CLOSE'>
            <Button
              size='small'
              variant='contained'
              color='error'
              sx={{ height: 30 }}
              onClick={() => {
                shape.setSelected(false);
                handleCloseDrawer();
              }}
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
              backgroundColor: '#009688',
              borderRadius: 1,
            }}
            variant='h6'
          >
            Play Menu
          </Typography>
        </ListItem>
        <ListItem>
          <Tabs
            sx={{ marginX: 'auto' }}
            value={tabValue}
            onChange={(e, newVal) => {
              setTabValue(newVal);
            }}
          >
            <Tab label='General' />
            <Tab label='Items' />
          </Tabs>
        </ListItem>
        <Box id='tabPanel1'>
          <pre>{JSON.stringify(menuObj, undefined, 2)}</pre>
          <ListItem sx={{ mt: 2 }}>
            <Typography
              variant='subtitle2'
              sx={{
                marginX: 1,
                fontSize: 16,
                boxShadow: 1,
                px: 1,
                borderRadius: 0.5,
                fontWeight: 405,
              }}
            >
              menuId:
            </Typography>
            <TextField
              value={menuObj.menuId || ''}
              onChange={(e) => {
                handleMenuObjChange(e.target.value, 'menuId');
              }}
              sx={{ width: 180, mx: 0.5 }}
              size='small'
            />
          </ListItem>
          <ListItem sx={{ mx: 0.5 }}>
            <Typography
              variant='subtitle2'
              sx={{
                marginX: 1,
                fontSize: 16,
                boxShadow: 1,
                px: 1,
                borderRadius: 0.5,
                fontWeight: 405,
              }}
            >
              desc:
            </Typography>
            <TextField
              value={menuObj.desc || ''}
              onChange={(e) => {
                handleMenuObjChange(e.target.value, 'desc');
              }}
              size='small'
              sx={{ mx: 0.5 }}
            />
          </ListItem>

          <ListItem sx={{ mx: 0.5 }}>
            <Typography
              variant='subtitle2'
              sx={{
                marginX: 1,
                fontSize: 16,
                boxShadow: 1,
                px: 1,
                borderRadius: 0.5,
                fontWeight: 405,
              }}
            >
              ignoreBuffer:
            </Typography>
            <Switch
              checked={menuObj.ignoreBuffer || false}
              onChange={(e) => {
                handleMenuObjChange(e.target.checked, 'ignoreBuffer');
              }}
              sx={{ mx: 0.5 }}
            ></Switch>
          </ListItem>
          <ListItem sx={{ mx: 0.5 }}>
            <Typography
              variant='subtitle2'
              sx={{
                marginX: 1,
                fontSize: 16,
                boxShadow: 1,
                px: 1,
                borderRadius: 0.5,
                fontWeight: 405,
              }}
            >
              logDb:
            </Typography>
            <Switch
              checked={menuObj.logDb || false}
              onChange={(e) => {
                handleMenuObjChange(e.target.checked, 'logDb');
              }}
              sx={{ mx: 0.5 }}
            ></Switch>
          </ListItem>
        </Box>
        <Box id='tabPanel2' sx={{ display: 'none' }}>
          <h2>Items</h2>
        </Box>
      </List>
    </>
  );
};

export default PlayMenu;
