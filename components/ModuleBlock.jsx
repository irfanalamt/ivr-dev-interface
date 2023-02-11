import {CleaningServices} from '@mui/icons-material';
import {
  Divider,
  List,
  ListItem,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import {useEffect, useState} from 'react';
import DrawerTop from './DrawerTop';

const ModuleBlock = ({shape, handleCloseDrawer, userVariables}) => {
  const [allVars, setAllVars] = useState(shape.userValues.allVars || null);

  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  useEffect(() => {
    if (!allVars) fillAllVariables();
  }, []);

  function fillAllVariables() {
    const allV = JSON.parse(shape.userValues.data).userVariables.filter(
      (v) => v.isInput || v.isOutput
    );
    setAllVars(allV);
  }

  function saveUserValues() {
    const varsNotMapped = allVars.some(
      (obj) => !obj.hasOwnProperty('currentName')
    );
    if (varsNotMapped) {
      setErrorText('all variables not mapped');
      return;
    }

    setErrorText('');

    const codeString = generateJS();
    shape.setFunctionString(codeString);

    shape.setUserValues({...shape.userValues, allVars});
    setSuccessText('Save successful');
  }

  function generateJS() {
    const inputVarsString = allVars
      .filter((obj) => obj.isInput)
      .map((obj) => `${obj.name}:this.${obj.currentName}`)
      .join(', ');
    const outputVarsString = allVars
      .filter((obj) => obj.isOutput)
      .map((obj) => `this.${obj.currentName}=outputVars.${obj.name}`)
      .join(';');

    const codeString = `this.${shape.text}=async function(){
      let inputVars = {${inputVarsString}};
      let outputVars = await IVR.runModule('${shape.text}', inputVars);
      ${outputVarsString}
    };`;

    console.log(codeString);
    return codeString;
  }

  function handleAllVarsChange(e, index) {
    const {value} = e.target;

    setAllVars((v) => {
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
      </Typography>
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
      <Divider sx={{mb: 2}} />

      <List>
        <ListItem>
          <Typography sx={{boxShadow: 1, px: 1, mb: 2}} variant='subtitle2'>
            Module variables
          </Typography>
        </ListItem>

        {allVars?.map((v, i) => (
          <ListItem key={i}>
            <Tooltip
              title={
                `${v.isInput ? 'input ' : ''}` +
                `${v.isOutput ? 'output ' : ''}` +
                v.type
              }
              placement='top'
              arrow>
              <Typography
                sx={{minWidth: '25%', fontWeight: 'bold'}}
                variant='body2'>
                {v.name}:
              </Typography>
            </Tooltip>
            <Select
              onChange={(e) => {
                handleAllVarsChange(e, i);
              }}
              value={v.currentName ?? ''}
              sx={{ml: 2, minWidth: 80}}
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
