import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { useEffect } from 'react';

const Protected = () => {
  const { status, data } = useSession();
  useEffect(() => {
    if (status === 'unauthenticated') Router.replace('/signin');
  }, [status]);

  if (status === 'authenticated')
    return (
      <div>
        Welcome{'\n'}
        {JSON.stringify(data.user, null, 2)}
      </div>
    );

  return <div>loading</div>;
};

export default Protected;
