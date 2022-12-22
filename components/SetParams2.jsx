import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import defaultParams from '../src/defaultParams';
import { getArrayFromRange } from '../src/helpers';
import DrawerTop from './DrawerTop';
defaultParams;

const SetParams = ({ shape, handleCloseDrawer, stageGroup, clearAndDraw }) => {
  const [shapeName, setShapeName] = useState(shape.text);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const paramList = shape.userValues?.params ?? defaultParams;
  const [currentParam, setCurrentParam] = useState(
    paramList[selectedIndex] ?? ''
  );

  function saveUserValues() {
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
        backgroundColor='#e91e63'
        blockName='Set Params'
      />
      <ListItem sx={{ mt: 4 }}>
        <Typography
          sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
          variant='body1'
        >
          Name
        </Typography>
        <TextField
          sx={{ ml: 2, width: 180 }}
          size='small'
          value={shapeName}
          onChange={(e) => {
            setShapeName(e.target.value);
          }}
        />
      </ListItem>
      <Divider sx={{ mt: 4 }} />
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
      </ListItem>
    </List>
  );
};

export default SetParams;
