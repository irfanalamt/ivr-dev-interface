import {
  Box,
  Button,
  Dialog,
  TextField,
  Tooltip,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel
} from '@mui/material';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {useEffect, useState} from 'react';
const {parse} = require('json2csv');

const PromptList = ({open, handleClose, stageGroup, promptDescriptionObj}) => {
  const [promptArray, setPromptArray] = useState(null);
  const [showUsedIn, setShowUsedIn] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    getPromptArray();
  }, []);

  function handleDescriptionChange(e, index) {
    const {value} = e.target;

    setPromptArray((p) => {
      const temp = [...p];
      temp[index].description = value;
      return temp;
    });
  }

  function savePromptList() {
    promptDescriptionObj.current = promptArray;
  }

  function getPromptArray() {
    let allPrompts = [];

    for (const page of stageGroup) {
      const shapes = page.shapes;

      for (const shape of Object.values(shapes)) {
        if (shape.userValues?.messageList) {
          addPromptsFromMessageList(shape, allPrompts);
        } else if (shape.userValues?.items) {
          addPromptsFromMenuItems(shape, allPrompts);
        }
      }
    }

    setPromptArray(allPrompts.map(addDescriptionFromSavedPrompts));
  }

  function addPromptsFromMessageList(shape, allPrompts) {
    if (['playMessage', 'playConfirm', 'getDigits'].includes(shape.type)) {
      shape.userValues.messageList
        .filter((message) => message.type === 'prompt')
        .forEach((message) => addPrompt(message.value, shape.text, allPrompts));
    }
  }

  function addPromptsFromMenuItems(shape, allPrompts) {
    if (shape.type === 'playMenu') {
      shape.userValues.items
        .filter((item) => item.prompt)
        .forEach((item) => addPrompt(item.prompt, shape.text, allPrompts));
    }
  }

  function addPrompt(prompt, usedIn, allPrompts) {
    let promptObject = allPrompts.find((p) => p.prompt === prompt);
    if (promptObject) {
      promptObject.usedIn.push(usedIn);
    } else {
      allPrompts.push({prompt, usedIn: [usedIn]});
    }
  }

  function addDescriptionFromSavedPrompts(prompt) {
    const savedPrompt = promptDescriptionObj.current?.find(
      (p) => p.prompt === prompt.prompt
    );
    if (savedPrompt) {
      prompt.description = savedPrompt.description;
    }
    return prompt;
  }

  function generateCSV(headings, data) {
    const csv = parse(data, {fields: headings});
    const csvFilename = 'promptList.csv';
    const csvBlob = new Blob([csv], {type: 'text/csv'});

    // Generate download of generated csv file
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(csvBlob);
    link.download = csvFilename;
    link.click();
  }

  function handleDownloadCSV() {
    if (promptArray?.length === 0) {
      setErrorText('Cannot generate CSV.');
      return;
    }
    setErrorText('');

    const allPrompts = promptArray.map((prompt, i) => ({
      SlNo: i + 1,
      PromptName: prompt.prompt,
      Description: prompt.description
    }));
    generateCSV(['SlNo', 'PromptName', 'Description'], allPrompts);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minWidth: 400,
          mt: 1
        }}
      >
        <Typography
          sx={{
            backgroundColor: '#b0bec5',
            px: 2,
            boxShadow: 1,
            width: 'max-content'
          }}
          variant='h6'
        >
          Prompt List
        </Typography>
        <Box>
          <Tooltip title='Export CSV'>
            <Button
              variant='contained'
              onClick={handleDownloadCSV}
              sx={{
                height: 30,
                mr: 1,
                color: 'black',
                backgroundColor: '#dcdcdc',
                '&:hover': {backgroundColor: '#dce775'}
              }}
              size='small'
            >
              <FileDownloadIcon />
            </Button>
          </Tooltip>

          <Tooltip title='SAVE'>
            <Button
              size='small'
              variant='contained'
              onClick={savePromptList}
              sx={{
                height: 30,
                mr: 1,
                color: 'black',
                backgroundColor: '#dcdcdc',
                '&:hover': {backgroundColor: '#81c784'}
              }}
            >
              <SaveRoundedIcon />
            </Button>
          </Tooltip>

          <Tooltip title='CLOSE'>
            <Button
              size='small'
              variant='contained'
              sx={{
                height: 30,
                mr: 1,
                color: 'black',
                backgroundColor: '#dcdcdc',
                '&:hover': {backgroundColor: '#e57373'}
              }}
              onClick={handleClose}
            >
              <CloseRoundedIcon sx={{fontSize: 21}} />
            </Button>
          </Tooltip>
        </Box>
      </Box>
      <Typography sx={{mx: 'auto', mt: 2, color: 'red'}}>
        {errorText}
      </Typography>
      {promptArray?.length > 0 ? (
        <>
          <FormControlLabel
            sx={{ml: 'auto', mt: 2, mr: 2, mb: 1}}
            control={
              <Switch
                checked={showUsedIn}
                onClick={() => setShowUsedIn(!showUsedIn)}
                size='small'
              />
            }
            label={showUsedIn ? 'Hide UsedIn' : 'Show UsedIn'}
          />

          <Table
            sx={{minWidth: 600, mb: 2, backgroundColor: '#fafafa'}}
            size='small'
            aria-label='promptList-table'
          >
            <TableHead>
              <TableRow>
                <TableCell
                  align='center'
                  sx={{
                    width: '20%',
                    border: '0.5px solid #bdbdbd',
                    fontSize: 'medium'
                  }}
                >
                  PromptName
                </TableCell>
                <TableCell
                  sx={{
                    width: '40%',
                    border: '0.5px solid #bdbdbd',
                    fontSize: 'medium'
                  }}
                >
                  Description
                </TableCell>
                {showUsedIn && (
                  <TableCell
                    sx={{fontSize: 'medium', border: '0.5px solid #bdbdbd'}}
                  >
                    UsedIn
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {promptArray?.map((row, i) => (
                <TableRow key={i}>
                  <TableCell
                    sx={{borderRight: '0.5px solid #bdbdbd'}}
                    align='center'
                  >
                    <Typography variant='subtitle2'>{row.prompt}</Typography>
                  </TableCell>
                  <TableCell sx={{borderRight: '0.5px solid #bdbdbd'}}>
                    <TextField
                      value={row.description}
                      onChange={(e) => handleDescriptionChange(e, i)}
                      size='small'
                      multiline
                      variant='standard'
                      InputProps={{
                        disableUnderline: true
                      }}
                    />
                  </TableCell>
                  {showUsedIn && <TableCell>{row.usedIn.join(', ')}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <Typography sx={{mx: 'auto', my: 4}} variant='body1'>
          No prompts added
        </Typography>
      )}
    </Dialog>
  );
};

export default PromptList;
