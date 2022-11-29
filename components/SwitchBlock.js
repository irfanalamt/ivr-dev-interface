import {
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

const SwitchBlock = ({ shape, handleCloseDrawer }) => {
  const [shapeName, setShapeName] = useState(shape.text);
  const [userValues, setUserValues] = useState(
    shape.userValues?.switchArray ?? [{ condition: '', exitPoint: '' }]
  );

  function saveUserValues() {
    shape.setText(shapeName);

    // filter our rows with both fields blank before save
    const filteredUserValues = userValues.filter(
      (row) => !(row.condition === '' && row.exitPoint === '')
    );

    shape.setUserValues({ switchArray: filteredUserValues });
  }

  function handleChangeUserValues(e, index) {
    const propertyName = e.target.name;
    const value = e.target.value;

    setUserValues((prev) => {
      const newArr = [...prev];
      newArr[index][propertyName] = value;
      return newArr;
    });
  }

  function handleAddCondition() {
    setUserValues((prev) => [...prev, { condition: '', exitPoint: '' }]);
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
            <ListItem key={i}>
              <TextField
                sx={{ mx: 0.5, width: '75%' }}
                size='small'
                value={row.condition}
                name='condition'
                onChange={(e) => handleChangeUserValues(e, i)}
              ></TextField>
              <TextField
                sx={{ mx: 0.5 }}
                size='small'
                value={row.exitPoint}
                name='exitPoint'
                onChange={(e) => handleChangeUserValues(e, i)}
              ></TextField>
            </ListItem>
          ))}
        </List>

        <ListItem>
          <Tooltip title='Add condition' placement='bottom'>
            <Button
              sx={{ mx: 1, backgroundColor: '#8bc34a', color: '#424242' }}
              size='small'
              onClick={handleAddCondition}
            >
              <AddCircleIcon />
            </Button>
          </Tooltip>
          <Tooltip title='Remove condition' placement='bottom'>
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
