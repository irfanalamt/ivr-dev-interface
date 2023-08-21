import {
  Box,
  Drawer,
  IconButton,
  ListItem,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import {useMemo, useState} from 'react';

const CallDataManager = ({
  isOpen,
  handleClose,
  callData,
  saveCallData,
  userVariables,
}) => {
  const [localCallData, setLocalCallData] = useState(callData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSnackbar, setShowSnackbar] = useState(false);

  const variableNames = useMemo(() => {
    return userVariables.map((variable) => `$${variable.name}`);
  }, [userVariables]);

  function handleValueChange(key, newValue) {
    setLocalCallData((prevData) => ({...prevData, [key]: newValue}));
  }

  function isValid(value) {
    if (value[0] == '$') {
      if (variableNames.includes(value)) {
        return true;
      } else return false;
    }

    return true;
  }

  function handleSave() {
    let errors = {};
    for (let key in localCallData) {
      if (!isValid(localCallData[key])) {
        errors[key] = 'This value is not valid.';
      }
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0) {
      saveCallData(localCallData);
      setShowSnackbar({
        message: `CallData saved successfully.`,
        type: 'success',
      });
    } else {
      setShowSnackbar({
        message: `Some fields contain invalid data. Save failed.`,
        type: 'error',
      });
    }
  }

  function handleNotificationClose() {
    setShowSnackbar(false);
  }

  function filterOptions(options, {inputValue}) {
    if (inputValue.startsWith('$')) {
      return options.filter((option) =>
        option.includes(inputValue.substring(1))
      );
    }
    return [];
  }

  return (
    <>
      <Drawer anchor='left' open={isOpen} onClose={handleClose}>
        <ListItem
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#cfd8dc',
            boxShadow: 2,
            p: 1,
          }}
          disablePadding>
          <Typography
            sx={{
              fontSize: 'extra-large',
              height: 40,
              ml: 1,
            }}
            variant='h5'>
            <img
              src='/icons/callDataManager.png'
              alt='Icon'
              height={'24px'}
              width={'24px'}
            />
            &nbsp;CallData Manager
          </Typography>
          <Box>
            <IconButton
              size='small'
              onClick={handleSave}
              sx={{
                backgroundColor: '#263238',
                color: 'white',
                '&:hover': {backgroundColor: '#66bb6a'},
                mr: 1,
              }}>
              <SaveIcon sx={{fontSize: '22px'}} />
            </IconButton>
            <IconButton
              size='small'
              onClick={handleClose}
              sx={{
                backgroundColor: '#263238',
                color: 'white',
                '&:hover': {backgroundColor: '#ef5350'},
              }}>
              <CloseIcon sx={{fontSize: '22px'}} />
            </IconButton>
          </Box>
        </ListItem>
        <Box
          id='callData'
          sx={{
            backgroundColor: '#eeeeee',
            height: '100%',
            minWidth: 400,
            overflow: 'auto',
            pb: 2,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
            },
          }}>
          <Table
            size='small'
            sx={{
              width: '100%',
              '& thead th': {
                backgroundColor: '#d6d6d6',
                color: '#333',
                fontWeight: 'bold',
                py: 1,
              },
              '& tbody tr:hover': {
                backgroundColor: '#f7f7f7',
              },
              '& tbody td': {
                paddingTop: '8px',
                paddingBottom: '8px',
              },
            }}>
            <TableHead>
              <TableRow>
                <TableCell size='small'>Key</TableCell>
                <TableCell size='small'>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(localCallData).map(([key, value], i) => (
                <TableRow key={i}>
                  <TableCell size='small'>{key}</TableCell>
                  <TableCell size='small'>
                    <Autocomplete
                      value={value}
                      options={variableNames}
                      freeSolo
                      filterOptions={filterOptions}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size='small'
                          sx={{
                            marginTop: 1,
                            marginBottom: 1,
                            backgroundColor: '#f2f2f2',
                          }}
                          error={!!fieldErrors[key]}
                          helperText={fieldErrors[key]}
                          onChange={(e) => {
                            handleValueChange(key, e.target.value);
                            setFieldErrors((prev) => ({
                              ...prev,
                              [key]: undefined,
                            }));
                          }}
                        />
                      )}
                      onInputChange={(event, newValue) => {
                        handleValueChange(key, newValue);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Drawer>

      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        sx={{mt: 5, mr: 1}}
        open={Boolean(showSnackbar)}
        autoHideDuration={5000}
        onClose={handleNotificationClose}>
        <Alert
          sx={{minWidth: '200px', display: 'flex', alignItems: 'center'}}
          severity={showSnackbar.type}>
          <Typography variant='body1' style={{fontSize: '1.1rem'}}>
            {showSnackbar.message}
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default CallDataManager;
