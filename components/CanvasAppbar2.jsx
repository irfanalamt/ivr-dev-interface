import ArchitectureIcon from '@mui/icons-material/Architecture';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

const CanvasAppbar2 = ({
  resetSelectedItemToolbar,
  handleGenerateConfigFile,
  ivrName,
  saveToDb,
}) => {
  function handleClick() {
    console.log('appBar clicked.');
    resetSelectedItemToolbar();
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
          size='small'>
          <HelpCenterIcon sx={{color: 'black', fontSize: 'large'}} />
        </IconButton>
      </Tooltip>
      <Box
        sx={{
          ml: 'auto',
          display: 'flex',
          alignItems: 'center',
        }}>
        <Typography sx={{mr: 3, color: 'black'}} variant='subtitle1'>
          {ivrName.name}
          {ivrName.name && `_${ivrName.version}`}
        </Typography>
        <Tooltip title='SAVE'>
          <IconButton
            sx={{
              mr: 1,
              backgroundColor: '#dcdcdc',
              color: 'black',
              '&:hover': {backgroundColor: '#81c784'},
            }}
            onClick={saveToDb}
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
            variant='contained'>
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
            variant='contained'>
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
      </Box>
    </AppBar>
  );
};

export default CanvasAppbar2;
