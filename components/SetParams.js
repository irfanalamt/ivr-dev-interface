import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  Chip,
  List,
  ListItem,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { checkValidity } from '../src/helpers';

const SetParams = ({ shape, handleCloseDrawer, stageGroup }) => {
  const [shapeName, setShapeName] = useState(shape.text ?? '');
  const [menuObj, setMenuObj] = useState(shape.userValues?.params || {});
  const [paramSelectedList, setParamSelectedList] = useState(
    shape.userValues?.paramSelectedList || []
  );
  const [paramSelected, setParamSelected] = useState('');
  const [errorObj, setErrorObj] = useState({});
  const [nextItem, setNextItem] = useState(shape.nextItem ?? '');

  const optionalParamsList = [
    'language',
    'terminator',
    'maxRetries',
    'maxRepeats',
    'firstTimeout',
    'interTimeout',
    'menuTimeout',
    'invalidAction',
    'timeoutAction',
    'currency',
    'invalidPrompt',
    'timeoutPrompt',
    'hotkeyMainMenu',
    'hotkeyTransfer',
    'logDb',
  ];

  function saveUserValues() {
    shape.setText(shapeName);
    shape.setNextItem(nextItem);
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
    let index = paramSelectedList.findIndex((el) => el === name);
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
                [...Array(11).keys()].slice(1).map((el, i) => (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                ))
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
      case 'maxRepeats':
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
              maxRepeats:
            </Typography>
            <Select
              size='small'
              sx={{ mr: 'auto', minWidth: '35%' }}
              value={menuObj.maxRepeats || ''}
              onChange={(e) => {
                handleMenuObjChange(e.target.value, 'maxRepeats');
              }}
            >
              {
                // Array of 1..10
                [...Array(11).keys()].slice(1).map((el, i) => (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                ))
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
                  handleRemoveParameter('maxRepeats');
                }}
              />
            </Tooltip>
          </ListItem>
        );
      case 'firstTimeout':
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
              firstTimeout:
            </Typography>
            <Select
              size='small'
              sx={{ mr: 'auto', minWidth: '35%' }}
              value={menuObj.firstTimeout || ''}
              onChange={(e) => {
                handleMenuObjChange(e.target.value, 'firstTimeout');
              }}
            >
              {
                // Array of 1..15
                [...Array(16).keys()].slice(1).map((el, i) => (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                ))
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
                  handleRemoveParameter('firstTimeout');
                }}
              />
            </Tooltip>
          </ListItem>
        );
      case 'interTimeout':
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
              interTimeout:
            </Typography>
            <Select
              size='small'
              sx={{ mr: 'auto', minWidth: '35%' }}
              value={menuObj.interTimeout || ''}
              onChange={(e) => {
                handleMenuObjChange(e.target.value, 'interTimeout');
              }}
            >
              {
                // Array of 1..15
                [...Array(16).keys()].slice(1).map((el, i) => (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                ))
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
                  handleRemoveParameter('interTimeout');
                }}
              />
            </Tooltip>
          </ListItem>
        );
      case 'menuTimeout':
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
              menuTimeout:
            </Typography>
            <Select
              size='small'
              sx={{ mr: 'auto', minWidth: '35%' }}
              value={menuObj.menuTimeout || ''}
              onChange={(e) => {
                handleMenuObjChange(e.target.value, 'menuTimeout');
              }}
            >
              {
                // Array of 1..15
                [...Array(16).keys()].slice(1).map((el, i) => (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                ))
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
                  handleRemoveParameter('menuTimeout');
                }}
              />
            </Tooltip>
          </ListItem>
        );
      case 'currency':
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
              currency:
            </Typography>
            <Select
              size='small'
              sx={{ mr: 'auto', minWidth: '35%' }}
              value={menuObj.currency || ''}
              onChange={(e) => {
                handleMenuObjChange(e.target.value, 'currency');
              }}
            >
              {['SAR', 'EUR', 'GBP', 'USD', 'CNY', 'RUB', 'JPY'].map(
                (el, i) => (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                )
              )}
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
                  handleRemoveParameter('currency');
                }}
              />
            </Tooltip>
          </ListItem>
        );
      case 'language':
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
              language:
            </Typography>
            <Select
              size='small'
              sx={{ mr: 'auto', minWidth: '35%' }}
              value={menuObj.language || ''}
              onChange={(e) => {
                handleMenuObjChange(e.target.value, 'language');
              }}
            >
              {['English', 'Arabic', 'French', 'Hindi', 'German'].map(
                (el, i) => (
                  <MenuItem key={i} value={el.toLowerCase()}>
                    {el}
                  </MenuItem>
                )
              )}
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
                  handleRemoveParameter('language');
                }}
              />
            </Tooltip>
          </ListItem>
        );
      case 'terminator':
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
              terminator:
            </Typography>
            <Select
              size='small'
              sx={{ mr: 'auto', minWidth: '35%' }}
              value={menuObj.terminator || ''}
              onChange={(e) => {
                handleMenuObjChange(e.target.value, 'terminator');
              }}
            >
              {['#', '*', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(
                (el, i) => (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                )
              )}
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
                  handleRemoveParameter('terminator');
                }}
              />
            </Tooltip>
          </ListItem>
        );
      case 'hotkeyMainMenu':
        return (
          <ListItem key={key}>
            <Typography
              variant='subtitle2'
              sx={{
                marginX: 1,
                width: '35%',
                borderRadius: 0.5,
                fontWeight: 405,
              }}
            >
              hotkeyMainMenu:
            </Typography>
            <Select
              size='small'
              sx={{ mr: 'auto', minWidth: '35%' }}
              value={menuObj.hotkeyMainMenu || ''}
              onChange={(e) => {
                handleMenuObjChange(e.target.value, 'hotkeyMainMenu');
              }}
            >
              {['#', '*', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(
                (el, i) => (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                )
              )}
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
                  handleRemoveParameter('hotkeyMainMenu');
                }}
              />
            </Tooltip>
          </ListItem>
        );
      case 'hotkeyTransfer':
        return (
          <ListItem key={key}>
            <Typography
              variant='subtitle2'
              sx={{
                marginX: 1,
                width: '35%',
                borderRadius: 0.5,
                fontWeight: 405,
              }}
            >
              hotkeyTransfer:
            </Typography>
            <Select
              size='small'
              sx={{ mr: 'auto', minWidth: '35%' }}
              value={menuObj.hotkeyTransfer || ''}
              onChange={(e) => {
                handleMenuObjChange(e.target.value, 'hotkeyTransfer');
              }}
            >
              {['#', '*', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(
                (el, i) => (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                )
              )}
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
                  handleRemoveParameter('hotkeyTransfer');
                }}
              />
            </Tooltip>
          </ListItem>
        );
      case 'logDb':
        return (
          <ListItem key={key}>
            <Typography
              variant='subtitle2'
              sx={{
                fontSize: 16,
                marginX: 1,
                width: '35%',
                borderRadius: 0.5,
                fontWeight: 405,
              }}
            >
              logDb:
            </Typography>
            <Switch
              sx={{ mx: 0.5 }}
              checked={menuObj.logDb}
              onChange={(e) => {
                handleMenuObjChange(e.target.checked, 'logDb');
              }}
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
                  handleRemoveParameter('logDb');
                }}
              />
            </Tooltip>
          </ListItem>
        );
    }
  }
  return (
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
        {/* <Typography
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
        </Typography> */}
        <Chip
          sx={{ backgroundColor: '#e91e63', mx: 'auto', px: 2, py: 3 }}
          label={<Typography variant='h6'>Set Params</Typography>}
        />
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
            handleValidation(e, 'menuId', 'object');
          }}
          helperText={errorObj.menuId}
          error={errorObj.menuId}
          size='small'
        />
      </ListItem>

      <ListItem sx={{ my: 2 }}>
        <Tooltip title='parameter type:'>
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
        </Tooltip>
        <Tooltip title='Add parameter'>
          <Button
            sx={{ ml: 4 }}
            variant='contained'
            color='success'
            size='small'
            onClick={handleAddParameter}
          >
            <AddCircleOutlineRoundedIcon />
          </Button>
        </Tooltip>
      </ListItem>
      {/* <pre>{JSON.stringify(paramSelectedList, null, 2)}</pre>
        <pre>{JSON.stringify(menuObj, null, 2)}</pre> */}
      {paramSelectedList.map((el, i) => addParamsElements(el, i))}
    </List>
  );
};

export default SetParams;
