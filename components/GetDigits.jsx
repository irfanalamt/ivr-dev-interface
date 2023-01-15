import {
  Tabs,
  List,
  ListItem,
  Tab,
  Typography,
  Tooltip,
  Box,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import { useRef, useState } from 'react';
import { addParamsElements } from '../src/helpers';
import DrawerTop from './DrawerTop';
import DrawerName from './DrawerName';
import MessageList from './MessageList';

const GetDigits = ({
  shape,
  handleCloseDrawer,
  userVariables,
  stageGroup,
  clearAndDraw,
  childRef,
}) => {
  const userValues = shape.userValues
    ? JSON.parse(JSON.stringify(shape.userValues))
    : {};
  const [resultName, setResultName] = useState(userValues.variableName ?? '');
  const [shapeName, setShapeName] = useState(shape.text);
  const [tabValue, setTabValue] = useState(0);
  const [minDigits, setMinDigits] = useState(userValues.params.minDigits ?? 1);
  const [maxDigits, setMaxDigits] = useState(userValues.params.maxDigits ?? 1);
  const [msgObj, setMsgObj] = useState(userValues.messageList || []);
  const [paramsObj, setParamsObj] = useState(
    userValues.params.paramsList ?? []
  );
  const [paramsObjType, setParamsObjType] = useState('');
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  const drawerNameRef = useRef({});

  const paramsObjOptions = [
    'terminator',
    'maxRetries',
    'invalidAction',
    'timeoutAction',
    'invalidPrompt',
    'interruptible',
  ];

  function saveUserValues() {
    // validate shapeName with validation function in child component
    const nameError = drawerNameRef.current.handleNameValidation(shapeName);
    if (nameError) {
      setErrorText(nameError);
      return;
    }

    // check for errors in msgObj
    const index = msgObj.findIndex((m) => m.isError);
    if (index !== -1) {
      setErrorText(`Error found in messageList object ${index + 1}`);
      return;
    }

    // handle save failure
    if (errorText !== '') {
      setErrorText('Save failed');
      return;
    }

    // handle save success
    setSuccessText('Save successful');
    setTimeout(() => setSuccessText(''), 3000);

    // remove null values and save
    const filteredMsgObj = msgObj.filter((n) => n.value);
    const entireParamsObj = {
      minDigits,
      maxDigits,
      paramsList: paramsObj,
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
    // create codeMessageObject
    const codeMessageObject = filteredMsgObj.map((obj) => {
      const { isError, useVariable, ...rest } = obj;
      return rest;
    });

    // create codeString
    let codeString = `this.${
      shapeName || `getDigits${shape.id}`
    }= async function(){let msgList = ${JSON.stringify(
      codeMessageObject
    )};let params = ${JSON.stringify(entireParamsObj)};this.${
      resultName || 'default'
    } = await IVR.getDigits(msgList,params);};`;
    shape.setFunctionString(codeString);
    console.log('🕺🏻getDigits code:', codeString);
  }

  function addParamsInput() {
    // handle adding a new input to paramsObj
    const value = paramsObjType === 'interruptible' ? true : '';
    setParamsObj((s) => [...s, { type: paramsObjType, value }]);
    setParamsObjType('');
  }

  function removeParamsInput() {
    // handle removing last input from paramsObj
    if (paramsObj === null || paramsObj === undefined) return;
    setParamsObj((s) => {
      const newArr = [...s];
      newArr.pop();
      return newArr;
    });
  }

  const getCurrentUserValues = () => {
    return JSON.stringify({
      name: shapeName,
      userValues: {
        params: {
          minDigits,
          maxDigits,
          paramsList: paramsObj,
        },
        messageList: msgObj,
        variableName: resultName,
      },
    });
  };
  childRef.getCurrentUserValues = getCurrentUserValues;

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
          errorText={errorText}
          setErrorText={setErrorText}
          successText={successText}
          drawerNameRef={drawerNameRef}
          shapeId={shape.id}
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
            setErrorText={setErrorText}
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
                marginTop: 2,
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
                      .filter((el) => !paramsObj.some((e) => e.type == el))
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
