import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
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
import {useRef, useState} from 'react';
import DrawerName from './DrawerName';
import DrawerTop from './DrawerTop';

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

  const drawerNameRef = useRef({});

  function handleInputArrChange(e, index) {
    e.preventDefault();

    setInputArr((s) => {
      const newArr = [...s];
      newArr[index].value = e.target.value;
      return newArr;
    });
  }
  function handleOutputArrChange(e, index) {
    e.preventDefault();

    setOutputArr((s) => {
      const newArr = [...s];
      newArr[index].value = e.target.value;
      return newArr;
    });
  }

  function saveUserValues() {
    // validate current shapeName user entered with th validation function in a child component
    const isNameError = drawerNameRef.current.handleNameValidation(shapeName);

    if (isNameError) {
      setErrorText(isNameError);
      return;
    }

    if (errorText !== '') {
      setErrorText('Save failed');
      return;
    }

    setSuccessText('Save successful');
    setTimeout(() => setSuccessText(''), 3000);

    shape.setText(shapeName || 'callAPI');
    clearAndDraw();
    shape.setUserValues({endpoint, inputArr, outputArr});
    console.log('🌟', {inputArr, outputArr});
    generateJS();
  }

  const getCurrentUserValues = () => {
    return JSON.stringify({
      name: shapeName,
      userValues: {endpoint, inputArr, outputArr},
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
    const inputVars = inputArr.filter((el) => el.value);
    const outputVars = outputArr.filter((el) => el.value);

    const inputVarsString = `{${inputVars
      .map((el) => `${el.value}:this.${el.value}`)
      .join(',')}}`;
    const outputVarsString = outputVars
      .map((el) => `this.${el.value}=outputVars.${el.value};`)
      .join('');

    let endpointString = endpoint;
    if (endpoint.indexOf('$') !== -1) {
      const index = endpoint.indexOf('/');
      let result;
      if (index === -1) {
        // '/' not found, return the entire str
        result = endpoint;
        endpointString = `this.${result.substring(1)}`;
      } else {
        // '/' found, return the characters before it
        result = endpoint.substring(0, index);
        let rest = endpoint.substring(index);
        endpointString = `this.${result.substring(1)}` + '+' + `'${rest}'`;
      }
    }

    const shapeNameToUse = shapeName || `callAPI${shape.id}`;
    const codeString = `this.${shapeNameToUse}=async function(){let endpoint = ${endpointString};let inputVars= ${inputVarsString};let outputVars = await IVR.callAPI(endpoint,inputVars);${outputVarsString}};`;

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

  function validateEndpoint(str) {
    if (str.indexOf('$') === -1 || str.length < 2) {
      setErrorText('');
      return;
    }

    const index = str.indexOf('/');
    let result;

    if (index === -1) {
      // '/' not found, return the entire string
      result = str;
    } else {
      // '/' found, return the characters before it
      result = str.substring(0, index);
    }

    const modifiedVariables = userVariables.map(
      (variable) => '$' + variable.name
    );

    if (modifiedVariables.includes(result)) {
      setErrorText('');
    } else {
      setErrorText(`${result} not declared`);
    }
  }

  return (
    <>
      <List sx={{minWidth: 300}}>
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
          drawerNameRef={drawerNameRef}
          shapeId={shape.id}
        />
        <Divider sx={{mb: 2}} />
        <ListItem>
          <Typography sx={{fontSize: '1.1rem'}} variant='h6'>
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
              validateEndpoint(e.target.value);
            }}
          />
        </ListItem>
        <Divider sx={{mt: 2}} />
        <ListItem>
          <Typography sx={{fontSize: '1rem', width: '50%'}} variant='h6'>
            Input Variables:
          </Typography>
          <Button
            sx={{
              ml: 1,
              backgroundColor: '#dcdcdc',
              '&:hover': {backgroundColor: '#b0b0b0'},
            }}
            size='small'
            variant='contained'
            onClick={addInput}>
            <AddRoundedIcon sx={{color: 'green', fontSize: '1.2rem'}} />
          </Button>
          <Button
            sx={{
              ml: 1,
              backgroundColor: '#dcdcdc',
              '&:hover': {backgroundColor: '#b0b0b0'},
            }}
            size='small'
            variant='contained'
            onClick={removeInput}>
            <RemoveRoundedIcon sx={{color: 'red', fontSize: '1.2rem'}} />
          </Button>
        </ListItem>
        <ListItem>
          {inputArr?.map((item, i) => {
            return (
              <Select
                sx={{mr: 0.5}}
                onChange={(e) => {
                  handleInputArrChange(e, i);
                }}
                value={item.value}
                key={i}
                size='small'>
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
        <Divider sx={{mt: 2}} />
        <ListItem>
          <Typography sx={{fontSize: '1rem', width: '50%'}} variant='h6'>
            Output Variables:
          </Typography>

          <Button
            sx={{
              ml: 1,
              backgroundColor: '#dcdcdc',
              '&:hover': {backgroundColor: '#b0b0b0'},
            }}
            size='small'
            variant='contained'
            onClick={addOutput}>
            <AddRoundedIcon sx={{color: 'green', fontSize: '1.2rem'}} />
          </Button>
          <Button
            sx={{
              ml: 1,
              backgroundColor: '#dcdcdc',
              '&:hover': {backgroundColor: '#b0b0b0'},
            }}
            size='small'
            variant='contained'
            onClick={removeOutput}>
            <RemoveRoundedIcon sx={{color: 'red', fontSize: '1.2rem'}} />
          </Button>
        </ListItem>
        <ListItem>
          {outputArr?.map((item, i) => {
            return (
              <Select
                sx={{mr: 0.5}}
                onChange={(e) => {
                  handleOutputArrChange(e, i);
                }}
                value={item.value}
                key={i}
                size='small'>
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
      </List>
      <Snackbar
        open={openToast}
        autoHideDuration={6000}
        onClose={() => setOpenToast(false)}>
        <Alert
          onClose={() => setOpenToast(false)}
          severity='warning'
          sx={{width: '100%'}}>
          Please set endpoint, input and output.
        </Alert>
      </Snackbar>
    </>
  );
};

export default CallApi;
