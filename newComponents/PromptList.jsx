import {
  Box,
  Button,
  Drawer,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {useState} from 'react';

const PromptList = ({isOpen, handleClose}) => {
  return (
    <Drawer anchor='left' open={isOpen} onClose={handleClose}>
      <List sx={{minWidth: 400}}>
        <ListItem>
          <IconButton
            onClick={handleClose}
            sx={{
              ml: 'auto',
              backgroundColor: '#dcdcdc',
              color: 'black',
              '&:hover': {backgroundColor: '#ffcdd2'},
            }}>
            <CloseIcon sx={{fontSize: '22px'}} />
          </IconButton>
        </ListItem>
        <ListItem>
          <Typography
            sx={{mt: 1, display: 'flex', alignItems: 'center', mx: 'auto'}}
            variant='h5'>
            {
              <img
                src='/icons/promptList.png'
                alt='Icon'
                height={'22px'}
                width={'22px'}
              />
            }
            &nbsp; PROMPT LIST
          </Typography>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default PromptList;
