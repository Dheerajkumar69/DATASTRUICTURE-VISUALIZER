import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { routeConfig } from './RouteConfig';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {routeConfig.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <Suspense fallback={<LoadingSpinner message={route.loadingMessage} />}>
                  <route.component />
                </Suspense>
              }
            />
          ))}
          {/* Fallback route for 404 */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Suspense>
    </Layout>
  );
};