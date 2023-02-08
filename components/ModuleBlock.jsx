import {CleaningServices} from '@mui/icons-material';
import {
  Box,
  Divider,
  List,
  ListItem,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import DrawerName from './DrawerName';
import DrawerTop from './DrawerTop';
import MessageList from './MessageList';

const ModuleBlock = ({shape, handleCloseDrawer, userVariables}) => {
  const [inputVars, setInputVars] = useState(
    shape.userValues.inputVars || null
  );
  const [outputVars, setOutputVars] = useState(
    shape.userValues.outputVars || null
  );

  useEffect(() => {
    if (!inputVars || !outputVars) fillInputAndOutputVariables();
  }, []);

  function fillInputAndOutputVariables() {
    const moduleUserVariables = JSON.parse(shape.userValues.data).userVariables;

    const input = moduleUserVariables.filter((v) => v.isInput);
    setInputVars(input);

    const output = moduleUserVariables.filter((v) => v.isOutput);
    setOutputVars(output);
  }

  function saveUserValues() {
    shape.setUserValues({...shape.userValues, inputVars, outputVars});

    console.log('inputVars', inputVars);
    console.log('outputVars', outputVars);
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
