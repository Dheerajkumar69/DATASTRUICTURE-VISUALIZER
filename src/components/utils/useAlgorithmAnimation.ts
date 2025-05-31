import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimationStep, ANIMATION_DURATION } from './AnimationUtils';

interface UseAlgorithmAnimationProps<T> {
  initialState: T;
  steps?: AnimationStep<T>[];
  useRAF?: boolean; // Option to use requestAnimationFrame instead of setTimeout
}

interface UseAlgorithmAnimationReturn<T> {
  currentState: T;
  currentStep: number;
  isAnimating: boolean;
  isPaused: boolean;
  animationSpeed: number;
  currentDescription: string;
  highlightedIndices: number[];
  animationType: string;
  
  // Controls
  startAnimation: () => void;
  pauseAnimation: () => void;
  resetAnimation: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  setAnimationSpeed: (speed: number) => void;
  
  // Methods for algorithm implementations
  setSteps: React.Dispatch<React.SetStateAction<AnimationStep<T>[]>>;
  canStepForward: boolean;
  canStepBackward: boolean;
  isLastStep: boolean;
  
  // Error state
  hasError: boolean;
  errorMessage: string | null;
}

export function useAlgorithmAnimation<T>(
  { initialState, steps = [], useRAF = false }: UseAlgorithmAnimationProps<T>
): UseAlgorithmAnimationReturn<T> {
  const [animationSteps, setAnimationSteps] = useState<AnimationStep<T>[]>(steps);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(ANIMATION_DURATION.MEDIUM);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Refs for animation timers/frames
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastStepTimeRef = useRef<number>(0);
  
  // Safe state access via refs to avoid closure issues in animations
  const currentStepRef = useRef<number>(currentStep);
  const isPausedRef = useRef<boolean>(isPaused);
  const isAnimatingRef = useRef<boolean>(isAnimating);
  
  // Update refs when state changes
  useEffect(() => {
    currentStepRef.current = currentStep;
    isPausedRef.current = isPaused;
    isAnimatingRef.current = isAnimating;
  }, [currentStep, isPaused, isAnimating]);
  
  // Reset error state when steps change
  useEffect(() => {
    setHasError(false);
    setErrorMessage(null);
  }, [animationSteps]);
  
  // Get current state from steps or use initial state
  const currentState = animationSteps.length > 0 && currentStep < animationSteps.length
    ? animationSteps[currentStep].state
    : initialState;
  
  const currentDescription = animationSteps.length > 0 && currentStep < animationSteps.length
    ? animationSteps[currentStep].description
    : '';
  
  const highlightedIndices = animationSteps.length > 0 && currentStep < animationSteps.length && animationSteps[currentStep].highlightedIndices
    ? animationSteps[currentStep].highlightedIndices || []
    : [];
    
  const animationType = animationSteps.length > 0 && currentStep < animationSteps.length && animationSteps[currentStep].animationType
    ? animationSteps[currentStep].animationType || 'default'
    : 'default';
  
  // Clean up any running animations
  const cleanupAnimation = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);
  
  // Animation frame handler for RAF implementation
  const animationFrameHandler = useCallback((timestamp: number) => {
    if (!isAnimatingRef.current || isPausedRef.current) return;
    
    const elapsed = timestamp - lastStepTimeRef.current;
    
    if (elapsed >= animationSpeed) {
      try {
        if (currentStepRef.current < animationSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
          lastStepTimeRef.current = timestamp;
        } else {
          setIsAnimating(false);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown animation error';
        setHasError(true);
        setErrorMessage(errorMsg);
        setIsAnimating(false);
        console.error('Animation error:', err);
      }
    }
    
    // Continue the animation loop
    if (isAnimatingRef.current && currentStepRef.current < animationSteps.length - 1) {
      rafRef.current = requestAnimationFrame(animationFrameHandler);
    }
  }, [animationSpeed, animationSteps.length]);
  
  // Handle automatic animation
  useEffect(() => {
    cleanupAnimation();
    
    if (isAnimating && !isPaused && animationSteps.length > 0) {
      if (currentStep < animationSteps.length - 1) {
        try {
          if (useRAF) {
            // Use requestAnimationFrame for smoother animations
            lastStepTimeRef.current = performance.now();
            rafRef.current = requestAnimationFrame(animationFrameHandler);
          } else {
            // Use setTimeout for compatibility
            timerRef.current = setTimeout(() => {
              setCurrentStep(prev => prev + 1);
            }, animationSpeed);
          }
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Unknown animation error';
          setHasError(true);
          setErrorMessage(errorMsg);
          setIsAnimating(false);
          console.error('Animation setup error:', err);
        }
      } else {
        setIsAnimating(false);
      }
    }
    
    return cleanupAnimation;
  }, [isAnimating, isPaused, currentStep, animationSteps, animationSpeed, cleanupAnimation, animationFrameHandler, useRAF]);
  
  // Animation control functions
  const startAnimation = useCallback(() => {
    if (animationSteps.length === 0) return;
    
    if (currentStep >= animationSteps.length - 1) {
      // Reset to beginning if we're at the end
      setCurrentStep(0);
    }
    
    setHasError(false);
    setErrorMessage(null);
    setIsAnimating(true);
    setIsPaused(false);
  }, [animationSteps.length, currentStep]);
  
  const pauseAnimation = useCallback(() => {
    setIsPaused(true);
  }, []);
  
  const resetAnimation = useCallback(() => {
    cleanupAnimation();
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    setHasError(false);
    setErrorMessage(null);
  }, [cleanupAnimation]);
  
  const stepForward = useCallback(() => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, animationSteps.length]);
  
  const stepBackward = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);
  
  return {
    currentState,
    currentStep,
    isAnimating,
    isPaused,
    animationSpeed,
    currentDescription,
    highlightedIndices,
    animationType,
    
    // Controls
    startAnimation,
    pauseAnimation,
    resetAnimation,
    stepForward,
    stepBackward,
    setAnimationSpeed,
    
    // For algorithm implementations
    setSteps: setAnimationSteps,
    canStepForward: currentStep < animationSteps.length - 1,
    canStepBackward: currentStep > 0,
    isLastStep: currentStep === animationSteps.length - 1,
    
    // Error state
    hasError,
    errorMessage
  };
} 