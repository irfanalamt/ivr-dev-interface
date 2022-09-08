import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  MenuItem,
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

const SetParams = ({ shape, handleCloseDrawer }) => {
  const [shapeName, setShapeName] = useState(shape.text || '');
  const [menuObj, setMenuObj] = useState(shape.userValues?.params || {});
  const [paramSelectedList, setParamSelectedList] = useState(
    shape.userValues?.paramSelectedList || []
  );
  const [paramSelected, setParamSelected] = useState('');
  const [errorObj, setErrorObj] = useState({});

  const optionalParamsList = [
    'invalidAction',
    'timeoutAction',
    'invalidPrompt',
    'timeoutPrompt',
    'maxRetries',
    'previousMenuId',
  ];

  function saveUserValues() {
    shape.setText(shapeName);
    shape.setUserValues({
      params: menuObj,
      paramSelectedList,
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
  function handleMenuObjChange(value, name) {
    setMenuObj((s) => {
      const newArr = { ...s };
      newArr[name] = value;
      return newArr;
    });
  }

  function handleAddParameter() {
    if (paramSelected === '') return;
    setParamSelectedList((s) => {
      return [...s, `${paramSelected}`];
    });
    setParamSelected('');
  }
  function handleRemoveParameter(name) {
    let index = paramSelectedList.findIndex((el) => {
      return el === name;
    });
    if (index === -1) return;
    setParamSelectedList((s) => {
      const newArr = [...s];
      newArr.splice(index, 1);
      return newArr;
    });
    setMenuObj((s) => {
      const newObj = { ...s };
      delete newObj[name];
      return newObj;
    });
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mr: 'auto',
                minWidth: '35%',
              }}
            >
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
                  value={menuObj.invalidTransferPoint || ''}
                  onChange={(e) => {
                    handleMenuObjChange(e.target.value, 'invalidTransferPoint');
                  }}
                />
              )}
              {menuObj.invalidAction === 'function' && (
                <TextField
                  placeholder='functionName'
                  sx={{ my: 0.5, width: 150 }}
                  size='small'
                  value={menuObj.invalidActionFunction || ''}
                  onChange={(e) => {
                    handleMenuObjChange(
                      e.target.value,
                      'invalidActionFunction'
                    );
                  }}
                />
              )}
            </Box>
            <Tooltip title='Remove parameter' placement='top-start'>
              <RemoveCircleOutlineRoundedIcon
                sx={{
                  ml: 'auto',
                  borderRadius: 1,
                  boxShadow: 1,
                  width: 22,
                  height: 22,
                }}
                color='error'
                onClick={() => {
                  handleRemoveParameter('invalidAction');
                }}
              />
            </Tooltip>
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mr: 'auto',
                minWidth: '35%',
              }}
            >
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
                  value={menuObj.timeoutTransferPoint || ''}
                  onChange={(e) => {
                    handleMenuObjChange(e.target.value, 'timeoutTransferPoint');
                  }}
                />
              )}
              {menuObj.timeoutAction === 'function' && (
                <TextField
                  placeholder='functionName'
                  sx={{ my: 0.5, width: 150 }}
                  size='small'
                  value={menuObj.timeoutActionFunction || ''}
                  onChange={(e) => {
                    handleMenuObjChange(
                      e.target.value,
                      'timeoutActionFunction'
                    );
                  }}
                />
              )}
            </Box>
            <Tooltip title='Remove parameter' placement='top-start'>
              <RemoveCircleOutlineRoundedIcon
                sx={{
                  ml: 'auto',
                  borderRadius: 1,
                  boxShadow: 1,
                  width: 22,
                  height: 22,
                }}
                color='error'
                onClick={() => {
                  handleRemoveParameter('timeoutAction');
                }}
              />
            </Tooltip>
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
              sx={{ width: '50%', mr: 'auto' }}
              size='small'
            />
            <Tooltip title='Remove parameter' placement='top-start'>
              <RemoveCircleOutlineRoundedIcon
                sx={{
                  ml: 'auto',
                  borderRadius: 1,
                  boxShadow: 1,
                  width: 22,
                  height: 22,
                }}
                color='error'
                onClick={() => {
                  handleRemoveParameter('timeoutPrompt');
                }}
              />
            </Tooltip>
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
              sx={{ width: '50%', mr: 'auto' }}
              size='small'
              helperText={errorObj.invalidPrompt}
            />
            <Tooltip title='Remove parameter' placement='top-start'>
              <RemoveCircleOutlineRoundedIcon
                sx={{
                  ml: 'auto',
                  borderRadius: 1,
                  boxShadow: 1,
                  width: 22,
                  height: 22,
                }}
                color='error'
                onClick={() => {
                  handleRemoveParameter('invalidPrompt');
                }}
              />
            </Tooltip>
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
              sx={{ mr: 'auto', minWidth: '35%' }}
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
            <Tooltip title='Remove parameter' placement='top-start'>
              <RemoveCircleOutlineRoundedIcon
                sx={{
                  ml: 'auto',
                  borderRadius: 1,
                  boxShadow: 1,
                  width: 22,
                  height: 22,
                }}
                color='error'
                onClick={() => {
                  handleRemoveParameter('maxRetries');
                }}
              />
            </Tooltip>
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
              sx={{ width: '50%', mr: 'auto' }}
              size='small'
            />
            <Tooltip title='Remove parameter' placement='top-start'>
              <RemoveCircleOutlineRoundedIcon
                sx={{
                  ml: 'auto',
                  borderRadius: 1,
                  boxShadow: 1,
                  width: 22,
                  height: 22,
                }}
                color='error'
                onClick={() => {
                  handleRemoveParameter('previousMenuId');
                }}
              />
            </Tooltip>
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
              backgroundColor: '#e91e63',
              borderRadius: 1,
            }}
            variant='h6'
          >
            Set Params
          </Typography>
        </ListItem>
        <ListItem sx={{ mt: 1 }}>
          <Typography sx={{ mx: 1, width: '35%' }} variant='h6'>
            Name:
          </Typography>
          <TextField
            sx={{ width: '50%', mr: 'auto' }}
            value={shapeName}
            onChange={(e) => {
              setShapeName(e.target.value);
            }}
            size='small'
          />
        </ListItem>

        <ListItem sx={{ my: 2 }}>
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
          <Tooltip title='Add parameter' placement='top-start'>
            <AddCircleOutlineRoundedIcon
              sx={{
                mx: 1,
                ml: 3,
                borderRadius: 1,
                boxShadow: 1,
                width: 28,
                height: 28,
              }}
              color='success'
              onClick={handleAddParameter}
            />
          </Tooltip>
          <Tooltip title='Remove parameter' placement='top-start'>
            <RemoveCircleOutlineRoundedIcon
              sx={{
                mx: 1,
                borderRadius: 1,
                boxShadow: 1,
                width: 28,
                height: 28,
              }}
              color='error'
              // onClick={handleRemoveParameter}
            />
          </Tooltip>
        </ListItem>
        <pre>{JSON.stringify(paramSelectedList, null, 2)}</pre>
        <pre>{JSON.stringify(menuObj, null, 2)}</pre>
        {paramSelectedList.map((el, i) => addParamsElements(el, i))}
      </List>
    </>
  );
};

export default SetParams;
