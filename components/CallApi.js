import { Button, ListItem, Tooltip, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

const CallApi = ({ shape, handleCloseDrawer, userVariables }) => {
  return (
    <>
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
      <Typography
        sx={{
          marginX: 'auto',
          marginY: 1,
          boxShadow: 1,
          paddingX: 3,
          paddingY: 1,
          backgroundColor: '#f0f4c3',
          borderRadius: 1,
        }}
        variant='h6'
      >
        Call Api
      </Typography>
    </>
  );
};

export default CallApi;
