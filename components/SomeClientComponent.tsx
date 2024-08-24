import { useEffect } from 'react';

const SomeClientComponent: React.FC = () => {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js').then((Bootstrap) => {
    });
  }, []);

  return <div>Some client-side component</div>;
};

export default SomeClientComponent;
