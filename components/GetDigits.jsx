import {
  Tabs,
  Button,
  List,
  ListItem,
  Tab,
  TextField,
  Typography,
  Tooltip,
  Box,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Paper,
  InputLabel,
  Divider,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import { useState } from 'react';
import {
  addInputElements,
  checkValidity,
  addParamsElements,
} from '../src/helpers';
import DrawerTop from './DrawerTop';
import DrawerName from './DrawerName';
import MessageList from './MessageList';

const GetDigits = ({
  shape,
  handleCloseDrawer,
  userVariables,
  stageGroup,
  clearAndDraw,
}) => {
  const [resultName, setResultName] = useState(
    shape.userValues?.variableName ?? ''
  );
  const [shapeName, setShapeName] = useState(shape.text);
  const [tabValue, setTabValue] = useState(0);
  const [minDigits, setMinDigits] = useState(
    shape.userValues?.params.minDigits ?? 1
  );
  const [maxDigits, setMaxDigits] = useState(
    shape.userValues?.params.maxDigits ?? 1
  );
  const [msgObj, setMsgObj] = useState(shape.userValues?.messageList || []);
  const [msgObjType, setMsgObjType] = useState('prompt');
  const [paramsObj, setParamsObj] = useState(
    shape.userValues?.params.paramsList ?? []
  );
  const [paramsObjType, setParamsObjType] = useState('');

  const paramsObjOptions = [
    'terminator',
    'maxRetries',
    'invalidAction',
    'timeoutAction',
    'invalidPrompt',
  ];

  function saveUserValues() {
    // remove null values; SAVE
    const filteredMsgObj = msgObj.filter((n) => n.value);
    const filteredParamsObj = paramsObj.filter((n) => n.value);
    const entireParamsObj = {
      minDigits,
      maxDigits,
      paramsList: filteredParamsObj,
    };

    shape.setText(shapeName);
    clearAndDraw();
    shape.setUserValues({
      params: entireParamsObj,
      messageList: filteredMsgObj,
      variableName: resultName,
    });

    if (filteredMsgObj.length > 0) generateJS(filteredMsgObj, entireParamsObj);
  }

  function generateJS(filteredMsgObj, entireParamsObj) {
    let codeString = `this.${
      shapeName || `getDigits${shape.id}`
    }= async function(){let msgList = ${JSON.stringify(
      filteredMsgObj
    )};let params = ${JSON.stringify(entireParamsObj)};this.${
      resultName || 'default'
    } = await IVR.getDigits(msgList,params); 
};`;
    shape.setFunctionString(codeString);
    console.log('🕺🏻getDigits code:', codeString);
  }

  function addParamsInput() {
    setParamsObj((s) => {
      return [...s, { type: paramsObjType, value: '' }];
    });
    setParamsObjType('');
  }
  function removeParamsInput() {
    if (paramsObj === null || paramsObj === undefined) return;
    setParamsObj((s) => {
      const newArr = [...s];
      newArr.pop();
      return newArr;
    });
  }

  return (
    <>
      <List sx={{ minWidth: 370 }}>
        <DrawerTop
          saveUserValues={saveUserValues}
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
          backgroundColor='#d1c4e9'
          blockName='Get Digits'
        />
        <DrawerName
          shapeName={shapeName}
          setShapeName={setShapeName}
          stageGroup={stageGroup}
        />
        <ListItem>
          <Typography variant='body1' sx={{ width: '40%', fontWeight: 'bold' }}>
            Result Variable:
          </Typography>

          {userVariables.length > 0 ? (
            <Select
              value={resultName}
              onChange={(e) => {
                setResultName(e.target.value);
              }}
              size='small'
            >
              {userVariables
                ?.filter((el) => el.type == 'number')
                .map((el, i) => {
                  return (
                    <MenuItem key={i} value={el.name}>
                      {el.name}
                    </MenuItem>
                  );
                })}
            </Select>
          ) : (
            <Typography sx={{ color: '#616161' }}>
              No variables added
            </Typography>
          )}
        </ListItem>
        <ListItem>
          <Tabs
            sx={{ marginX: 'auto' }}
            value={tabValue}
            onChange={(e, newVal) => {
              setTabValue(newVal);
              console.log('tabVA', tabValue, typeof tabValue);
            }}
          >
            <Tab label='Message List' />
            <Tab label='Parameters' />
          </Tabs>
        </ListItem>
        <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }} id='tabPanel1'>
          <MessageList
            messageList={msgObj}
            setMessageList={setMsgObj}
            userVariables={userVariables}
          />

          <ListItem>
            <Typography
              sx={{
                color: '#e53935',
                paddingX: 2,
                boxShadow: 2,
                visibility: 'hidden',
              }}
              id='error-box'
              variant='button'
            ></Typography>
          </ListItem>
        </Box>
        <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }} id='tabPanel2'>
          <ListItem sx={{ marginTop: 2 }}>
            <Typography sx={{ fontSize: 18, width: '30%' }} variant='h6'>
              minDigits:
            </Typography>
            <Select
              size='small'
              sx={{ marginX: 2 }}
              id='minDigits-select'
              value={minDigits}
              onChange={(e) => {
                setMinDigits(e.target.value);
              }}
            >
              {
                // Array of 1..20
                [...Array(21).keys()].slice(1).map((el, i) => {
                  return (
                    <MenuItem key={i} value={el}>
                      {el}
                    </MenuItem>
                  );
                })
              }
            </Select>
          </ListItem>
          <ListItem sx={{ marginTop: 2 }}>
            <Typography sx={{ fontSize: 18, width: '30%' }} variant='h6'>
              maxDigits:
            </Typography>
            <Select
              size='small'
              sx={{ marginX: 2 }}
              id='maxDigits-select'
              value={maxDigits}
              onChange={(e) => {
                setMaxDigits(e.target.value);
              }}
            >
              {[...Array(21).keys()].slice(1).map((el, i) => {
                return (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                );
              })}
            </Select>
          </ListItem>
          {/* <pre>{JSON.stringify(paramsObj, undefined, 2)}</pre> */}
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
          <ListItem>
            <Select
              size='small'
              sx={{ minWidth: '40%' }}
              value={paramsObjType}
              onChange={(e) => {
                setParamsObjType(e.target.value);
              }}
            >
              {
                // remove params already added
                paramsObj.length > 0
                  ? paramsObjOptions
                      .filter((el) => {
                        return !paramsObj.some((e) => e.type == el);
                      })
                      .map((el, i) => (
                        <MenuItem key={i} value={el}>
                          {el}
                        </MenuItem>
                      ))
                  : paramsObjOptions.map((el, i) => (
                      <MenuItem key={i} value={el}>
                        {el}
                      </MenuItem>
                    ))
              }
            </Select>
            <Tooltip title='Add'>
              <IconButton
                sx={{
                  ml: 2,
                }}
                size='large'
                onClick={addParamsInput}
              >
                <AddBoxRoundedIcon sx={{ '&:hover': { color: '#81c784' } }} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Remove'>
              <IconButton size='large' onClick={removeParamsInput}>
                <RemoveCircleRoundedIcon
                  sx={{ '&:hover': { color: '#e57373' } }}
                />
              </IconButton>
            </Tooltip>
          </ListItem>
          <List>
            {paramsObj?.map((el, i) =>
              addParamsElements(el.type, i, paramsObj, setParamsObj)
            )}
          </List>
        </Box>
      </List>
    </>
  );
};

export default GetDigits;
