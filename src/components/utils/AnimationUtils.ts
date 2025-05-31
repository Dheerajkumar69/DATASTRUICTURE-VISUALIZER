import { keyframes } from 'styled-components';

// Standard animation durations
export const ANIMATION_DURATION = {
  SLOW: 1000,
  MEDIUM: 500,
  FAST: 200,
};

// Standard animation timing functions
export const ANIMATION_EASING = {
  DEFAULT: 'ease-in-out',
  LINEAR: 'linear',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  BOUNCE: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};

// Standard keyframes for common animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const scaleIn = keyframes`
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

export const slideIn = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

export const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const highlight = keyframes`
  0% {
    background-color: transparent;
    box-shadow: none;
  }
  50% {
    background-color: rgba(99, 102, 241, 0.2);
    box-shadow: 0 0 8px rgba(99, 102, 241, 0.4);
  }
  100% {
    background-color: transparent;
    box-shadow: none;
  }
`;

// Animation helpers for standard operations
export const getAnimationStyles = (type: string, duration: number = ANIMATION_DURATION.MEDIUM) => {
  const easing = ANIMATION_EASING.DEFAULT;
  
  switch (type) {
    case 'add':
      return `animation: ${scaleIn} ${duration}ms ${easing};`;
    case 'remove':
      return `animation: ${fadeOut} ${duration}ms ${easing};`;
    case 'highlight':
      return `animation: ${highlight} ${duration}ms ${easing};`;
    case 'move':
      return `animation: ${slideIn} ${duration}ms ${easing};`;
    case 'update':
      return `animation: ${pulse} ${duration}ms ${easing};`;
    default:
      return `animation: ${fadeIn} ${duration}ms ${easing};`;
  }
};

// Enhanced animation step interface
export interface AnimationStep<T> {
  state: T;
  description: string;
  highlightedIndices?: number[];
  animationType?: string;
  timestamp?: number;
  metadata?: Record<string, any>;
}

/**
 * Create a promise that resolves after a specified delay.
 * Includes error handling to prevent unhandled promise rejections.
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(resolve, ms);
    } catch (error) {
      console.error('Error in delay function:', error);
      reject(error);
    }
  });
};

/**
 * Enhanced version of setTimeout that returns a promise and includes error handling
 */
export const safeTimeout = (callback: () => void, ms: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const timer = setTimeout(() => {
        try {
          callback();
          resolve();
        } catch (error) {
          console.error('Error in safeTimeout callback:', error);
          reject(error);
        }
      }, ms);
      
      // Attach the timer to the promise for potential cleanup
      (Promise as any).timer = timer;
    } catch (error) {
      console.error('Error setting up safeTimeout:', error);
      reject(error);
    }
  });
};

/**
 * Safely clear a timeout, handling potential errors
 */
export const safeClearTimeout = (timeoutId: NodeJS.Timeout | null): boolean => {
  if (!timeoutId) return false;
  
  try {
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    console.error('Error clearing timeout:', error);
    return false;
  }
};

/**
 * Request animation frame with error handling
 */
export const safeRequestAnimationFrame = (callback: FrameRequestCallback): number => {
  try {
    return requestAnimationFrame(callback);
  } catch (error) {
    console.error('Error in requestAnimationFrame:', error);
    // Fallback to setTimeout as a safety mechanism
    const timeoutId = setTimeout(() => callback(performance.now()), 16);
    return timeoutId as unknown as number;
  }
};

/**
 * Cancel animation frame with error handling
 */
export const safeCancelAnimationFrame = (requestId: number | null): boolean => {
  if (!requestId) return false;
  
  try {
    cancelAnimationFrame(requestId);
    return true;
  } catch (error) {
    console.error('Error canceling animation frame:', error);
    // Try to clear the potential fallback timeout
    try {
      clearTimeout(requestId as unknown as NodeJS.Timeout);
    } catch (e) {
      // Ignore any error from clearing timeout
    }
    return false;
  }
};

/**
 * Create an animated step with additional metadata
 */
export const createAnimatedStep = <T>(
  state: T,
  description: string,
  highlightedIndices: number[] = [],
  animationType: string = 'default',
  metadata: Record<string, any> = {}
): AnimationStep<T> => {
  return {
    state,
    description,
    highlightedIndices,
    animationType,
    timestamp: performance.now(),
    metadata
  };
};

/**
 * Create a deep copy of a step to prevent mutation issues
 */
export const cloneStep = <T>(step: AnimationStep<T>): AnimationStep<T> => {
  return {
    state: JSON.parse(JSON.stringify(step.state)),
    description: step.description,
    highlightedIndices: step.highlightedIndices ? [...step.highlightedIndices] : [],
    animationType: step.animationType,
    timestamp: step.timestamp,
    metadata: step.metadata ? JSON.parse(JSON.stringify(step.metadata)) : {}
  };
};

/**
 * Performance monitoring for animations
 */
export const measureAnimationPerformance = (
  callback: () => void, 
  label: string = 'Animation Performance'
): void => {
  try {
    performance.mark(`${label}-start`);
    callback();
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measurements = performance.getEntriesByName(label);
    if (measurements.length > 0) {
      console.log(`${label}: ${measurements[0].duration.toFixed(2)}ms`);
    }
    
    // Clean up performance marks
    performance.clearMarks(`${label}-start`);
    performance.clearMarks(`${label}-end`);
    performance.clearMeasures(label);
  } catch (error) {
    console.error('Error measuring animation performance:', error);
  }
}; 