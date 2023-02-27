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
    const ivrReplacedString = replaceLogWithIvrLog(newReplacedString);
    const shapeId = shape.id;
    const shapeFunctionName = shapeName || `runScript${shapeId}`;
    const codeString = `this.${shapeFunctionName} = async function(){${ivrReplacedString}};`;
    shape.setFunctionString(codeString);
  }

  function replaceDollarString(str) {
    return str.replace(/\$([a-zA-Z])/g, 'this.$1');
  }
  function replaceLogWithIvrLog(str) {
    return str.replace(/log/g, 'IVR.log');
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

    if (validateFunctionString(functionString)) {
      generateJS();
      setSuccessText('Save successful');
      setTimeout(() => setSuccessText(''), 3000);
    } else {
      setErrorText('Invalid function');
    }
  }

  function getUserVariablesString() {
    const variables = userVariables
      .map(
        (userVariable) => `let $${userVariable.name} = '${userVariable.value}';`
      )
      .join(' ');

    if (!variables) return '';

    return variables;
  }

  function getLogCode() {
    const logValidationString = `class log{
static trace(message){}
static info(message){}
static error(message){}
    }`;

    return logValidationString;
  }

  function validateFunctionString(script) {
    const variablesCode = getUserVariablesString();
    const logCode = getLogCode();
    const bottomCode = script;

    try {
      eval(variablesCode + logCode + bottomCode);
    } catch (error) {
      setIsFunctionError(true);
      setSuccessText('');
      setErrorText(error.message);
      return false;
    }
    setIsFunctionError(false);
    setErrorText('');
    setSuccessText('script valid');

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
            mx: 2,
            backgroundColor: isFunctionError
              ? '#ffebee'
              : functionString.length > 2 && '#f1f8e9',
          }}
          label={isFunctionError ? 'code invalid' : ''}
          value={functionString}
          onChange={(e) => {
            setFunctionString(e.target.value);
            validateFunctionString(e.target.value);
          }}
          inputProps={{spellCheck: 'false'}}
          placeholder='Enter JS code'
          minRows={9}
          multiline
          fullWidth
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
          onClick={() => validateFunctionString(functionString)}>
          Validate
        </Button>
      </ListItem>
    </List>
  );
};

export default FunctionBlock;
