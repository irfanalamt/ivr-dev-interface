import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Button,
  Chip,
  List,
  ListItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { checkValidity } from '../src/helpers';

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
    <List>
      <ListItem>
        <Tooltip title='CLOSE'>
          <Button
            size='small'
            variant='outlined'
            color='error'
            sx={{ height: 30 }}
            onClick={() => {
              shape.setSelected(false);
              handleCloseDrawer();
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 21 }} />
          </Button>
        </Tooltip>
        <Tooltip title='SAVE'>
          <Button
            sx={{ height: 30, marginLeft: 1, marginRight: 'auto' }}
            size='small'
            variant='outlined'
            color='success'
            onClick={saveUserValues}
          >
            <SaveRoundedIcon sx={{ fontSize: 20 }} />
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem>
        <Chip
          sx={{ backgroundColor: '#ff5722', mx: 'auto', px: 2, py: 3 }}
          label={<Typography variant='h6'>RunScript</Typography>}
        />
      </ListItem>
      <ListItem sx={{ my: 2 }}>
        <Typography variant='button' sx={{ fontSize: 16, width: '35%' }}>
          Name:
        </Typography>
        <TextField
          value={shapeName || ''}
          onChange={(e) => {
            setShapeName(e.target.value);
            handleValidation(e, 'menuId', 'object');
          }}
          sx={{
            mx: 0.5,
          }}
          helperText={errorObj.menuId}
          error={errorObj.menuId}
          size='small'
        />
      </ListItem>

      <ListItem>
        <TextField
          sx={{
            mx: 'auto',
            mt: 2,
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
          sx={{ mx: 'auto' }}
          variant='contained'
          color='success'
          onClick={handleFunctionValidation}
        >
          Validate
        </Button>
      </ListItem>
    </List>
  );
};

export default FunctionBlock;
