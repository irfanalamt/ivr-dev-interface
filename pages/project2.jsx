import {useEffect, useState} from 'react';
import ProjectPage from '../components/ProjectPage';
import IvrDialog from '../components/IvrDialog';

const testWorkSpace = () => {
  const [isIvrDialogOpen, setIsIvrDialogOpen] = useState(false);
  const [ivrName, setIvrName] = useState({name: '', version: 1});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedIvrName = localStorage.getItem('ivrName');
      setIvrName(
        storedIvrName ? JSON.parse(storedIvrName) : {name: '', version: 1}
      );
      setIsIvrDialogOpen(!storedIvrName);
    }
  }, []);

  function handleDialogInputChange(event, type) {
    setIvrName({...ivrName, [type]: event.target.value});
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ivrName', JSON.stringify(ivrName));
    }
  }, [ivrName]);

  return (
    <>
      <ProjectPage ivrName={ivrName} />
      <IvrDialog
        isOpen={isIvrDialogOpen}
        handleClose={() => setIsIvrDialogOpen(false)}
        ivrName={ivrName}
        handleInputChange={handleDialogInputChange}
      />
    </>
  );
};

export default testWorkSpace;
