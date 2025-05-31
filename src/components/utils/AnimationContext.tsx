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
    getActiveAnimations
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};

export default AnimationContext; 