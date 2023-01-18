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
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
} from '@mui/material';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { useEffect, useState } from 'react';

const PromptList = ({
  open,
  handleClose,
  stageGroup,
  promptDescriptionObj,
}) => {
  const [promptArray, setPromptArray] = useState(null);
  const [showUsedIn, setShowUsedIn] = useState(false);

  useEffect(() => {
    getPromptArray();
  }, []);

  function handleDescriptionChange(e, index) {
    const { value } = e.target;

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
      allPrompts.push({ prompt, usedIn: [usedIn] });
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

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minWidth: 400,
          mt: 1,
        }}
      >
        <Typography
          sx={{
            backgroundColor: '#b0bec5',
            px: 2,
            boxShadow: 1,
            width: 'max-content',
          }}
          variant='h6'
        >
          Prompt List
        </Typography>
        <Box>
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
                '&:hover': { backgroundColor: '#81c784' },
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
                '&:hover': { backgroundColor: '#e57373' },
              }}
              onClick={handleClose}
            >
              <CloseRoundedIcon sx={{ fontSize: 21 }} />
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {promptArray?.length > 0 ? (
        <>
          <FormControlLabel
            sx={{ ml: 'auto', mt: 2, mr: 2, mb: 1 }}
            control={
              <Switch
                checked={showUsedIn}
                onClick={() => setShowUsedIn(!showUsedIn)}
                size='small'
              />
            }
            label={showUsedIn ? 'Hide UsedIn' : 'Show UsedIn'}
          />{' '}
          <TableContainer sx={{ backgroundColor: '#fafafa' }} component={Paper}>
            <Table sx={{ minWidth: 600 }} aria-label='promptList-table'>
              <TableHead>
                <TableRow>
                  <TableCell align='center' sx={{ width: '20%' }}>
                    PromptName
                  </TableCell>
                  <TableCell sx={{ width: '40%' }}>Description</TableCell>
                  {showUsedIn && <TableCell>UsedIn</TableCell>}
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
                        sx={{ width: 200 }}
                        size='small'
                        multiline
                      />
                    </TableCell>
                    {showUsedIn && (
                      <TableCell>{row.usedIn.join(', ')}</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography sx={{ mx: 'auto', my: 4 }} variant='body1'>
          No prompts added
        </Typography>
      )}

      {/* {promptArray?.length > 0 ? (
        <Stack sx={{ my: 2, pl: 2 }} spacing={1}>
          <Box sx={{ display: 'flex', mb: 2 }}>
            <Box sx={{ width: '40%' }}>
              <Typography
                sx={{
                  width: 'max-content',
                  px: 1,
                  fontSize: 'medium',
                  backgroundColor: '#eceff1',
                }}
                variant='h6'
              >
                prompt name
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: 'medium',
                width: 'max-content',
                px: 1,
                backgroundColor: '#eceff1',
              }}
              variant='h6'
            >
              description
            </Typography>
          </Box>
          {promptArray?.map((p, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: '40%', ml: 1 }} variant='body1'>
                {p.prompt}
              </Typography>
              <TextField sx={{ width: 200 }} size='small' multiline />
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography sx={{ mx: 'auto', my: 4 }} variant='body1'>
          No prompts added
        </Typography>
      )} */}
    </Dialog>
  );
};

export default PromptList;
