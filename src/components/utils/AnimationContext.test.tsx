import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AnimationProvider, useAnimationContext } from './AnimationContext';

// Wrapper component for testing hooks
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AnimationProvider>{children}</AnimationProvider>
);

describe('AnimationContext', () => {
  test('provides initial state correctly', () => {
    const { result } = renderHook(() => useAnimationContext(), { wrapper });

    expect(result.current.globalAnimationRunning).toBe(false);
    expect(result.current.getActiveAnimations()).toEqual([]);
    expect(typeof result.current.setGlobalAnimationRunning).toBe('function');
    expect(typeof result.current.registerAnimation).toBe('function');
    expect(typeof result.current.unregisterAnimation).toBe('function');
    expect(typeof result.current.pauseAllAnimations).toBe('function');
    expect(typeof result.current.resumeAllAnimations).toBe('function');
    expect(typeof result.current.resetAllAnimations).toBe('function');
  });

  test('setGlobalAnimationRunning updates state correctly', () => {
    const { result } = renderHook(() => useAnimationContext(), { wrapper });

    act(() => {
      result.current.setGlobalAnimationRunning(true);
    });

    expect(result.current.globalAnimationRunning).toBe(true);

    act(() => {
      result.current.setGlobalAnimationRunning(false);
    });

    expect(result.current.globalAnimationRunning).toBe(false);
  });

  test('registerAnimation adds animation to active list', () => {
    const { result } = renderHook(() => useAnimationContext(), { wrapper });

    act(() => {
      result.current.registerAnimation('test-animation-1');
    });

    expect(result.current.getActiveAnimations()).toContain('test-animation-1');

    act(() => {
      result.current.registerAnimation('test-animation-2');
    });

    const activeAnimations = result.current.getActiveAnimations();
    expect(activeAnimations).toContain('test-animation-1');
    expect(activeAnimations).toContain('test-animation-2');
    expect(activeAnimations).toHaveLength(2);
  });

  test('unregisterAnimation removes animation from active list', () => {
    const { result } = renderHook(() => useAnimationContext(), { wrapper });

    act(() => {
      result.current.registerAnimation('test-animation-1');
      result.current.registerAnimation('test-animation-2');
    });

    expect(result.current.getActiveAnimations()).toHaveLength(2);

    act(() => {
      result.current.unregisterAnimation('test-animation-1');
    });

    const activeAnimations = result.current.getActiveAnimations();
    expect(activeAnimations).not.toContain('test-animation-1');
    expect(activeAnimations).toContain('test-animation-2');
    expect(activeAnimations).toHaveLength(1);
  });

  test('pauseAllAnimations sets global state to false', () => {
    const { result } = renderHook(() => useAnimationContext(), { wrapper });

    act(() => {
      result.current.setGlobalAnimationRunning(true);
    });

    expect(result.current.globalAnimationRunning).toBe(true);

    act(() => {
      result.current.pauseAllAnimations();
    });

    expect(result.current.globalAnimationRunning).toBe(false);
  });

  test('resumeAllAnimations sets global state to true', () => {
    const { result } = renderHook(() => useAnimationContext(), { wrapper });

    expect(result.current.globalAnimationRunning).toBe(false);

    act(() => {
      result.current.resumeAllAnimations();
    });

    expect(result.current.globalAnimationRunning).toBe(true);
  });

  test('resetAllAnimations sets global state to false', () => {
    const { result } = renderHook(() => useAnimationContext(), { wrapper });

    act(() => {
      result.current.setGlobalAnimationRunning(true);
    });

    expect(result.current.globalAnimationRunning).toBe(true);

    act(() => {
      result.current.resetAllAnimations();
    });

    expect(result.current.globalAnimationRunning).toBe(false);
  });

  test('registerAnimation handles duplicate IDs correctly', () => {
    const { result } = renderHook(() => useAnimationContext(), { wrapper });

    act(() => {
      result.current.registerAnimation('duplicate-id');
      result.current.registerAnimation('duplicate-id');
    });

    const activeAnimations = result.current.getActiveAnimations();
    expect(activeAnimations.filter(id => id === 'duplicate-id')).toHaveLength(1);
  });

  test('unregisterAnimation handles non-existent IDs gracefully', () => {
    const { result } = renderHook(() => useAnimationContext(), { wrapper });

    act(() => {
      result.current.registerAnimation('existing-animation');
    });

    expect(result.current.getActiveAnimations()).toHaveLength(1);

    act(() => {
      result.current.unregisterAnimation('non-existent-animation');
    });

    expect(result.current.getActiveAnimations()).toHaveLength(1);
    expect(result.current.getActiveAnimations()).toContain('existing-animation');
  });

  test('context functions are stable across re-renders', () => {
    const { result, rerender } = renderHook(() => useAnimationContext(), { wrapper });

    const initialFunctions = {
      setGlobalAnimationRunning: result.current.setGlobalAnimationRunning,
      registerAnimation: result.current.registerAnimation,
      unregisterAnimation: result.current.unregisterAnimation,
      pauseAllAnimations: result.current.pauseAllAnimations,
      resumeAllAnimations: result.current.resumeAllAnimations,
      resetAllAnimations: result.current.resetAllAnimations,
      getActiveAnimations: result.current.getActiveAnimations,
    };

    rerender();

    expect(result.current.setGlobalAnimationRunning).toBe(initialFunctions.setGlobalAnimationRunning);
    expect(result.current.registerAnimation).toBe(initialFunctions.registerAnimation);
    expect(result.current.unregisterAnimation).toBe(initialFunctions.unregisterAnimation);
    expect(result.current.pauseAllAnimations).toBe(initialFunctions.pauseAllAnimations);
    expect(result.current.resumeAllAnimations).toBe(initialFunctions.resumeAllAnimations);
    expect(result.current.resetAllAnimations).toBe(initialFunctions.resetAllAnimations);
    expect(result.current.getActiveAnimations).toBe(initialFunctions.getActiveAnimations);
  });
});
