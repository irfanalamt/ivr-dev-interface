import ArchitectureIcon from '@mui/icons-material/Architecture';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

const SavedProjects = () => {
  const router = useRouter();
  const [filenames, setFilenames] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    axios
      .get('/api/getProjects')
      .then((response) => {
        setFilenames(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  function handleFileOpen(projectName) {
    axios
      .get(`/api/getProject?fileName=${projectName}`)
      .then((response) => {
        router.push({
          pathname: '/project',
          query: {projectData: JSON.stringify(response.data)},
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (isLoading)
    return (
      <Typography
        sx={{py: 10, fontSize: 'large'}}
        variant='subtitle1'
        textAlign='center'>
        Loading...
      </Typography>
    );

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#f5f5f5',
          alignItems: 'center',
          height: 50,
          px: 3,
          boxShadow: 1,
        }}>
        <Avatar sx={{backgroundColor: '#bbdefb', mx: 1}}>
          <ArchitectureIcon sx={{fontSize: '2.5rem', color: 'black'}} />
        </Avatar>
        <Typography sx={{ml: 1}} variant='h6'>
          saved projects
        </Typography>
      </Box>
      {filenames?.length > 0 ? (
        <Box sx={{maxWidth: 360, backgroundColor: '#eceff1', mt: 2}}>
          <List>
            {filenames.map((projectName, i) => (
              <Box key={i}>
                <ListItem>
                  <ListItemText>
                    <Typography variant='button'>{projectName}</Typography>
                  </ListItemText>
                  <Tooltip title='open' placement='right'>
                    <Button
                      onClick={() => handleFileOpen(projectName)}
                      variant='standard'>
                      <FileOpenIcon />
                    </Button>
                  </Tooltip>
                </ListItem>
                {i !== filenames.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Box>
      ) : (
        <Typography
          sx={{py: 10, fontSize: 'large'}}
          variant='subtitle1'
          textAlign='center'>
          No saved projects found
        </Typography>
      )}
    </Container>
  );
};

export default SavedProjects;
