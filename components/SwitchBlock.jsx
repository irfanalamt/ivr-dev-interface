import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {useState} from 'react';
import DrawerTop from './DrawerTop';
import DrawerName from './DrawerName';

const SwitchBlock = ({
  shape,
  handleCloseDrawer,
  userVariables,
  stageGroup,
  clearAndDraw,
  childRef,
}) => {
  const [shapeName, setShapeName] = useState(shape.text);
  const [userValues, setUserValues] = useState(
    shape.userValues?.switchArray.length > 0
      ? shape.userValues?.switchArray
      : [{condition: '', exitPoint: '', conditionError: '', exitError: ''}]
  );
  const [defaultExitPoint, setDefaultExitPoint] = useState(
    shape.userValues?.default.exitPoint ?? 'default'
  );
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  function saveUserValues() {
    if (errorText !== '') {
      setErrorText('cannot save. error found');
      return;
    }
    for (let i = 0; i < userValues.length; i++) {
      if (userValues[i].exitError || userValues[i].conditionError) {
        setErrorText(`Error found in row ${i + 1}`);
        return;
      }
    }

    setSuccessText('Save successful');
    setTimeout(() => setSuccessText(''), 3000);

    shape.setText(shapeName);
    clearAndDraw();

    shape.setUserValues({
      switchArray: getFilteredUserValues(),
      default: {...shape.userValues?.default, exitPoint: defaultExitPoint},
    });
  }

  function replaceDollarString(str) {
    return str.replace(/\$([a-zA-Z])/g, 'this.$1');
  }

  function getFilteredUserValues() {
    const filteredUserValues = userValues
      .filter(
        (row) =>
          !(
            row.condition === '' ||
            row.exitPoint === '' ||
            row.conditionError ||
            row.exitError
          )
      )
      .map((row) => ({
        condition: replaceDollarString(row.condition),
        exitPoint: row.exitPoint,
        nextId: row.nextId,
      }));

    return filteredUserValues;
  }

  const getCurrentUserValues = () => {
    return JSON.stringify({
      name: shapeName,
      userValues: {
        switchArray: getFilteredUserValues(),
        default: {...shape.userValues?.default, exitPoint: defaultExitPoint},
      },
    });
  };
  childRef.getCurrentUserValues = getCurrentUserValues;

  function handleChangeUserValues(e, index) {
    const {name, value} = e.target;

    setUserValues((prev) => {
      const newArr = [...prev];
      newArr[index][name] = value;
      return newArr;
    });
  }

  function handleAddCondition() {
    setUserValues((prev) => [...prev, {condition: '', exitPoint: ''}]);
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

  function validateCondition(value, index) {
    if (value.length === 0) {
      clearConditionError(index);
      return;
    }

    if (value.length < 2) return;

    const topCode = getUserVariablesString();
    const bottomCode = `let x = ${value};`;

    console.log('code:', topCode + bottomCode);

    try {
      eval(topCode + bottomCode);
      console.log('✨', topCode + bottomCode);
      clearConditionError(index);
    } catch (error) {
      setErrorText(error.message);
      setConditionError(index);
    }
  }

  function setConditionError(index) {
    setUserValues((prev) => {
      const newArr = [...prev];
      newArr[index].conditionError = 'invalid condition';
      return newArr;
    });
  }

  function clearConditionError(index) {
    setErrorText('');
    setUserValues((prev) => {
      const newArr = [...prev];
      newArr[index].conditionError = '';
      return newArr;
    });
  }

  function validateInput(e, index) {
    const {name, value} = e.target;

    if (name === 'condition') {
      validateCondition(value, index);
    } else if (name === 'exitPoint') {
      validateExitPoint(value, index);
    }
  }

  function validateExitPoint(value, index) {
    const regExp = /^[a-z0-9]+$/i;
    const isAlNum = regExp.test(value);
    const currentExitPoints = userValues.map((el) => el.exitPoint);
    currentExitPoints.splice(index, 1);

    if (currentExitPoints.includes(value)) {
      setExitPointError('duplicate exitPoint', index);
      return;
    }

    if (!isAlNum) {
      setExitPointError('invalid exitPoint character', index);
      return;
    }

    clearExitPointError(index);
  }

  function setExitPointError(message, index) {
    console.log(`Error: ${message}`);
    setUserValues((prev) => {
      const newArr = [...prev];
      newArr[index].exitError = message;
      return newArr;
    });
  }

  function clearExitPointError(index) {
    setUserValues((prev) => {
      const newArr = [...prev];
      newArr[index].exitError = '';
      return newArr;
    });
  }

  function handleRemoveCondition() {
    if (userValues.length === 1) return;

    setUserValues((prev) => {
      const newArr = [...prev];
      newArr.pop();
      return newArr;
    });
  }

  return (
    <>
      <List>
        <DrawerTop
          saveUserValues={saveUserValues}
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
          backgroundColor='#795548'
          blockName='Switch'
        />
        <DrawerName
          shapeName={shapeName}
          setShapeName={setShapeName}
          stageGroup={stageGroup}
          errorText={errorText}
          setErrorText={setErrorText}
          successText={successText}
        />
        <Divider sx={{mb: 4}} />
        <ListItem>
          <Typography
            sx={{fontSize: '1.2rem', width: '75%', mx: 0.5}}
            variant='subtitle2'>
            Condition
          </Typography>
          <Typography
            sx={{fontSize: '1.2rem', width: '25%'}}
            variant='subtitle2'>
            Action
          </Typography>
        </ListItem>
        <List>
          {userValues.map((row, i) => (
            <Box key={i}>
              <ListItem>
                <TextField
                  sx={{
                    mx: 0.5,
                    width: '75%',
                    backgroundColor: row.conditionError && '#ffcdd2',
                  }}
                  size='small'
                  value={row.condition}
                  name='condition'
                  onChange={(e) => {
                    handleChangeUserValues(e, i);
                    validateInput(e, i);
                  }}
                  multiline></TextField>
                <TextField
                  sx={{
                    mx: 0.5,
                    backgroundColor: row.exitError && '#ffcdd2',
                    width: '25%',
                  }}
                  size='small'
                  value={row.exitPoint}
                  name='exitPoint'
                  onChange={(e) => {
                    handleChangeUserValues(e, i);
                    validateInput(e, i);
                  }}
                  error={!!row.exitError}></TextField>
              </ListItem>
              <ListItem
                sx={{
                  display:
                    row.exitError || row.conditionError ? 'flex' : 'none',
                }}>
                <Typography
                  sx={{
                    mt: -1,
                    mr: 'auto',
                    ml: 2,
                    px: 1,
                    boxShadow: 1,
                    width: 'max-content',
                    backgroundColor: '#e3f2fd',
                    display: row.conditionError ? 'inline-block' : 'none',
                  }}>
                  {row.conditionError}
                </Typography>
                <Typography
                  sx={{
                    mt: -1,
                    ml: 'auto',
                    mr: 2,
                    px: 1,
                    boxShadow: 1,
                    backgroundColor: '#e3f2fd',
                    width: 'max-content',
                    display: row.exitError ? 'inline-block' : 'none',
                  }}>
                  {row.exitError}
                </Typography>
              </ListItem>
            </Box>
          ))}
        </List>
        <ListItem>
          <TextField
            sx={{width: '75%', mx: 0.5, backgroundColor: '#eceff1'}}
            size='small'
            value='Default'
            disabled
          />

          <TextField
            sx={{width: '25%', mx: 0.5}}
            size='small'
            value={defaultExitPoint}
            onChange={(e) => setDefaultExitPoint(e.target.value)}
          />
        </ListItem>

        <ListItem sx={{mt: 2}}>
          <Tooltip title='Add exitPoint' placement='bottom'>
            <Button
              sx={{
                mx: 1,
                backgroundColor: '#dcdcdc',
                '&:hover': {backgroundColor: '#b0b0b0'},
              }}
              size='small'
              onClick={handleAddCondition}>
              <AddCircleIcon sx={{fontSize: '1.2rem', color: '#1b5e20'}} />
            </Button>
          </Tooltip>
          <Tooltip title='Remove exitPoint' placement='bottom'>
            <Button
              sx={{
                mx: 1,
                backgroundColor: '#dcdcdc',
                '&:hover': {backgroundColor: '#b0b0b0'},
              }}
              size='small'
              onClick={handleRemoveCondition}>
              <RemoveCircleIcon sx={{fontSize: '1.2rem', color: '#b71c1c'}} />
            </Button>
          </Tooltip>
        </ListItem>
      </List>
    </>
  );
};

export default SwitchBlock;
