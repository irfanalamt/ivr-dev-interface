import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import DownloadingIcon from '@mui/icons-material/Downloading';
import ErrorIcon from '@mui/icons-material/Error';
import FolderIcon from '@mui/icons-material/Folder';
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { useEffect, useState } from 'react';

const ShowProjects = () => {
  const { data: session, status } = useSession();
  const [projectList, setProjectList] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      setLoading(true);
      axios
        .get('/api/getProjects', {
          params: {
            email: session.user.email,
          },
        })
        .then((res) => {
          console.log('get projects:', res.data);
          setLoading(false);
          if (res.data.message) {
            setProjectList(res.data.projects);
          }
        });
    }
  }, []);

  if (status === 'authenticated') {
    return (
      <Container>
        <Box
          sx={{
            display: 'flex',
            my: 1,
            backgroundColor: '#f9fbe7',
            alignItems: 'center',
            height: 80,
            px: 2,
            boxShadow: 1,
          }}
        >
          <Avatar sx={{ backgroundColor: '#bbdefb', mx: 1 }}>
            <ArchitectureIcon sx={{ fontSize: '2.5rem', color: 'black' }} />
          </Avatar>
          <Typography
            sx={{ mx: 2, fontSize: '1.1rem', fontWeight: 'bold' }}
            variant='body2'
          >
            PROJECT DASHBOARD
          </Typography>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#aed581',
              width: 'max-content',
              px: 2,
              py: 1,
              borderRadius: 2,
              ml: 'auto',
            }}
            variant='body2'
          >
            <AccountCircleIcon sx={{ mr: 0.5 }} />
            {session.user.email}
          </Typography>
        </Box>
        {loading && (
          <Typography
            sx={{ display: 'flex', alignItems: 'center', fontSize: 17 }}
            variant='subtitle2'
          >
            <DownloadingIcon sx={{ fontSize: '1.1rem', mr: 0.5 }} /> Loading..
          </Typography>
        )}
        <Paper sx={{ mt: '8%', py: 5, px: 2, backgroundColor: '#FDFDF9' }}>
          {projectList ? (
            <Box sx={{ display: 'flex' }}>
              {Object.keys(projectList).map((el, i) => (
                <Button
                  key={i}
                  sx={{ mx: 2 }}
                  variant='contained'
                  size='large'
                  onClick={() => {
                    localStorage.setItem('isExistingProject', true);
                    localStorage.setItem(
                      'saved_project',
                      JSON.stringify(projectList[el].shapes)
                    );

                    Router.push('/stageCanvas2');
                  }}
                >
                  <FolderIcon sx={{ mr: 0.5 }} /> {el}
                </Button>
              ))}
            </Box>
          ) : (
            !loading && (
              <Typography
                sx={{ my: 4, display: 'flex', alignItems: 'center' }}
                variant='h5'
              >
                No saved projects in database.
                <ErrorIcon sx={{ mx: 0.5, color: '#ef5350' }} />
              </Typography>
            )
          )}
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <Button sx={{ m: 3 }} variant='outlined' href='/' color='secondary'>
        HOME
      </Button>
      <Button sx={{ m: 3 }} variant='outlined' href='/signin' color='success'>
        LOGIN
      </Button>
      <Button sx={{ m: 3 }} variant='outlined' href='/signup'>
        SIGNUP
      </Button>
      <Typography
        sx={{
          mt: '40vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        variant='h5'
      >
        Please sign in to save, open projects.
        <ErrorIcon sx={{ mx: 0.5, color: '#ef5350' }} />
      </Typography>
    </>
  );
};

export default ShowProjects;
