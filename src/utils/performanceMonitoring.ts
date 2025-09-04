// Performance monitoring utilities for tracking bundle loading and component performance

export const performanceMonitor = {
  // Track component load times
  trackComponentLoad: (componentName: string, startTime: number) => {
    const loadTime = performance.now() - startTime;
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    }
    
    // Send to analytics in production (could be replaced with actual analytics service)
    if (process.env.NODE_ENV === 'production') {
      // Example: analytics.track('component_load_time', { componentName, loadTime });
    }
  },

  // Track bundle chunk loading
  trackChunkLoad: (chunkName: string, startTime: number) => {
    const loadTime = performance.now() - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Chunk ${chunkName} loaded in ${loadTime.toFixed(2)}ms`);
    }
  },

  // Track route transitions
  trackRouteTransition: (fromRoute: string, toRoute: string, startTime: number) => {
    const transitionTime = performance.now() - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 Route transition ${fromRoute} → ${toRoute} took ${transitionTime.toFixed(2)}ms`);
    }
  },

  // Track memory usage
  trackMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (process.env.NODE_ENV === 'development') {
        console.log('💾 Memory usage:', {
          used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
          total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
          limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
        });
      }
    }
  },

  // Track largest contentful paint
  trackLCP: () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          console.log(`🎨 Largest Contentful Paint: ${lastEntry.startTime.toFixed(2)}ms`);
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  },

  // Initialize performance monitoring
  init: () => {
    if (typeof window !== 'undefined') {
      performanceMonitor.trackLCP();
      
      // Track initial page load
      window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      });

      // Track memory usage every 30 seconds in development
      if (process.env.NODE_ENV === 'development') {
        setInterval(() => {
          performanceMonitor.trackMemoryUsage();
        }, 30000);
      }
    }
  }
};
