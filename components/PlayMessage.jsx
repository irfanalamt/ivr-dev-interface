import {
  Box,
  List,
  ListItem,
  MenuItem,
  Select,
  Switch,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {useRef, useState} from 'react';
import DrawerName from './DrawerName';
import DrawerTop from './DrawerTop';
import MessageList from './MessageList';

const PlayMessage = ({
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
  const [shapeName, setShapeName] = useState(shape.text);
  const [tabValue, setTabValue] = useState(0);
  const [msgObj, setMsgObj] = useState(userValues.messageList || []);
  const [interruptible, setInterruptible] = useState(
    userValues.params.interruptible ?? true
  );
  const [repeatOption, setRepeatOption] = useState(
    userValues.params.repeatOption || 'X'
  );
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  const drawerNameRef = useRef({});

  function saveUserValues() {
    // validate current shapeName user entered with th validation function in a child component
    const isNameError = drawerNameRef.current.handleNameValidation(shapeName);

    if (isNameError) {
      setErrorText(isNameError);
      return;
    }

    const index = msgObj.findIndex((m) => m.isError);
    if (index !== -1) {
      setErrorText(`Error found in messageList object ${index + 1}`);
      return;
    }
    console.log('drawerRef', drawerNameRef.current.handleNameValidation);

    if (errorText !== '') {
      setErrorText('Save failed');
      return;
    }

    //save success message
    setSuccessText('Save successful');
    setTimeout(() => setSuccessText(''), 3000);
    // remove null values; SAVE
    const filteredMsgObj = msgObj.filter((n) => n.value);
    shape.setText(shapeName);
    clearAndDraw();

    shape.setUserValues({
      params: {interruptible, repeatOption},
      messageList: filteredMsgObj,
    });

    if (filteredMsgObj.length > 0) generateJS(filteredMsgObj);
  }

  function generateJS(filteredMsgObj) {
    const codeMessageObject = filteredMsgObj.map((obj) => {
      const {isError, useVariable, ...rest} = obj;
      return rest;
    });

    let codeString = `this.${
      shapeName || `playMessage${shape.id}`
    }= async function(){let msgList = ${JSON.stringify(
      codeMessageObject
    )};let params = ${JSON.stringify({
      interruptible,
      repeatOption,
    })};await IVR.playMessage(msgList,params);};`;

    shape.setFunctionString(codeString);
  }

  const getCurrentUserValues = () => {
    return JSON.stringify({
      name: shapeName,
      userValues: {
        params: {interruptible, repeatOption},
        messageList: msgObj,
      },
    });
  };
  childRef.getCurrentUserValues = getCurrentUserValues;

  return (
    <>
      <List sx={{minWidth: 350}}>
        <DrawerTop
          saveUserValues={saveUserValues}
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
          backgroundColor='#f0f4c3'
          blockName='Play Message'
        />
        <DrawerName
          drawerNameRef={drawerNameRef}
          shapeName={shapeName}
          setShapeName={setShapeName}
          stageGroup={stageGroup}
          errorText={errorText}
          setErrorText={setErrorText}
          successText={successText}
          shapeId={shape.id}
        />
        <ListItem>
          <Tabs
            sx={{marginX: 'auto'}}
            value={tabValue}
            onChange={(e, newVal) => {
              setTabValue(newVal);
            }}>
            <Tab label='Message List' />
            <Tab label='Parameters' />
          </Tabs>
        </ListItem>
      </List>
      <Box sx={{display: tabValue === 0 ? 'block' : 'none'}} id='tabPanel1'>
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
            variant='button'></Typography>
        </ListItem>
      </Box>
      <Box id='tabPanel2' sx={{display: tabValue === 1 ? 'block' : 'none'}}>
        <ListItem>
          <Typography sx={{fontSize: 18, width: '50%'}} variant='h6'>
            interruptible:
          </Typography>
          <Switch
            checked={interruptible}
            onChange={(e) => {
              setInterruptible(e.target.checked);
            }}></Switch>
        </ListItem>
        <ListItem sx={{marginTop: 3}}>
          <Typography sx={{fontSize: 18, width: '50%'}} variant='h6'>
            repeatOption:
          </Typography>
          <Select
            size='small'
            sx={{marginX: 1}}
            id='repeatOption-select'
            value={repeatOption}
            onChange={(e) => {
              setRepeatOption(e.target.value);
            }}>
            <MenuItem value='X'>X</MenuItem>
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
      </Box>
    </>
  );
};

export default PlayMessage;
