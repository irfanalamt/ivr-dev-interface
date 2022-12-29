import {
  Alert,
  Button,
  Divider,
  List,
  ListItem,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useState } from 'react';
import DrawerTop from './DrawerTop';
import DrawerName from './DrawerName';

const CallApi = ({
  shape,
  handleCloseDrawer,
  userVariables,
  clearAndDraw,
  stageGroup,
  childRef,
}) => {
  const [shapeName, setShapeName] = useState(shape.text);
  const [inputArr, setInputArr] = useState(
    shape.userValues?.inputArr || [
      {
        value: '',
      },
    ]
  );
  const [outputArr, setOutputArr] = useState(
    shape.userValues?.outputArr || [
      {
        value: '',
      },
    ]
  );
  const [endpoint, setEndpoint] = useState(shape.userValues?.endpoint || '');
  const [errorText, setErrorText] = useState('');
  const [openToast, setOpenToast] = useState(false);
  const [successText, setSuccessText] = useState('');

  function handleInputArrChange(e, index) {
    console.log('🚀 ~ handleInputArrChange ~ e', e);
    e.preventDefault();
    console.log('🚀 ~ handleInputArrChange ~ index', index);
    setInputArr((s) => {
      const newArr = [...s];
      newArr[index].value = e.target.value;
      return newArr;
    });
  }
  function handleOutputArrChange(e, index) {
    console.log('🚀 ~ handleOutputArrChange ~ e', e);
    e.preventDefault();
    console.log('🚀 ~ handleOutputArrChange ~ index', index);
    setOutputArr((s) => {
      const newArr = [...s];
      newArr[index].value = e.target.value;
      return newArr;
    });
  }

  function saveUserValues() {
    setSuccessText('Save successful');
    setTimeout(() => setSuccessText(''), 3000);

    shape.setText(shapeName || 'callAPI');
    clearAndDraw();
    shape.setUserValues({ endpoint, inputArr, outputArr });
    console.log('🌟', { inputArr, outputArr });
    generateJS();
  }

  const getCurrentUserValues = () => {
    return JSON.stringify({
      name: shapeName,
      userValues: { endpoint, inputArr, outputArr },
    });
  };
  childRef.getCurrentUserValues = getCurrentUserValues;

  function generateJS() {
    if (!endpoint || !inputArr[0].value || !outputArr[0].value) {
      console.log('set endpoint,input & output!❌');
      shape.setFunctionString('');
      setOpenToast(true);
      return;
    }

    // genarate function only if all 3 parameters are filled

    let inputVarsString =
      '{' + inputArr.map((el) => `${el.value}:this.${el.value}`) + '}';

    let outputVarsString = outputArr
      .filter((el) => el.value)
      .map((el) => `this.${el.value}=outputVars.${el.value};`)
      .join('');

    let codeString = `this.${
      shapeName || `callAPI${shape.id}`
    }=async function(){let endpoint = '${endpoint}';let inputVars= ${inputVarsString};let outputVars = await IVR.callAPI(endpoint,inputVars);${outputVarsString}
}`;

    shape.setFunctionString(codeString);
    console.log('🕺🏻callAPI code:', codeString);
  }

  function addInput() {
    setInputArr((s) => {
      return [
        ...s,
        {
          value: '',
        },
      ];
    });
  }
  function addOutput() {
    setOutputArr((s) => {
      return [
        ...s,
        {
          value: '',
        },
      ];
    });
  }
  function removeInput() {
    setInputArr((s) => {
      const newArr = [...s];
      newArr.pop();
      return newArr;
    });
  }
  function removeOutput() {
    setOutputArr((s) => {
      const newArr = [...s];
      newArr.pop();
      return newArr;
    });
  }

  function handleApiCall() {
    const inputVarList = inputArr.map((el) => el.value);
    const outputVarList = outputArr.map((el) => el.value);

    console.log('inputVarList', inputVarList);
    console.log('outputVarList', outputVarList);
    console.log('endpoint', endpoint);
  }

  return (
    <>
      <List sx={{ minWidth: 300 }}>
        <DrawerTop
          saveUserValues={saveUserValues}
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
          backgroundColor='#bbdefb'
          blockName='Call API'
        />
        <DrawerName
          shapeName={shapeName}
          setShapeName={setShapeName}
          stageGroup={stageGroup}
          errorText={errorText}
          setErrorText={setErrorText}
          successText={successText}
        />
        <Divider sx={{ mb: 2 }} />
        <ListItem>
          <Typography sx={{ fontSize: '1.1rem' }} variant='h6'>
            REST endpoint:
          </Typography>
        </ListItem>
        <ListItem>
          <TextField
            size='small'
            placeholder='https://example.com/function'
            fullWidth
            value={endpoint}
            onChange={(e) => {
              setEndpoint(e.target.value);
            }}
          />
        </ListItem>
        <Divider sx={{ mt: 2 }} />
        <ListItem>
          <Typography sx={{ fontSize: '1rem', width: '50%' }} variant='h6'>
            Input Variables:
          </Typography>
          <Button
            sx={{
              ml: 1,
              backgroundColor: '#dcdcdc',
              '&:hover': { backgroundColor: '#b0b0b0' },
            }}
            size='small'
            variant='contained'
            onClick={addInput}
          >
            <AddRoundedIcon sx={{ color: 'green', fontSize: '1.2rem' }} />
          </Button>
          <Button
            sx={{
              ml: 1,
              backgroundColor: '#dcdcdc',
              '&:hover': { backgroundColor: '#b0b0b0' },
            }}
            size='small'
            variant='contained'
            onClick={removeInput}
          >
            <RemoveRoundedIcon sx={{ color: 'red', fontSize: '1.2rem' }} />
          </Button>
        </ListItem>
        <ListItem>
          {inputArr?.map((item, i) => {
            return (
              <Select
                sx={{ mr: 0.5 }}
                onChange={(e) => {
                  handleInputArrChange(e, i);
                }}
                value={item.value}
                key={i}
                size='small'
              >
                {userVariables?.map((el, i) => {
                  return (
                    <MenuItem key={i} value={el.name}>
                      {el.name}
                    </MenuItem>
                  );
                })}
              </Select>
            );
          })}
        </ListItem>
        <Divider sx={{ mt: 2 }} />
        <ListItem>
          <Typography sx={{ fontSize: '1rem', width: '50%' }} variant='h6'>
            Output Variables:
          </Typography>

          <Button
            sx={{
              ml: 1,
              backgroundColor: '#dcdcdc',
              '&:hover': { backgroundColor: '#b0b0b0' },
            }}
            size='small'
            variant='contained'
            onClick={addOutput}
          >
            <AddRoundedIcon sx={{ color: 'green', fontSize: '1.2rem' }} />
          </Button>
          <Button
            sx={{
              ml: 1,
              backgroundColor: '#dcdcdc',
              '&:hover': { backgroundColor: '#b0b0b0' },
            }}
            size='small'
            variant='contained'
            onClick={removeOutput}
          >
            <RemoveRoundedIcon sx={{ color: 'red', fontSize: '1.2rem' }} />
          </Button>
        </ListItem>
        <ListItem>
          {outputArr?.map((item, i) => {
            return (
              <Select
                sx={{ mr: 0.5 }}
                onChange={(e) => {
                  handleOutputArrChange(e, i);
                }}
                value={item.value}
                key={i}
                size='small'
              >
                {userVariables?.map((el, i) => {
                  return (
                    <MenuItem key={i} value={el.name}>
                      {el.name}
                    </MenuItem>
                  );
                })}
              </Select>
            );
          })}
        </ListItem>

        <ListItem>
          <Button
            onClick={handleApiCall}
            sx={{
              mx: 'auto',
              mt: 2,
              backgroundColor: '#dcdcdc',
              '&:hover': { backgroundColor: '#b0b0b0' },
            }}
            variant='contained'
            size='small'
          >
            <SendRoundedIcon sx={{ color: '#2196f3' }} />
          </Button>
        </ListItem>
      </List>
      <Snackbar
        open={openToast}
        autoHideDuration={6000}
        onClose={() => setOpenToast(false)}
      >
        <Alert
          onClose={() => setOpenToast(false)}
          severity='warning'
          sx={{ width: '100%' }}
        >
          Please set endpoint, input and output.
        </Alert>
      </Snackbar>
    </>
  );
};

export default CallApi;
