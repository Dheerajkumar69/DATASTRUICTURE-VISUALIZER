# Standardized Animation System

This folder contains utilities for creating consistent animations across all algorithm problems and data structures in the project.

## Components and Utilities

### 1. AnimationUtils.ts
- Provides standard animation durations, timing functions, and keyframes
- Contains helper functions for creating animated steps

### 2. AnimatedComponents.tsx
- Theme-compatible animated components for various visualization elements
- Includes standardized control panels, info panels, and other UI elements

### 3. useAlgorithmAnimation.ts
- A custom React hook for managing animation state and controls
- Handles animation timing, stepping, and user controls

## How to Use

### Basic Implementation for Algorithm Problems

1. **Import necessary utilities and components**:
   ```tsx
   import { 
     useAlgorithmAnimation, 
     AnimatedArrayElement,
     AnimationControls,
     InfoPanel,
     InfoTitle,
     InfoContent,
     createAnimatedStep
   } from '../../components/utils';
   ```

2. **Define your algorithm state interface**:
   ```tsx
   interface SortingState {
     array: number[];
     comparisons: number;
     swaps: number;
     indices: {
       current: number;
       comparing: number;
       sorted: number[];
     };
   }
   ```

3. **Initialize the animation hook**:
   ```tsx
   const {
     currentState,
     currentStep,
     isAnimating,
     isPaused,
     animationSpeed,
     currentDescription,
     setSteps,
     startAnimation,
     pauseAnimation,
     resetAnimation,
     stepForward,
     stepBackward,
     setAnimationSpeed,
     canStepForward,
     canStepBackward
   } = useAlgorithmAnimation<SortingState>({ 
     initialState: { 
       array: [],
       comparisons: 0,
       swaps: 0, 
       indices: {
         current: -1,
         comparing: -1,
         sorted: []
       }
     } 
   });
   ```

4. **Generate animation steps from your algorithm**:
   ```tsx
   const runBubbleSort = (array: number[]) => {
     const steps: AnimationStep<SortingState>[] = [];
     const arr = [...array];
     
     // Initial step
     steps.push(createAnimatedStep(
       { 
         array: [...arr], 
         comparisons: 0, 
         swaps: 0,
         indices: { current: 0, comparing: 1, sorted: [] }
       },
       "Starting bubble sort...",
       [0, 1],
       'highlight'
     ));
     
     // Add algorithm steps...
     
     setSteps(steps);
   };
   ```

5. **Render the visualization with themed components**:
   ```tsx
   return (
     <div>
       <AnimationControls
         isAnimating={isAnimating}
         isPaused={isPaused}
         onStart={startAnimation}
         onPause={pauseAnimation}
         onReset={resetAnimation}
         onStepForward={stepForward}
         onStepBackward={stepBackward}
         onSpeedChange={setAnimationSpeed}
         currentSpeed={animationSpeed}
         canStepForward={canStepForward}
         canStepBackward={canStepBackward}
       />
       
       <ArrayContainer>
         {currentState.array.map((value, index) => (
           <AnimatedArrayElement
             key={index}
             isHighlighted={currentState.indices.current === index}
             isActive={currentState.indices.comparing === index}
             isVisited={currentState.indices.sorted.includes(index)}
             animationType={currentState.indices.comparing === index ? 'update' : 'default'}
           >
             {value}
           </AnimatedArrayElement>
         ))}
       </ArrayContainer>
       
       {currentDescription && (
         <InfoPanel>
           <InfoContent>{currentDescription}</InfoContent>
         </InfoPanel>
       )}
     </div>
   );
   ```

## Animation Types

The following animation types are available:

- `default`: Simple fade-in animation
- `add`: Scale-in animation for new elements
- `remove`: Fade-out animation for removing elements
- `highlight`: Pulse highlight animation
- `update`: Pulse animation for updating elements
- `move`: Slide-in animation for moving elements

## Custom Styling

All components use theme values from the project's theme system, ensuring consistency with the rest of the UI. 