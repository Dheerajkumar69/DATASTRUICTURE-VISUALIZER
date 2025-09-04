import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ResourcePreloaderProps {
  children: React.ReactNode;
}

// Map routes to their likely next routes for preloading
const routePreloadMap: Record<string, string[]> = {
  '/': [
    '/data-structures/array',
    '/algorithms/sorting',
    '/algorithms/graph'
  ],
  '/data-structures/array': [
    '/data-structures/linked-list',
    '/algorithms/array/kadane',
    '/algorithms/array/sliding-window'
  ],
  '/algorithms/sorting': [
    '/algorithms/sorting/bubble-sort',
    '/algorithms/sorting/merge-sort',
    '/algorithms/sorting/quick-sort'
  ],
  '/algorithms/graph': [
    '/algorithms/graph/astar',
    '/algorithms/graph/kruskal',
    '/algorithms/graph/prim'
  ],
  '/algorithms/backtracking': [
    '/algorithms/backtracking/nqueens',
    '/algorithms/backtracking/traveling-salesman'
  ],
  '/algorithms/problems': [
    '/algorithms/problems/number-of-islands',
    '/algorithms/problems/maze-solving',
    '/algorithms/problems/shortest-path-grid'
  ]
};

// Critical CSS and JS resources that should be preloaded
const criticalResources = [
  // Add paths to critical resources
  '/static/css/main.css',
  '/static/js/main.js'
];

const ResourcePreloader: React.FC<ResourcePreloaderProps> = ({ children }) => {
  const location = useLocation();

  // Preload critical resources
  useEffect(() => {
    const preloadCriticalResources = () => {
      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        
        if (resource.endsWith('.css')) {
          link.as = 'style';
        } else if (resource.endsWith('.js')) {
          link.as = 'script';
        }
        
        // Only add if not already present
        if (!document.querySelector(`link[href="${resource}"]`)) {
          document.head.appendChild(link);
        }
      });
    };

    preloadCriticalResources();
  }, []);

  // Preload likely next routes based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const routesToPreload = routePreloadMap[currentPath] || [];

    routesToPreload.forEach(route => {
      // Use route-based preloading
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      
      // Only add if not already present
      if (!document.querySelector(`link[href="${route}"]`)) {
        document.head.appendChild(link);
      }
    });

    // Clean up prefetch links after 30 seconds to avoid too many
    const cleanup = setTimeout(() => {
      document.querySelectorAll('link[rel="prefetch"]').forEach(link => {
        if (routesToPreload.includes(link.getAttribute('href') || '')) {
          document.head.removeChild(link);
        }
      });
    }, 30000);

    return () => clearTimeout(cleanup);
  }, [location.pathname]);

  // Preload fonts for better typography loading
  useEffect(() => {
    const fontPreloads = [
      // Add any custom fonts here
      // 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ];

    fontPreloads.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = fontUrl;
      link.as = 'style';
      link.crossOrigin = 'anonymous';
      
      if (!document.querySelector(`link[href="${fontUrl}"]`)) {
        document.head.appendChild(link);
      }
    });
  }, []);

  // Prefetch critical JavaScript chunks
  useEffect(() => {
    const prefetchNextChunks = () => {
      // This would be populated by webpack in a real scenario
      const nextLikelyChunks = [
        // Example: '/static/js/2.chunk.js',
        // Example: '/static/js/3.chunk.js',
      ];

      nextLikelyChunks.forEach(chunk => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = chunk;
        link.as = 'script';
        
        if (!document.querySelector(`link[href="${chunk}"]`)) {
          document.head.appendChild(link);
        }
      });
    };

    // Delay prefetch to not interfere with critical loading
    const prefetchTimer = setTimeout(prefetchNextChunks, 2000);
    return () => clearTimeout(prefetchTimer);
  }, []);

  return <>{children}</>;
};

export default ResourcePreloader;
