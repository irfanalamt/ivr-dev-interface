import {useEffect, useState} from 'react';
import ProjectPage from '../components/ProjectPage';
import IvrDialog from '../components/IvrDialog';

const TestWorkSpace = ({user}) => {
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
      <ProjectPage
        ivrName={ivrName}
        openIvrDialog={() => setIsIvrDialogOpen(true)}
        user={user}
      />
      <IvrDialog
        isOpen={Boolean(isIvrDialogOpen)}
        handleClose={() => setIsIvrDialogOpen(false)}
        ivrName={ivrName}
        setIvrName={setIvrName}
      />
    </>
  );
};

export default TestWorkSpace;
