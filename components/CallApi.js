import {
  Button,
  List,
  ListItem,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { useState } from 'react';

const CallApi = ({ shape, handleCloseDrawer, userVariables }) => {
  const [inputVars, setInputVars] = useState([]);
  function handleInputVarChange(e) {
    console.log(e.target.value);
  }

  return (
    <>
      {console.log(userVariables)}
      <List sx={{ minWidth: 300 }}>
        <ListItem>
          {console.log(userVariables)}
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
              backgroundColor: '#2196f3',
              borderRadius: 1,
            }}
            variant='h6'
          >
            Call API
          </Typography>
        </ListItem>

        <ListItem>
          <Typography variant='body1'>Input Variables:</Typography>
          <Select value={inputVars} multiple onChange={handleInputVarChange}>
            {userVariables.map((el, i) => {
              return (
                <MenuItem key={i} value={el.name}>
                  {el.name}
                </MenuItem>
              );
            })}
          </Select>
        </ListItem>
      </List>
    </>
  );
};

export default CallApi;
