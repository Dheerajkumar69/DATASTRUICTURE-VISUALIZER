import { useState, useEffect, useCallback } from 'react';

// Device detection utilities
export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const isTouchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsTouchDevice(isTouchCapable);
      
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { deviceType, isTouchDevice };
};

// Network status hook for performance optimization
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'fast' | 'unknown'>('unknown');

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Check connection speed if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const updateConnectionSpeed = () => {
        if (connection.effectiveType === '4g') {
          setConnectionSpeed('fast');
        } else if (connection.effectiveType === '3g' || connection.effectiveType === '2g') {
          setConnectionSpeed('slow');
        } else {
          setConnectionSpeed('unknown');
        }
      };
      
      updateConnectionSpeed();
      connection.addEventListener('change', updateConnectionSpeed);
      
      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
        connection.removeEventListener('change', updateConnectionSpeed);
      };
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return { isOnline, connectionSpeed };
};

// Viewport dimensions hook
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      });
    };

    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  return viewport;
};

// Reduced motion preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Battery status for performance optimization
export const useBatteryStatus = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [lowBattery, setLowBattery] = useState(false);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryStatus = () => {
          setBatteryLevel(battery.level);
          setIsCharging(battery.charging);
          setLowBattery(battery.level < 0.2 && !battery.charging);
        };

        updateBatteryStatus();
        
        battery.addEventListener('chargingchange', updateBatteryStatus);
        battery.addEventListener('levelchange', updateBatteryStatus);
        
        return () => {
          battery.removeEventListener('chargingchange', updateBatteryStatus);
          battery.removeEventListener('levelchange', updateBatteryStatus);
        };
      });
    }
  }, []);

  return { batteryLevel, isCharging, lowBattery };
};

// Intersection observer for lazy loading
export const useIntersectionObserver = (options: IntersectionObserverInit = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<Element | null>(null);

  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px 50px 0px',
    ...options
  };

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, defaultOptions);

    observer.observe(element);

    return () => observer.disconnect();
  }, [element, defaultOptions]);

  return [setElement, isVisible] as const;
};

// Performance metrics
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0
  });

  useEffect(() => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      setMetrics({
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0
      });

      // Check for Paint Timing API
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, firstContentfulPaint: entry.startTime }));
            } else if (entry.name === 'largest-contentful-paint') {
              setMetrics(prev => ({ ...prev, largestContentfulPaint: entry.startTime }));
            }
          });
        });

        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
        
        return () => observer.disconnect();
      }
    }
  }, []);

  return metrics;
};

// Combined mobile performance hook
export const useMobilePerformance = () => {
  const { deviceType, isTouchDevice } = useDeviceType();
  const { isOnline, connectionSpeed } = useNetworkStatus();
  const viewport = useViewport();
  const prefersReducedMotion = useReducedMotion();
  const { batteryLevel, isCharging, lowBattery } = useBatteryStatus();
  const performanceMetrics = usePerformanceMetrics();

  // Performance recommendations
  const shouldOptimizeForPerformance = useCallback(() => {
    return (
      deviceType === 'mobile' ||
      connectionSpeed === 'slow' ||
      lowBattery ||
      performanceMetrics.loadTime > 3000
    );
  }, [deviceType, connectionSpeed, lowBattery, performanceMetrics.loadTime]);

  const shouldReduceAnimations = useCallback(() => {
    return prefersReducedMotion || lowBattery || connectionSpeed === 'slow';
  }, [prefersReducedMotion, lowBattery, connectionSpeed]);

  return {
    device: {
      type: deviceType,
      isTouchDevice,
      viewport
    },
    network: {
      isOnline,
      connectionSpeed
    },
    battery: {
      level: batteryLevel,
      isCharging,
      lowBattery
    },
    performance: performanceMetrics,
    preferences: {
      prefersReducedMotion
    },
    recommendations: {
      shouldOptimizeForPerformance: shouldOptimizeForPerformance(),
      shouldReduceAnimations: shouldReduceAnimations()
    }
  };
};
