import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
const FunctionBlock = ({ shape, handleCloseDrawer, stageGroup }) => {
  const [shapeName, setShapeName] = useState(shape.text);
  const [nextItem, setNextItem] = useState(shape.nextItem || '');

  const menuActionList = stageGroup.shapes.filter(
    (s) =>
      s.text !== shapeName &&
      s.text !== 'playMenu' &&
      s.text !== 'playMessage' &&
      s.text !== 'function' &&
      s.text !== 'setParams' &&
      s.text !== 'getDigits' &&
      s.text !== 'callAPI'
  );
  if (menuActionList.length > 0) menuActionList.push({ text: 'null' });

  function saveUserValues() {
    shape.setText(shapeName);
    shape.setNextItem(nextItem);
    console.log('shape after save', shape);
    console.log('shapeGroup ', stageGroup);
  }

  return (
    <>
      <List>
        <ListItem>
          <Tooltip title='CLOSE'>
            <Button
              size='small'
              variant='contained'
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
              variant='contained'
              color='success'
              onClick={saveUserValues}
            >
              <SaveRoundedIcon sx={{ fontSize: 20 }} />
            </Button>
          </Tooltip>
        </ListItem>
        <ListItem>
          <Typography
            sx={{
              marginX: 'auto',
              marginY: 1,
              boxShadow: 1,
              paddingX: 3,
              paddingY: 1,
              backgroundColor: '#ff5722',
              borderRadius: 1,
            }}
            variant='h6'
          >
            Function
          </Typography>
        </ListItem>
        <ListItem sx={{ my: 2 }}>
          <Typography
            variant='button'
            sx={{ marginX: 1, fontSize: 16, width: '35%' }}
          >
            Name:
          </Typography>
          <TextField
            value={shapeName || ''}
            onChange={(e) => {
              setShapeName(e.target.value);
              // handleValidation(e, 'menuId', 'object');
            }}
            sx={{
              mx: 0.5,
            }}
            // helperText={errorObj.menuId}
            size='small'
          />
        </ListItem>
        <ListItem>
          <Typography
            sx={{ width: '35%', fontWeight: 405 }}
            variant='subtitle1'
          >
            nextItem:
          </Typography>
          {menuActionList.length > 0 ? (
            <Select
              size='small'
              value={nextItem}
              onChange={(e) => setNextItem(e.target.value)}
            >
              {menuActionList.map((el, i) => (
                <MenuItem key={i} value={el.text}>
                  <Typography
                    sx={{ display: 'inline', minWidth: '40%', mr: 1 }}
                  >
                    {el.text}
                  </Typography>
                  {el.type === 'pentagon' && (
                    <Typography
                      sx={{ color: '#e91e63', pr: 1 }}
                      variant='subtitle2'
                    >
                      [setParams]
                    </Typography>
                  )}
                  {el.type === 'rectangle' && (
                    <Typography
                      sx={{
                        color: '#ff5722',
                        pr: 1,
                      }}
                      variant='subtitle2'
                    >
                      [function]
                    </Typography>
                  )}
                  {el.type === 'hexagon' && (
                    <Typography
                      sx={{
                        color: '#009688',
                        pr: 1,
                      }}
                      variant='subtitle2'
                    >
                      [playMenu]
                    </Typography>
                  )}
                  {el.type === 'parallelogram' && (
                    <Typography
                      sx={{
                        color: '#9c27b0',
                        pr: 1,
                      }}
                      variant='subtitle2'
                    >
                      [getDigits]
                    </Typography>
                  )}
                  {el.type === 'roundedRectangle' && (
                    <Typography
                      sx={{
                        color: '#c0ca33',
                        pr: 1,
                      }}
                      variant='subtitle2'
                    >
                      [playMessage]
                    </Typography>
                  )}
                  {el.type === 'circle' && (
                    <Typography
                      sx={{
                        color: '#2196f3',
                        pr: 1,
                      }}
                      variant='subtitle2'
                    >
                      [callAPI]
                    </Typography>
                  )}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography
              sx={{ mx: 0.5, color: '#f44336', fontSize: 16 }}
              variant='h6'
            >
              No action added
            </Typography>
          )}
        </ListItem>
      </List>
    </>
  );
};

export default FunctionBlock;