import dynamic from 'next/dynamic';

const DynamicCanvas = dynamic(() => import('../components/Canvas'), {
  ssr: false,
});

const CanvasPage = () => {
  return <DynamicCanvas />;
};

export default CanvasPage;
