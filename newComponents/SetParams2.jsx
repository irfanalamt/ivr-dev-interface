import {
  Box,
  Button,
  Divider,
  Drawer,
  FormLabel,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import defaultParams from '../src/defaultParams';
import {useState} from 'react';

const SetParams = ({shape, handleCloseDrawer, shapes, clearAndDraw}) => {
  const [parameter, setParameter] = useState(defaultParams[0]);

  return (
    <>
      <Box
        sx={{backgroundColor: '#f5f5f5', boxShadow: 1, display: 'flex', p: 1}}>
        <Typography sx={{display: 'flex', alignItems: 'center'}} variant='h5'>
          {
            <img
              src='/icons/setParamsBlack.png'
              alt='Icon'
              height={'22px'}
              width={'22px'}
            />
          }
          &nbsp; Set Params
        </Typography>
        <Tooltip placement='left' title='CLOSE'>
          <IconButton
            onClick={handleCloseDrawer}
            sx={{
              ml: 'auto',
              backgroundColor: '#dcdcdc',
              color: 'black',
              '&:hover': {backgroundColor: '#ffcdd2'},
            }}>
            <CloseIcon sx={{fontSize: '22px'}} />
          </IconButton>
        </Tooltip>
      </Box>
      <List sx={{minWidth: 350}}>
        <ListItem sx={{mt: 1}}>
          <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Typography fontSize='large' variant='subtitle2'>
              ID
            </Typography>
            <TextField size='small' />
          </Box>
        </ListItem>
        <Divider sx={{my: 2}} />
        <ListItem>
          <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Typography fontSize='large' variant='subtitle1'>
              parameters
            </Typography>
            <Select
              value={parameter}
              onChange={(e) => setParameter(e.target.value)}
              labelId='paramteter-label'
              sx={{minWidth: 150}}
              size='small'>
              {defaultParams.map((p, i) => (
                <MenuItem value={p} key={i}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </ListItem>
        <ListItem sx={{backgroundColor: '#f7f8f9', mt: 1}}>
          <Box sx={{display: 'flex', flexDirection: 'column', py: 2}}>
            {parameter.name && (
              <>
                <Typography variant='body1'>{parameter.name}</Typography>
                <ListItem>
                  {parameter.type === 'select' && (
                    <Select size='small' value={parameter.value}>
                      {parameter.optionList?.map((p, i) => (
                        <MenuItem value={p} key={i}>
                          {p}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  {!parameter.type && (
                    <TextField
                      sx={{width: 150}}
                      size='small'
                      name='name'
                      value={parameter.value}
                    />
                  )}
                  {parameter.type === 'switch' && (
                    <Switch checked={parameter.value} />
                  )}
                  <Tooltip title='update' placement='right'>
                    <Button sx={{ml: 2}} size='small' variant='contained'>
                      <SaveIcon />
                    </Button>
                  </Tooltip>
                </ListItem>
              </>
            )}
          </Box>
        </ListItem>
      </List>
    </>
  );
};

export default SetParams;
