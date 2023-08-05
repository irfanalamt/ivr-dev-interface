import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {useRouter} from 'next/router';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';

const SavedProjects2 = ({user}) => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const projectRef = useRef('');

  useEffect(() => {
    fetchProjectsFromDb();
  }, []);

  function fetchProjectsFromDb() {
    const token = localStorage.getItem('token');
    axios
      .get('/api/getProjects2', {headers: {Authorization: token}})
      .then((response) => {
        const newData = modifyResponseData(response.data);
        sortAscendingByDate(newData);
        setProjects(newData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }

  function handleDeleteClick(name) {
    setDialogOpen(true);
    projectRef.current = name;
  }

  function handleDialogClose() {
    setDialogOpen(false);
    projectRef.current = '';
  }

  function handleConfirmDelete() {
    deleteProjectFromDb(projectRef.current);
    setDialogOpen(false);
  }

  function handleExportProject(name) {
    const token = localStorage.getItem('token');

    console.log('name:', name);

    axios
      .get('/api/getProject2', {
        params: {
          name,
        },
        headers: {Authorization: token},
      })
      .then((response) => {
        console.log(response.data);
        downloadObjectAsFile(response.data, name);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function downloadObjectAsFile(object, fileName) {
    const json = JSON.stringify(object, null, 2);
    const blob = new Blob([json], {type: 'application/json'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName + '.ivrf';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function deleteProjectFromDb(name) {
    const token = localStorage.getItem('token');
    console.log('name is ' + name);
    axios
      .delete('/api/deleteProject', {
        params: {name},
        headers: {Authorization: token},
      })
      .then((response) => {
        console.log(response.data);
        updateProjectsAfterDelete(name);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        projectRef.current = '';
      });
  }

  function updateProjectsAfterDelete(name) {
    const updatedProjects = projects.filter((project) => project.name !== name);
    setProjects(updatedProjects);
  }

  function modifyResponseData(data) {
    return data.map((d) => {
      const date = new Date(d.timestamp).toLocaleString();
      const {ivrName, version} = getIvrNameAndVersion(d.name);
      const displayName = `${ivrName} (${version})`;

      return {name: d.name, date, displayName, description: d.description};
    });
  }

  function sortAscendingByDate(array) {
    return array.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });
  }

  function getIvrNameAndVersion(name) {
    const parts = name.split('_');
    const version = parts.pop();
    const ivrName = parts.join('_');
    return {ivrName, version};
  }

  function handleOpenProject(name, description) {
    const {ivrName, version} = getIvrNameAndVersion(name);
    sessionStorage.setItem(
      'ivrName',
      JSON.stringify({name: ivrName, version, description})
    );
    router.push('/project');
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundImage: 'linear-gradient(45deg, #f5f5f5, #e0e0e0)',
      }}>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#f5f5f5',
          alignItems: 'center',
          height: 64,
          px: 3,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }}>
        <Avatar sx={{backgroundColor: '#bbdefb', marginRight: 1}}>
          <ArchitectureIcon sx={{fontSize: '2.5rem', color: '#424242'}} />
        </Avatar>
        <Typography
          variant='h5'
          component='div'
          sx={{
            fontFamily: 'Roboto',
            display: 'flex',
            alignItems: 'center',
            color: '#424242',
          }}>
          IVR Studio
        </Typography>
        {user ? (
          <>
            <Typography sx={{ml: 'auto', mr: 1}}>{user.name}</Typography>
            <AccountCircleIcon />
          </>
        ) : (
          <Typography
            sx={{
              ml: 'auto',
              mr: 1,
              fontWeight: 'bold',
            }}
            variant='subtitle2'>
            Guest 🟢
          </Typography>
        )}
      </Box>
      <Container sx={{mt: 4}}>
        <Typography sx={{mb: 3}} variant='h4' gutterBottom>
          Saved Projects
        </Typography>
        {loading ? (
          <Box sx={{display: 'flex', justifyContent: 'center', mt: 5}}>
            <CircularProgress />
          </Box>
        ) : projects.length === 0 ? (
          <Box sx={{mt: 5}}>
            <Typography variant='h6' align='center'>
              No projects found.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {projects.map((project, i) => (
              <Grid item key={i} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    backgroundColor: '#FAFAFA',
                    borderRadius: 2,
                    p: 1,
                    boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.05)',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0px 3px 0px rgba(0, 0, 0, 0.1)',
                    },
                  }}>
                  <CardContent sx={{flexGrow: 1}}>
                    <Typography
                      gutterBottom
                      variant='h6'
                      component='div'
                      sx={{fontWeight: 'bold'}}>
                      {project.displayName}
                    </Typography>
                    <Typography color='text.secondary'>
                      {project.date}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{justifyContent: 'flex-end'}}>
                    <Button
                      variant='outlined'
                      color='success'
                      onClick={() => handleExportProject(project.name)}
                      sx={{textTransform: 'none'}}>
                      Export
                    </Button>
                    <Button
                      variant='outlined'
                      color='error'
                      onClick={() => handleDeleteClick(project.name)}
                      sx={{textTransform: 'none'}}>
                      Delete
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() =>
                        handleOpenProject(project.name, project.description)
                      }
                      sx={{textTransform: 'none'}}>
                      Open
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <DeleteConfirmationDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleConfirmDelete}
        itemName={projectRef.current}
      />
    </Box>
  );
};

export default SavedProjects2;
