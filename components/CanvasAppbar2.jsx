import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
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
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  function handleClick() {
    console.log('appBar clicked.');
    resetSelectedItemToolbar();
  }

  function handleReset() {
    sessionStorage.removeItem('ivrName');
    location.reload();
  }

  return (
    <AppBar
      style={{
        height: 50,
        backgroundColor: '#FAFAFA',
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onClick={handleClick}>
      <Tooltip title='GUIDE'>
        <IconButton
          sx={{
            ml: 2,
            backgroundColor: '#dcdcdc',
            '&:hover': {backgroundColor: '#80cbc4'},
          }}
          aria-label='user-guide'
          size='small'
          onClick={openUserGuide}>
          <HelpCenterIcon sx={{color: 'black', fontSize: 'large'}} />
        </IconButton>
      </Tooltip>
      <Typography
        sx={{ml: 4, color: 'black'}}
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
              mx: 1,
            }}
            size='small'
            variant='contained'
            onClick={handleGenerateConfigFile}>
            <SaveAltIcon sx={{fontSize: 'large'}} />
          </Button>
        </Tooltip>
        {user ? (
          <>
            <Typography sx={{ml: 'auto', ml: 2, color: 'black'}}>
              {user.name}
            </Typography>
            <AccountCircleIcon sx={{color: '#666666', mx: 1}} />
          </>
        ) : (
          <Typography
            sx={{
              ml: 'auto',
              mx: 1,
              fontWeight: 'bold',
              color: 'black',
            }}
            variant='subtitle2'>
            Guest 🟢
          </Typography>
        )}
      </Box>
      <ResetWorkspaceDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleReset}
      />
    </AppBar>
  );
};

export default CanvasAppbar2;
