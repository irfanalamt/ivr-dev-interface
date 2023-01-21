import dynamic from 'next/dynamic';

const DynamicCanvas = dynamic(() => import('../components/Canvas'), {
  ssr: false
});

const moduleWorkSpace = () => {
  return <DynamicCanvas isModule />;
};

export default moduleWorkSpace;
