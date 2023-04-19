import {CacheProvider} from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';
import Head from 'next/head';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import createEmotionCache from '../src/createEmotionCache.js';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: {...pageProps},
  } = props;

  const [user, setUser] = useState(null);

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

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />

      <Component {...pageProps} user={user} updateUser={updateUser} />
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
