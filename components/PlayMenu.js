import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
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

const PlayMenu = ({ shape, handleCloseDrawer }) => {
  return (
    <>
      <List sx={{ minWidth: 300 }}>
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
              //onClick={saveUserValues}
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
              backgroundColor: '#009688',
              borderRadius: 1,
            }}
            variant='h6'
          >
            Play Menu
          </Typography>
        </ListItem>
        <ListItem sx={{ mt: 2 }}>
          <Typography
            variant='subtitle2'
            sx={{
              marginX: 1,
              fontSize: 16,
              boxShadow: 1,
              px: 1,
              borderRadius: 0.5,
              fontWeight: 405,
            }}
          >
            menuId:
          </Typography>
          <TextField sx={{ width: 180, mx: 0.5 }} size='small' />
        </ListItem>
        <ListItem sx={{ mx: 0.5 }}>
          <Typography
            variant='subtitle2'
            sx={{
              marginX: 1,
              fontSize: 16,
              boxShadow: 1,
              px: 1,
              borderRadius: 0.5,
              fontWeight: 405,
            }}
          >
            desc:
          </Typography>
          <TextField size='small' sx={{ mx: 0.5 }} />
        </ListItem>
        <ListItem sx={{ mx: 0.5 }}>
          <Typography
            variant='subtitle2'
            sx={{
              marginX: 1,
              fontSize: 16,
              boxShadow: 1,
              px: 1,
              borderRadius: 0.5,
              fontWeight: 405,
            }}
          >
            transferPoint:
          </Typography>
          <TextField size='small' sx={{ mx: 0.5, width: 120 }} />
        </ListItem>
        <ListItem sx={{ mx: 0.5 }}>
          <Typography
            variant='subtitle2'
            sx={{
              marginX: 1,
              fontSize: 16,
              boxShadow: 1,
              px: 1,
              borderRadius: 0.5,
              fontWeight: 405,
            }}
          >
            invalidAction:
          </Typography>
          <Select size='small' defaultValue={''}>
            <MenuItem value=''> </MenuItem>
            <MenuItem value='disconnect'>disconnect</MenuItem>
            <MenuItem value='transfer'>transfer</MenuItem>
            <MenuItem value='function'>function</MenuItem>
          </Select>
        </ListItem>
        <ListItem sx={{ mx: 0.5 }}>
          <Typography
            variant='subtitle2'
            sx={{
              marginX: 1,
              fontSize: 16,
              boxShadow: 1,
              px: 1,
              borderRadius: 0.5,
              fontWeight: 405,
            }}
          >
            invalidTransferPoint:
          </Typography>
          <TextField size='small' sx={{ mx: 0.5, width: 120 }} />
        </ListItem>
        <ListItem sx={{ mx: 0.5 }}>
          <Typography
            variant='subtitle2'
            sx={{
              marginX: 1,
              fontSize: 16,
              boxShadow: 1,
              px: 1,
              borderRadius: 0.5,
              fontWeight: 405,
            }}
          >
            timeoutAction:
          </Typography>
          <Select size='small' defaultValue={''}>
            <MenuItem value=''> </MenuItem>
            <MenuItem value='disconnect'>disconnect</MenuItem>
            <MenuItem value='transfer'>transfer</MenuItem>
            <MenuItem value='function'>function</MenuItem>
          </Select>
        </ListItem>
        <ListItem sx={{ mx: 0.5 }}>
          <Typography
            variant='subtitle2'
            sx={{
              marginX: 1,
              fontSize: 16,
              boxShadow: 1,
              px: 1,
              borderRadius: 0.5,
              fontWeight: 405,
            }}
          >
            timeoutTransferPoint:
          </Typography>
          <TextField size='small' sx={{ mx: 0.5, width: 120 }} />
        </ListItem>
        <ListItem sx={{ mx: 0.5 }}>
          <Typography
            variant='subtitle2'
            sx={{
              marginX: 1,
              fontSize: 16,
              boxShadow: 1,
              px: 1,
              borderRadius: 0.5,
              fontWeight: 405,
            }}
          >
            invalidPrompt:
          </Typography>
          <TextField sx={{ width: 180, mx: 0.5 }} size='small' />
        </ListItem>
        <ListItem sx={{ mx: 0.5 }}>
          <Typography
            variant='subtitle2'
            sx={{
              marginX: 1,
              fontSize: 16,
              boxShadow: 1,
              px: 1,
              borderRadius: 0.5,
              fontWeight: 405,
            }}
          >
            timeoutPrompt:
          </Typography>
          <TextField sx={{ width: 180, mx: 0.5 }} size='small' />
        </ListItem>
        <ListItem sx={{ mx: 0.5 }}>
          <Typography
            variant='subtitle2'
            sx={{
              marginX: 1,
              fontSize: 16,
              boxShadow: 1,
              px: 1,
              borderRadius: 0.5,
              fontWeight: 405,
            }}
          >
            maxRetries:
          </Typography>
          <Select size='small'>
            {
              // Array of 1..10
              [...Array(11).keys()].slice(1).map((el, i) => {
                return (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                );
              })
            }
          </Select>
        </ListItem>
        <ListItem sx={{ mx: 0.5 }}>
          <Typography
            variant='subtitle2'
            sx={{
              marginX: 1,
              fontSize: 16,
              boxShadow: 1,
              px: 1,
              borderRadius: 0.5,
              fontWeight: 405,
            }}
          >
            menuTimeout:
          </Typography>
          <Select size='small'>
            {
              // Array of 1..10
              [...Array(11).keys()].slice(1).map((el, i) => {
                return (
                  <MenuItem key={i} value={el}>
                    {el}
                  </MenuItem>
                );
              })
            }
          </Select>
        </ListItem>
        <ListItem sx={{ mx: 0.5 }}>
          <Typography
            variant='subtitle2'
            sx={{
              marginX: 1,
              fontSize: 16,
              boxShadow: 1,
              px: 1,
              borderRadius: 0.5,
              fontWeight: 405,
            }}
          >
            previousMenuId:
          </Typography>
          <TextField sx={{ width: 180, mx: 0.5 }} size='small' />
        </ListItem>
        <ListItem sx={{ mx: 0.5 }}>
          <Typography
            variant='subtitle2'
            sx={{
              marginX: 1,
              fontSize: 16,
              boxShadow: 1,
              px: 1,
              borderRadius: 0.5,
              fontWeight: 405,
            }}
          >
            ignoreBuffer:
          </Typography>
          <Switch sx={{ mx: 0.5 }}></Switch>
        </ListItem>
        <ListItem sx={{ mx: 0.5 }}>
          <Typography
            variant='subtitle2'
            sx={{
              marginX: 1,
              fontSize: 16,
              boxShadow: 1,
              px: 1,
              borderRadius: 0.5,
              fontWeight: 405,
            }}
          >
            logDb:
          </Typography>
          <Switch sx={{ mx: 0.5 }}></Switch>
        </ListItem>
      </List>
    </>
  );
};

export default PlayMenu;
