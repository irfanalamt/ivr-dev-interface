import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {useEffect, useMemo, useRef, useState} from 'react';
import {checkValidity} from '../src/helpers';

const Jumper = ({shape, handleCloseDrawer, openVariableManager, shapes}) => {
  const [type, setType] = useState(shape.userValues?.type ?? 'exit');
  const [name, setName] = useState(shape.userValues?.name || shape.text);

  const [exitName, setExitName] = useState(shape.userValues?.exitName ?? '');

  const [successText, setSuccessText] = useState('');
  const [errorText, setErrorText] = useState('');

  const errors = useRef({});

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSuccessText('');
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [successText]);

  const allExitJumpers = useMemo(
    () =>
      shapes.filter(
        (shape) => shape.type === 'jumper' && shape.userValues?.type === 'exit'
      ),
    [shapes]
  );

  const allUnusedExitJumpers = allExitJumpers.filter(
    (exitJumper) =>
      !shapes.some((el) => {
        const isSameExitName =
          el.userValues?.exitName === exitJumper.userValues?.name;
        const isEntryType = el.userValues?.type === 'entry';
        const isNotCurrentShape = el !== shape;

        return isSameExitName && isEntryType && isNotCurrentShape;
      })
  );

  function handleSave() {
    if (errors.current.name) {
      setErrorText('Id not valid');
      return;
    }

    shape.setUserValues({
      type,
      name,
      exitName,
    });
    setErrorText('');
    setSuccessText('Saved.');
  }

  function validateExitId(value) {
    const isValidFormat = checkValidity('object', value);
    if (isValidFormat !== -1) {
      setErrorText(isValidFormat);
      errors.current.name = true;
      return;
    }

    const isUnique = isExitIdUnique(value);
    if (isUnique) {
      setErrorText('');
      delete errors.current.name;
    } else {
      setErrorText('Id not unique');
      errors.current.name = true;
    }
  }

  function isExitIdUnique(name) {
    return !allExitJumpers.some(
      (currentShape) =>
        currentShape !== shape && currentShape.userValues?.name === name
    );
  }

  return (
    <>
      <ListItem
        sx={{
          backgroundColor: '#cfd8dc',
          display: 'flex',
          boxShadow: 2,
          p: 1,
          minWidth: 350,
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
              src='/icons/jumperBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp;Jumper
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
          onClick={handleCloseDrawer}
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
        <Stack sx={{mt: 4, px: 2}}>
          <Typography fontSize='large' variant='subtitle2'>
            Type
          </Typography>

          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <RadioGroup
              row
              name='radio-endflowType'
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                if (e.target.value === 'exit') {
                  setExitName('');
                }
              }}>
              <FormControlLabel value='exit' control={<Radio />} label='Exit' />
              <FormControlLabel
                sx={{ml: 1}}
                value='entry'
                control={<Radio />}
                label='Entry'
              />
            </RadioGroup>
            <Button
              onClick={handleSave}
              sx={{ml: 'auto'}}
              size='small'
              variant='contained'>
              <SaveIcon />
            </Button>
          </Box>
          <ListItem sx={{height: 30}}>
            {successText && (
              <Typography sx={{color: 'green', mx: 'auto'}}>
                {successText}
              </Typography>
            )}
            {!successText && (
              <Typography sx={{color: 'red', mx: 'auto'}}>
                {errorText}
              </Typography>
            )}
          </ListItem>
          <Typography sx={{fontSize: '1rem'}} variant='subtitle2'>
            ID
          </Typography>
          {type === 'exit' ? (
            <TextField
              sx={{width: '220px', backgroundColor: '#f5f5f5'}}
              size='small'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                validateExitId(e.target.value);
              }}
            />
          ) : (
            <Select
              sx={{width: '180px', backgroundColor: '#f5f5f5'}}
              size='small'
              value={exitName}
              onChange={(e) => setExitName(e.target.value)}>
              {allUnusedExitJumpers.map((s, i) => (
                <MenuItem value={s.userValues.name} key={i}>
                  {s.userValues.name}
                </MenuItem>
              ))}
            </Select>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default Jumper;
