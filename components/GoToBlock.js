import {
  List,
  ListItem,
  Tooltip,
  Typography,
  Button,
  Chip,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { useRef, useState } from 'react';
import { checkValidity } from '../src/helpers';

const GoToBlock = ({ shape, handleCloseDrawer, entireStageGroup }) => {
  const [shapeName, setShapeName] = useState(shape.text);
  const [gotoType, setGotoType] = useState(shape.userValues?.type ?? 'exit');
  const [exitShapeName, setExitShapeName] = useState(
    shape.userValues?.exitPoint ?? ''
  );

  const nameErrorRef = useRef(null);

  function calculateAllExitPoints() {
    let exitPoints = [];

    entireStageGroup.forEach((page) => {
      page.getShapesAsArray().forEach((el) => {
        if (
          el.type === 'jumper' &&
          el.userValues?.type === 'exit' &&
          el.text !== shapeName
        )
          exitPoints.push(el.text);
      });
    });

    return exitPoints;
  }

  function saveUserValues() {
    if (gotoType === 'entry') {
      shape.setFillStyle('#388e3c');
      shape.setUserValues({
        type: gotoType,
        exitPoint: exitShapeName,
      });
      return;
    }
    // reset color
    shape.setFillStyle('#f57f17');

    // save name only if no nameError
    if (nameErrorRef.current.innerText === '') shape.setText(shapeName);

    shape.setUserValues({
      type: gotoType,
    });

    console.log('all exit points', calculateAllExitPoints());
  }

  function handleNameValidation(e) {
    let errorBox = nameErrorRef.current;
    let errorMessage = checkValidity('object', e);
    if (errorMessage !== -1) {
      errorBox.style.display = 'block';
      e.target.style.backgroundColor = '#ffebee';
      errorBox.innerText = errorMessage;
      return;
    }

    // check name unique in all pages
    for (const page of entireStageGroup) {
      for (const el of page.getShapesAsArray()) {
        if (el.text === e.target.value) {
          errorBox.style.display = 'block';
          e.target.style.backgroundColor = '#ffebee';
          errorBox.innerText = 'name NOT unique';
          return;
        }
      }
    }

    // no error condition
    errorBox.style.display = 'none';
    e.target.style.backgroundColor = '#f1f8e9';
    errorBox.innerText = '';
  }

  return (
    <List sx={{ minWidth: 300 }}>
      <ListItem>
        <Tooltip title='CLOSE'>
          <Button
            size='small'
            variant='outlined'
            color='error'
            sx={{ height: 30 }}
            onClick={() => {
              shape.setSelected(false);
              saveUserValues();
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
          sx={{ backgroundColor: '#ffcc80', mx: 'auto', px: 2, py: 3 }}
          label={<Typography variant='h6'>Jumper</Typography>}
        />
      </ListItem>
      <ListItem sx={{ marginTop: 1 }}>
        <Typography variant='button' sx={{ fontSize: 16, width: '40%' }}>
          Type:
        </Typography>
        <RadioGroup
          name='controlled-radio-buttons-group'
          value={gotoType}
          onChange={(e) => setGotoType(e.target.value)}
        >
          <FormControlLabel value='exit' control={<Radio />} label='EXIT' />
          <FormControlLabel value='entry' control={<Radio />} label='ENTRY' />
        </RadioGroup>
      </ListItem>{' '}
      <ListItem sx={{ marginTop: 1 }}>
        <Typography variant='button' sx={{ fontSize: 16, width: '40%' }}>
          Name:
        </Typography>
        {gotoType === 'exit' ? (
          <TextField
            sx={{ width: 180, marginX: 1 }}
            size='small'
            value={shapeName}
            onChange={(e) => {
              handleNameValidation(e);
              setShapeName(e.target.value);
            }}
          ></TextField>
        ) : (
          <Select
            sx={{ width: 180, marginX: 1 }}
            size='small'
            value={exitShapeName}
            onChange={(e) => setExitShapeName(e.target.value)}
          >
            {calculateAllExitPoints().map((el, i) => (
              <MenuItem key={i} value={el || ''}>
                {el}
              </MenuItem>
            ))}
          </Select>
        )}
      </ListItem>
      <ListItem>
        <Typography
          sx={{
            marginX: 'auto',
            boxShadow: 1,
            paddingX: 1,
            backgroundColor: '#ffcdd2',
            display: 'none',
          }}
          variant='subtitle2'
          ref={nameErrorRef}
        ></Typography>
      </ListItem>
    </List>
  );
};

export default GoToBlock;
