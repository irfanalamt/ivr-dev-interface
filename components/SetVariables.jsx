import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {useState} from 'react';
import {checkValidity} from '../src/helpers';

const SetVariables = ({
  handleCloseDrawer,
  userVariables = [],
  setUserVariables,
  entireStageGroup,
  isModule,
}) => {
  const [varList, setVarList] = useState(userVariables);
  const [selectedVarIndex, setSelectedVarIndex] = useState('');
  const [isViewMode, setIsViewMode] = useState(true);
  const [currVariable, setCurrVariable] = useState({
    type: 'prompt',
    name: '',
    value: '',
    description: '',
  });
  const [errorText, setErrorText] = useState('');

  const dayValues = [
    '1 Sunday',
    '2 Monday',
    '3 Tuesday',
    '4 Wednesday',
    '5 Thursday',
    '6 Friday',
    '7 Saturday',
  ];

  const monthValues = [
    '01 January',
    '02 February',
    '03 March',
    '04 April',
    '05 May',
    '06 June',
    '07 July',
    '08 August',
    '09 September',
    '10 October',
    '11 November',
    '12 December',
  ];

  const handleAdd = () => {
    setSelectedVarIndex('');
    setCurrVariable({
      type: 'prompt',
      name: '',
      value: '',
      description: '',
    });
    setIsViewMode(false);
  };

  const handleModify = () => {
    setIsViewMode(false);
  };

  const handleDelete = () => {
    // check if var in use. if so prevent delete
    for (const stage of entireStageGroup) {
      if (stage.checkVariableInUse(varList[selectedVarIndex].name)) {
        setErrorText('Variable in use. Cannot delete.');
        return;
      }
    }
    setVarList((v) => {
      const temp = [...v];
      temp.splice(selectedVarIndex, 1);
      setUserVariables(temp);
      return temp;
    });
    setSelectedVarIndex('');
    setCurrVariable({});
  };

  const handleVarChange = (e) => {
    const {value, name} = e.target;

    setCurrVariable((v) => ({...currVariable, [name]: value}));
  };

  const handleVarChangeCheckbox = (e) => {
    const {checked, name} = e.target;

    setCurrVariable((v) => ({...currVariable, [name]: checked}));
  };

  const handleValidation = (e) => {
    const {name, value} = e.target;

    let errorM = -1;

    if (name === 'name') {
      errorM = checkValidity('object', value);
    } else {
      errorM = checkValidity(currVariable.type, value);
    }

    if (errorM === -1) {
      // No error condition
      setErrorText('');
      return;
    }

    setErrorText(errorM);
  };

  const handleSave = () => {
    if (!currVariable.name || !currVariable.value || errorText !== '') {
      return;
    }

    const newVarList = varList.filter((v, i) => i !== selectedVarIndex);
    if (newVarList.some((v) => v.name === currVariable.name)) {
      setErrorText('variable name NOT unique');
      return;
    }

    if (selectedVarIndex === '') {
      setVarList((v) => {
        const temp = [...v];
        temp.push(currVariable);
        setUserVariables(temp);
        return temp;
      });
      setSelectedVarIndex(varList.length);
    } else {
      entireStageGroup.forEach((stage) => {
        stage.modifyVariable(varList[selectedVarIndex].name, currVariable.name);
      });
      setVarList((v) => {
        const temp = [...v];
        temp[selectedVarIndex] = currVariable;
        setUserVariables(temp);
        return temp;
      });
    }

    setIsViewMode(true);
  };

  return (
    <List sx={{minWidth: 400}}>
      <Box
        sx={{
          mt: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Typography
          sx={{
            backgroundColor: '#ffab91',
            px: 2,
            py: 1,
            boxShadow: 1,
            fontSize: '1.5rem',
            width: 'max-content',
          }}
          variant='h6'>
          Set Variables
        </Typography>
        <Tooltip title='CLOSE'>
          <Button
            size='small'
            variant='contained'
            sx={{
              height: 30,
              mr: 1,
              color: 'black',
              backgroundColor: '#dcdcdc',
              '&:hover': {backgroundColor: '#e57373'},
            }}
            onClick={handleCloseDrawer}>
            <CloseRoundedIcon sx={{fontSize: 21}} />
          </Button>
        </Tooltip>
      </Box>
      <Typography
        sx={{
          backgroundColor: ' #FFE4E1',
          color: '#FF0000',
          width: 'max-content',
          position: 'absolute',
          px: 1,
          mt: 1,
          left: 0,
          right: 0,
          mx: 'auto',
          fontSize: '0.75rem',
        }}
        variant='subtitle1'>
        {errorText}
      </Typography>
      <ListItem sx={{mt: 4}}>
        <InputLabel id='select-label'>variable list</InputLabel>
        <Select
          sx={{ml: 2, minWidth: '50%'}}
          labelId='select-label'
          size='small'
          onChange={(e) => {
            setSelectedVarIndex(e.target.value);

            setCurrVariable(varList[e.target.value]);

            setIsViewMode(true);
          }}
          value={selectedVarIndex}>
          {varList.map((v, i) => (
            <MenuItem value={i} key={i}>
              {v.name}
            </MenuItem>
          ))}
        </Select>
      </ListItem>
      <ListItem sx={{mt: 1}}>
        <Button
          sx={{
            backgroundColor: '#dcdcdc',
            color: '#1b5e20',
            '&:hover': {backgroundColor: '#b0b0b0'},
          }}
          variant='contained'
          onClick={handleAdd}>
          Add
        </Button>
        <Button
          sx={{
            ml: 1,
            backgroundColor: '#dcdcdc',
            color: '#01579b',
            '&:hover': {backgroundColor: '#b0b0b0'},
          }}
          variant='contained'
          color='secondary'
          onClick={handleModify}
          disabled={selectedVarIndex === ''}>
          Modify
        </Button>
        <Button
          sx={{
            ml: 1,
            backgroundColor: '#dcdcdc',
            color: '#b71c1c',
            '&:hover': {backgroundColor: '#b0b0b0'},
          }}
          variant='contained'
          color='error'
          onClick={handleDelete}
          disabled={selectedVarIndex === ''}>
          Delete
        </Button>
      </ListItem>
      <List sx={{mt: 4}}>
        <Divider sx={{mb: 1}} />
        <ListItem>
          <Typography sx={{fontWeight: 'bold', width: '30%'}} variant='body1'>
            type:
          </Typography>
          <Select
            sx={{ml: 1, width: 'max-content'}}
            name='type'
            value={currVariable.type ?? 'prompt'}
            onChange={handleVarChange}
            size='small'
            disabled={isViewMode === true || selectedVarIndex !== ''}>
            <MenuItem value='prompt'>Prompt</MenuItem>
            <MenuItem value='number'>Number</MenuItem>
            <MenuItem value='string'>String</MenuItem>
            <MenuItem value='boolean'>Boolean</MenuItem>
            <MenuItem value='date'>Date</MenuItem>
            <MenuItem value='day'>Day</MenuItem>
            <MenuItem value='month'>Month</MenuItem>
            <MenuItem value='time'>Time</MenuItem>
          </Select>
          {isModule && (
            <>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Tooltip title='input variable' placement='top' arrow>
                  <Checkbox
                    name='isInput'
                    checked={currVariable.isInput ?? false}
                    onChange={handleVarChangeCheckbox}
                    sx={{ml: 1}}
                    size='small'
                    disabled={isViewMode === true}
                  />
                </Tooltip>
                <Typography>I/P</Typography>
              </Box>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Tooltip title='output variable' placement='top' arrow>
                  <Checkbox
                    name='isOutput'
                    checked={currVariable.isOutput ?? false}
                    onChange={handleVarChangeCheckbox}
                    sx={{ml: 1}}
                    size='small'
                    disabled={isViewMode === true}
                  />
                </Tooltip>
                <Typography>O/P</Typography>
              </Box>
            </>
          )}
        </ListItem>
        <ListItem>
          <Typography sx={{fontWeight: 'bold', width: '30%'}} variant='body1'>
            name:
          </Typography>
          <TextField
            sx={{ml: 1, width: '55%'}}
            size='small'
            name='name'
            placeholder={isViewMode === false ? 'required' : ''}
            value={currVariable.name ?? ''}
            onChange={(e) => {
              handleValidation(e);
              handleVarChange(e);
            }}
            disabled={isViewMode === true}
          />
        </ListItem>
        <ListItem>
          <Typography sx={{fontWeight: 'bold', width: '30%'}} variant='body1'>
            defaultValue:
          </Typography>
          <Select
            size='small'
            name='value'
            sx={{
              display:
                currVariable.type === 'day' || currVariable.type === 'month'
                  ? 'block'
                  : 'none',
              minWidth: '30%',
              ml: 1,
            }}
            value={
              currVariable.type === 'day' || currVariable.type === 'month'
                ? currVariable.value
                : ''
            }
            onChange={handleVarChange}>
            {currVariable.type === 'day' &&
              dayValues.map((d, i) => (
                <MenuItem value={i + 1} key={i}>
                  {d}
                </MenuItem>
              ))}
            {currVariable.type === 'month' &&
              monthValues.map((d, i) => (
                <MenuItem value={i + 1} key={i}>
                  {d}
                </MenuItem>
              ))}
          </Select>
          <TextField
            sx={{
              ml: 1,
              width: '55%',
              display: !(
                currVariable.type === 'day' || currVariable.type === 'month'
              )
                ? 'block'
                : 'none',
            }}
            size='small'
            name='value'
            placeholder={isViewMode === false ? 'required' : ''}
            value={currVariable.value ?? ''}
            onChange={(e) => {
              handleValidation(e);
              handleVarChange(e);
            }}
            disabled={isViewMode === true}
          />
        </ListItem>
        <ListItem>
          <Typography sx={{fontWeight: 'bold', width: '30%'}} variant='body1'>
            description:
          </Typography>
          <TextField
            sx={{mx: 1}}
            size='small'
            name='description'
            multiline
            value={currVariable.description ?? ''}
            onChange={handleVarChange}
            disabled={isViewMode === true}
          />
          <Tooltip title='SAVE'>
            <SaveRoundedIcon
              sx={{
                position: 'relative',
                left: 10,
                fontSize: '1.5rem',
                '&:hover': {color: '#2e7d32', fontSize: '1.6rem'},
              }}
              onClick={handleSave}
            />
          </Tooltip>
        </ListItem>
        <Divider sx={{mt: 1}} />
      </List>
    </List>
  );
};

export default SetVariables;
