import dynamic from 'next/dynamic';

const DynamicCanvas = dynamic(() => import('../components/TestPage'), {
  ssr: false,
});

const testWorkSpace = () => {
  return <DynamicCanvas />;
};

export default testWorkSpace;
