import { useReducer, useEffect, useCallback } from 'react';

// Define action types
type Action = 
  | { type: 'SET_STEPS', payload: any[] }
  | { type: 'SET_CURRENT_STEP', payload: number }
  | { type: 'START_ANIMATION' }
  | { type: 'PAUSE_ANIMATION' }
  | { type: 'RESET_ANIMATION' }
  | { type: 'STEP_FORWARD' }
  | { type: 'STEP_BACKWARD' }
  | { type: 'SET_ANIMATION_SPEED', payload: number };

// Define state interface
interface State<T> {
  steps: T[];
  currentStep: number;
  isAnimating: boolean;
  isPaused: boolean;
  animationSpeed: number;
}

// Initial state
const initialState = <T>(): State<T> => ({
  steps: [],
  currentStep: 0,
  isAnimating: false,
  isPaused: false,
  animationSpeed: 10, // Default 10ms
});

// Reducer function
function reducer<T>(state: State<T>, action: Action): State<T> {
  switch (action.type) {
    case 'SET_STEPS':
      return {
        ...state,
        steps: action.payload,
        currentStep: 0,
        isAnimating: false,
        isPaused: false,
      };
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };
    case 'START_ANIMATION':
      return {
        ...state,
        isAnimating: true,
        isPaused: false,
      };
    case 'PAUSE_ANIMATION':
      return {
        ...state,
        isPaused: true,
      };
    case 'RESET_ANIMATION':
      return {
        ...state,
        currentStep: 0,
        isAnimating: false,
        isPaused: false,
      };
    case 'STEP_FORWARD':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.steps.length - 1),
      };
    case 'STEP_BACKWARD':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };
    case 'SET_ANIMATION_SPEED':
      return {
        ...state,
        animationSpeed: action.payload,
      };
    default:
      return state;
  }
}

// Custom hook
function useVisualizationState<T>() {
  const [state, dispatch] = useReducer(reducer<T>, initialState<T>());
  
  // Animation timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (state.isAnimating && !state.isPaused && state.currentStep < state.steps.length - 1) {
      timer = setTimeout(() => {
        dispatch({ type: 'STEP_FORWARD' });
      }, state.animationSpeed);
    } else if (state.currentStep >= state.steps.length - 1) {
      dispatch({ type: 'PAUSE_ANIMATION' });
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [state.isAnimating, state.isPaused, state.currentStep, state.steps.length, state.animationSpeed]);
  
  // Actions
  const setSteps = useCallback((steps: T[]) => {
    dispatch({ type: 'SET_STEPS', payload: steps });
  }, []);
  
  const startAnimation = useCallback(() => {
    dispatch({ type: 'START_ANIMATION' });
  }, []);
  
  const pauseAnimation = useCallback(() => {
    dispatch({ type: 'PAUSE_ANIMATION' });
  }, []);
  
  const resetAnimation = useCallback(() => {
    dispatch({ type: 'RESET_ANIMATION' });
  }, []);
  
  const stepForward = useCallback(() => {
    dispatch({ type: 'STEP_FORWARD' });
  }, []);
  
  const stepBackward = useCallback(() => {
    dispatch({ type: 'STEP_BACKWARD' });
  }, []);
  
  const setAnimationSpeed = useCallback((speed: number) => {
    dispatch({ type: 'SET_ANIMATION_SPEED', payload: speed });
  }, []);
  
  return {
    // State
    steps: state.steps,
    currentStep: state.currentStep,
    isAnimating: state.isAnimating,
    isPaused: state.isPaused,
    animationSpeed: state.animationSpeed,
    
    // Current step data
    currentStepData: state.steps[state.currentStep],
    
    // Computed values
    hasSteps: state.steps.length > 0,
    isFirstStep: state.currentStep === 0,
    isLastStep: state.currentStep === state.steps.length - 1,
    
    // Actions
    setSteps,
    startAnimation,
    pauseAnimation,
    resetAnimation,
    stepForward,
    stepBackward,
    setAnimationSpeed,
  };
}

export default useVisualizationState; 