import React from 'react';
import ArrayPageTemplate from '../../../components/templates/ArrayPageTemplate';
import { AlgorithmInfo } from '../../../types/algorithm';

const slidingWindowInfo: AlgorithmInfo = {
  name: "Sliding Window",
  description: "The Sliding Window technique is a method used to solve problems involving arrays or lists by maintaining a window of elements that slides through the array. It's particularly useful for problems that require finding a subarray or subsequence that satisfies certain conditions.",
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)'
  },
  spaceComplexity: 'O(1)',
  implementations: {
    javascript: `function slidingWindow(arr, k) {
  let maxSum = 0;
  let windowSum = 0;
  
  // Calculate sum of first window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  
  // Slide window and update max sum
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}`,
    python: `def sliding_window(arr, k):
    max_sum = 0
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i - k] + arr[i]
        max_sum = max(max_sum, window_sum)
    
    return max_sum`,
    java: `public int slidingWindow(int[] arr, int k) {
    int maxSum = 0;
    int windowSum = 0;
    
    // Calculate sum of first window
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    maxSum = windowSum;
    
    // Slide window and update max sum
    for (int i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}`,
    cpp: `int slidingWindow(vector<int>& arr, int k) {
    int maxSum = 0;
    int windowSum = 0;
    
    // Calculate sum of first window
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    maxSum = windowSum;
    
    // Slide window and update max sum
    for (int i = k; i < arr.size(); i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = max(maxSum, windowSum);
    }
    
    return maxSum;
}`
  }
};

const generateSlidingWindowSteps = (array: number[]): Array<{
  array: number[];
  activeIndices: number[];
  comparingIndices: number[];
  stepDescription: string;
}> => {
  const steps = [];
  const k = 3; // Window size
  let windowSum = 0;
  let maxSum = 0;

  // Calculate initial window sum
  for (let i = 0; i < k; i++) {
    windowSum += array[i];
  }
  maxSum = windowSum;

  // Initial step showing first window
  steps.push({
    array: [...array],
    activeIndices: Array.from({ length: k }, (_, i) => i),
    comparingIndices: [],
    stepDescription: `Initial window sum: ${windowSum}`
  });

  // Slide window and update max sum
  for (let i = k; i < array.length; i++) {
    // Show window sliding
    steps.push({
      array: [...array],
      activeIndices: Array.from({ length: k }, (_, j) => i - k + j + 1),
      comparingIndices: [i - k],
      stepDescription: `Sliding window: removing ${array[i - k]} and adding ${array[i]}`
    });

    windowSum = windowSum - array[i - k] + array[i];
    
    if (windowSum > maxSum) {
      maxSum = windowSum;
      steps.push({
        array: [...array],
        activeIndices: Array.from({ length: k }, (_, j) => i - k + j + 1),
        comparingIndices: [],
        stepDescription: `New maximum sum found: ${maxSum}`
      });
    } else {
      steps.push({
        array: [...array],
        activeIndices: Array.from({ length: k }, (_, j) => i - k + j + 1),
        comparingIndices: [],
        stepDescription: `Current window sum: ${windowSum}`
      });
    }
  }

  // Final step showing result
  steps.push({
    array: [...array],
    activeIndices: [],
    comparingIndices: [],
    stepDescription: `Maximum sum of any ${k}-element subarray: ${maxSum}`
  });

  return steps;
};

const SlidingWindowPage: React.FC = () => {
  return (
    <ArrayPageTemplate
      algorithmInfo={slidingWindowInfo}
      generateSteps={generateSlidingWindowSteps}
      defaultArray={[2, 1, 5, 1, 3, 2]}
    />
  );
};

export default SlidingWindowPage; 