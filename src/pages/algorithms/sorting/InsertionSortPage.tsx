import React from 'react';
import SortingPageTemplate, { AnimationStep, SortingAlgorithmInfo } from '../../../components/templates/SortingPageTemplate';

const insertionSortInfo: SortingAlgorithmInfo = {
  name: 'Insertion Sort',
  description: 'Insertion Sort is a simple sorting algorithm that works by building the final sorted array one item at a time. It is efficient for small data sets and is often used as part of more sophisticated algorithms. It works by taking elements from the unsorted part and inserting them into their correct position in the sorted part.',
  timeComplexityBest: 'O(n)',
  timeComplexityAverage: 'O(n²)',
  timeComplexityWorst: 'O(n²)',
  spaceComplexity: 'O(1)',
  stability: 'Stable',
  implementations: [
    {
      language: 'javascript',
      title: 'Insertion Sort - JavaScript Implementation',
      code: `function insertionSort(arr) {
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    // Store the current element to be inserted in the right place
    const key = arr[i];
    let j = i - 1;
    
    // Move elements of arr[0..i-1] that are greater than key
    // to one position ahead of their current position
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    // Place key at its correct position
    arr[j + 1] = key;
  }
  
  return arr;
}`
    },
    {
      language: 'python',
      title: 'Insertion Sort - Python Implementation',
      code: `def insertion_sort(arr):
    n = len(arr)
    
    # Traverse through 1 to n
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        
        # Move elements of arr[0..i-1] that are greater than key
        # to one position ahead of their current position
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
            
        # Place key at its correct position
        arr[j + 1] = key
    
    return arr`
    },
    {
      language: 'java',
      title: 'Insertion Sort - Java Implementation',
      code: `public static void insertionSort(int[] arr) {
    int n = arr.length;
    
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        // Move elements of arr[0..i-1] that are greater than key
        // to one position ahead of their current position
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        // Place key at its correct position
        arr[j + 1] = key;
    }
}`
    },
    {
      language: 'c++',
      title: 'Insertion Sort - C++ Implementation',
      code: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        // Move elements of arr[0..i-1] that are greater than key
        // to one position ahead of their current position
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        // Place key at its correct position
        arr[j + 1] = key;
    }
}`
    }
  ]
};

const generateInsertionSortSteps = (array: number[]): AnimationStep[] => {
  const steps: AnimationStep[] = [];
  const arr = [...array];
  const n = arr.length;
  
  // Mark the first element as sorted (it's already in place)
  steps.push({
    type: 'sorted',
    indices: [0],
    description: `First element ${arr[0]} is already sorted`
  });
  
  // Iterate through the array starting from the second element
  for (let i = 1; i < n; i++) {
    // Store the current element to be inserted
    const key = arr[i];
    
    steps.push({
      type: 'compare',
      indices: [i],
      description: `Considering element ${key} at index ${i} for insertion into the sorted portion`
    });
    
    let j = i - 1;
    
    // Compare key with each element in the sorted subarray arr[0..i-1]
    while (j >= 0 && arr[j] > key) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        description: `Comparing ${arr[j]} at index ${j} with ${key}`
      });
      
      steps.push({
        type: 'swap',
        indices: [j, j + 1],
        description: `Moving ${arr[j]} one position ahead to index ${j + 1}`
      });
      
      // Move elements of arr[0..i-1] that are greater than key
      // to one position ahead of their current position
      arr[j + 1] = arr[j];
      j--;
    }
    
    // Place key at its correct position in sorted array
    if (j + 1 !== i) {
      steps.push({
        type: 'swap',
        indices: [j + 1],
        description: `Placing ${key} at its correct position (index ${j + 1})`
      });
      
      arr[j + 1] = key;
    }
    
    // Mark the current element as sorted
    steps.push({
      type: 'sorted',
      indices: [j + 1],
      description: `Element ${arr[j + 1]} is now in its correct sorted position at index ${j + 1}`
    });
    
    // Update the list of sorted indices (all elements from 0 to i)
    if (i > 1) {
      const sortedIndices: number[] = [];
      for (let k = 0; k <= i; k++) {
        if (k !== j + 1) { // Skip the one we just marked
          sortedIndices.push(k);
        }
      }
      
      if (sortedIndices.length > 0) {
        steps.push({
          type: 'sorted',
          indices: sortedIndices,
          description: `All elements from index 0 to ${i} are now sorted`
        });
      }
    }
  }
  
  return steps;
};

const InsertionSortPage: React.FC = () => {
  return (
    <SortingPageTemplate
      algorithmInfo={insertionSortInfo}
      generateSteps={generateInsertionSortSteps}
    />
  );
};

export default InsertionSortPage; 