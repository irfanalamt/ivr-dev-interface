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
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';

const BottomBar = ({resetSelectedItemToolbar}) => {
  function handleClick() {
    console.log('bottomBar clicked.');
    resetSelectedItemToolbar();
  }

  return (
    <Box
      style={{
        height: 35,
        backgroundColor: '#cfd8dc',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
      onClick={handleClick}>
      <Tooltip title='variables' arrow>
        <SettingsApplicationsIcon sx={{ml: 2}} />
      </Tooltip>
      <Tooltip title='prompt list' arrow>
        <ListAltIcon sx={{ml: 2}} />
      </Tooltip>

      <Tooltip title='module manager' arrow>
        <ViewModuleIcon sx={{ml: 2}} />
      </Tooltip>

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
