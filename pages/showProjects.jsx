import { Box, Button, Container, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ErrorIcon from '@mui/icons-material/Error';
import FolderIcon from '@mui/icons-material/Folder';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Router from 'next/router';

const ShowProjects = () => {
  const { data: session, status } = useSession();
  const [projectList, setProjectList] = useState(null);
  useEffect(() => {
    if (status === 'authenticated') {
      axios
        .get('/api/getProjects', {
          params: {
            email: session.user.email,
          },
        })
        .then((res) => {
          console.log('get projects:', res.data);
          if (res.data.message) {
            setProjectList(res.data.projects);
          }
        });
    }
  }, []);
  // session.user.email
  if (status === 'authenticated') {
    return (
      <Container>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 4,
            backgroundColor: '#aed581',
            width: 'max-content',
            px: 2,
            py: 1,
            borderRadius: 2,
          }}
          variant='body2'
        >
          <AccountCircleIcon sx={{ mr: 0.5 }} />
          {session.user.email}
        </Typography>
        {projectList ? (
          <Box sx={{ display: 'flex', mt: '10%' }}>
            {Object.keys(projectList).map((el, i) => (
              <Typography
                key={i}
                sx={{
                  mx: 2,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#42a5f5',
                  px: 2,
                  py: 1,
                  boxShadow: 1,
                }}
                variant='subtitle2'
                onClick={() => {
                  localStorage.setItem('isExistingProject', true);
                  localStorage.setItem(
                    'saved_project',
                    JSON.stringify(projectList[el])
                  );

                  Router.push('/stageCanvas2');
                }}
              >
                <FolderIcon sx={{ mr: 0.5 }} /> {el}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography
            sx={{ my: 4, display: 'flex', alignItems: 'center' }}
            variant='h5'
          >
            No saved projects in database.
            <ErrorIcon sx={{ mx: 0.5, color: '#ef5350' }} />
          </Typography>
        )}
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
