import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import styled, { css } from 'styled-components';

// Breakpoint definitions
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Device detection
export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  orientation: 'portrait' | 'landscape';
  screenSize: {
    width: number;
    height: number;
  };
  currentBreakpoint: Breakpoint;
}

// Responsive context
interface ResponsiveContextType {
  device: DeviceInfo;
  isBreakpoint: (breakpoint: Breakpoint) => boolean;
  isAboveBreakpoint: (breakpoint: Breakpoint) => boolean;
  isBelowBreakpoint: (breakpoint: Breakpoint) => boolean;
}

const ResponsiveContext = createContext<ResponsiveContextType | null>(null);

// Hook for using responsive context
export const useResponsive = (): ResponsiveContextType => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  return context;
};

// Device detection utilities
const detectDevice = (width: number, height: number): DeviceInfo => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const orientation = height > width ? 'portrait' : 'landscape';
  
  let currentBreakpoint: Breakpoint = 'xs';
  for (const [bp, value] of Object.entries(breakpoints).reverse()) {
    if (width >= value) {
      currentBreakpoint = bp as Breakpoint;
      break;
    }
  }

  return {
    isMobile: width < breakpoints.md,
    isTablet: width >= breakpoints.md && width < breakpoints.lg,
    isDesktop: width >= breakpoints.lg,
    isTouchDevice,
    orientation,
    screenSize: { width, height },
    currentBreakpoint
  };
};

// Responsive Provider Component
interface ResponsiveProviderProps {
  children: ReactNode;
}

export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children }) => {
  const [device, setDevice] = useState<DeviceInfo>(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return detectDevice(width, height);
  });

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      // Debounce resize events
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        setDevice(detectDevice(width, height));
      }, 100);
    };

    const handleOrientationChange = () => {
      // Handle orientation change with delay for correct dimensions
      setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        setDevice(detectDevice(width, height));
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      clearTimeout(resizeTimer);
    };
  }, []);

  const isBreakpoint = (breakpoint: Breakpoint): boolean => {
    return device.currentBreakpoint === breakpoint;
  };

  const isAboveBreakpoint = (breakpoint: Breakpoint): boolean => {
    return device.screenSize.width >= breakpoints[breakpoint];
  };

  const isBelowBreakpoint = (breakpoint: Breakpoint): boolean => {
    return device.screenSize.width < breakpoints[breakpoint];
  };

  const contextValue: ResponsiveContextType = {
    device,
    isBreakpoint,
    isAboveBreakpoint,
    isBelowBreakpoint
  };

  return (
    <ResponsiveContext.Provider value={contextValue}>
      {children}
    </ResponsiveContext.Provider>
  );
};

// Responsive styled components utilities
export const mediaQuery = (breakpoint: Breakpoint) => {
  return `@media (min-width: ${breakpoints[breakpoint]}px)`;
};

export const maxMediaQuery = (breakpoint: Breakpoint) => {
  return `@media (max-width: ${breakpoints[breakpoint] - 1}px)`;
};

// Responsive grid system
interface GridProps {
  cols?: number;
  gap?: string;
  responsive?: {
    [K in Breakpoint]?: {
      cols?: number;
      gap?: string;
    };
  };
}

export const ResponsiveGrid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: repeat(${({ cols = 1 }) => cols}, 1fr);
  gap: ${({ gap = '1rem' }) => gap};
  
  ${({ responsive }) =>
    responsive &&
    Object.entries(responsive).map(([bp, config]) =>
      css`
        ${mediaQuery(bp as Breakpoint)} {
          ${config.cols && `grid-template-columns: repeat(${config.cols}, 1fr);`}
          ${config.gap && `gap: ${config.gap};`}
        }
      `
    )}
`;

// Responsive container
interface ContainerProps {
  fluid?: boolean;
  maxWidth?: {
    [K in Breakpoint]?: string;
  };
}

export const ResponsiveContainer = styled.div<ContainerProps>`
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  
  ${({ fluid, maxWidth }) =>
    !fluid &&
    css`
      ${mediaQuery('sm')} {
        max-width: ${maxWidth?.sm || '540px'};
      }
      
      ${mediaQuery('md')} {
        max-width: ${maxWidth?.md || '720px'};
      }
      
      ${mediaQuery('lg')} {
        max-width: ${maxWidth?.lg || '960px'};
      }
      
      ${mediaQuery('xl')} {
        max-width: ${maxWidth?.xl || '1140px'};
      }
      
      ${mediaQuery('xxl')} {
        max-width: ${maxWidth?.xxl || '1320px'};
      }
    `}
`;

// Show/Hide components based on breakpoints
interface VisibilityProps {
  showOn?: Breakpoint[];
  hideOn?: Breakpoint[];
  showAbove?: Breakpoint;
  hideAbove?: Breakpoint;
  showBelow?: Breakpoint;
  hideBelow?: Breakpoint;
}

export const ResponsiveVisibility = styled.div<VisibilityProps>`
  ${({ showOn, hideOn, showAbove, hideAbove, showBelow, hideBelow }) => {
    let styles = '';
    
    // Default to hidden if showOn is specified
    if (showOn) {
      styles += 'display: none;';
      showOn.forEach(bp => {
        styles += `
          ${mediaQuery(bp)} {
            display: block;
          }
        `;
      });
    }
    
    // Hide on specific breakpoints
    if (hideOn) {
      hideOn.forEach(bp => {
        styles += `
          ${mediaQuery(bp)} {
            display: none;
          }
        `;
      });
    }
    
    // Show above breakpoint
    if (showAbove) {
      styles += 'display: none;';
      styles += `
        ${mediaQuery(showAbove)} {
          display: block;
        }
      `;
    }
    
    // Hide above breakpoint
    if (hideAbove) {
      styles += `
        ${mediaQuery(hideAbove)} {
          display: none;
        }
      `;
    }
    
    // Show below breakpoint
    if (showBelow) {
      styles += `
        ${maxMediaQuery(showBelow)} {
          display: block;
        }
      `;
      styles += `
        ${mediaQuery(showBelow)} {
          display: none;
        }
      `;
    }
    
    // Hide below breakpoint
    if (hideBelow) {
      styles += `
        ${maxMediaQuery(hideBelow)} {
          display: none;
        }
      `;
    }
    
    return css`${styles}`;
  }}
`;

// Touch-friendly components
export const TouchButton = styled.button<{ size?: 'small' | 'medium' | 'large' }>`
  min-height: ${({ size = 'medium' }) => {
    switch (size) {
      case 'small': return '36px';
      case 'large': return '56px';
      default: return '44px';
    }
  }};
  min-width: ${({ size = 'medium' }) => {
    switch (size) {
      case 'small': return '36px';
      case 'large': return '56px';
      default: return '44px';
    }
  }};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #0056b3;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  // Touch device specific styles
  @media (hover: none) and (pointer: coarse) {
    &:hover {
      background: #007bff;
      transform: none;
    }
    
    &:active {
      background: #0056b3;
    }
  }
`;

// Mobile-optimized input
export const TouchInput = styled.input`
  min-height: 44px;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px; // Prevents zoom on iOS
  width: 100%;
  
  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
  
  ${maxMediaQuery('md')} {
    font-size: 16px; // Ensure no zoom on mobile
  }
`;

// Responsive text
interface ResponsiveTextProps {
  size?: {
    [K in Breakpoint]?: string;
  };
}

export const ResponsiveText = styled.p<ResponsiveTextProps>`
  margin: 0;
  
  ${({ size }) =>
    size &&
    Object.entries(size).map(([bp, fontSize]) =>
      css`
        ${mediaQuery(bp as Breakpoint)} {
          font-size: ${fontSize};
        }
      `
    )}
`;

export default ResponsiveProvider;