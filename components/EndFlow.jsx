import {
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import {useContext, useState} from 'react';
import {VariableContext} from '../src/context';
import DrawerTop from './DrawerTop';

const EndFlow = ({shape, handleCloseDrawer}) => {
  const {isModule} = useContext(VariableContext);
  const [type, setType] = useState(
    shape.userValues?.type ?? (isModule ? 'return' : 'disconnect')
  );
  const [transferPoint, setTransferPoint] = useState(
    shape.userValues?.transferPoint ?? ''
  );

  function handleTypeChange(e) {
    setType(e.target.value);
  }

  function handleTransferPointChange(e) {
    setTransferPoint(e.target.value);
  }

  function saveUserValues() {
    shape.setUserValues({
      type,
      transferPoint: type === 'disconnect' ? null : transferPoint,
    });
  }

  return (
    <>
      <List sx={{minWidth: 350}}>
        <DrawerTop
          saveUserValues={saveUserValues}
          shape={shape}
          handleCloseDrawer={handleCloseDrawer}
          backgroundColor='#f8bbd0'
          blockName='End Flow'
        />
        <ListItem sx={{mt: 4}}>
          <Typography sx={{fontSize: '1.1rem'}} variant='h6'>
            Type:
          </Typography>
        </ListItem>
        <ListItem>
          <RadioGroup
            name='radio-endflowType'
            value={type}
            onChange={handleTypeChange}>
            {isModule && (
              <FormControlLabel
                sx={{ml: 1}}
                value='return'
                control={<Radio />}
                label='RETURN'
              />
            )}
            <FormControlLabel
              sx={{ml: 1}}
              value='disconnect'
              control={<Radio />}
              label='DISCONNECT'
            />
            <FormControlLabel
              sx={{ml: 1}}
              value='transfer'
              control={<Radio />}
              label='TRANSFER'
            />
          </RadioGroup>
        </ListItem>
        {type === 'transfer' && (
          <ListItem sx={{mt: 2}}>
            <Typography variant='body1' sx={{fontWeight: 'bold', fontSize: 15}}>
              transferPoint:
            </Typography>
            <TextField
              sx={{width: 180, ml: 2}}
              size='small'
              value={transferPoint}
              onChange={handleTransferPointChange}></TextField>
          </ListItem>
        )}
      </List>
    </>
  );
};

export default EndFlow;
