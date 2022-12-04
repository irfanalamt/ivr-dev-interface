import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { checkValidity } from '../src/helpers';

const PlayMenu = ({ shape, handleCloseDrawer, stageGroup }) => {
  const [shapeName, setShapeName] = useState(shape.text);
  const [tabValue, setTabValue] = useState(0);
  const [menuObj, setMenuObj] = useState(shape.userValues?.params || {});
  const [paramSelected, setParamSelected] = useState('');
  const [paramSelectedList, setParamSelectedList] = useState(
    shape.userValues?.paramSelectedList || []
  );
  const [itemsObj, setItemsObj] = useState(shape.userValues?.items || []);
  const [itemSelected, setItemSelected] = useState('');
  const [errorObj, setErrorObj] = useState({});

  function handleMenuObjChange(value, name) {
    setMenuObj((s) => {
      const newArr = { ...s };
      newArr[name] = value;
      return newArr;
    });
  }

  function saveUserValues() {
    shape.setText(shapeName || 'playMenu');
    const filteredItems = itemsObj.filter((item) => item.action);
    shape.setUserValues({
      params: menuObj,
      paramSelectedList,
      items: filteredItems,
    });

    generateJS();
  }

  function generateJS() {
    let menuString = JSON.stringify({ ...menuObj, items: itemsObj });

    let codeString = `this.${
      shapeName || `playMenu${shape.id}`
    }= async function(){let menu =${menuString};await IVR.playMenu(menu);
    };`;

    shape.setFunctionString(codeString);
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
    if (itemSelected === '') return;
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
      newArr[key][name] = String(value);
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
    // check name unique
    if (stageGroup.getShapes().some((el) => el.text === e.target.value)) {
      e.target.style.backgroundColor = '#ffebee';
      setErrorObj((s) => {
        return { ...s, [name]: 'name NOT unique' };
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
            placeholder='required'
            autoFocus
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
              variant='outlined'
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
              variant='outlined'
              color='success'
              onClick={saveUserValues}
            >
              <SaveRoundedIcon sx={{ fontSize: 20 }} />
            </Button>
          </Tooltip>
        </ListItem>
        <ListItem>
          <Chip
            sx={{ backgroundColor: '#009688', mx: 'auto', px: 2, py: 3 }}
            label={<Typography variant='h6'>Play Menu</Typography>}
          />
        </ListItem>
        <ListItem sx={{ my: 2 }}>
          <Typography variant='button' sx={{ fontSize: 16, width: '35%' }}>
            Name:
          </Typography>
          <TextField
            value={shapeName || ''}
            onChange={(e) => {
              setShapeName(e.target.value);
              handleValidation(e, 'menuId', 'object');
            }}
            sx={{
              mx: 0.5,
            }}
            helperText={errorObj.menuId}
            error={errorObj.menuId}
            size='small'
          />
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
        <Box id='tabPanel1' sx={{ display: tabValue == 0 ? 'block' : 'none' }}>
          {/* <pre>{JSON.stringify(menuObj, undefined, 2)}</pre> */}

          <ListItem sx={{ my: 0.5 }}>
            <Typography
              variant='subtitle2'
              sx={{
                fontSize: 16,
                width: '35%',
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
              <IconButton
                sx={{ ml: 2 }}
                color='success'
                size='large'
                onClick={handleAddParameter}
              >
                <AddCircleOutlineRoundedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Remove parameter'>
              <IconButton
                color='error'
                size='large'
                onClick={handleRemoveParameter}
              >
                <RemoveCircleOutlineRoundedIcon />
              </IconButton>
            </Tooltip>
          </ListItem>
          <List>
            {paramSelectedList.map((el, i) => addParamsElements(el, i))}
          </List>
        </Box>
        <Box id='tabPanel2' sx={{ display: tabValue == 1 ? 'block' : 'none' }}>
          <ListItem sx={{ mt: 2 }}>
            <Paper
              sx={{
                width: '100%',
                p: 2,
                backgroundColor: '#f9fbe7',
                display: 'flex',
                alignItems: 'center',
              }}
            >
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
            </Paper>
          </ListItem>
          {/* <pre>{JSON.stringify(itemsObj, null, 2)}</pre> */}
          {itemsObj?.map((el, i) => addItemElements(el.digit, i))}
        </Box>
      </List>
    </>
  );
};

export default PlayMenu;
