import {
  Box,
  List,
  ListItem,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import DrawerName from './DrawerName';
import DrawerTop from './DrawerTop';
import MessageList from './MessageList';

const PlayConfirm = ({
  shape,
  handleCloseDrawer,
  userVariables,
  stageGroup,
  clearAndDraw,
  childRef,
}) => {
  const [shapeName, setShapeName] = useState(shape.text);
  const [tabValue, setTabValue] = useState(0);
  const [msgObj, setMsgObj] = useState(shape.userValues?.messageList || []);
  const [confirmOption, setConfirmOption] = useState(
    shape.userValues?.params.confirmOption ?? ''
  );
  const [cancelOption, setCancelOption] = useState(
    shape.userValues?.params.cancelOption ?? ''
  );
  const [confirmPrompt, setConfirmPrompt] = useState(
    shape.userValues?.params.confirmPrompt ?? ''
  );
  const [cancelPrompt, setCancelPrompt] = useState(
    shape.userValues?.params.cancelPrompt ?? ''
  );
  const [errorText, setErrorText] = useState('');

  function saveUserValues() {
    const filteredMsgObj = msgObj.filter((n) => n.value);
    shape.setText(shapeName);
    clearAndDraw();
    shape.setUserValues({
      params: { confirmOption, cancelOption, confirmPrompt, cancelPrompt },
      messageList: filteredMsgObj,
    });

    if (filteredMsgObj.length > 0) generateJS(filteredMsgObj);
  }

  const getCurrentUserValues = () => {
    return JSON.stringify({
      name: shapeName,
      userValues: {
        params: { confirmOption, cancelOption, confirmPrompt, cancelPrompt },
        messageList: msgObj,
      },
    });
  };
  childRef.getCurrentUserValues = getCurrentUserValues;

  function generateJS(filteredMsgObj) {
    let codeString = `this.${
      shapeName || `playConfirm${shape.id}`
    }= async function(){let msgList = ${JSON.stringify(
      filteredMsgObj
    )};let params = ${JSON.stringify({
      confirmOption,
      cancelOption,
      confirmPrompt,
      cancelPrompt,
    })};await IVR.playConfirm(msgList,params);};`;

    shape.setFunctionString(codeString);
    console.log('🕺🏻playConfirm code:', codeString);
  }

  return (
    <>
      <List sx={{ minWidth: 350 }}>
        <DrawerTop
          saveUserValues={saveUserValues}
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
          backgroundColor='#dcedc8'
          blockName='Play Confirm'
        />
        <DrawerName
          shapeName={shapeName}
          setShapeName={setShapeName}
          stageGroup={stageGroup}
          errorText={errorText}
          setErrorText={setErrorText}
        />
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
      </List>
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
      <Box id='tabPanel2' sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
        <ListItem sx={{ marginTop: 2 }}>
          <Typography sx={{ fontSize: 18, width: '50%' }} variant='h6'>
            confirmOption:
          </Typography>
          <Select
            size='small'
            sx={{ marginX: 1 }}
            value={confirmOption}
            onChange={(e) => {
              setConfirmOption(e.target.value);
            }}
          >
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={9}>9</MenuItem>
          </Select>
        </ListItem>
        <ListItem sx={{ marginTop: 1 }}>
          <Typography sx={{ fontSize: 18, width: '50%' }} variant='h6'>
            cancelOption:
          </Typography>
          <Select
            size='small'
            sx={{ marginX: 1 }}
            value={cancelOption}
            onChange={(e) => {
              setCancelOption(e.target.value);
            }}
          >
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={9}>9</MenuItem>
          </Select>
        </ListItem>
        <ListItem sx={{ marginTop: 1 }}>
          <Typography sx={{ fontSize: 18, width: '50%' }} variant='h6'>
            confirmPrompt:
          </Typography>
          <TextField
            size='small'
            value={confirmPrompt}
            onChange={(e) => {
              setConfirmPrompt(e.target.value);
            }}
          />
        </ListItem>
        <ListItem sx={{ marginTop: 1 }}>
          <Typography sx={{ fontSize: 18, width: '50%' }} variant='h6'>
            cancelPrompt:
          </Typography>
          <TextField
            size='small'
            value={cancelPrompt}
            onChange={(e) => {
              setCancelPrompt(e.target.value);
            }}
          />
        </ListItem>
      </Box>
    </>
  );
};

export default PlayConfirm;
