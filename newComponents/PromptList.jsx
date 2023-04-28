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
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {useEffect, useState} from 'react';
const {parse} = require('json2csv');

const PromptList = ({isOpen, handleClose, shapes}) => {
  const [promptArray, setPromptArray] = useState(null);
  const [showUsedIn, setShowUsedIn] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    fetchAllPrompts();
  }, []);

  useEffect(() => {
    if (errorText !== '') {
      const timer = setTimeout(() => {
        setErrorText('');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [errorText]);

  function fetchAllPrompts() {
    const prompts = [];

    shapes.forEach((shape) => {
      if (shape.type === 'playMenu') {
        collectMenuPrompts(shape, prompts);
      } else if (isPromptRelevantShape(shape)) {
        collectMessageListPrompts(shape, prompts);
      }
    });

    setPromptArray(prompts);
  }

  function isPromptRelevantShape(shape) {
    return ['playMessage', 'playConfirm', 'getDigits'].includes(shape.type);
  }

  function collectMenuPrompts(shape, prompts) {
    const itemsWithPrompts = shape.userValues?.items.filter(
      (item) => item.prompt
    );

    itemsWithPrompts?.forEach((item) => {
      updateOrAddPrompt(item.prompt, shape.text, prompts);
    });
  }

  function collectMessageListPrompts(shape, prompts) {
    const filteredPrompts = shape.userValues?.messageList.filter(
      (message) => message.type === 'Prompt'
    );

    filteredPrompts?.forEach((prompt) => {
      updateOrAddPrompt(prompt.item, shape.text, prompts);
    });
  }

  function updateOrAddPrompt(promptText, shapeText, prompts) {
    const promptIndex = prompts.findIndex((p) => p.prompt === promptText);
    if (promptIndex >= 0) {
      prompts[promptIndex].usedIn += `, ${shapeText}`;
    } else {
      prompts.push({prompt: promptText, usedIn: shapeText});
    }
  }

  function handleDescriptionChange(e, index) {
    const {value} = e.target;

    setPromptArray((p) => {
      const temp = [...p];
      temp[index].description = value;
      return temp;
    });
  }

  function generateCSV(headings, data) {
    const csvContent = parse(data, {fields: headings});
    const csvFilename = 'promptList.csv';
    const csvBlob = new Blob([csvContent], {type: 'text/csv'});

    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(csvBlob);
    downloadLink.download = csvFilename;
    downloadLink.click();
  }

  function handleDownloadCSV() {
    if (promptArray?.length === 0) {
      setErrorText('Cannot generate CSV.');
      return;
    }
    setErrorText('');

    const formattedPrompts = promptArray.map((prompt, index) => ({
      SlNo: index + 1,
      PromptName: prompt.prompt,
      Description: prompt.description,
    }));

    generateCSV(['SlNo', 'PromptName', 'Description'], formattedPrompts);
  }

  return (
    <Drawer anchor='left' open={isOpen} onClose={handleClose}>
      <ListItem
        sx={{
          backgroundColor: '#cfd8dc',
          boxShadow: 2,
          minWidth: '45vw',
          p: 1,
        }}
        disablePadding>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 'auto',
            fontSize: 'extra-large',
            height: 40,
            ml: 1,
          }}
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
        <Tooltip title='Download CSV'>
          <IconButton
            onClick={handleDownloadCSV}
            sx={{
              ml: 'auto',
              backgroundColor: '#263238',
              color: 'white',
              '&:hover': {backgroundColor: '#66bb6a'},
              height: 30,
              width: 30,
            }}>
            <FileDownloadIcon sx={{fontSize: '22px'}} />
          </IconButton>
        </Tooltip>
        <IconButton
          onClick={handleClose}
          sx={{
            ml: 1,
            backgroundColor: '#263238',
            color: 'white',
            '&:hover': {backgroundColor: '#ef5350'},
            height: 30,
            width: 30,
          }}>
          <CloseIcon sx={{fontSize: '22px'}} />
        </IconButton>
      </ListItem>

      <Box sx={{backgroundColor: '#eeeeee', height: '100%', p: 2}}>
        {errorText && (
          <Typography
            textAlign='center'
            variant='body1'
            color='error'
            gutterBottom>
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
                    sx={{width: '50%', fontWeight: 'bold'}}>
                    Prompt Name
                  </TableCell>
                  <TableCell sx={{fontWeight: 'bold'}}>Description</TableCell>
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
