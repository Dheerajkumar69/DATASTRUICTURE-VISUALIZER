import React from 'react';
import SortingPageTemplate, { AnimationStep, SortingAlgorithmInfo } from '../../../components/templates/SortingPageTemplate';

const bubbleSortInfo: SortingAlgorithmInfo = {
  name: 'Bubble Sort',
  description: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted. The algorithm gets its name because the smaller elements "bubble" to the top of the list.',
  timeComplexityBest: 'O(n)',
  timeComplexityAverage: 'O(n²)',
  timeComplexityWorst: 'O(n²)',
  spaceComplexity: 'O(1)',
  stability: 'Stable',
  implementations: [
    {
      language: 'javascript',
      title: 'Bubble Sort - JavaScript Implementation',
      code: `function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    // Last i elements are already in place
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap if they are in wrong order
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    // If no swapping occurred in this pass, array is sorted
    if (!swapped) break;
  }
  
  return arr;
}`
    },
    {
      language: 'python',
      title: 'Bubble Sort - Python Implementation',
      code: `def bubble_sort(arr):
    n = len(arr)
    
    # Traverse through all array elements
    for i in range(n - 1):
        # Last i elements are already sorted
        swapped = False
        
        # Traverse the array from 0 to n-i-1
        for j in range(n - i - 1):
            # Compare adjacent elements
            if arr[j] > arr[j + 1]:
                # Swap if they are in wrong order
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        # If no swapping occurred in this pass, array is sorted
        if not swapped:
            break
    
    return arr`
    },
    {
      language: 'java',
      title: 'Bubble Sort - Java Implementation',
      code: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    
    for (int i = 0; i < n - 1; i++) {
        // Last i elements are already in place
        boolean swapped = false;
        
        for (int j = 0; j < n - i - 1; j++) {
            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                // Swap if they are in wrong order
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        
        // If no swapping occurred in this pass, array is sorted
        if (!swapped) break;
    }
}`
    },
    {
      language: 'c++',
      title: 'Bubble Sort - C++ Implementation',
      code: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    
    for (int i = 0; i < n - 1; i++) {
        // Last i elements are already in place
        bool swapped = false;
        
        for (int j = 0; j < n - i - 1; j++) {
            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                // Swap if they are in wrong order
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        
        // If no swapping occurred in this pass, array is sorted
        if (!swapped) break;
    }
}`
    }
  ]
};

const generateBubbleSortSteps = (array: number[]): AnimationStep[] => {
  const steps: AnimationStep[] = [];
  const arr = [...array];
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      // Comparing adjacent elements
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        description: `Comparing adjacent elements: ${arr[j]} and ${arr[j + 1]}`
      });
      
      // If current element is greater than next element, swap them
      if (arr[j] > arr[j + 1]) {
        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          description: `Swapping ${arr[j]} and ${arr[j + 1]} as they are in wrong order`
        });
        
        // Swap the elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    // The largest element is now at the end, mark it as sorted
    steps.push({
      type: 'sorted',
      indices: [n - i - 1],
      description: `Element ${arr[n - i - 1]} is now in its correct sorted position`
    });
    
    // If no swapping occurred in this pass, array is sorted
    if (!swapped) {
      // Mark all remaining elements as sorted
      const remainingIndices: number[] = [];
      for (let k = 0; k < n - i - 1; k++) {
        remainingIndices.push(k);
      }
      
      if (remainingIndices.length > 0) {
        steps.push({
          type: 'sorted',
          indices: remainingIndices,
          description: 'No swaps needed in this pass. Remaining elements are already sorted.'
        });
      }
      
      break;
    }
  }
  
  return steps;
};

const BubbleSortPage: React.FC = () => {
  return (
    <SortingPageTemplate
      algorithmInfo={bubbleSortInfo}
      generateSteps={generateBubbleSortSteps}
    />
  );
};

export default BubbleSortPage; 