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
import DrawerTop from './DrawerTop';

const FunctionBlock = ({
  shape,
  handleCloseDrawer,
  stageGroup,
  clearAndDraw,
}) => {
  const [shapeName, setShapeName] = useState(shape.text);

  const [functionString, setFunctionString] = useState('');
  const [isFunctionError, setIsFunctionError] = useState(false);
  const [errorObj, setErrorObj] = useState({});

  function saveUserValues() {
    shape.setText(shapeName || `runScript${shape.id}`);
    clearAndDraw();
    let isValid = isValidJs();
    if (isValid) {
      generateJS();
    }
  }

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

  function handleValidation(e, name, type) {
    let errorMessage = checkValidity(type, e);
    if (errorMessage !== -1) {
      e.target.style.backgroundColor = '#ffebee';
      setErrorObj((s) => {
        return { ...s, [name]: errorMessage };
      });
      return;
    }

    if (
      stageGroup.getShapesAsArray().some((el) => el.text === e.target.value)
    ) {
      e.target.style.backgroundColor = '#ffebee';
      setErrorObj((s) => {
        return { ...s, [name]: 'name NOT unique' };
      });
      return;
    }
    // no error condition
    setErrorObj((s) => {
      const newObj = { ...s };
      delete newObj[name];
      return newObj;
    });
    e.target.style.backgroundColor = '#f1f8e9';
  }

  return (
    <List sx={{ minWidth: 350 }}>
      <DrawerTop
        saveUserValues={saveUserValues}
        shape={shape}
        handleCloseDrawer={handleCloseDrawer}
        backgroundColor='#ff5722'
        blockName='Run Script'
      />

      <ListItem sx={{ my: 4 }}>
        <Typography
          sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
          variant='body1'
        >
          Name
        </Typography>
        <TextField
          sx={{ ml: 2, width: 180 }}
          size='small'
          value={shapeName}
          onChange={(e) => {
            setShapeName(e.target.value);
          }}
        />
      </ListItem>

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
