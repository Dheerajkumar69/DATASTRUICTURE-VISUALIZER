import React from 'react';
import SortingPageTemplate, { AnimationStep, SortingAlgorithmInfo } from '../../../components/templates/SortingPageTemplate';

const selectionSortInfo: SortingAlgorithmInfo = {
  name: 'Selection Sort',
  description: 'Selection Sort is a simple comparison-based sorting algorithm. It divides the input list into two parts: a sorted sublist of items which is built up from left to right, and a sublist of remaining unsorted items. Initially, the sorted sublist is empty and the unsorted sublist is the entire input list. The algorithm repeatedly finds the minimum element from the unsorted sublist and places it at the end of the sorted sublist.',
  timeComplexityBest: 'O(n²)',
  timeComplexityAverage: 'O(n²)',
  timeComplexityWorst: 'O(n²)',
  spaceComplexity: 'O(1)',
  stability: 'Not Stable',
  implementations: [
    {
      language: 'javascript',
      title: 'Selection Sort - JavaScript Implementation',
      code: `function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    // Find the minimum element in unsorted array
    let minIndex = i;
    
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap the found minimum element with the first element
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  
  return arr;
}`
    },
    {
      language: 'python',
      title: 'Selection Sort - Python Implementation',
      code: `def selection_sort(arr):
    n = len(arr)
    
    # Traverse through all array elements
    for i in range(n - 1):
        # Find the minimum element in remaining unsorted array
        min_index = i
        
        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j
        
        # Swap the found minimum element with the first element
        if min_index != i:
            arr[i], arr[min_index] = arr[min_index], arr[i]
    
    return arr`
    },
    {
      language: 'java',
      title: 'Selection Sort - Java Implementation',
      code: `public static void selectionSort(int[] arr) {
    int n = arr.length;
    
    for (int i = 0; i < n - 1; i++) {
        // Find the minimum element in unsorted array
        int minIndex = i;
        
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // Swap the found minimum element with the first element
        if (minIndex != i) {
            int temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }
}`
    },
    {
      language: 'c++',
      title: 'Selection Sort - C++ Implementation',
      code: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    
    for (int i = 0; i < n - 1; i++) {
        // Find the minimum element in unsorted array
        int minIndex = i;
        
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // Swap the found minimum element with the first element
        if (minIndex != i) {
            swap(arr[i], arr[minIndex]);
        }
    }
}`
    }
  ]
};

const generateSelectionSortSteps = (array: number[]): AnimationStep[] => {
  const steps: AnimationStep[] = [];
  const arr = [...array];
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    // Find the minimum element in unsorted array
    let minIndex = i;
    
    steps.push({
      type: 'compare',
      indices: [i],
      description: `Starting new pass. Assuming element at index ${i} (value ${arr[i]}) is the minimum.`
    });
    
    for (let j = i + 1; j < n; j++) {
      steps.push({
        type: 'compare',
        indices: [minIndex, j],
        description: `Comparing minimum ${arr[minIndex]} at index ${minIndex} with ${arr[j]} at index ${j}`
      });
      
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        steps.push({
          type: 'compare',
          indices: [minIndex],
          description: `Found new minimum ${arr[minIndex]} at index ${minIndex}`
        });
      }
    }
    
    // Swap the found minimum element with the first element
    if (minIndex !== i) {
      steps.push({
        type: 'swap',
        indices: [i, minIndex],
        description: `Swapping ${arr[i]} at index ${i} with minimum ${arr[minIndex]} at index ${minIndex}`
      });
      
      // Perform the swap
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
    
    // Mark the element as sorted
    steps.push({
      type: 'sorted',
      indices: [i],
      description: `Element ${arr[i]} is now at its correct sorted position at index ${i}`
    });
  }
  
  // Mark the last element as sorted (it's already in the right place)
  steps.push({
    type: 'sorted',
    indices: [n - 1],
    description: `Last element ${arr[n - 1]} is now at its correct sorted position at index ${n - 1}`
  });
  
  return steps;
};

const SelectionSortPage: React.FC = () => {
  return (
    <SortingPageTemplate
      algorithmInfo={selectionSortInfo}
      generateSteps={generateSelectionSortSteps}
    />
  );
};

export default SelectionSortPage; 