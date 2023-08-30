import {CacheProvider} from '@emotion/react';
import {Alert, Snackbar} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';
import Head from 'next/head';
import {useRouter} from 'next/router';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import createEmotionCache from '../src/createEmotionCache.js';

const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: {...pageProps},
  } = props;

  const [user, setUser] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  async function verifyToken(token) {
    const response = await axios.get('/api/verify', {
      headers: {Authorization: token},
    });
    const decoded = response.data;
    return decoded;
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token)
        .then((decoded) => {
          setUser(decoded);
        })
        .catch((error) => {
          console.error(error);

          setOpenSnackbar(true);
          setTimeout(() => {
            setOpenSnackbar(false);
            router.push('/');
          }, 3500);

          setUser(null);
          localStorage.removeItem('token');
        });
    } else {
      setUser(null);
    }
  }, []);

  function updateUser(token) {
    if (token) {
      verifyToken(token)
        .then((decoded) => {
          setUser(decoded);
        })
        .catch((error) => {
          console.error(error);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }

  function handleCloseSnackbar(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  }

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <CssBaseline />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
        <Alert onClose={handleCloseSnackbar} severity='error' variant='filled'>
          Your session has expired. Please log in again.
        </Alert>
      </Snackbar>

      <Component {...pageProps} user={user} updateUser={updateUser} />
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
