/**
 * Manual test script for the animation system
 * This is meant to be executed in the browser console to validate the animation system's functionality.
 */

import { 
  safeTimeout, 
  safeClearTimeout, 
  safeRequestAnimationFrame, 
  safeCancelAnimationFrame,
  createAnimatedStep,
  cloneStep,
  measureAnimationPerformance
} from '../components/utils/AnimationUtils';

// Simple counter state to test animations
interface CounterState {
  count: number;
  description: string;
}

/**
 * Test the safe timeout functions
 */
export async function testSafeTimeout() {
  let timeoutId: NodeJS.Timeout | null = null;
  let testPassed = false;
  
  try {
    // Test successful callback
    await safeTimeout(() => {
      testPassed = true;
    }, 100);
    
    console.assert(testPassed, 'safeTimeout should execute callback');
    
    // Test cleanup
    timeoutId = setTimeout(() => {
    }, 1000);
    
    const cleanupSuccess = safeClearTimeout(timeoutId);
    console.assert(cleanupSuccess, 'safeClearTimeout should return true on success');
    
    // Test with null
    const cleanupNull = safeClearTimeout(null);
    console.assert(cleanupNull === false, 'safeClearTimeout should return false with null');
  } catch (error) {
    console.error('safeTimeout test failed:', error);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Test the animation frame functions
 */
export async function testAnimationFrame() {
  let rafId: number | null = null;
  let testPassed = false;
  
  try {
    // Test requestAnimationFrame
    rafId = safeRequestAnimationFrame(() => {
      testPassed = true;
    });
    
    // Wait for frame to execute
    await new Promise(resolve => setTimeout(resolve, 20));
    
    console.assert(testPassed, 'safeRequestAnimationFrame should execute callback');
    
    // Test cancellation
    testPassed = false;
    rafId = safeRequestAnimationFrame(() => {
      testPassed = true;
    });
    
    const cancelSuccess = safeCancelAnimationFrame(rafId);
    console.assert(cancelSuccess, 'safeCancelAnimationFrame should return true on success');
    
    // Wait to ensure callback was actually canceled
    await new Promise(resolve => setTimeout(resolve, 20));
    
    console.assert(!testPassed, 'Callback should not execute after cancellation');
    
    // Test with null
    const cancelNull = safeCancelAnimationFrame(null);
    console.assert(cancelNull === false, 'safeCancelAnimationFrame should return false with null');
  } catch (error) {
    console.error('Animation frame test failed:', error);
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
  }
}

/**
 * Test animation step creation and cloning
 */
export function testAnimationSteps() {
  try {
    // Create a step
    const step = createAnimatedStep<CounterState>(
      { count: 5, description: 'Test step' },
      'This is a test step',
      [1, 2, 3],
      'increment',
      { extra: 'metadata' }
    );
    
    console.assert(step.state.count === 5, 'Step should have correct state');
    console.assert(step.description === 'This is a test step', 'Step should have correct description');
    console.assert(step.highlightedIndices?.length === 3, 'Step should have correct highlights');
    console.assert(step.animationType === 'increment', 'Step should have correct animation type');
    console.assert(step.metadata?.extra === 'metadata', 'Step should have correct metadata');
    console.assert(typeof step.timestamp === 'number', 'Step should have timestamp');
    
    // Test cloning
    const cloned = cloneStep(step);
    
    // Modify original to ensure deep copy
    step.state.count = 10;
    step.highlightedIndices![0] = 99;
    step.metadata!.extra = 'changed';
    
    console.assert(cloned.state.count === 5, 'Cloned step should have original state value');
    console.assert(cloned.highlightedIndices![0] === 1, 'Cloned step should have original highlights');
    console.assert(cloned.metadata!.extra === 'metadata', 'Cloned step should have original metadata');
  } catch (error) {
    console.error('Animation step test failed:', error);
  }
}

/**
 * Test performance monitoring
 */
export function testPerformanceMonitoring() {
  try {
    // Simple performance test
    measureAnimationPerformance(() => {
      // Simulate some work
      let sum = 0;
      for (let i = 0; i < 1000000; i++) {
        sum += i;
      }
    }, 'Test computation');
  } catch (error) {
    console.error('Performance monitoring test failed:', error);
  }
}

/**
 * Run all tests
 */
export async function runAllTests() {
  await testSafeTimeout();
  await testAnimationFrame();
  testAnimationSteps();
  testPerformanceMonitoring();
}

// Execute tests when in dev mode
if (process.env.NODE_ENV === 'development') {
  console.log('Animation system test file loaded. Call runAllTests() to execute tests.');
} 