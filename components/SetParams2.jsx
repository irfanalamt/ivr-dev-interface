import {
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
import { useRef, useState } from 'react';
import defaultParams from '../src/defaultParams';
import DrawerName from './DrawerName';
import DrawerTop from './DrawerTop';
import SaveIcon from '@mui/icons-material/Save';

const SetParams = ({
  shape,
  handleCloseDrawer,
  stageGroup,
  clearAndDraw,
  childRef,
}) => {
  const [shapeName, setShapeName] = useState(shape.text);
  const [errorText, setErrorText] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const paramList = shape.userValues?.params ?? defaultParams;
  const [currentParam, setCurrentParam] = useState(
    paramList[selectedIndex] ?? ''
  );
  const [successText, setSuccessText] = useState('');

  const drawerNameRef = useRef({});

  function saveUserValues() {
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
    const newParamList = [...paramList];
    newParamList[selectedIndex] = currentParam;
    shape.setUserValues({
      params: newParamList,
    });
    // shape.setUserValues({
    //   params: menuObj,
    //   paramSelectedList,
    // });
    // generateJS();
  }

  const getCurrentUserValues = () => {
    const newParamList = [...paramList];
    newParamList[selectedIndex] = currentParam;
    return JSON.stringify({
      name: shapeName,
      userValues: { params: newParamList },
    });
  };
  childRef.getCurrentUserValues = getCurrentUserValues;

  const handleParamChange = (e) => {
    const { value } = e.target;

    setCurrentParam((p) => ({
      ...p,
      value: value,
    }));
  };

  const handleParamChangeSwitch = (e) => {
    const { checked } = e.target;

    setCurrentParam((p) => ({
      ...p,
      value: checked,
    }));
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
      <ListItem sx={{ mt: 4 }}>
        <InputLabel id='select-label'>parameter list</InputLabel>
        <Select
          sx={{ ml: 2, minWidth: '50%' }}
          labelId='select-label'
          size='small'
          value={selectedIndex}
          onChange={(e) => {
            setSelectedIndex(e.target.value);
            setCurrentParam(paramList[e.target.value]);
          }}
        >
          {paramList.map((v, i) => (
            <MenuItem value={i} key={i}>
              {v.name}
            </MenuItem>
          ))}
        </Select>
      </ListItem>
      <ListItem
        sx={{ mt: 4, justifyContent: 'center' }}
        id='paramter-view-area'
      >
        <Typography variant='body1'>{currentParam.name}:</Typography>
        {currentParam.type === 'select' && (
          <Select
            sx={{ ml: 2 }}
            size='small'
            value={currentParam.value}
            onChange={handleParamChange}
          >
            {currentParam.optionList?.map((p, i) => (
              <MenuItem value={p} key={i}>
                {p}
              </MenuItem>
            ))}
          </Select>
        )}
        {!currentParam.type && (
          <TextField
            sx={{ ml: 2, width: '45%' }}
            size='small'
            name='name'
            value={currentParam.value}
            onChange={handleParamChange}
          />
        )}
        {currentParam.type === 'switch' && (
          <Switch
            sx={{ ml: 2 }}
            checked={currentParam.value}
            onChange={handleParamChangeSwitch}
          />
        )}
        <Tooltip title='update parameter' placement='top-end'>
          <Button sx={{ ml: 2 }} onClick={saveUserValues}>
            <SaveIcon sx={{ fontSize: '1.3rem', color: '#424242' }} />
          </Button>
        </Tooltip>
      </ListItem>
    </List>
  );
};

export default SetParams;
