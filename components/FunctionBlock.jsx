import { Button, List, ListItem, TextField } from '@mui/material';
import { useRef, useState } from 'react';

import DrawerName from './DrawerName';
import DrawerTop from './DrawerTop';

const FunctionBlock = ({
  shape,
  handleCloseDrawer,
  stageGroup,
  clearAndDraw,
  childRef,
  userVariables,
}) => {
  const [shapeName, setShapeName] = useState(shape.text);

  const [functionString, setFunctionString] = useState(
    shape.userValues?.script || ''
  );
  const [isFunctionError, setIsFunctionError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  const drawerNameRef = useRef({});

  function saveUserValues() {
    // validate current shapeName user entered with validation function in a child component
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

    shape.setText(shapeName || `runScript${shape.id}`);
    shape.setUserValues({ script: functionString });
    clearAndDraw();
    let isValid = isValidJs();
    if (isValid) {
      generateJS();
    }
  }

  const getCurrentUserValues = () => {
    return JSON.stringify({
      name: shapeName,
      userValues: { script: functionString },
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

  function validateString() {
    // First, check if the string is a valid JavaScript expression
    try {
      eval(functionString);
    } catch (error) {
      return false;
    }

    // If the string is a valid expression, check if it uses 'this.variableName'
    if (str.includes('this.')) {
      // Extract the variable name from the string
      const variableName = str.match(/this\.(.*)/)[1];

      // Check if the variable name is present in the userVariables array
      if (!userVariables.some((variable) => variable.name === variableName)) {
        return false;
      }
    }

    // If the string passes both checks, it is valid
    return true;
  }

  function handleFunctionValidation() {
    console.log('Function text', functionString);
    let isValid = validateString();
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
        successText={successText}
        drawerNameRef={drawerNameRef}
        shapeId={shape.id}
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
