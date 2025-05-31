# Animation System Migration Guide

This guide helps you migrate existing components to use the new robust animation system that includes error handling, performance monitoring, and better state management.

## Why Migrate?

The new animation system provides several benefits:

1. **Error Handling**: Proper error catching and recovery
2. **Performance Monitoring**: Track animation performance
3. **Global State Management**: Coordinate animations across components
4. **RequestAnimationFrame Support**: Option for smoother animations
5. **Cleanup Guarantees**: Better cleanup of animation timers
6. **Consistent API**: Same API across all components

## Migration Steps

### Step 1: Import the new hooks and utilities

Replace:
```tsx
import { useState, useEffect, useRef } from 'react';
```

With:
```tsx
import { useState, useRef } from 'react';
import { useRobustAnimation } from '../../hooks/useRobustAnimation';
import { safeClearTimeout, safeRequestAnimationFrame, safeCancelAnimationFrame } from '../../components/utils/AnimationUtils';
```

### Step 2: Replace animation state management

Replace:
```tsx
const [steps, setSteps] = useState<Step[]>([]);
const [currentStep, setCurrentStep] = useState<number>(0);
const [isAnimating, setIsAnimating] = useState<boolean>(false);
const [isPaused, setIsPaused] = useState<boolean>(false);
const [animationSpeed, setAnimationSpeed] = useState<number>(1000);

// Animation timer
useEffect(() => {
  let timer: NodeJS.Timeout;
  
  if (isAnimating && !isPaused && currentStep < steps.length - 1) {
    timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, animationSpeed);
  } else if (currentStep >= steps.length - 1) {
    setIsAnimating(false);
  }
  
  return () => {
    if (timer) clearTimeout(timer);
  };
}, [isAnimating, isPaused, currentStep, steps, animationSpeed]);
```

With:
```tsx
const {
  currentState: currentStepData,
  currentStep,
  isAnimating,
  isPaused,
  animationSpeed,
  startAnimation,
  pauseAnimation,
  resetAnimation,
  stepForward,
  stepBackward,
  setAnimationSpeed,
  setSteps,
  hasError,
  errorMessage
} = useRobustAnimation({
  initialState: null, // initial state value
  steps: [], // initial steps
  useRAF: true, // use requestAnimationFrame for smoother animations
  animationId: 'component-name-animation' // unique ID for this animation
});
```

### Step 3: Update control functions

Replace:
```tsx
const startAnimation = () => {
  setIsAnimating(true);
  setIsPaused(false);
};

const pauseAnimation = () => {
  setIsPaused(true);
};

const resetAnimation = () => {
  setIsAnimating(false);
  setIsPaused(false);
  setCurrentStep(0);
};

const stepForward = () => {
  if (currentStep < steps.length - 1) {
    setCurrentStep(prev => prev + 1);
  }
};

const stepBackward = () => {
  if (currentStep > 0) {
    setCurrentStep(prev => prev - 1);
  }
};
```

With:
```tsx
// The control functions are now provided by useRobustAnimation
// Just use startAnimation, pauseAnimation, resetAnimation, stepForward, stepBackward directly
```

### Step 4: Error handling

Add error handling to your component:

```tsx
// Display error message if animation encounters an error
{hasError && (
  <ErrorMessage>
    Animation error: {errorMessage}
    <Button onClick={resetAnimation}>Reset</Button>
  </ErrorMessage>
)}
```

### Step 5: Setting steps

Replace:
```tsx
setSteps(newSteps);
```

With:
```tsx
setSteps(newSteps);
```

(This stays the same, but the new system includes deeper error checking)

## Example Migration

### Before:

```tsx
const MyComponent: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1000);
  
  // Animation timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isAnimating && !isPaused && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, animationSpeed);
    } else if (currentStep >= steps.length - 1) {
      setIsAnimating(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAnimating, isPaused, currentStep, steps, animationSpeed]);
  
  // Control methods
  const startAnimation = () => {
    setIsAnimating(true);
    setIsPaused(false);
  };
  
  const pauseAnimation = () => {
    setIsPaused(true);
  };
  
  // Rest of component...
};
```

### After:

```tsx
const MyComponent: React.FC = () => {
  const {
    currentState: currentStepData,
    currentStep,
    isAnimating,
    isPaused,
    animationSpeed,
    startAnimation,
    pauseAnimation,
    resetAnimation,
    stepForward,
    stepBackward,
    setAnimationSpeed,
    setSteps,
    hasError,
    errorMessage
  } = useRobustAnimation({
    initialState: null,
    useRAF: true,
    animationId: 'my-component-animation'
  });
  
  // Rest of component...
  
  // Error handling
  if (hasError) {
    return (
      <ErrorContainer>
        <h3>Animation Error</h3>
        <p>{errorMessage}</p>
        <Button onClick={resetAnimation}>Reset Animation</Button>
      </ErrorContainer>
    );
  }
  
  // Component render...
};
```

## Tips for Successful Migration

1. Migrate one component at a time
2. Test thoroughly after each migration
3. Use the global AnimationContext for coordinating animations across components
4. Leverage the new performance monitoring tools
5. Add proper error handling throughout the component

For any questions or issues, please refer to the API documentation or contact the development team. 