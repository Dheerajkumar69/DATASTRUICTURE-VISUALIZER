import React from 'react';
import ArrayPageTemplate, { Step } from '../../../components/templates/ArrayPageTemplate';
import { AlgorithmInfo } from '../../../types/algorithm';

const kadaneInfo: AlgorithmInfo = {
  name: "Kadane's Algorithm",
  description: "Kadane's Algorithm is an efficient algorithm to find the maximum subarray sum in a given array of integers. It works by maintaining a running sum of the current subarray and updating the maximum sum whenever a larger sum is found.",
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)'
  },
  spaceComplexity: 'O(1)',
  implementations: {
    javascript: `function kadaneAlgorithm(arr) {
  let maxCurrent = arr[0];
  let maxGlobal = arr[0];
  
  for (let i = 1; i < arr.length; i++) {
    maxCurrent = Math.max(arr[i], maxCurrent + arr[i]);
    maxGlobal = Math.max(maxGlobal, maxCurrent);
  }
  
  return maxGlobal;
}`,
    python: `def kadane_algorithm(arr):
    max_current = arr[0]
    max_global = arr[0]
    
    for i in range(1, len(arr)):
        max_current = max(arr[i], max_current + arr[i])
        max_global = max(max_global, max_current)
    
    return max_global`,
    java: `public int kadaneAlgorithm(int[] arr) {
    int maxCurrent = arr[0];
    int maxGlobal = arr[0];
    
    for (int i = 1; i < arr.length; i++) {
        maxCurrent = Math.max(arr[i], maxCurrent + arr[i]);
        maxGlobal = Math.max(maxGlobal, maxCurrent);
    }
    
    return maxGlobal;
}`,
    cpp: `int kadaneAlgorithm(vector<int>& arr) {
    int maxCurrent = arr[0];
    int maxGlobal = arr[0];
    
    for (int i = 1; i < arr.size(); i++) {
        maxCurrent = max(arr[i], maxCurrent + arr[i]);
        maxGlobal = max(maxGlobal, maxCurrent);
    }
    
    return maxGlobal;
}`
  }
};

const generateKadaneSteps = (array: number[]): Step[] => {
  const steps: Step[] = [];
  let maxCurrent = array[0];
  let maxGlobal = array[0];
  let start = 0;
  let end = 0;
  let currentStart = 0;

  // Initial step
  steps.push({
    array: [...array],
    activeIndices: [0],
    comparingIndices: [],
    stepDescription: 'Initialize maxCurrent and maxGlobal with first element'
  });

  for (let i = 1; i < array.length; i++) {
    // Compare current element with current sum
    steps.push({
      array: [...array],
      activeIndices: [i],
      comparingIndices: [currentStart, i - 1],
      stepDescription: `Comparing element at index ${i} with current subarray sum`
    });

    if (array[i] > maxCurrent + array[i]) {
      maxCurrent = array[i];
      currentStart = i;
      steps.push({
        array: [...array],
        activeIndices: [i],
        comparingIndices: [],
        stepDescription: `Starting new subarray at index ${i}`
      });
    } else {
      maxCurrent = maxCurrent + array[i];
      steps.push({
        array: [...array],
        activeIndices: Array.from({ length: i - currentStart + 1 }, (_, idx) => idx + currentStart),
        comparingIndices: [],
        stepDescription: `Extending current subarray to include index ${i}`
      });
    }

    if (maxCurrent > maxGlobal) {
      maxGlobal = maxCurrent;
      start = currentStart;
      end = i;
      steps.push({
        array: [...array],
        activeIndices: Array.from({ length: end - start + 1 }, (_, idx) => idx + start),
        comparingIndices: [],
        stepDescription: `Found new maximum subarray sum: ${maxGlobal}`
      });
    }
  }

  // Final step showing the result
  steps.push({
    array: [...array],
    activeIndices: Array.from({ length: end - start + 1 }, (_, idx) => idx + start),
    comparingIndices: [],
    stepDescription: `Maximum subarray sum: ${maxGlobal}`
  });

  return steps;
};

const KadanePage: React.FC = () => {
  return (
    <ArrayPageTemplate
      algorithmInfo={kadaneInfo}
      generateSteps={generateKadaneSteps}
      defaultArray={[-2, 1, -3, 4, -1, 2, 1, -5, 4]}
    />
  );
};

export default KadanePage; 