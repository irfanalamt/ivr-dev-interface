import {
  Box,
  Button,
  Divider,
  Drawer,
  FormLabel,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import defaultParams from '../src/defaultParams';
import {useEffect, useState} from 'react';

const SetParams = ({shape, handleCloseDrawer, shapes, clearAndDraw}) => {
  const [name, setName] = useState(shape.text);
  const [selectedParameterIndex, setSelectedParameterIndex] = useState(0);
  const [currentParameter, setCurrentParameter] = useState(defaultParams[0]);
  const [modifiedParameters, setModifiedParameters] = useState(
    shape.userValues?.params ?? []
  );

  useEffect(() => {
    shape.setUserValues({
      params: modifiedParameters,
    });
  }, [modifiedParameters]);

  function handleSaveName() {
    shape.setText(name);
    clearAndDraw();
  }

  function handleSelectedParameterIndexChange(e) {
    setSelectedParameterIndex(e.target.value);

    const currentParam = {...defaultParams[e.target.value]};
    const duplicate = modifiedParameters.find(
      (p) => p.name === currentParam.name
    );

    if (duplicate) {
      console.log('duplicate found✨');
      currentParam.value = duplicate.value;
    }

    setCurrentParameter(currentParam);
  }

  function handleFieldChange(e) {
    console.log('yo:', e.target.value);
    setCurrentParameter({...currentParameter, value: e.target.value});
  }
  function handleFieldChangeSwitch(e) {
    setCurrentParameter({...currentParameter, value: e.target.checked});
  }

  function handleAddModifiedParameter() {
    const index = modifiedParameters.findIndex(
      (param) => param.name === currentParameter.name
    );
    if (index !== -1) {
      const updatedParameters = [...modifiedParameters];
      updatedParameters[index] = {
        name: currentParameter.name,
        value: currentParameter.value,
      };
      setModifiedParameters(updatedParameters);
    } else {
      setModifiedParameters([
        ...modifiedParameters,
        {name: currentParameter.name, value: currentParameter.value},
      ]);
    }
  }

  function handleDeleteModifiedParameter(index) {
    setModifiedParameters((p) => {
      const temp = [...p];
      temp.splice(index, 1);
      return temp;
    });
  }

  return (
    <>
      <Box
        sx={{backgroundColor: '#f5f5f5', boxShadow: 1, display: 'flex', p: 1}}>
        <Typography sx={{display: 'flex', alignItems: 'center'}} variant='h5'>
          {
            <img
              src='/icons/setParamsBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp; Set Params
        </Typography>
        <Tooltip placement='left' title='CLOSE'>
          <IconButton
            onClick={handleCloseDrawer}
            sx={{
              ml: 'auto',
              backgroundColor: '#dcdcdc',
              color: 'black',
              '&:hover': {backgroundColor: '#ffcdd2'},
            }}>
            <CloseIcon sx={{fontSize: '22px'}} />
          </IconButton>
        </Tooltip>
      </Box>
      <List sx={{minWidth: 350}}>
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
          <Typography sx={{ml: 2, mt: 1}} fontSize='large' variant='subtitle2'>
            ID
          </Typography>
          <ListItem>
            <TextField
              onChange={(e) => setName(e.target.value)}
              value={name}
              sx={{minWidth: '220px'}}
              size='small'
            />
            <Button
              onClick={handleSaveName}
              sx={{ml: 2}}
              size='small'
              variant='contained'>
              <SaveIcon />
            </Button>
          </ListItem>
        </Box>

        <Divider sx={{my: 2}} />
        <ListItem>
          <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Typography fontSize='large' variant='subtitle1'>
              parameters
            </Typography>
            <Select
              value={selectedParameterIndex}
              onChange={handleSelectedParameterIndexChange}
              labelId='paramteter-label'
              sx={{minWidth: '220px'}}
              size='small'>
              {defaultParams.map((p, i) => (
                <MenuItem value={i} key={i}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </ListItem>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            py: 2,
            backgroundColor: '#f7f8f9',
            mt: 1,
          }}>
          {currentParameter.name && (
            <>
              <Typography sx={{ml: 2}} variant='body1'>
                {currentParameter.name}
              </Typography>
              <ListItem>
                {currentParameter.type === 'select' && (
                  <Select
                    sx={{minWidth: '220px'}}
                    size='small'
                    value={currentParameter.value}
                    onChange={handleFieldChange}>
                    {currentParameter.optionList?.map((p, i) => (
                      <MenuItem value={p} key={i}>
                        {p}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                {!currentParameter.type && (
                  <TextField
                    sx={{minWidth: '220px'}}
                    size='small'
                    name='name'
                    value={currentParameter.value}
                    onChange={handleFieldChange}
                  />
                )}
                {currentParameter.type === 'switch' && (
                  <Box sx={{width: '220px'}}>
                    <Switch
                      onChange={handleFieldChangeSwitch}
                      checked={currentParameter.value}
                    />
                  </Box>
                )}
                <Tooltip title='update' placement='top'>
                  <Button
                    onClick={handleAddModifiedParameter}
                    sx={{ml: 2}}
                    size='small'
                    variant='contained'>
                    <SaveIcon />
                  </Button>
                </Tooltip>
              </ListItem>
            </>
          )}
        </Box>
      </List>
      <List sx={{px: 2}}>
        {modifiedParameters.map((p, i) => (
          <ListItem key={i}>
            <Typography variant='subtitle2'>{p.name}:</Typography>
            <Typography sx={{ml: 2}}>
              {typeof p.value === 'boolean' ? `${p.value}` : p.value}
            </Typography>
            <Button
              onClick={() => handleDeleteModifiedParameter(i)}
              sx={{ml: 'auto'}}>
              <DeleteIcon sx={{color: '#424242'}} />
            </Button>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default SetParams;
