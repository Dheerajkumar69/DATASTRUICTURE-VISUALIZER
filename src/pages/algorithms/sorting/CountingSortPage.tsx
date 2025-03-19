import React from 'react';
import SortingPageTemplate, { AnimationStep, SortingAlgorithmInfo } from '../../../components/templates/SortingPageTemplate';

const countingSortInfo: SortingAlgorithmInfo = {
  name: 'Counting Sort',
  description: 'Counting sort is a non-comparative sorting algorithm that works well when there is limited range of input values. It counts the occurrences of each element and uses this information to place elements in their correct sorted positions. It is particularly efficient when the range of input values is not significantly larger than the number of elements to be sorted.',
  timeComplexityBest: 'O(n + k)',
  timeComplexityAverage: 'O(n + k)',
  timeComplexityWorst: 'O(n + k)',
  spaceComplexity: 'O(n + k)',
  stability: 'Stable',
  implementations: [
    {
      language: 'javascript',
      title: 'Counting Sort - JavaScript Implementation',
      code: `function countingSort(arr) {
  // Find the maximum element to determine the count array size
  const max = Math.max(...arr);
  
  // Create a count array of size max+1 and initialize with zeros
  const count = new Array(max + 1).fill(0);
  
  // Store the count of each element
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
  }
  
  // Modify the count array to store the position of each element
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }
  
  // Create a result array
  const result = new Array(arr.length);
  
  // Build the result array
  for (let i = arr.length - 1; i >= 0; i--) {
    result[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
  }
  
  return result;
}`
    },
    {
      language: 'python',
      title: 'Counting Sort - Python Implementation',
      code: `def counting_sort(arr):
    # Find the maximum element to determine the count array size
    max_element = max(arr)
    
    # Create a count array of size max+1 and initialize with zeros
    count = [0] * (max_element + 1)
    
    # Store the count of each element
    for num in arr:
        count[num] += 1
    
    # Modify the count array to store the position of each element
    for i in range(1, max_element + 1):
        count[i] += count[i - 1]
    
    # Create a result array
    result = [0] * len(arr)
    
    # Build the result array
    for i in range(len(arr) - 1, -1, -1):
        result[count[arr[i]] - 1] = arr[i]
        count[arr[i]] -= 1
    
    return result`
    },
    {
      language: 'java',
      title: 'Counting Sort - Java Implementation',
      code: `public static void countingSort(int[] arr) {
    // Find the maximum element to determine the count array size
    int max = Arrays.stream(arr).max().getAsInt();
    
    // Create a count array of size max+1 and initialize with zeros
    int[] count = new int[max + 1];
    
    // Store the count of each element
    for (int i = 0; i < arr.length; i++) {
        count[arr[i]]++;
    }
    
    // Modify the count array to store the position of each element
    for (int i = 1; i <= max; i++) {
        count[i] += count[i - 1];
    }
    
    // Create a result array
    int[] result = new int[arr.length];
    
    // Build the result array (process in reverse to maintain stability)
    for (int i = arr.length - 1; i >= 0; i--) {
        result[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    
    // Copy the result back to the original array
    for (int i = 0; i < arr.length; i++) {
        arr[i] = result[i];
    }
}`
    },
    {
      language: 'c++',
      title: 'Counting Sort - C++ Implementation',
      code: `void countingSort(vector<int>& arr) {
    // Find the maximum element to determine the count array size
    int max = *max_element(arr.begin(), arr.end());
    
    // Create a count array of size max+1 and initialize with zeros
    vector<int> count(max + 1, 0);
    
    // Store the count of each element
    for (int i = 0; i < arr.size(); i++) {
        count[arr[i]]++;
    }
    
    // Modify the count array to store the position of each element
    for (int i = 1; i <= max; i++) {
        count[i] += count[i - 1];
    }
    
    // Create a result array
    vector<int> result(arr.size());
    
    // Build the result array (process in reverse to maintain stability)
    for (int i = arr.size() - 1; i >= 0; i--) {
        result[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    
    // Copy the result back to the original array
    for (int i = 0; i < arr.size(); i++) {
        arr[i] = result[i];
    }
}`
    }
  ]
};

const generateCountingSortSteps = (array: number[]): AnimationStep[] => {
  const steps: AnimationStep[] = [];
  const arr = [...array];
  
  // Step 1: Find the maximum element
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    steps.push({
      type: 'compare',
      indices: [i, 0],
      description: `Comparing ${arr[i]} with current max ${max} to find the maximum value`
    });
    
    if (arr[i] > max) {
      max = arr[i];
      steps.push({
        type: 'compare',
        indices: [i],
        description: `Found new maximum: ${max}`
      });
    }
  }
  
  // Step 2: Initialize count array
  const count = new Array(max + 1).fill(0);
  steps.push({
    type: 'compare',
    indices: [],
    description: `Initialized count array of size ${max + 1} with zeros`
  });
  
  // Step 3: Store count of each element
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
    steps.push({
      type: 'compare',
      indices: [i],
      description: `Counting occurrences of element ${arr[i]}, count is now ${count[arr[i]]}`
    });
  }
  
  // Step 4: Modify count array to store position info
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
    steps.push({
      type: 'compare',
      indices: [],
      description: `Updating count array at position ${i}: ${count[i-1]} + ${count[i] - count[i-1]} = ${count[i]}`
    });
  }
  
  // Step 5: Build the output array
  const output = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    steps.push({
      type: 'compare',
      indices: [i],
      description: `Processing element ${arr[i]} at index ${i}`
    });
    
    output[count[arr[i]] - 1] = arr[i];
    steps.push({
      type: 'swap',
      indices: [i, count[arr[i]] - 1],
      description: `Placing ${arr[i]} at position ${count[arr[i]] - 1} in the output array`
    });
    
    count[arr[i]]--;
  }
  
  // Step 6: Copy back to original array and mark as sorted
  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
    steps.push({
      type: 'sorted',
      indices: [i],
      description: `Element ${output[i]} is now in its correct sorted position at index ${i}`
    });
  }
  
  return steps;
};

const CountingSortPage: React.FC = () => {
  return (
    <SortingPageTemplate
      algorithmInfo={countingSortInfo}
      generateSteps={generateCountingSortSteps}
    />
  );
};

export default CountingSortPage; 