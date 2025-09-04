import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AnimationContextType {
  globalAnimationRunning: boolean;
  setGlobalAnimationRunning: (isRunning: boolean) => void;
  registerAnimation: (id: string) => void;
  unregisterAnimation: (id: string) => void;
  pauseAllAnimations: () => void;
  resumeAllAnimations: () => void;
  resetAllAnimations: () => void;
  getActiveAnimations: () => string[];
  // Enhanced features
  speed: number;
  setSpeed: (speed: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (message: string) => void;
  progress: number;
  setProgress: (progress: number) => void;
}

// Create the context with a default value
const AnimationContext = createContext<AnimationContextType>({
  globalAnimationRunning: false,
  // These are intentionally empty functions as they will be properly implemented in the provider
  setGlobalAnimationRunning: () => {/* placeholder implementation */},
  registerAnimation: () => {/* placeholder implementation */},
  unregisterAnimation: () => {/* placeholder implementation */},
  pauseAllAnimations: () => {/* placeholder implementation */},
  resumeAllAnimations: () => {/* placeholder implementation */},
  resetAllAnimations: () => {/* placeholder implementation */},
  getActiveAnimations: () => [],
  // Enhanced features defaults
  speed: 1.0,
  setSpeed: () => {/* placeholder implementation */},
  isLoading: false,
  setIsLoading: () => {/* placeholder implementation */},
  loadingMessage: '',
  setLoadingMessage: () => {/* placeholder implementation */},
  progress: 0,
  setProgress: () => {/* placeholder implementation */},
});

// Custom hook for using the animation context
export const useAnimationContext = () => useContext(AnimationContext);

interface AnimationProviderProps {
  children: ReactNode;
}

// Animation provider component
export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const [globalAnimationRunning, setGlobalAnimationRunning] = useState<boolean>(false);
  const [activeAnimations, setActiveAnimations] = useState<Set<string>>(new Set());
  
  // Enhanced features state
  const [speed, setSpeed] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  // Register a new animation
  const registerAnimation = useCallback((id: string) => {
    setActiveAnimations(prev => {
      const updated = new Set(prev);
      updated.add(id);
      return updated;
    });
  }, []);

  // Unregister an animation when it's no longer needed
  const unregisterAnimation = useCallback((id: string) => {
    setActiveAnimations(prev => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });
  }, []);

  // Pause all animations - this just sets the global state
  // Individual components should listen to this state and respond
  const pauseAllAnimations = useCallback(() => {
    setGlobalAnimationRunning(false);
  }, []);

  // Resume all animations
  const resumeAllAnimations = useCallback(() => {
    setGlobalAnimationRunning(true);
  }, []);

  // Reset all animations - just sets global state
  const resetAllAnimations = useCallback(() => {
    setGlobalAnimationRunning(false);
  }, []);

  // Get a list of active animation IDs
  const getActiveAnimations = useCallback(() => {
    return Array.from(activeAnimations);
  }, [activeAnimations]);

  // Context value
  const contextValue: AnimationContextType = {
    globalAnimationRunning,
    setGlobalAnimationRunning,
    registerAnimation,
    unregisterAnimation,
    pauseAllAnimations,
    resumeAllAnimations,
    resetAllAnimations,
    getActiveAnimations,
    // Enhanced features
    speed,
    setSpeed,
    isLoading,
    setIsLoading,
    loadingMessage,
    setLoadingMessage,
    progress,
    setProgress
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};

export default AnimationContext; 