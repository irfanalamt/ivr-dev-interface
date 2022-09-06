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
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';

const PlayMenu = ({ shape, handleCloseDrawer }) => {
  const [tabValue, setTabValue] = useState(0);
  const [menuObj, setMenuObj] = useState(shape.userValues?.params || {});
  const [paramSelected, setParamSelected] = useState('');
  const [paramSelectedList, setParamSelectedList] = useState(
    shape.userValues?.paramSelectedList || []
  );

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
    shape.setText(menuObj.menuId || 'playMenu');
    shape.setUserValues({ params: menuObj, paramSelectedList });
  }

  const optionalParamsList = [
    'invalidAction',
    'timeoutAction',
    'invalidPrompt',
    'timeoutPrompt',
    'maxRetries',
    'previousMenuId',
  ];

  function handleAddParameter() {
    console.log('handleaddparameter');
    setParamSelectedList((s) => {
      return [...s, `${paramSelected}`];
    });
    setParamSelected('');
  }
  function addParamsElements(type, key) {
    switch (type) {
      case 'invalidAction':
        return (
          <ListItem key={key}>
            <Typography
              variant='subtitle2'
              sx={{
                marginX: 1,
                fontSize: 16,
                borderRadius: 0.5,
                fontWeight: 405,
                width: '35%',
              }}
            >
              invalidAction:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Select
                value={menuObj.invalidAction || ''}
                onChange={(e) => {
                  handleMenuObjChange(e.target.value, 'invalidAction');
                }}
                size='small'
              >
                <MenuItem value='disconnect'>Disconnect</MenuItem>
                <MenuItem value='transfer'>Transfer</MenuItem>
                <MenuItem value='function'>Function</MenuItem>
              </Select>
              {menuObj.invalidAction === 'transfer' && (
                <TextField
                  placeholder='transferPoint'
                  sx={{ my: 0.5, width: 150 }}
                  size='small'
                />
              )}
              {menuObj.invalidAction === 'function' && (
                <TextField
                  placeholder='functionName'
                  sx={{ my: 0.5, width: 150 }}
                  size='small'
                />
              )}
            </Box>
          </ListItem>
        );

      case 'timeoutAction':
        return (
          <ListItem key={key}>
            <Typography
              variant='subtitle2'
              sx={{
                marginX: 1,
                fontSize: 16,

                borderRadius: 0.5,
                fontWeight: 405,
                width: '35%',
              }}
            >
              timeoutAction:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Select
                value={menuObj.timeoutAction || ''}
                onChange={(e) => {
                  handleMenuObjChange(e.target.value, 'timeoutAction');
                }}
                size='small'
              >
                <MenuItem value='disconnect'>Disconnect</MenuItem>
                <MenuItem value='transfer'>Transfer</MenuItem>
                <MenuItem value='function'>Function</MenuItem>
              </Select>
              {menuObj.timeoutAction === 'transfer' && (
                <TextField
                  placeholder='transferPoint'
                  sx={{ my: 0.5, width: 150 }}
                  size='small'
                />
              )}
              {menuObj.timeoutAction === 'function' && (
                <TextField
                  placeholder='functionName'
                  sx={{ my: 0.5, width: 150 }}
                  size='small'
                />
              )}
            </Box>
          </ListItem>
        );
      case 'timeoutPrompt':
        return (
          <ListItem key={key}>
            <Typography
              variant='subtitle2'
              sx={{
                marginX: 1,
                fontSize: 16,
                width: '35%',

                borderRadius: 0.5,
                fontWeight: 405,
              }}
            >
              timeoutPrompt:
            </Typography>
            <TextField
              value={menuObj.timeoutPrompt || ''}
              onChange={(e) => {
                handleMenuObjChange(e.target.value, 'timeoutPrompt');
              }}
              sx={{ mx: 0.5 }}
              size='small'
            />
          </ListItem>
        );
      case 'invalidPrompt':
        return (
          <ListItem key={key}>
            <Typography
              variant='subtitle2'
              sx={{
                marginX: 1,
                fontSize: 16,
                width: '35%',

                borderRadius: 0.5,
                fontWeight: 405,
              }}
            >
              invalidPrompt:
            </Typography>
            <TextField
              value={menuObj.invalidPrompt || ''}
              onChange={(e) => {
                handleMenuObjChange(e.target.value, 'invalidPrompt');
              }}
              sx={{ mx: 0.5 }}
              size='small'
            />
          </ListItem>
        );
      case 'maxRetries':
        return (
          <ListItem key={key}>
            <Typography
              variant='subtitle2'
              sx={{
                marginX: 1,
                fontSize: 16,
                width: '35%',
                borderRadius: 0.5,
                fontWeight: 405,
              }}
            >
              maxRetries:
            </Typography>
            <Select
              size='small'
              sx={{ marginX: 2 }}
              value={menuObj.maxRetries || ''}
              onChange={(e) => {
                handleMenuObjChange(e.target.value, 'maxRetries');
              }}
            >
              {
                // Array of 1..10
                [...Array(11).keys()].slice(1).map((el, i) => {
                  return (
                    <MenuItem key={i} value={el}>
                      {el}
                    </MenuItem>
                  );
                })
              }
            </Select>
          </ListItem>
        );
      case 'previousMenuId':
        return (
          <ListItem key={key}>
            <Typography
              variant='subtitle2'
              sx={{
                marginX: 1,
                fontSize: 16,
                width: '35%',
                borderRadius: 0.5,
                fontWeight: 405,
              }}
            >
              previousMenuId:
            </Typography>
            <TextField
              value={menuObj.previousMenuId || ''}
              onChange={(e) => {
                handleMenuObjChange(e.target.value, 'previousMenuId');
              }}
              sx={{ mx: 0.5 }}
              size='small'
            />
          </ListItem>
        );
    }
  }

  return (
    <>
      <List>
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
          {/* <pre>{JSON.stringify(menuObj, undefined, 2)}</pre> */}
          <ListItem sx={{ mt: 2 }}>
            <Typography
              variant='subtitle2'
              sx={{
                marginX: 1,
                fontSize: 16,
                width: '35%',
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
              sx={{
                mx: 0.5,
              }}
              size='small'
            />
          </ListItem>
          <ListItem sx={{ my: 0.5 }}>
            <Typography
              variant='subtitle2'
              sx={{
                marginX: 1,
                fontSize: 16,
                width: '35%',
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

          <ListItem sx={{ my: 0.5 }}>
            <Typography
              variant='subtitle2'
              sx={{
                marginX: 1,
                fontSize: 16,
                width: '35%',
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
            ></Switch>
          </ListItem>
          <ListItem sx={{ my: 0.5 }}>
            <Typography
              variant='subtitle2'
              sx={{
                marginX: 1,
                fontSize: 16,
                width: '35%',
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
            ></Switch>
          </ListItem>
          <ListItem>
            <Typography
              sx={{
                fontWeight: 410,
                marginTop: 4,
                borderBottom: 1,
              }}
              variant='subtitle1'
            >
              Optional Params
            </Typography>
          </ListItem>
          {/* <pre>{JSON.stringify(paramSelectedList, undefined, 2)}</pre> */}
          <ListItem>
            <Select
              value={paramSelected}
              onChange={(e) => {
                setParamSelected(e.target.value);
              }}
              size='small'
            >
              {paramSelectedList.length > 0
                ? optionalParamsList
                    .filter((el) => !paramSelectedList.includes(el))
                    .map((el, i) => (
                      <MenuItem key={i} value={el}>
                        {el}
                      </MenuItem>
                    ))
                : optionalParamsList.map((el, i) => (
                    <MenuItem key={i} value={el}>
                      {el}
                    </MenuItem>
                  ))}
              {}
            </Select>
            <Tooltip title='Add parameter'>
              <AddCircleOutlineRoundedIcon
                sx={{
                  mx: 1,
                  ml: 2,
                  borderRadius: 1,
                  boxShadow: 1,
                  width: 28,
                  height: 28,
                }}
                color='success'
                onClick={handleAddParameter}
              />
            </Tooltip>
            <Tooltip title='Remove parameter'>
              <RemoveCircleOutlineRoundedIcon
                sx={{
                  mx: 0.5,
                  borderRadius: 1,
                  boxShadow: 1,
                  width: 28,
                  height: 28,
                }}
                color='error'
              />
            </Tooltip>
          </ListItem>
          <List>
            {paramSelectedList.map((el, i) => addParamsElements(el, i))}
          </List>
        </Box>
        <Box id='tabPanel2' sx={{ display: 'none' }}>
          <h2>Items</h2>
        </Box>
      </List>
    </>
  );
};

export default PlayMenu;
