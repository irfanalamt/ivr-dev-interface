import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
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
const FunctionBlock = ({ shape, handleCloseDrawer }) => {
  const [shapeName, setShapeName] = useState(shape.text);

  function saveUserValues() {
    shape.setText(shapeName);
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
      </List>
    </>
  );
};

export default FunctionBlock;
