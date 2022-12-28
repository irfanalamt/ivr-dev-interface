import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { checkValidity } from '../src/helpers';
import DrawerName from './DrawerName';
import DrawerTop from './DrawerTop';

const FunctionBlock = ({
  shape,
  handleCloseDrawer,
  stageGroup,
  clearAndDraw,
  childRef,
}) => {
  const [shapeName, setShapeName] = useState(shape.text);

  const [functionString, setFunctionString] = useState();
  const [isFunctionError, setIsFunctionError] = useState(false);
  const [errorText, setErrorText] = useState('');

  function saveUserValues() {
    shape.setText(shapeName || `runScript${shape.id}`);
    clearAndDraw();
    let isValid = isValidJs();
    if (isValid) {
      generateJS();
    }
  }

  const getCurrentUserValues = () => {
    return JSON.stringify({
      name: shapeName,
      userValues: null,
    });
  };
  childRef.getCurrentUserValues = getCurrentUserValues;

  function generateJS() {
    if (functionString.length < 2) {
      shape.setFunctionString('');
      return;
    }

    let codeString = `this.${
      shapeName || `runScript${shape.id}`
    }=async function(){${functionString}};`;

    shape.setFunctionString(codeString);
    console.log('🕺🏻runScript code:', codeString);
  }

  function handleFunctionValidation() {
    console.log('Function text', functionString);
    let isValid = isValidJs();
    if (isValid) {
      console.log('its valid! ✅');
      setIsFunctionError(false);
      return;
    }

    console.log('its NOT valid!❌');
    setIsFunctionError(true);
  }

  function isValidJs() {
    let isValid = true;
    let esprima = require('esprima');
    try {
      esprima.parseScript(functionString);
    } catch (e) {
      isValid = false;
    }
    return isValid;
  }

  return (
    <List sx={{ minWidth: 350 }}>
      <DrawerTop
        saveUserValues={saveUserValues}
        shape={shape}
        handleCloseDrawer={handleCloseDrawer}
        backgroundColor='#ffe0b2'
        blockName='Run Script'
      />

      <DrawerName
        shapeName={shapeName}
        setShapeName={setShapeName}
        stageGroup={stageGroup}
        errorText={errorText}
        setErrorText={setErrorText}
      />

      <ListItem sx={{ mt: 4 }}>
        <TextField
          sx={{
            mx: 'auto',
            backgroundColor: isFunctionError && '#ffebee',
          }}
          label={isFunctionError ? 'code invalid' : 'Function code'}
          value={functionString}
          onChange={(e) => {
            setFunctionString(e.target.value);
          }}
          placeholder='Enter JS code'
          minRows={9}
          multiline
        />
      </ListItem>
      <ListItem>
        <Button
          sx={{
            mx: 'auto',
            backgroundColor: '#dcdcdc',
            color: '#1b5e20',
            '&:hover': { backgroundColor: '#b0b0b0' },
          }}
          variant='contained'
          onClick={handleFunctionValidation}
        >
          Validate
        </Button>
      </ListItem>
    </List>
  );
};

export default FunctionBlock;
