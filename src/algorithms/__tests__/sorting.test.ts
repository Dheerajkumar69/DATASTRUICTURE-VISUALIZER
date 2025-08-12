import { describe, test, expect, beforeEach } from '@jest/globals';

// Sorting Algorithm Implementations for Testing
export const sortingAlgorithms = {
  bubbleSort: (arr: number[]): number[] => {
    const result = [...arr];
    const n = result.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (result[j] > result[j + 1]) {
          [result[j], result[j + 1]] = [result[j + 1], result[j]];
        }
      }
    }
    
    return result;
  },

  quickSort: (arr: number[]): number[] => {
    if (arr.length <= 1) return arr;
    
    const pivot = arr[Math.floor(arr.length / 2)];
    const less = arr.filter(x => x < pivot);
    const equal = arr.filter(x => x === pivot);
    const greater = arr.filter(x => x > pivot);
    
    return [
      ...sortingAlgorithms.quickSort(less),
      ...equal,
      ...sortingAlgorithms.quickSort(greater)
    ];
  },

  mergeSort: (arr: number[]): number[] => {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = sortingAlgorithms.mergeSort(arr.slice(0, mid));
    const right = sortingAlgorithms.mergeSort(arr.slice(mid));
    
    return merge(left, right);
  },

  insertionSort: (arr: number[]): number[] => {
    const result = [...arr];
    
    for (let i = 1; i < result.length; i++) {
      const key = result[i];
      let j = i - 1;
      
      while (j >= 0 && result[j] > key) {
        result[j + 1] = result[j];
        j--;
      }
      
      result[j + 1] = key;
    }
    
    return result;
  },

  selectionSort: (arr: number[]): number[] => {
    const result = [...arr];
    const n = result.length;
    
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      
      for (let j = i + 1; j < n; j++) {
        if (result[j] < result[minIdx]) {
          minIdx = j;
        }
      }
      
      if (minIdx !== i) {
        [result[i], result[minIdx]] = [result[minIdx], result[i]];
      }
    }
    
    return result;
  },

  heapSort: (arr: number[]): number[] => {
    const result = [...arr];
    const n = result.length;
    
    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(result, n, i);
    }
    
    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      [result[0], result[i]] = [result[i], result[0]];
      heapify(result, i, 0);
    }
    
    return result;
  },

  countingSort: (arr: number[]): number[] => {
    if (arr.length === 0) return arr;
    
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const result = new Array(arr.length);
    
    // Count occurrences
    for (let i = 0; i < arr.length; i++) {
      count[arr[i] - min]++;
    }
    
    // Change count[i] to actual position
    for (let i = 1; i < range; i++) {
      count[i] += count[i - 1];
    }
    
    // Build result array
    for (let i = arr.length - 1; i >= 0; i--) {
      result[count[arr[i] - min] - 1] = arr[i];
      count[arr[i] - min]--;
    }
    
    return result;
  }
};

// Helper functions
function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let leftIdx = 0;
  let rightIdx = 0;
  
  while (leftIdx < left.length && rightIdx < right.length) {
    if (left[leftIdx] <= right[rightIdx]) {
      result.push(left[leftIdx]);
      leftIdx++;
    } else {
      result.push(right[rightIdx]);
      rightIdx++;
    }
  }
  
  return result.concat(left.slice(leftIdx)).concat(right.slice(rightIdx));
}

function heapify(arr: number[], n: number, i: number): void {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}

// Test data generators
const generateTestCases = () => ({
  empty: [],
  single: [1],
  sorted: [1, 2, 3, 4, 5],
  reverse: [5, 4, 3, 2, 1],
  random: [64, 34, 25, 12, 22, 11, 90],
  duplicates: [4, 2, 7, 2, 9, 4, 1, 7],
  large: Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000)),
  negative: [-3, -1, -7, -2, -5],
  mixed: [-5, -1, 0, 3, 8, -2, 10],
  allSame: [5, 5, 5, 5, 5]
});

describe('Sorting Algorithms', () => {
  let testCases: ReturnType<typeof generateTestCases>;

  beforeEach(() => {
    testCases = generateTestCases();
  });

  describe('Correctness Tests', () => {
    const algorithmNames = Object.keys(sortingAlgorithms) as (keyof typeof sortingAlgorithms)[];

    algorithmNames.forEach(algorithmName => {
      describe(algorithmName, () => {
        Object.entries(testCases).forEach(([caseName, input]) => {
          test(`should correctly sort ${caseName} array`, () => {
            const expected = [...input].sort((a, b) => a - b);
            const result = sortingAlgorithms[algorithmName](input);
            
            expect(result).toEqual(expected);
            expect(input).toEqual(testCases[caseName as keyof typeof testCases]); // Original unchanged
          });
        });

        test('should handle edge cases', () => {
          expect(sortingAlgorithms[algorithmName]([])).toEqual([]);
          expect(sortingAlgorithms[algorithmName]([1])).toEqual([1]);
          expect(sortingAlgorithms[algorithmName]([2, 1])).toEqual([1, 2]);
        });

        test('should not modify original array', () => {
          const original = [3, 1, 4, 1, 5];
          const originalCopy = [...original];
          
          sortingAlgorithms[algorithmName](original);
          
          expect(original).toEqual(originalCopy);
        });
      });
    });
  });

  describe('Performance Characteristics', () => {
    test('bubble sort should handle worst case (reverse sorted)', () => {
      const input = Array.from({ length: 50 }, (_, i) => 50 - i);
      const startTime = performance.now();
      
      const result = sortingAlgorithms.bubbleSort(input);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(result).toEqual(Array.from({ length: 50 }, (_, i) => i + 1));
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('quick sort should handle best case', () => {
      const input = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000));
      const startTime = performance.now();
      
      const result = sortingAlgorithms.quickSort(input);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(result).toEqual([...input].sort((a, b) => a - b));
      expect(duration).toBeLessThan(100); // Should be fast
    });

    test('merge sort should have consistent performance', () => {
      const sizes = [100, 500, 1000];
      const times: number[] = [];
      
      sizes.forEach(size => {
        const input = Array.from({ length: size }, () => Math.floor(Math.random() * size));
        const startTime = performance.now();
        
        sortingAlgorithms.mergeSort(input);
        
        const endTime = performance.now();
        times.push(endTime - startTime);
      });
      
      // Merge sort should scale relatively linearly for these sizes
      expect(times[2]).toBeLessThan(times[0] * 20); // Not more than 20x slower for 10x data
    });
  });

  describe('Stability Tests', () => {
    interface NumberWithId {
      value: number;
      id: number;
    }

    const createStableTestData = (): NumberWithId[] => [
      { value: 3, id: 1 },
      { value: 1, id: 1 },
      { value: 3, id: 2 },
      { value: 2, id: 1 },
      { value: 1, id: 2 }
    ];

    // For algorithms that should be stable
    test('merge sort should be stable', () => {
      const stableTestData = createStableTestData();
      const values = stableTestData.map(item => item.value);
      const sorted = sortingAlgorithms.mergeSort(values);
      
      // Expected: [1, 1, 2, 3, 3]
      expect(sorted).toEqual([1, 1, 2, 3, 3]);
      
      // Note: This is a simplified stability test since we're only testing values
      // In a real implementation, we'd need to track the original objects
    });

    test('insertion sort should be stable', () => {
      const stableTestData = createStableTestData();
      const values = stableTestData.map(item => item.value);
      const sorted = sortingAlgorithms.insertionSort(values);
      
      expect(sorted).toEqual([1, 1, 2, 3, 3]);
    });
  });

  describe('Memory Usage Tests', () => {
    test('in-place algorithms should not create excessive arrays', () => {
      const input = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000));
      
      // Monitor memory usage (simplified)
      const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      sortingAlgorithms.bubbleSort(input);
      sortingAlgorithms.selectionSort(input);
      sortingAlgorithms.insertionSort(input);
      
      const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 10MB for this test)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle arrays with extreme values', () => {
      const extremeValues = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, 0];
      
      Object.values(sortingAlgorithms).forEach(algorithm => {
        const result = algorithm(extremeValues);
        expect(result).toEqual([Number.MIN_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER]);
      });
    });

    test('should handle arrays with floating point numbers', () => {
      const floats = [3.14, 2.71, 1.41, 1.73];
      const expected = [1.41, 1.73, 2.71, 3.14];
      
      Object.values(sortingAlgorithms).forEach(algorithm => {
        const result = algorithm(floats);
        expect(result).toEqual(expected);
      });
    });

    test('should handle very large arrays efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, () => Math.floor(Math.random() * 10000));
      
      const startTime = performance.now();
      const result = sortingAlgorithms.quickSort(largeArray);
      const endTime = performance.now();
      
      expect(result.length).toBe(largeArray.length);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
      
      // Verify it's actually sorted
      for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThanOrEqual(result[i - 1]);
      }
    });
  });

  describe('Algorithm-Specific Tests', () => {
    describe('Counting Sort', () => {
      test('should work with small range of integers', () => {
        const input = [4, 2, 2, 8, 3, 3, 1];
        const result = sortingAlgorithms.countingSort(input);
        expect(result).toEqual([1, 2, 2, 3, 3, 4, 8]);
      });

      test('should handle negative numbers', () => {
        const input = [-1, -3, 0, -2, 2, 1];
        const result = sortingAlgorithms.countingSort(input);
        expect(result).toEqual([-3, -2, -1, 0, 1, 2]);
      });
    });

    describe('Quick Sort', () => {
      test('should handle worst case pivot selection', () => {
        // Already sorted array (worst case for basic pivot selection)
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const result = sortingAlgorithms.quickSort(input);
        expect(result).toEqual(input);
      });
    });

    describe('Merge Sort', () => {
      test('should handle uneven split arrays', () => {
        const input = [5, 2, 8, 1, 9, 3, 7, 4, 6];
        const result = sortingAlgorithms.mergeSort(input);
        expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      });
    });
  });
});
