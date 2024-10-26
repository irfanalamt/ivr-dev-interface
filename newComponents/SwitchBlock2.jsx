import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {useEffect, useMemo, useRef, useState} from 'react';
import {checkValidity} from '../src/helpers';
import {isNameUnique} from '../src/myFunctions';
import SaveChangesDialog from './SaveChangesDialog';
import ExpressionTextField from './ExpressionTextField';

const SwitchBlock = ({
  shape,
  handleCloseDrawer,
  shapes,
  clearAndDraw,
  userVariables,
  openVariableManager,
  openUserGuide,
}) => {
  const [name, setName] = useState(shape.text);
  const [successText, setSuccessText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [actions, setActions] = useState(
    shape.userValues?.actions ?? [{condition: '', action: ''}]
  );
  const [defaultAction, setDefaultAction] = useState(
    shape.userValues?.defaultAction ?? 'default'
  );
  const [showDialog, setShowDialog] = useState(false);

  const errors = useRef({});

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSuccessText('');
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [successText]);

  const allVariableNames = useMemo(() => {
    return userVariables.map((variable) => `$${variable.name}`);
  }, [userVariables]);

  function handleNameChange(e) {
    const {value} = e.target;

    setName(value);

    const isValidFormat = checkValidity('object', value);
    if (isValidFormat !== -1) {
      setErrorText(isValidFormat);
      errors.current.name = true;
      return;
    }

    const isUnique = isNameUnique(value, shape, shapes, userVariables);
    if (!isUnique) {
      setErrorText('Id not unique.');
      errors.current.name = true;
    } else {
      setErrorText('');
      errors.current.name = undefined;
    }
  }

  function handleSave() {
    if (errors.current.name) {
      setErrorText('Id not valid.');
      return;
    }

    shape.setText(name);
    clearAndDraw();

    const hasValidationErrors = actions.some(
      (a) => a.conditionError || a.actionError
    );

    if (hasValidationErrors) {
      setErrorText('Save failed. Validation error.');
      setSuccessText('');
    } else {
      const validActions = actions.filter((a) => a.condition && a.action);
      shape.setUserValues({
        ...shape.userValues,
        actions: validActions,
        defaultAction,
      });
      setSuccessText('Saved.');
      setErrorText('');
      if (validActions.length > 0) {
        shape.isComplete = true;
      } else {
        shape.isComplete = false;
      }
    }
  }
  function handleSaveAndClose() {
    const defaultShape = {
      actions: actions.map(({nextItem, ...rest}) => rest),
      defaultAction,
    };

    if (!shape.userValues) {
      const expectedString = JSON.stringify(defaultShape);

      if (expectedString.length === 68) {
        handleCloseDrawer();
      } else {
        setShowDialog(true);
      }
      return;
    }

    const userShape = {
      actions: shape.userValues.actions.map(({nextItem, ...rest}) => rest),
      defaultAction: shape.userValues.defaultAction,
    };

    if (JSON.stringify(userShape) === JSON.stringify(defaultShape)) {
      handleSave();
      handleCloseDrawer();
    } else {
      setShowDialog(true);
    }
  }

  function handleAddAction() {
    const updatedActions = [...actions];

    updatedActions.push({
      condition: '',
      action: '',
    });

    setActions(updatedActions);
  }

  function handleActionFieldChange(name, value, index) {
    const updatedActions = [...actions];
    updatedActions[index][name] = value;
    setActions(updatedActions);
  }

  function handleDeleteAction(index) {
    const updatedActions = [...actions];
    updatedActions.splice(index, 1);
    setActions(updatedActions);
  }

  function setConditionError(message, index) {
    const updatedActions = [...actions];
    updatedActions[index].conditionError = message;
    setActions(updatedActions);
  }
  function clearConditionError(index) {
    const updatedActions = [...actions];
    updatedActions[index].conditionError = undefined;
    setActions(updatedActions);
  }
  function setActionError(message, index) {
    const updatedActions = [...actions];
    updatedActions[index].actionError = message;
    setActions(updatedActions);
  }
  function clearActionError(index) {
    const updatedActions = [...actions];
    updatedActions[index].actionError = undefined;
    setActions(updatedActions);
  }
  function getUserVariablesString() {
    const variables = userVariables
      .map((userVariable) => {
        if (userVariable.type === 'json')
          return `let $${userVariable.name} = ${userVariable.defaultValue};`;
        else
          return `let $${userVariable.name} = '${userVariable.defaultValue}';`;
      })
      .join(' ');

    if (!variables) return '';

    return variables;
  }

  function validateCondition(value, index) {
    if (value.length === 0) {
      clearConditionError(index);
      return;
    }
    if (value.length < 2) return;

    const topCode = getUserVariablesString();
    const bottomCode = `if(${value}){};`;

    try {
      eval('"use strict";\n' + topCode + bottomCode);

      clearConditionError(index);
    } catch (error) {
      setConditionError(error.message, index);
    }
  }

  function validateAction(value, index) {
    const duplicateIndex = actions.findIndex(
      (action, i) => action.action === value && i !== index
    );
    if (duplicateIndex >= 0 || value == defaultAction) {
      setActionError('action not unique', index);
    } else {
      clearActionError(index);
    }
  }

  return (
    <>
      <ListItem
        sx={{
          backgroundColor: '#cfd8dc',
          display: 'flex',
          boxShadow: 2,
          p: 1,
        }}>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 'extra-large',
            height: 40,
          }}
          variant='h5'>
          {
            <img
              src='/icons/switchBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp;Switch
        </Typography>
        <IconButton
          size='small'
          onClick={openVariableManager}
          sx={{
            ml: 'auto',
            backgroundColor: '#263238',
            color: 'white',
            '&:hover': {backgroundColor: '#26a69a'},
            height: 30,
            width: 30,
          }}>
          <img
            src='/icons/variableManagerWhite.png'
            alt='Icon'
            height={'16px'}
            width={'16px'}
          />
        </IconButton>

        <IconButton
          onClick={openUserGuide}
          size='small'
          sx={{
            ml: 1,
            backgroundColor: '#263238',
            color: 'white',
            '&:hover': {backgroundColor: '#29b6f6'},
            height: 30,
            width: 30,
          }}>
          <QuestionMarkIcon sx={{fontSize: '20px'}} />
        </IconButton>
        <IconButton
          onClick={handleSaveAndClose}
          size='small'
          sx={{
            ml: 1,
            backgroundColor: '#263238',
            color: 'white',
            '&:hover': {backgroundColor: '#ef5350'},
            height: 30,
            width: 30,
          }}>
          <CloseIcon sx={{fontSize: '22px'}} />
        </IconButton>
      </ListItem>
      <Box sx={{backgroundColor: '#eeeeee', height: '100%'}}>
        <Stack>
          <Typography sx={{ml: 2, mt: 1}} fontSize='large' variant='subtitle2'>
            ID
          </Typography>
          <ListItem sx={{mt: -1}}>
            <TextField
              onChange={handleNameChange}
              value={name}
              sx={{minWidth: '220px', backgroundColor: '#f5f5f5'}}
              size='small'
              error={errors.current.name}
            />
            <Button
              onClick={handleSave}
              sx={{ml: 2}}
              size='small'
              variant='contained'>
              <SaveIcon />
            </Button>
          </ListItem>

          <ListItem sx={{height: 30}}>
            {successText && (
              <Typography sx={{mt: -1, color: 'green', mx: 'auto'}}>
                {successText}
              </Typography>
            )}
            {!successText && (
              <Typography sx={{mt: -1, color: 'red', mx: 'auto'}}>
                {errorText}
              </Typography>
            )}
          </ListItem>
        </Stack>
        <Divider />
        <Stack sx={{px: 2, py: 1, mb: 2}}>
          <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
            Default Action
          </Typography>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <TextField
              sx={{backgroundColor: '#f5f5f5', width: 200}}
              inputProps={{
                style: {fontFamily: 'Courier New'},
              }}
              value={defaultAction}
              onChange={(e) => setDefaultAction(e.target.value)}
              size='small'
            />
          </Box>
        </Stack>
        <Divider />
        <List sx={{backgroundColor: '#eeeeee'}}>
          {actions.map((row, i) => (
            <Stack sx={{px: 2, py: 1}} key={i}>
              <Stack>
                <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
                  Condition
                </Typography>
                <ExpressionTextField
                  inputValue={row}
                  setInputValue={(value) => {
                    handleActionFieldChange('condition', value, i);
                    validateCondition(value, i);
                  }}
                  variableNames={allVariableNames}
                />
                <Typography sx={{color: 'red', mx: 'auto'}}>
                  {row.conditionError}&nbsp;
                </Typography>
              </Stack>
              <Stack>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <TextField
                    sx={{
                      mr: i == 0 && '35px',
                      backgroundColor: '#f5f5f5',
                      width: 200,
                    }}
                    inputProps={{
                      style: {fontFamily: 'Courier New'},
                    }}
                    placeholder='action'
                    size='small'
                    value={row.action}
                    error={Boolean(row.actionError)}
                    onChange={(e) => {
                      handleActionFieldChange('action', e.target.value, i);
                      validateAction(e.target.value, i);
                    }}
                  />
                  {i > 0 && (
                    <IconButton
                      color='error'
                      size='small'
                      onClick={() => handleDeleteAction(i)}
                      sx={{
                        ml: 'auto',
                        mr: 1,
                        backgroundColor: '#cfcfcf',
                        '&:hover': {backgroundColor: '#c7c1bd'},
                        height: 30,
                        width: 30,
                      }}>
                      <DeleteIcon sx={{color: '#424242'}} />
                    </IconButton>
                  )}
                </Box>
                <Typography sx={{color: 'red', mx: 'auto'}}>
                  {row.actionError}&nbsp;
                </Typography>
              </Stack>
              <Divider sx={{mt: 1}} />
            </Stack>
          ))}
          <ListItem>
            <Button
              sx={{
                backgroundColor: '#bdbdbd',
                color: 'black',
                '&:hover': {backgroundColor: '#9ccc65'},
                ml: 'auto',
                mr: 1,
              }}
              onClick={handleAddAction}
              variant='contained'>
              Add
            </Button>
          </ListItem>
        </List>
      </Box>
      <SaveChangesDialog
        open={showDialog}
        handleSave={handleSave}
        handleClose={() => {
          setShowDialog(false);
          handleCloseDrawer();
        }}
      />
    </>
  );
};

export default SwitchBlock;
