import dynamic from 'next/dynamic';

const DynamicCanvas = dynamic(() => import('../components/Canvas'), {
  ssr: false
});

const projectWorkSpace = () => {
  return <DynamicCanvas />;
};

export default projectWorkSpace;
