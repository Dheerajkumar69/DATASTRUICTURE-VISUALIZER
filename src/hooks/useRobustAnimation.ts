import { useEffect, useCallback, useId } from 'react';
import { useAnimationContext } from '../components/utils/AnimationContext';
import { useAlgorithmAnimation } from '../components/utils/useAlgorithmAnimation';
import { AnimationStep, ANIMATION_DURATION } from '../components/utils/AnimationUtils';

/**
 * Options for the robust animation hook
 */
interface UseRobustAnimationOptions<T> {
  initialState: T;
  steps?: AnimationStep<T>[];
  useRAF?: boolean;
  animationId?: string;
  animationSpeed?: number;
}

/**
 * A hook that combines the enhanced useAlgorithmAnimation with global animation context
 * for consistent animation management across the application.
 */
export function useRobustAnimation<T>({
  initialState,
  steps = [],
  useRAF = false,
  animationId,
  animationSpeed = ANIMATION_DURATION.MEDIUM
}: UseRobustAnimationOptions<T>) {
  // Generate a unique ID if not provided
  const generatedId = useId();
  const id = animationId || `animation-${generatedId}`;
  
  // Get global animation context
  const {
    registerAnimation,
    unregisterAnimation,
    globalAnimationRunning
  } = useAnimationContext();
  
  // Use the enhanced algorithm animation hook
  const animation = useAlgorithmAnimation({
    initialState,
    steps,
    useRAF
  });
  
  // Register this animation with the global context when it mounts
  useEffect(() => {
    // Register this animation with the global context
    registerAnimation(id);
    
    return () => {
      unregisterAnimation(id);
    };
  }, [id, registerAnimation, unregisterAnimation]);
  
  // Sync with global animation state
  useEffect(() => {
    if (animation.isAnimating && !globalAnimationRunning) {
      animation.pauseAnimation();
    }
  }, [globalAnimationRunning, animation.isAnimating, animation.pauseAnimation]);
  
  // Enhanced controls with error handling
  const startAnimation = useCallback(() => {
    try {
      animation.startAnimation();
    } catch (error) {
      console.error('Error starting animation:', error);
    }
  }, [animation.startAnimation]);
  
  const pauseAnimation = useCallback(() => {
    try {
      animation.pauseAnimation();
    } catch (error) {
      console.error('Error pausing animation:', error);
    }
  }, [animation.pauseAnimation]);
  
  const resetAnimation = useCallback(() => {
    try {
      animation.resetAnimation();
    } catch (error) {
      console.error('Error resetting animation:', error);
    }
  }, [animation.resetAnimation]);
  
  const stepForward = useCallback(() => {
    try {
      animation.stepForward();
    } catch (error) {
      console.error('Error stepping forward animation:', error);
    }
  }, [animation.stepForward]);
  
  const stepBackward = useCallback(() => {
    try {
      animation.stepBackward();
    } catch (error) {
      console.error('Error stepping backward animation:', error);
    }
  }, [animation.stepBackward]);
  
  // Return enhanced animation controls and state
  return {
    ...animation,
    animationId: id,
    startAnimation,
    pauseAnimation,
    resetAnimation,
    stepForward,
    stepBackward
  };
} 