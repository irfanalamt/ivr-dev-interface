import {
  Box,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Drawer,
  List,
  ListItem,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useEffect, useState} from 'react';

const PromptList = ({isOpen, handleClose, shapes}) => {
  const [promptArray, setPromptArray] = useState(null);
  const [showUsedIn, setShowUsedIn] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    getAllPrompts();
  }, []);

  function getAllPrompts() {
    const allPrompts = [];

    shapes.forEach((shape) => {
      if (shape.type === 'playMenu') {
        addMenuPrompts(shape, allPrompts);
      } else if (
        ['playMessage', 'playConfirm', 'getDigits'].includes(shape.type)
      ) {
        addMessageListPrompts(shape, allPrompts);
      }
    });

    setPromptArray(allPrompts);
  }

  function addMenuPrompts(shape, allPrompts) {
    const itemsWithPrompts = shape.userValues?.items.filter(
      (item) => item.prompt
    );

    itemsWithPrompts?.forEach((item) => {
      const promptIndex = allPrompts.findIndex((p) => p.prompt === item.prompt);
      if (promptIndex >= 0) {
        allPrompts[promptIndex].usedIn += `, ${shape.text}`;
      } else {
        allPrompts.push({prompt: item.prompt, usedIn: shape.text});
      }
    });
  }

  function addMessageListPrompts(shape, allPrompts) {
    const prompts = shape.userValues?.messageList.filter(
      (message) => message.type === 'Prompt'
    );

    prompts?.forEach((prompt) => {
      const promptIndex = allPrompts.findIndex((p) => p.prompt === prompt.item);
      if (promptIndex >= 0) {
        allPrompts[promptIndex].usedIn += `, ${shape.text}`;
      } else {
        allPrompts.push({prompt: prompt.item, usedIn: shape.text});
      }
    });
  }

  function handleDescriptionChange(e, index) {
    const {value} = e.target;

    setPromptArray((p) => {
      const temp = [...p];
      temp[index].description = value;
      return temp;
    });
  }

  return (
    <Drawer anchor='left' open={isOpen} onClose={handleClose}>
      <List sx={{backgroundColor: '#cfd8dc', boxShadow: 2, minWidth: 400}}>
        <ListItem disablePadding>
          <IconButton
            onClick={handleClose}
            sx={{
              ml: 'auto',
              backgroundColor: '#263238',
              color: 'white',
              '&:hover': {backgroundColor: '#ef5350'},
              height: 30,
              width: 30,
              mr: 1,
            }}>
            <CloseIcon sx={{fontSize: '22px'}} />
          </IconButton>
        </ListItem>
        <ListItem disablePadding>
          <Typography
            sx={{mb: 1, display: 'flex', alignItems: 'center', mx: 'auto'}}
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
      <Box sx={{backgroundColor: '#eeeeee', height: '100%', p: 2}}>
        {errorText && (
          <Typography variant='body1' color='error' gutterBottom>
            {errorText}
          </Typography>
        )}
        {promptArray?.length > 0 ? (
          <>
            <ListItem>
              <FormControlLabel
                sx={{ml: 'auto', mr: 1}}
                control={
                  <Switch
                    checked={showUsedIn}
                    onClick={() => setShowUsedIn(!showUsedIn)}
                    color='primary'
                    size='small'
                  />
                }
                label={showUsedIn ? 'Hide UsedIn' : 'Show UsedIn'}
              />
            </ListItem>
            <Table sx={{backgroundColor: '#fafafa'}}>
              <TableHead>
                <TableRow>
                  <TableCell
                    align='center'
                    sx={{width: '20%', fontWeight: 'bold'}}>
                    Prompt Name
                  </TableCell>
                  <TableCell sx={{width: '40%', fontWeight: 'bold'}}>
                    Description
                  </TableCell>
                  {showUsedIn && (
                    <TableCell sx={{fontWeight: 'bold'}}>Used In</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {promptArray?.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell align='center'>{row.prompt}</TableCell>
                    <TableCell>
                      <TextField
                        value={row.description}
                        onChange={(e) => handleDescriptionChange(e, i)}
                        size='small'
                        multiline
                        variant='standard'
                        InputProps={{
                          disableUnderline: true,
                          spellCheck: false,
                          sx: {backgroundColor: '#fcfcfc'},
                        }}
                        fullWidth
                      />
                    </TableCell>
                    {showUsedIn && (
                      <TableCell>
                        <Typography variant='body2'>{row.usedIn}</Typography>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <Typography
            variant='body1'
            align='center'
            fontSize='large'
            sx={{my: 5}}>
            No prompts added
          </Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default PromptList;
