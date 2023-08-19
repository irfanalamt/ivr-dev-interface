import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import {
  AppBar,
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import {useRouter} from 'next/router';
import {useState} from 'react';
import ResetWorkspaceDialog from './ResetWorkspaceDialog';

const CanvasAppbar2 = ({
  resetSelectedItemToolbar,
  handleGenerateConfigFile,
  ivrName,
  saveToDb,
  openIvrDialog,
  user,
  openUserGuide,
  updateUser,
  openVariableManager,
  openPromptList,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSignOutDialog, setOpenSignOutDialog] = useState(false);

  const router = useRouter();

  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleMyProjects() {
    window.open(`/saved-projects`, '_blank');
    handleMenuClose();
  }

  function handleSignOut() {
    handleMenuClose();
    setOpenSignOutDialog(true);
  }

  function confirmSignOut() {
    setOpenSignOutDialog(false);
    localStorage.removeItem('token');
    sessionStorage.removeItem('ivrName');
    updateUser(null);
    router.push('/');
  }

  function cancelSignOut() {
    setOpenSignOutDialog(false);
  }

  function handleClick() {
    resetSelectedItemToolbar();
  }

  function handleReset() {
    sessionStorage.removeItem('ivrName');
    location.reload();
  }

  function handleLogin() {
    router.push('/');
  }

  return (
    <AppBar
      style={{
        height: 50,
        backgroundColor: '#FAFAFA',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 0,
      }}
      onClick={handleClick}>
      <Typography
        sx={{ml: 4, color: '#3C3C3C', fontWeight: 600}}
        variant='subtitle1'
        fontSize='large'>
        {ivrName.name}
        {ivrName.name && ` (${ivrName.version})`}
      </Typography>
      <Box
        sx={{
          ml: 'auto',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
        }}>
        <Tooltip title='SAVE'>
          <IconButton
            sx={{
              mr: 1,
              backgroundColor: '#dcdcdc',
              color: 'black',
              '&:hover': {backgroundColor: '#81c784'},
            }}
            onClick={() => saveToDb(true)}
            variant='contained'
            color='success'>
            <SaveIcon sx={{fontSize: 'large'}} />
          </IconButton>
        </Tooltip>
        <Tooltip title='SAVE AS'>
          <IconButton
            sx={{
              mr: 1,
              backgroundColor: '#dcdcdc',
              color: 'black',
              '&:hover': {backgroundColor: '#9575cd'},
            }}
            variant='contained'
            onClick={openIvrDialog}>
            <SaveAsIcon sx={{fontSize: 'large'}} />
          </IconButton>
        </Tooltip>
        <Tooltip title='RESET WORKSPACE'>
          <IconButton
            sx={{
              mr: 1,
              backgroundColor: '#dcdcdc',
              color: 'black',
              '&:hover': {backgroundColor: '#64b5f6'},
            }}
            variant='contained'
            onClick={() => setOpenDialog(true)}>
            <RestartAltIcon sx={{fontSize: 'large'}} />
          </IconButton>
        </Tooltip>
        <Tooltip title='GENERATE SCRIPT'>
          <Button
            sx={{
              backgroundColor: '#66bb6a',
              color: 'black',
              '&:hover': {
                backgroundColor: '#43a047',
              },
              ml: 1,
              mr: 2,
            }}
            size='small'
            variant='contained'
            onClick={handleGenerateConfigFile}>
            <SaveAltIcon sx={{fontSize: 'large'}} />
          </Button>
        </Tooltip>
        <ButtonBase sx={{height: '100%'}} onClick={handleMenuOpen}>
          <Box
            sx={{
              backgroundColor: '#E5E5E5',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              pl: 0.5,
              pr: 0,
            }}>
            {user ? (
              <>
                <IconButton edge='end'>
                  <AccountCircleIcon sx={{color: 'black'}} />
                </IconButton>
                <Typography
                  variant='subtitle1'
                  sx={{ml: 1, mr: 1.5, color: 'black'}}>
                  {user.name}
                </Typography>
              </>
            ) : (
              <Typography
                sx={{
                  ml: 2,
                  mr: 1,
                  fontWeight: 'bold',
                  color: 'black',
                }}
                variant='subtitle2'>
                Guest 🟢
              </Typography>
            )}
          </Box>
        </ButtonBase>
      </Box>
      <ResetWorkspaceDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleReset}
      />
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        disableScrollLock={true}>
        <MenuItem onClick={openVariableManager} dense>
          <ListItemIcon style={{minWidth: 'auto', marginRight: '5px'}}>
            <img
              src='/icons/variableManager.png'
              alt='icon'
              style={{width: '14px'}}
            />
          </ListItemIcon>
          <ListItemText primary='Variable Manager' />
        </MenuItem>
        <MenuItem onClick={openPromptList} dense>
          <ListItemIcon style={{minWidth: 'auto', marginRight: '7px'}}>
            <img
              src='/icons/promptList.png'
              alt='icon'
              style={{width: '14px'}}
            />
          </ListItemIcon>
          <ListItemText primary=' Prompt List' />
        </MenuItem>

        <Divider />

        <MenuItem onClick={openUserGuide} dense>
          User Guide
        </MenuItem>
        <MenuItem onClick={handleMyProjects} dense>
          My Projects
        </MenuItem>
        {user ? (
          <MenuItem onClick={handleSignOut} dense>
            Sign Out
          </MenuItem>
        ) : (
          <MenuItem
            style={{
              fontWeight: 'bold',
              backgroundColor: '#F2F3F7',
            }}
            onClick={handleLogin}
            dense>
            Log In
          </MenuItem>
        )}
      </Menu>

      <Dialog open={openSignOutDialog} onClose={cancelSignOut}>
        <DialogTitle>Confirm Sign Out</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to sign out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelSignOut}>Cancel</Button>
          <Button onClick={confirmSignOut} color='primary' autoFocus>
            Yes, Sign Out
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default CanvasAppbar2;
