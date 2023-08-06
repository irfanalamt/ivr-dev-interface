import {useEffect, useState} from 'react';
import ProjectPage from '../components/ProjectPage';
import IvrDialog from '../components/IvrDialog';
import useWindowSize from '../src/hooks/useWindowSize';
import {Avatar, Box, Typography} from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';

const TestWorkSpace = ({user, updateUser}) => {
  const size = useWindowSize();
  const [isIvrDialogOpen, setIsIvrDialogOpen] = useState(false);
  const [ivrName, setIvrName] = useState({
    name: '',
    version: 1,
    description: '',
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedIvrName = sessionStorage.getItem('ivrName');

    if (!storedIvrName) {
      setIsIvrDialogOpen(true);
      setIvrName({name: '', version: 1, description: ''});
      return;
    }

    const {name, version, description} = JSON.parse(storedIvrName);
    setIsIvrDialogOpen(!name);
    setIvrName({name, version, description});
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ivrName', JSON.stringify(ivrName));
    }
  }, [ivrName]);

  return (
    <>
      {size.width <= 800 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            padding: '2rem',
            textAlign: 'center',
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
          </Box>
          <Typography variant='body1' sx={{mt: 2}}>
            Unfortunately, this device is not supported by our application.
            <br />
            Please try logging in from a desktop device for the optimal
            experience.
          </Typography>
        </Box>
      ) : (
        <>
          <ProjectPage
            ivrName={ivrName}
            openIvrDialog={() => setIsIvrDialogOpen(true)}
            user={user}
            updateUser={updateUser}
          />
          <IvrDialog
            isOpen={Boolean(isIvrDialogOpen)}
            handleClose={() => setIsIvrDialogOpen(false)}
            ivrName={ivrName}
            setIvrName={setIvrName}
          />
        </>
      )}
    </>
  );
};

export default TestWorkSpace;
