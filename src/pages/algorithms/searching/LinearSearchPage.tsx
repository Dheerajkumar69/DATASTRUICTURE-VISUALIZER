import React from 'react';
import ArrayPageTemplate, { Step } from '../../../components/templates/ArrayPageTemplate';
import { AlgorithmInfo } from '../../../types/algorithm';

const linearSearchInfo: AlgorithmInfo = {
  name: "Linear Search",
  description: "Linear Search is the simplest search algorithm that works by checking each element of the array one by one until a match is found or the entire array has been searched. It works on both sorted and unsorted arrays.",
  timeComplexity: {
    best: 'O(1)',
    average: 'O(n)',
    worst: 'O(n)'
  },
  spaceComplexity: 'O(1)',
  implementations: {
    javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1; // Element not found
}`,
    python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1  # Element not found`,
    java: `public int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1; // Element not found
}`,
    cpp: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1; // Element not found
}`
  }
};

const generateLinearSearchSteps = (array: number[]): Step[] => {
  const steps: Step[] = [];
  
  // Choose a target that is somewhere in the second half of the array
  // This gives a good demo for linear search
  const targetIndex = Math.floor(array.length * 0.7);
  const target = array[targetIndex];
  
  // Initial step
  steps.push({
    array: [...array],
    activeIndices: [],
    comparingIndices: [],
    stepDescription: `Starting linear search for target value ${target}`
  });
  
  for (let i = 0; i < array.length; i++) {
    // Current comparison
    steps.push({
      array: [...array],
      activeIndices: Array.from({ length: i }, (_, idx) => idx),
      comparingIndices: [i],
      stepDescription: `Checking element at index ${i}: ${array[i]}`
    });
    
    // Found the target
    if (array[i] === target) {
      steps.push({
        array: [...array],
        activeIndices: [],
        comparingIndices: [i],
        stepDescription: `Found target ${target} at index ${i}!`
      });
      break;
    }
    
    // Not found yet
    if (i < array.length - 1) {
      steps.push({
        array: [...array],
        activeIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
        comparingIndices: [],
        stepDescription: `Element at index ${i} does not match target. Moving to next element.`
      });
    }
  }
  
  // If we've gone through the entire array without finding the target
  if (steps[steps.length - 1].stepDescription !== `Found target ${target} at index ${targetIndex}!`) {
    steps.push({
      array: [...array],
      activeIndices: Array.from({ length: array.length }, (_, idx) => idx),
      comparingIndices: [],
      stepDescription: `Searched entire array. Target ${target} not found.`
    });
  }
  
  return steps;
};

const LinearSearchPage: React.FC = () => {
  return (
    <ArrayPageTemplate
      algorithmInfo={linearSearchInfo}
      generateSteps={generateLinearSearchSteps}
      defaultArray={[23, 10, 38, 64, 72, 16, 5, 90, 47, 29]}
    />
  );
};

export default LinearSearchPage; 