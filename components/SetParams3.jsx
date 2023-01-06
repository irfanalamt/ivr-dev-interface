import {
  Box,
  Button,
  Divider,
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
import DeleteIcon from '@mui/icons-material/Delete';
import { useRef, useState } from 'react';
import defaultParams from '../src/defaultParams';
import DrawerName from './DrawerName';
import DrawerTop from './DrawerTop';
import SaveIcon from '@mui/icons-material/Save';
import { useEffect } from 'react';

const SetParams = ({
  shape,
  handleCloseDrawer,
  stageGroup,
  clearAndDraw,
  childRef,
}) => {
  const [shapeName, setShapeName] = useState(shape.text);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  const [selectedParameterIndex, setSelectedParameterIndex] = useState(0);
  const [selectedParameter, setSelectedParameter] = useState(defaultParams[0]);
  const [modifiedParameters, setModifiedParameters] = useState(
    shape.userValues?.params ?? {}
  );

  const drawerNameRef = useRef({});

  useEffect(() => {
    console.log('setParams:', selectedParameter);
    console.log('modifiedParameters:', modifiedParameters);
  }, [selectedParameter, modifiedParameters]);

  const saveUserValues = () => {
    // validate current shapeName user entered with th validation function in a child component
    const isNameError = drawerNameRef.current.handleNameValidation(shapeName);

    if (isNameError) {
      setErrorText(isNameError);
      return;
    }

    if (errorText !== '') {
      setErrorText('Save failed');
      return;
    }

    setSuccessText('Save successful');
    setTimeout(() => setSuccessText(''), 3000);

    shape.setText(shapeName || `setParams${shape.id}`);
    clearAndDraw();
    shape.setUserValues({
      params: modifiedParameters,
    });

    // generateJS();
  };

  const getCurrentUserValues = () => {
    return JSON.stringify({
      name: shapeName,
      userValues: { params: modifiedParameters },
    });
  };
  childRef.getCurrentUserValues = getCurrentUserValues;

  const handleSelectedParameterChange = (e) => {
    const { value } = e.target;

    setSelectedParameterIndex(value);

    if (modifiedParameters[defaultParams[value].name]) {
      // if parameter is present in the modifiedParameters, use that value
      const modifiedParam = { ...defaultParams[value] };
      modifiedParam.value = modifiedParameters[defaultParams[value].name].value;
      setSelectedParameter(modifiedParam);
      return;
    }
    setSelectedParameter(defaultParams[value]);
  };

  const handleFieldChange = (e) => {
    setSelectedParameter({ ...selectedParameter, value: e.target.value });
  };

  const handleSwitchChange = (e) => {
    setSelectedParameter({ ...selectedParameter, value: e.target.checked });
  };

  const handleUpdateParameter = () => {
    const newModifiedParameters = { ...modifiedParameters };
    newModifiedParameters[selectedParameter.name] = selectedParameter;
    setModifiedParameters(newModifiedParameters);
    shape.setUserValues({
      params: newModifiedParameters,
    });
    setSuccessText('parameter updated');
    setTimeout(() => {
      setSuccessText('');
    }, 2000);
  };

  const handleDeleteParameter = (parameterName) => {
    setModifiedParameters((p) => {
      const temp = { ...p };
      delete temp[parameterName];
      return temp;
    });
  };

  return (
    <List sx={{ minWidth: 350 }}>
      <DrawerTop
        saveUserValues={saveUserValues}
        shape={shape}
        handleCloseDrawer={handleCloseDrawer}
        backgroundColor='#f8bbd0'
        blockName='Set Params'
      />
      <DrawerName
        shapeName={shapeName}
        setShapeName={setShapeName}
        stageGroup={stageGroup}
        errorText={errorText}
        setErrorText={setErrorText}
        successText={successText}
        drawerNameRef={drawerNameRef}
        shapeId={shape.id}
      />
      <Divider />
      <ListItem sx={{ mt: 2 }}>
        <InputLabel id='select-label'>parameter list</InputLabel>
        <Select
          sx={{ ml: 2 }}
          labelId='select-label'
          size='small'
          value={selectedParameterIndex}
          onChange={handleSelectedParameterChange}
        >
          {defaultParams.map((p, i) => (
            <MenuItem value={i} key={i}>
              {p.name}
            </MenuItem>
          ))}
        </Select>
      </ListItem>
      <ListItem
        sx={{ mt: 2, justifyContent: 'center' }}
        id='paramter-view-area'
      >
        <Typography variant='body1'>{selectedParameter.name}:</Typography>
        {selectedParameter.type === 'select' && (
          <Select
            sx={{ ml: 2 }}
            size='small'
            value={selectedParameter.value}
            onChange={handleFieldChange}
          >
            {selectedParameter.optionList?.map((p, i) => (
              <MenuItem value={p} key={i}>
                {p}
              </MenuItem>
            ))}
          </Select>
        )}
        {!selectedParameter.type && (
          <TextField
            sx={{ ml: 2, width: 150 }}
            size='small'
            name='name'
            value={selectedParameter.value}
            onChange={handleFieldChange}
          />
        )}
        {selectedParameter.type === 'switch' && (
          <Switch
            sx={{ ml: 2 }}
            checked={selectedParameter.value}
            onChange={handleSwitchChange}
          />
        )}
        <Tooltip title='update parameter' placement='top-end'>
          <Button sx={{ ml: 2 }} onClick={handleUpdateParameter}>
            <SaveIcon sx={{ fontSize: '1.3rem', color: '#424242' }} />
          </Button>
        </Tooltip>
      </ListItem>
      <Divider sx={{ my: 1 }} />
      <List>
        {Object.values(modifiedParameters).map((p, i) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              my: 0.5,
              backgroundColor: '#f5f5f5',
              pr: 4,
              alignItems: 'center',
            }}
            key={i}
          >
            <Typography sx={{ ml: 4, fontSize: '1rem' }} variant='subtitle2'>
              {p.name}:
            </Typography>
            <Typography sx={{ ml: 1, fontSize: '1rem' }}>
              {p.value}
              {typeof p.value === 'boolean' && `${p.value}`}
            </Typography>
            <Button
              sx={{ ml: 'auto', mr: -3 }}
              onClick={() => {
                handleDeleteParameter(p.name);
              }}
            >
              <DeleteIcon sx={{ fontSize: '1.3rem', color: '#424242' }} />
            </Button>
          </Box>
        ))}
      </List>
    </List>
  );
};

export default SetParams;
