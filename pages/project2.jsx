import dynamic from 'next/dynamic';

const DynamicCanvas = dynamic(() => import('../components/ProjectPage'), {
  ssr: false,
});

const testWorkSpace = () => {
  return <DynamicCanvas />;
};

export default testWorkSpace;
