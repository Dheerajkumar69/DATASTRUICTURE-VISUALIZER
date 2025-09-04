import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  getAnimationStyles,
  delay,
  safeTimeout,
  safeClearTimeout,
  safeRequestAnimationFrame,
  safeCancelAnimationFrame,
  createAnimatedStep,
  cloneStep,
  measureAnimationPerformance,
} from './AnimationUtils';

// Mock console methods
const consoleError = jest.spyOn(console, 'error').mockImplementation();
const consoleLog = jest.spyOn(console, 'log').mockImplementation();

describe('AnimationUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    consoleError.mockClear();
    consoleLog.mockClear();
  });

  describe('Constants', () => {
    test('ANIMATION_DURATION has correct values', () => {
      expect(ANIMATION_DURATION.SLOW).toBe(1000);
      expect(ANIMATION_DURATION.MEDIUM).toBe(500);
      expect(ANIMATION_DURATION.FAST).toBe(200);
    });

    test('ANIMATION_EASING has correct values', () => {
      expect(ANIMATION_EASING.DEFAULT).toBe('ease-in-out');
      expect(ANIMATION_EASING.LINEAR).toBe('linear');
      expect(ANIMATION_EASING.EASE_IN).toBe('ease-in');
      expect(ANIMATION_EASING.EASE_OUT).toBe('ease-out');
      expect(ANIMATION_EASING.BOUNCE).toBe('cubic-bezier(0.175, 0.885, 0.32, 1.275)');
    });
  });

  describe('getAnimationStyles', () => {
    test('returns correct styles for add animation', () => {
      const styles = getAnimationStyles('add', 300);
      expect(styles).toContain('300ms');
      expect(styles).toContain('ease-in-out');
    });

    test('returns correct styles for remove animation', () => {
      const styles = getAnimationStyles('remove', 400);
      expect(styles).toContain('400ms');
      expect(styles).toContain('ease-in-out');
    });

    test('returns correct styles for highlight animation', () => {
      const styles = getAnimationStyles('highlight', 600);
      expect(styles).toContain('600ms');
      expect(styles).toContain('ease-in-out');
    });

    test('returns correct styles for move animation', () => {
      const styles = getAnimationStyles('move', 250);
      expect(styles).toContain('250ms');
      expect(styles).toContain('ease-in-out');
    });

    test('returns correct styles for update animation', () => {
      const styles = getAnimationStyles('update', 350);
      expect(styles).toContain('350ms');
      expect(styles).toContain('ease-in-out');
    });

    test('returns default styles for unknown animation type', () => {
      const styles = getAnimationStyles('unknown', 500);
      expect(styles).toContain('500ms');
      expect(styles).toContain('ease-in-out');
    });

    test('uses default duration when not provided', () => {
      const styles = getAnimationStyles('add');
      expect(styles).toContain('500ms'); // ANIMATION_DURATION.MEDIUM
    });
  });

  describe('delay function', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('resolves after specified time', async () => {
      const promise = delay(1000);
      let resolved = false;

      promise.then(() => {
        resolved = true;
      });

      expect(resolved).toBe(false);
      
      jest.advanceTimersByTime(999);
      await Promise.resolve(); // Let microtasks run
      expect(resolved).toBe(false);
      
      jest.advanceTimersByTime(1);
      await Promise.resolve(); // Let microtasks run
      expect(resolved).toBe(true);
    });

    test('resolves with void', async () => {
      const promise = delay(100);
      jest.advanceTimersByTime(100);
      const result = await promise;
      expect(result).toBeUndefined();
    });
  });

  describe('safeTimeout function', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('executes callback after specified time', async () => {
      const callback = jest.fn();
      const promise = safeTimeout(callback, 1000);

      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);
      await promise;

      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('resolves promise after callback execution', async () => {
      const callback = jest.fn();
      const promise = safeTimeout(callback, 500);

      let resolved = false;
      promise.then(() => {
        resolved = true;
      });

      jest.advanceTimersByTime(500);
      await Promise.resolve();

      expect(resolved).toBe(true);
      expect(callback).toHaveBeenCalled();
    });

    test('handles callback errors gracefully', async () => {
      const errorCallback = jest.fn(() => {
        throw new Error('Callback error');
      });

      const promise = safeTimeout(errorCallback, 100);
      jest.advanceTimersByTime(100);

      await expect(promise).rejects.toThrow('Callback error');
      expect(consoleError).toHaveBeenCalledWith('Error in safeTimeout callback:', expect.any(Error));
    });
  });

  describe('safeClearTimeout function', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('returns false for null timeout', () => {
      const result = safeClearTimeout(null);
      expect(result).toBe(false);
    });

    test('returns true for valid timeout', () => {
      const timeoutId = setTimeout(() => {}, 1000);
      const result = safeClearTimeout(timeoutId);
      expect(result).toBe(true);
    });

    test('handles clearTimeout errors', () => {
      // Mock clearTimeout to throw an error
      const originalClearTimeout = global.clearTimeout;
      global.clearTimeout = jest.fn(() => {
        throw new Error('Clear timeout error');
      });

      const timeoutId = setTimeout(() => {}, 1000);
      const result = safeClearTimeout(timeoutId);

      expect(result).toBe(false);
      expect(consoleError).toHaveBeenCalledWith('Error clearing timeout:', expect.any(Error));

      // Restore original clearTimeout
      global.clearTimeout = originalClearTimeout;
    });
  });

  describe('safeRequestAnimationFrame function', () => {
    test('calls requestAnimationFrame with callback', () => {
      const callback = jest.fn();
      const mockRequestId = 123;
      
      global.requestAnimationFrame = jest.fn().mockReturnValue(mockRequestId);
      
      const result = safeRequestAnimationFrame(callback);
      
      expect(global.requestAnimationFrame).toHaveBeenCalledWith(callback);
      expect(result).toBe(mockRequestId);
    });

    test('handles requestAnimationFrame errors with setTimeout fallback', () => {
      jest.useFakeTimers();
      
      const callback = jest.fn();
      global.requestAnimationFrame = jest.fn(() => {
        throw new Error('RAF error');
      });

      const result = safeRequestAnimationFrame(callback);

      expect(consoleError).toHaveBeenCalledWith('Error in requestAnimationFrame:', expect.any(Error));
      expect(typeof result).toBe('number');

      // Check that setTimeout fallback works
      jest.advanceTimersByTime(16);
      expect(callback).toHaveBeenCalledWith(expect.any(Number));

      jest.useRealTimers();
    });
  });

  describe('safeCancelAnimationFrame function', () => {
    test('returns false for null request ID', () => {
      const result = safeCancelAnimationFrame(null);
      expect(result).toBe(false);
    });

    test('returns true for valid request ID', () => {
      global.cancelAnimationFrame = jest.fn();
      
      const result = safeCancelAnimationFrame(123);
      
      expect(global.cancelAnimationFrame).toHaveBeenCalledWith(123);
      expect(result).toBe(true);
    });

    test('handles cancelAnimationFrame errors', () => {
      global.cancelAnimationFrame = jest.fn(() => {
        throw new Error('Cancel RAF error');
      });

      const result = safeCancelAnimationFrame(123);

      expect(result).toBe(false);
      expect(consoleError).toHaveBeenCalledWith('Error canceling animation frame:', expect.any(Error));
    });
  });

  describe('createAnimatedStep function', () => {
    test('creates step with all parameters', () => {
      const state = [1, 2, 3];
      const description = 'Test step';
      const highlightedIndices = [0, 2];
      const animationType = 'highlight';
      const metadata = { custom: 'data' };

      const step = createAnimatedStep(state, description, highlightedIndices, animationType, metadata);

      expect(step.state).toBe(state);
      expect(step.description).toBe(description);
      expect(step.highlightedIndices).toBe(highlightedIndices);
      expect(step.animationType).toBe(animationType);
      expect(step.metadata).toBe(metadata);
      expect(typeof step.timestamp).toBe('number');
    });

    test('creates step with default parameters', () => {
      const state = [1, 2, 3];
      const description = 'Test step';

      const step = createAnimatedStep(state, description);

      expect(step.state).toBe(state);
      expect(step.description).toBe(description);
      expect(step.highlightedIndices).toEqual([]);
      expect(step.animationType).toBe('default');
      expect(step.metadata).toEqual({});
      expect(typeof step.timestamp).toBe('number');
    });

    test('timestamp is recent', () => {
      const before = performance.now();
      const step = createAnimatedStep([1, 2, 3], 'Test');
      const after = performance.now();

      expect(step.timestamp).toBeGreaterThanOrEqual(before);
      expect(step.timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('cloneStep function', () => {
    test('creates deep copy of step', () => {
      const originalStep = {
        state: [1, 2, 3],
        description: 'Original step',
        highlightedIndices: [0, 1],
        animationType: 'highlight',
        timestamp: 123456789,
        metadata: { custom: 'data', nested: { value: 42 } }
      };

      const clonedStep = cloneStep(originalStep);

      expect(clonedStep).toEqual(originalStep);
      expect(clonedStep).not.toBe(originalStep);
      expect(clonedStep.state).not.toBe(originalStep.state);
      expect(clonedStep.highlightedIndices).not.toBe(originalStep.highlightedIndices);
      expect(clonedStep.metadata).not.toBe(originalStep.metadata);
    });

    test('handles step with undefined optional properties', () => {
      const originalStep = {
        state: [1, 2, 3],
        description: 'Simple step',
        highlightedIndices: undefined,
        animationType: 'default',
        timestamp: 123456789,
        metadata: undefined
      };

      const clonedStep = cloneStep(originalStep);

      expect(clonedStep.highlightedIndices).toEqual([]);
      expect(clonedStep.metadata).toEqual({});
    });

    test('properly clones complex state objects', () => {
      const originalStep = {
        state: {
          array: [1, 2, 3],
          currentIndex: 1,
          comparisons: 5
        },
        description: 'Complex state',
        highlightedIndices: [0, 1],
        animationType: 'update',
        timestamp: 123456789,
        metadata: { step: 1 }
      };

      const clonedStep = cloneStep(originalStep);

      expect(clonedStep.state).toEqual(originalStep.state);
      expect(clonedStep.state).not.toBe(originalStep.state);
      expect(clonedStep.state.array).not.toBe(originalStep.state.array);
    });
  });

  describe('measureAnimationPerformance function', () => {
    let mockPerformance: any;

    beforeEach(() => {
      // Mock performance methods
      mockPerformance = {
        mark: jest.fn(),
        measure: jest.fn(),
        getEntriesByName: jest.fn().mockReturnValue([{ duration: 123.45 }]),
        clearMarks: jest.fn(),
        clearMeasures: jest.fn(),
      };

      // Replace global performance
      Object.defineProperty(global, 'performance', {
        value: mockPerformance,
        writable: true,
      });
    });

    test('measures callback performance with default label', () => {
      const callback = jest.fn();

      measureAnimationPerformance(callback);

      expect(mockPerformance.mark).toHaveBeenCalledWith('Animation Performance-start');
      expect(callback).toHaveBeenCalledTimes(1);
      expect(mockPerformance.mark).toHaveBeenCalledWith('Animation Performance-end');
      expect(mockPerformance.measure).toHaveBeenCalledWith(
        'Animation Performance',
        'Animation Performance-start',
        'Animation Performance-end'
      );
      expect(consoleLog).toHaveBeenCalledWith('Animation Performance: 123.45ms');
    });

    test('measures callback performance with custom label', () => {
      const callback = jest.fn();
      const customLabel = 'Custom Animation Test';

      measureAnimationPerformance(callback, customLabel);

      expect(mockPerformance.mark).toHaveBeenCalledWith(`${customLabel}-start`);
      expect(mockPerformance.mark).toHaveBeenCalledWith(`${customLabel}-end`);
      expect(mockPerformance.measure).toHaveBeenCalledWith(
        customLabel,
        `${customLabel}-start`,
        `${customLabel}-end`
      );
      expect(consoleLog).toHaveBeenCalledWith(`${customLabel}: 123.45ms`);
    });

    test('cleans up performance marks and measures', () => {
      const callback = jest.fn();
      const label = 'Test Label';

      measureAnimationPerformance(callback, label);

      expect(mockPerformance.clearMarks).toHaveBeenCalledWith(`${label}-start`);
      expect(mockPerformance.clearMarks).toHaveBeenCalledWith(`${label}-end`);
      expect(mockPerformance.clearMeasures).toHaveBeenCalledWith(label);
    });

    test('handles no measurement entries', () => {
      mockPerformance.getEntriesByName.mockReturnValue([]);
      const callback = jest.fn();

      measureAnimationPerformance(callback);

      expect(consoleLog).not.toHaveBeenCalled();
    });

    test('handles performance API errors', () => {
      mockPerformance.mark.mockImplementation(() => {
        throw new Error('Performance mark error');
      });

      const callback = jest.fn();

      measureAnimationPerformance(callback);

      expect(consoleError).toHaveBeenCalledWith(
        'Error measuring animation performance:',
        expect.any(Error)
      );
    });
  });
});
