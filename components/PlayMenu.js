import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  Divider,
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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { checkValidity } from '../src/helpers';

const PlayMenu = ({ shape, handleCloseDrawer }) => {
  const [tabValue, setTabValue] = useState(0);
  const [menuObj, setMenuObj] = useState(shape.userValues?.params || {});
  const [paramSelected, setParamSelected] = useState('');
  const [paramSelectedList, setParamSelectedList] = useState(
    shape.userValues?.paramSelectedList || []
  );
  const [itemsObj, setItemsObj] = useState(shape.userValues?.items || []);
  const [itemSelected, setItemSelected] = useState('');
  const [errorObj, setErrorObj] = useState({});

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
    shape.setUserValues({
      params: menuObj,
      paramSelectedList,
      items: itemsObj,
    });
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
  function handleRemoveParameter() {
    if (paramSelectedList.length < 1) return;

    setParamSelectedList((s) => {
      const newArr = [...s];
      newArr.pop();
      return newArr;
    });
  }
  function handleAddItem() {
    setItemsObj((s) => {
      return [...s, { digit: itemSelected }];
    });
    setItemSelected('');
  }
  function handleRemoveItem(e, key) {
    setItemsObj((s) => {
      const newArr = [...s];
      newArr.splice(key, 1);
      return newArr;
    });
  }

  function handleItemsObjChange(value, key, name) {
    setItemsObj((s) => {
      const newArr = [...s];
      newArr[key][name] = value;
      return newArr;
    });
  }
  function handleValidation(e, name, type) {
    let errorMessage = checkValidity(type, e);
    if (errorMessage !== -1) {
      e.target.style.backgroundColor = '#ffebee';
      setErrorObj((s) => {
        return { ...s, [name]: errorMessage };
      });
      return;
    }
    // no error condition
    setErrorObj((s) => {
      const newObj = { ...s };
      delete newObj[name];
      return newObj;
    });
    e.target.style.backgroundColor = '#f1f8e9';
  }

  function addItemElements(digit, key) {
    return (
      <List key={key}>
        <ListItem>
          <Typography
            sx={{
              boxShadow: 1,
              px: 1,
              borderRadius: 1,
              backgroundColor: '#f1f8e9',
            }}
            variant='h6'
          >
            {digit}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography
            sx={{ width: '35%', fontWeight: 405 }}
            variant='subtitle1'
          >
            action:
          </Typography>
          <TextField
            value={itemsObj[key].action || ''}
            onChange={(e) => {
              handleItemsObjChange(e.target.value, key, 'action');
              handleValidation(e, `action${key}`, 'object');
            }}
            helperText={errorObj[`action${key}`]}
            sx={{ mx: 1 }}
            size='small'
          />
        </ListItem>
        <ListItem>
          <Typography
            sx={{ width: '35%', fontWeight: 405 }}
            variant='subtitle1'
          >
            prompt:
          </Typography>
          <TextField
            value={itemsObj[key].prompt || ''}
            onChange={(e) => {
              handleItemsObjChange(e.target.value, key, 'prompt');
              handleValidation(e, `prompt${key}`, 'prompt');
            }}
            helperText={errorObj[`prompt${key}`]}
            sx={{ mx: 1 }}
            size='small'
          />
        </ListItem>
        <ListItem>
          <Typography
            sx={{ width: '35%', fontWeight: 405 }}
            variant='subtitle1'
          >
            disable:
          </Typography>
          <Switch
            checked={itemsObj[key].disable || false}
            onChange={(e) => {
              handleItemsObjChange(e.target.checked, key, 'disable');
            }}
            sx={{ mx: 0.5 }}
          ></Switch>
        </ListItem>
        <ListItem>
          <Typography
            sx={{ width: '35%', fontWeight: 405 }}
            variant='subtitle1'
          >
            silent:
          </Typography>
          <Switch
            checked={itemsObj[key].silent || false}
            onChange={(e) => {
              handleItemsObjChange(e.target.checked, key, 'silent');
            }}
            sx={{ mx: 0.5 }}
          ></Switch>
        </ListItem>
        <ListItem>
          <Typography
            sx={{ width: '35%', fontWeight: 405 }}
            variant='subtitle1'
          >
            skip:
          </Typography>
          <Select
            value={itemsObj[key].skip || ''}
            onChange={(e) => {
              handleItemsObjChange(e.target.value, key, 'skip');
            }}
            size='small'
            sx={{ minWidth: '25%' }}
          >
            {[...Array(10).keys()].slice(1).map((el, i) => (
              <MenuItem key={i} value={el}>
                {el}
              </MenuItem>
            ))}
          </Select>
          <Tooltip title='Remove item' placement='top-start'>
            <RemoveCircleIcon
              sx={{
                ml: 'auto',
                color: '#ef5350',
                boxShadow: 1,
                width: 'max-content',
                borderRadius: 1,
                fontSize: '1.5rem',
              }}
              onClick={(e) => {
                handleRemoveItem(e, key);
              }}
            />
          </Tooltip>
        </ListItem>
        <Divider sx={{ my: 2 }} />
      </List>
    );
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
                handleValidation(e, 'timeoutPrompt', 'prompt');
              }}
              helperText={errorObj.timeoutPrompt}
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
                handleValidation(e, 'invalidPrompt', 'prompt');
              }}
              sx={{ mx: 0.5 }}
              size='small'
              helperText={errorObj.invalidPrompt}
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
      <List sx={{ minWidth: 350 }}>
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
                handleValidation(e, 'menuId', 'object');
              }}
              sx={{
                mx: 0.5,
              }}
              helperText={errorObj.menuId}
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
          {/* <pre>{JSON.stringify(errorObj, undefined, 2)}</pre> */}
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
              sx={{ minWidth: '35%' }}
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
                onClick={handleRemoveParameter}
              />
            </Tooltip>
          </ListItem>
          <List>
            {paramSelectedList.map((el, i) => addParamsElements(el, i))}
          </List>
        </Box>
        <Box id='tabPanel2' sx={{ display: 'none' }}>
          <ListItem sx={{ mt: 2 }}>
            <Typography
              sx={{ width: '35%', fontSize: 17, fontWeight: 405 }}
              variant='subtitle1'
            >
              Select Item
            </Typography>
            <Select
              value={itemSelected}
              onChange={(e) => {
                setItemSelected(e.target.value);
              }}
              sx={{ mx: 1 }}
              size='small'
            >
              {itemsObj.length > 0
                ? ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '#', '*']
                    .filter((el) => !itemsObj.some((e) => e.digit == el))
                    .map((el, i) => (
                      <MenuItem key={i} value={el}>
                        {el}
                      </MenuItem>
                    ))
                : [
                    '0',
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '#',
                    '*',
                  ].map((el, i) => (
                    <MenuItem key={i} value={el}>
                      {el}
                    </MenuItem>
                  ))}
            </Select>
            <Tooltip title='Add Item' placement='right-start'>
              <AddCircleIcon
                sx={{
                  mx: 2,
                  color: '#4caf50',
                  boxShadow: 1,
                  width: 'max-content',
                  borderRadius: 1,
                  fontSize: '1.5rem',
                }}
                onClick={handleAddItem}
              />
            </Tooltip>
          </ListItem>
          {/* <pre>{JSON.stringify(itemsObj, null, 2)}</pre> */}
          {itemsObj?.map((el, i) => addItemElements(el.digit, i))}
        </Box>
      </List>
    </>
  );
};

export default PlayMenu;
