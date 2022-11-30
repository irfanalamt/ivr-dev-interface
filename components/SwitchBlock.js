import {
  Box,
  Button,
  Chip,
  List,
  ListItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useState } from 'react';
import ResetCanvasDialog from './ResetCanvasDialog';

const SwitchBlock = ({
  shape,
  handleCloseDrawer,
  userVariables,
  stageGroup,
}) => {
  const [shapeName, setShapeName] = useState(shape.text);
  const [userValues, setUserValues] = useState(
    shape.userValues?.switchArray ?? [
      { condition: '', exitPoint: '', conditionError: '', exitError: '' },
    ]
  );

  function saveUserValues() {
    shape.setText(shapeName);

    // filter our rows with both fields blank or has an error in either fields
    const filteredUserValues = userValues.filter(
      (row) =>
        !(
          (row.condition === '' && row.exitPoint === '') ||
          row.conditionError ||
          row.exitError
        )
    );

    const validExitPointsArray = filteredUserValues.map((row) => row.exitPoint);

    console.log('valid exits', validExitPointsArray);

    stageGroup.cleanupExitShapes(shape.id);
    stageGroup.addExitShapes(validExitPointsArray, shape.id);

    // save only valid user values
    shape.setUserValues({ switchArray: filteredUserValues });
  }

  function handleChangeUserValues(e, index) {
    const { name, value } = e.target;

    setUserValues((prev) => {
      const newArr = [...prev];
      newArr[index][name] = value;
      return newArr;
    });
  }

  function handleAddCondition() {
    setUserValues((prev) => [...prev, { condition: '', exitPoint: '' }]);
  }

  function validateInput(e, index) {
    const { name, value } = e.target;

    if (name === 'condition') {
      if (value === 'test') {
        // test error condition
        setUserValues((prev) => {
          const newArr = [...prev];
          newArr[index].conditionError = 'invalid condition';
          return newArr;
        });
        return;
      }

      // no error ; reset error property
      setUserValues((prev) => {
        const newArr = [...prev];
        newArr[index].conditionError = '';
        return newArr;
      });
    }

    if (name === 'exitPoint') {
      const regExp = /^[a-z0-9]+$/i;
      const isAlNum = regExp.test(value);
      if (!isAlNum) {
        // error condition
        setUserValues((prev) => {
          const newArr = [...prev];
          newArr[index].exitError = 'invalid exitPoint character';
          return newArr;
        });
        return;
      }
      // no error ; reset error property
      setUserValues((prev) => {
        const newArr = [...prev];
        newArr[index].exitError = '';
        return newArr;
      });
    }

    console.log('name,value🕺🏻', name, value, index);
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
            sx={{ backgroundColor: '#795548', mx: 'auto', px: 2, py: 3 }}
            label={<Typography variant='h6'>Switch</Typography>}
          />
        </ListItem>
        <ListItem sx={{ mt: 1, mb: 3 }}>
          <Typography variant='button' sx={{ fontSize: 15, width: '35%' }}>
            Name:
          </Typography>
          <TextField
            sx={{ width: 180, marginX: 1 }}
            size='small'
            value={shapeName}
            onChange={(e) => setShapeName(e.target.value)}
          ></TextField>
        </ListItem>
        <ListItem>
          <Typography
            sx={{ fontSize: '1.2rem', width: '60%', mx: 0.5 }}
            variant='subtitle2'
          >
            Condition
          </Typography>
          <Typography sx={{ fontSize: '1.2rem' }} variant='subtitle2'>
            ExitPoint
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
                ></TextField>
                <TextField
                  sx={{ mx: 0.5, backgroundColor: row.exitError && '#ffcdd2' }}
                  size='small'
                  value={row.exitPoint}
                  name='exitPoint'
                  onChange={(e) => {
                    handleChangeUserValues(e, i);
                    validateInput(e, i);
                  }}
                  error={row.exitError}
                ></TextField>
              </ListItem>
              <ListItem
                sx={{
                  display:
                    row.exitError || row.conditionError ? 'flex' : 'none',
                }}
              >
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
                  }}
                >
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
                  }}
                >
                  {row.exitError}
                </Typography>
              </ListItem>
            </Box>
          ))}
        </List>

        <ListItem>
          <Tooltip title='Add exitPoint' placement='bottom'>
            <Button
              sx={{ mx: 1, backgroundColor: '#8bc34a', color: '#424242' }}
              size='small'
              onClick={handleAddCondition}
            >
              <AddCircleIcon />
            </Button>
          </Tooltip>
          <Tooltip title='Remove exitPoint' placement='bottom'>
            <Button
              sx={{ mx: 1, backgroundColor: '#e91e63', color: '#424242' }}
              size='small'
              color='error'
              onClick={handleRemoveCondition}
            >
              <RemoveCircleIcon />
            </Button>
          </Tooltip>
        </ListItem>
      </List>
    </>
  );
};

export default SwitchBlock;
