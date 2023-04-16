import {useEffect, useState} from 'react';
import ProjectPage from '../components/ProjectPage';
import IvrDialog from '../components/IvrDialog';

const TestWorkSpace = ({user}) => {
  const [isIvrDialogOpen, setIsIvrDialogOpen] = useState(false);
  const [ivrName, setIvrName] = useState({name: '', version: 1});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedIvrName = sessionStorage.getItem('ivrName');
      setIvrName(
        storedIvrName ? JSON.parse(storedIvrName) : {name: '', version: 1}
      );
      setIsIvrDialogOpen(!storedIvrName);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ivrName', JSON.stringify(ivrName));
    }
  }, [ivrName]);

  const handleDialogInputChange = (event, type) => {
    setIvrName({...ivrName, [type]: event.target.value});
  };

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
        handleInputChange={handleDialogInputChange}
      />
    </>
  );
};

export default TestWorkSpace;
