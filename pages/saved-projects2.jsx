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

  useEffect(() => {
    fetchProjectsFromDb();
  }, []);

  function fetchProjectsFromDb() {
    const token = localStorage.getItem('token');
    axios
      .get('/api/getProjects2', {headers: {Authorization: token}})
      .then((response) => {
        const newData = modifyResponseData(response.data);
        setProjects(newData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }

  const projectRef = useRef('');

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
    router.push('/project2');
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
      <Container sx={{mt: 2}}>
        <Typography sx={{mb: 2, color: '#6E6E6E'}} variant='h6'>
          Saved Projects
        </Typography>
        {loading ? (
          <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
            <CircularProgress />
          </Box>
        ) : projects.length === 0 ? (
          <Typography
            sx={{mt: 4, fontSize: 'large', textAlign: 'center'}}
            variant='subtitle2'>
            No projects found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {projects.map((project, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                  <CardContent sx={{flexGrow: 1}}>
                    <Typography variant='h6' component='div'>
                      {project.displayName}
                    </Typography>
                    <Typography color='textSecondary'>
                      {project.date}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      sx={{ml: 'auto'}}
                      variant='outlined'
                      color='error'
                      onClick={() => handleDeleteClick(project.name)}>
                      Delete
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() =>
                        handleOpenProject(project.name, project.description)
                      }>
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
