import {Button, List, ListItem, TextField} from '@mui/material';
import {useRef, useState} from 'react';

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

  function generateJS() {
    if (!functionString) {
      shape.setFunctionString('');
      return;
    }

    const newReplacedString = replaceDollarString(functionString);
    const shapeId = shape.id;
    const shapeFunctionName = shapeName || `runScript${shapeId}`;
    const codeString = `this.${shapeFunctionName} = async function(){${newReplacedString}};`;
    shape.setFunctionString(codeString);
  }

  function replaceDollarString(str) {
    return str.replace(/\$([a-zA-Z])/g, 'this.$1');
  }

  function saveUserValues() {
    const nameError = drawerNameRef.current.handleNameValidation(shapeName);
    if (nameError) {
      setErrorText(nameError);
      return;
    }

    if (errorText !== '') {
      setErrorText('Save failed');
      return;
    }

    shape.setText(shapeName || `runScript${shape.id}`);
    shape.setUserValues({script: functionString});
    clearAndDraw();

    if (validateFunctionString()) {
      generateJS();
      setSuccessText('Save successful');
      setTimeout(() => setSuccessText(''), 3000);
    } else {
      setErrorText('Invalid function');
    }
  }

  function getUserVariablesString() {
    const variables = userVariables
      .map((userVariable) => {
        if (userVariable.type == 'string' || userVariable.type == 'prompt')
          return `let $${userVariable.name} = '${userVariable.value}';`;

        return `let $${userVariable.name} = ${userVariable.value};`;
      })
      .join(' ');

    if (!variables) return '';

    return variables;
  }

  function validateFunctionString() {
    const topCode = getUserVariablesString();
    const bottomCode = functionString;

    try {
      eval(topCode + bottomCode);
    } catch (error) {
      setIsFunctionError(true);
      setErrorText(error.message);
      return false;
    }
    setIsFunctionError(false);
    setErrorText('');
    setSuccessText('script valid');
    setTimeout(() => setSuccessText(''), 3000);

    return true;
  }

  const getCurrentUserValues = () => {
    return JSON.stringify({
      name: shapeName,
      userValues: {script: functionString},
    });
  };
  childRef.getCurrentUserValues = getCurrentUserValues;

  return (
    <List sx={{minWidth: 350}}>
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

      <ListItem sx={{mt: 4}}>
        <TextField
          sx={{
            mx: 'auto',
            backgroundColor: isFunctionError
              ? '#ffebee'
              : functionString.length > 2 && '#f1f8e9',
          }}
          label={isFunctionError ? 'code invalid' : 'code valid'}
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
            '&:hover': {backgroundColor: '#b0b0b0'},
          }}
          variant='contained'
          onClick={validateFunctionString}>
          Validate
        </Button>
      </ListItem>
    </List>
  );
};

export default FunctionBlock;
