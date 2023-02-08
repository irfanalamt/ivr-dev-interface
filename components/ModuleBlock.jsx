import {
  Divider,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import {useEffect, useState} from 'react';
import DrawerTop from './DrawerTop';

const ModuleBlock = ({shape, handleCloseDrawer, userVariables}) => {
  const [inputVars, setInputVars] = useState(
    shape.userValues.inputVars || null
  );
  const [outputVars, setOutputVars] = useState(
    shape.userValues.outputVars || null
  );
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  useEffect(() => {
    if (!inputVars || !outputVars) fillInputAndOutputVariables();
  }, []);

  function fillInputAndOutputVariables() {
    const input = JSON.parse(shape.userValues.data).userVariables.filter(
      (v) => v.isInput
    );
    setInputVars(input);

    const output = JSON.parse(shape.userValues.data).userVariables.filter(
      (v) => v.isOutput
    );
    setOutputVars(output);
  }

  function saveUserValues() {
    const inputNotMapped = inputVars.some(
      (obj) => !obj.hasOwnProperty('currentName')
    );
    if (inputNotMapped) {
      setErrorText('all inputs not mapped');
      return;
    }

    const outputNotMapped = outputVars.some(
      (obj) => !obj.hasOwnProperty('currentName')
    );
    if (outputNotMapped) {
      setErrorText('all outputs not mapped');
      return;
    }

    setErrorText('');

    const codeString = generateJS();
    shape.setFunctionString(codeString);
    shape.setUserValues({...shape.userValues, inputVars, outputVars});
    setSuccessText('Save successful');
  }

  function generateJS() {
    const inputVarsString = inputVars
      .map((obj) => `${obj.name}:this.${obj.currentName}`)
      .join(', ');

    const codeString = `this.${shape.text}=async function(){
      let inputVars = {${inputVarsString}};
      let outputVars = await IVR.runModule('${shape.text}', inputVars);
    };`;

    console.log(codeString);
    return codeString;
  }

  function handleOutputVarsChange(e, index) {
    const {value} = e.target;

    setOutputVars((v) => {
      const temp = [...v];
      temp[index].currentName = value;
      return temp;
    });
  }

  function handleInputVarsChange(e, index) {
    const {value} = e.target;

    setInputVars((v) => {
      const temp = [...v];
      temp[index].currentName = value;
      return temp;
    });
  }

  return (
    <List sx={{minWidth: 350}}>
      <DrawerTop
        saveUserValues={saveUserValues}
        shape={shape}
        handleCloseDrawer={handleCloseDrawer}
        backgroundColor='#f5cbab'
        blockName='Module'
      />
      <Typography
        sx={{
          backgroundColor: ' #FFE4E1',
          color: '#FF0000',
          width: 'max-content',
          position: 'absolute',
          px: 1,
          left: 0,
          right: 0,
          mx: 'auto',
          fontSize: '0.75rem',
        }}
        variant='subtitle1'>
        {errorText}
      </Typography>{' '}
      <Typography
        sx={{
          backgroundColor: '#7eca8f',
          color: '#ffffff',
          width: 'max-content',
          position: 'absolute',
          px: 1,
          left: 0,
          right: 0,
          mx: 'auto',
          fontSize: '0.75rem',
        }}
        variant='subtitle1'>
        {successText}
      </Typography>
      <ListItem sx={{my: 2}}>
        <Typography sx={{mr: 1, fontSize: '1rem'}} variant='h6'>
          Name:
        </Typography>
        <Typography>{shape.text}</Typography>
      </ListItem>
      <Divider />
      <ListItem>
        <Typography sx={{mt: 1, fontSize: '1rem'}} variant='h6'>
          Input Variables
        </Typography>
      </ListItem>
      <List>
        {inputVars?.map((v, i) => (
          <ListItem key={i}>
            <Typography variant='body2'>{v.name}:</Typography>
            <Select
              onChange={(e) => {
                handleInputVarsChange(e, i);
              }}
              value={v.currentName ?? ''}
              sx={{ml: 2}}
              size='small'>
              {userVariables.map((v, i) => (
                <MenuItem value={v.name} key={i}>
                  {v.name}
                </MenuItem>
              ))}
            </Select>
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem>
        <Typography sx={{mt: 1, fontSize: '1rem'}} variant='h6'>
          Output Variables
        </Typography>
      </ListItem>
      <List>
        {outputVars?.map((v, i) => (
          <ListItem key={i}>
            <Typography variant='body2'>{v.name}:</Typography>
            <Select
              onChange={(e) => {
                handleOutputVarsChange(e, i);
              }}
              value={v.currentName ?? ''}
              sx={{ml: 2}}
              size='small'>
              {userVariables.map((v, i) => (
                <MenuItem value={v.name} key={i}>
                  {v.name}
                </MenuItem>
              ))}
            </Select>
          </ListItem>
        ))}
      </List>
    </List>
  );
};

export default ModuleBlock;
