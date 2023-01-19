import {
  List,
  ListItem,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem
} from '@mui/material';
import {useRef, useState} from 'react';
import {checkValidity} from '../src/helpers';
import DrawerTop from './DrawerTop';

const GoToBlock = ({shape, handleCloseDrawer, entireStageGroup}) => {
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
        exitPoint: exitShapeName
      });
      return;
    }
    // reset color
    shape.setFillStyle('#f57f17');

    // save name only if no nameError
    if (nameErrorRef.current.innerText === '') shape.setText(shapeName);

    shape.setUserValues({
      type: gotoType
    });

    console.log('all exit points', calculateAllExitPoints());
  }

  function handleNameValidation(e) {
    const {value} = e.target;

    const nameErrorBox = nameErrorRef.current;
    const nameErrorMessage = checkValidity('object', value);
    if (nameErrorMessage !== -1) {
      nameErrorBox.style.display = 'block';
      e.target.style.backgroundColor = '#ffebee';
      nameErrorBox.innerText = nameErrorMessage;
      return;
    }

    // check name unique in all pages
    const isUniqueName = checkUniqueName(value, entireStageGroup);
    if (!isUniqueName) {
      nameErrorBox.style.display = 'block';
      e.target.style.backgroundColor = '#ffebee';
      nameErrorBox.innerText = 'Name is not unique';
      return;
    }

    // no error condition
    nameErrorBox.style.display = 'none';
    e.target.style.backgroundColor = '#f1f8e9';
    nameErrorBox.innerText = '';
  }

  function checkUniqueName(name, pageGroup) {
    for (const page of pageGroup) {
      for (const pageElement of page.getShapesAsArray()) {
        if (pageElement.text === name) {
          return false;
        }
      }
    }
    return true;
  }

  return (
    <List sx={{minWidth: 300}}>
      <DrawerTop
        saveUserValues={saveUserValues}
        shape={shape}
        handleCloseDrawer={handleCloseDrawer}
        backgroundColor='#ffcc80'
        blockName='Jumper'
      />
      <ListItem sx={{marginTop: 4}}>
        <Typography variant='button' sx={{fontSize: 16, width: '40%'}}>
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
      <ListItem sx={{marginTop: 1}}>
        <Typography variant='button' sx={{fontSize: 16, width: '40%'}}>
          Name:
        </Typography>
        {gotoType === 'exit' ? (
          <TextField
            sx={{width: 180, marginX: 1}}
            size='small'
            value={shapeName}
            onChange={(e) => {
              handleNameValidation(e);
              setShapeName(e.target.value);
            }}
          ></TextField>
        ) : (
          <Select
            sx={{width: 180, marginX: 1}}
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
            display: 'none'
          }}
          variant='subtitle2'
          ref={nameErrorRef}
        ></Typography>
      </ListItem>
    </List>
  );
};

export default GoToBlock;
