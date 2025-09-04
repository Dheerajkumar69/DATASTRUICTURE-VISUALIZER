import React, { Suspense } from 'react';
import LoadingFallback from './LoadingFallback';

interface LazyRouteWrapperProps {
  component: React.ComponentType<any>;
  loadingMessage?: string;
}

const LazyRouteWrapper: React.FC<LazyRouteWrapperProps> = ({ component: Component, loadingMessage }) => {
  return (
    <Suspense fallback={<LoadingFallback message={loadingMessage} />}>
      <Component />
    </Suspense>
  );
};

export default LazyRouteWrapper;
