import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import InfoIcon from '@mui/icons-material/Info';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import {
  Alert,
  BottomNavigation,
  Box,
  Button,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';

const BottomBar = ({resetSelectedItemToolbar, openVariableManager}) => {
  function handleClick() {
    console.log('bottomBar clicked.');
    resetSelectedItemToolbar();
  }

  function handleVariableMangerClick() {
    console.log('variable manger clicked.');
    openVariableManager();
  }

  return (
    <Box
      style={{
        height: 35,
        backgroundColor: '#CCCCCC',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
      onClick={handleClick}>
      {/* <Tooltip title='variables' arrow>
        <Button>
          <SettingsApplicationsIcon sx={{ml: 2}} />
        </Button>
      </Tooltip>
      <Tooltip title='prompt list' arrow>
        <Button>
          <ListAltIcon sx={{ml: 2}} />
        </Button>
      </Tooltip>

      <Tooltip title='module manager' arrow>
        <Button>
          <ViewModuleIcon sx={{ml: 2}} />
        </Button>
      </Tooltip> */}

      {/* <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#b3e5fc',
          borderRadius: 2,
          ml: 2,
          px: 1,
        }}
        variant='subtitle2'>
        <InfoIcon sx={{mr: 0.5, color: '#ef5350'}} />
        infoMessage.current
      </Typography> */}
      <Tooltip title='VARIABLE MANAGER' arrow>
        <IconButton
          onClick={handleVariableMangerClick}
          sx={{
            ml: '90px',
            backgroundColor: '#5DA5DA',
            '&:hover': {
              backgroundColor: '#82CFFD',
            },
          }}>
          <img
            src='/icons/variableManager.png'
            alt='Icon'
            height={'16px'}
            width={'16px'}
          />
        </IconButton>
      </Tooltip>
      <Box sx={{ml: 'auto', display: 'flex', alignItems: 'center'}}>
        <Pagination
          count={2}
          shape='rounded'
          hideNextButton={true}
          hidePrevButton={true}
        />
        <Tooltip title='Add Page'>
          <IconButton>
            <AddBoxIcon sx={{fontSize: 'large'}} />
          </IconButton>
        </Tooltip>
        <Tooltip title='Remove Page'>
          <IconButton>
            <IndeterminateCheckBoxIcon sx={{fontSize: 'large'}} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default BottomBar;
