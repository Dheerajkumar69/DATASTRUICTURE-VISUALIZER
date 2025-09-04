import React, { createContext, useContext, ReactNode } from 'react';

// Simple animation context for mobile compatibility
interface AnimationContextType {
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  reduceMotion: boolean;
}

const AnimationContext = createContext<AnimationContextType>({
  isAnimating: false,
  setIsAnimating: () => {},
  reduceMotion: false
});

export const useAnimation = () => useContext(AnimationContext);

interface AnimationProviderProps {
  children: ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  // Check for reduced motion preference
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <AnimationContext.Provider value={{ isAnimating, setIsAnimating, reduceMotion }}>
      {children}
    </AnimationContext.Provider>
  );
};
