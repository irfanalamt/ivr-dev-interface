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
} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {useRouter} from 'next/router';

const SavedProjects2 = ({user}) => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('/api/getProjects2', {headers: {Authorization: token}})
      .then((response) => {
        modifyResponseDate(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function modifyResponseDate(data) {
    const newData = data.map((d) => {
      const date = new Date(d.timestamp);
      const formattedDate = date.toLocaleString();

      return {name: d.name, date: formattedDate};
    });

    setProjects(newData);
  }

  function handleOpenProject(name) {
    const parts = name.split('_');
    const version = parts.pop();
    const ivrName = parts.join('_');

    sessionStorage.setItem(
      'ivrName',
      JSON.stringify({name: ivrName, version: version})
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
        <Grid container spacing={3}>
          {projects.map((project, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Card
                sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                <CardContent sx={{flexGrow: 1}}>
                  <Typography variant='h6' component='div'>
                    {project.name}
                  </Typography>
                  <Typography color='textSecondary'>{project.date}</Typography>
                </CardContent>
                <CardActions>
                  <Button sx={{ml: 'auto'}} variant='outlined' color='error'>
                    Delete
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => handleOpenProject(project.name)}>
                    Open
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default SavedProjects2;
