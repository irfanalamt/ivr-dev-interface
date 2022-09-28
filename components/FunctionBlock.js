import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Button,
  List,
  ListItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { checkValidity } from '../src/helpers';

const FunctionBlock = ({ shape, handleCloseDrawer, stageGroup }) => {
  const [shapeName, setShapeName] = useState(shape.text);
  const [nextItem, setNextItem] = useState(shape.nextItem || '');
  const [functionString, setFunctionString] = useState('');
  const [isFunctionError, setIsFunctionError] = useState(false);
  const [errorObj, setErrorObj] = useState({});

  function saveUserValues() {
    shape.setText(shapeName);
    shape.setNextItem(nextItem);
    console.log('shape after save', shape);
    console.log('shapeGroup ', stageGroup);
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

    if (stageGroup.getShapes().some((el) => el.text === e.target.value)) {
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
    <>
      <List>
        <ListItem>
          <Tooltip title='CLOSE'>
            <Button
              size='small'
              variant='contained'
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
              variant='contained'
              color='success'
              onClick={saveUserValues}
            >
              <SaveRoundedIcon sx={{ fontSize: 20 }} />
            </Button>
          </Tooltip>
        </ListItem>
        <ListItem>
          <Typography
            sx={{
              marginX: 'auto',
              marginY: 1,
              boxShadow: 1,
              paddingX: 3,
              paddingY: 1,
              backgroundColor: '#ff5722',
              borderRadius: 1,
            }}
            variant='h6'
          >
            Function
          </Typography>
        </ListItem>
        <ListItem sx={{ my: 2 }}>
          <Typography
            variant='button'
            sx={{ marginX: 1, fontSize: 16, width: '35%' }}
          >
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
            variant='outlined'
            color='success'
            onClick={handleFunctionValidation}
          >
            Validate
          </Button>
        </ListItem>
      </List>
    </>
  );
};

export default FunctionBlock;
