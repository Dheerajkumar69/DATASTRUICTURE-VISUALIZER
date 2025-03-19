import React from 'react';
import SortingPageTemplate, { 
  SortingAlgorithmInfo, 
  AnimationStep
} from '../../../components/templates/SortingPageTemplate';

// Quick Sort algorithm info
const quickSortInfo: SortingAlgorithmInfo = {
  name: 'Quick Sort',
  description: 'Quick Sort is an efficient, in-place, divide-and-conquer sorting algorithm. It works by selecting a "pivot" element and partitioning the array around the pivot, recursively sorting the resulting sub-arrays.',
  timeComplexityBest: 'O(n log n)',
  timeComplexityAverage: 'O(n log n)',
  timeComplexityWorst: 'O(n²)',
  spaceComplexity: 'O(log n)',
  stability: 'Not Stable',
  implementations: [
    {
      language: 'javascript',
      title: 'JavaScript Implementation',
      code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Partition the array and get the pivot index
    const pivotIndex = partition(arr, low, high);
    
    // Recursively sort the sub-arrays
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  
  return arr;
}

function partition(arr, low, high) {
  // Choose the rightmost element as the pivot
  const pivot = arr[high];
  
  // Index of smaller element
  let i = low - 1;
  
  // Compare each element with pivot
  for (let j = low; j < high; j++) {
    // If current element is smaller than the pivot
    if (arr[j] < pivot) {
      // Increment index of smaller element
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  // Place the pivot element at its correct position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
  // Return the position where partition is done
  return i + 1;
}`
    },
    {
      language: 'python',
      title: 'Python Implementation',
      code: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        # Partition the array and get the pivot index
        pivot_index = partition(arr, low, high)
        
        # Recursively sort the sub-arrays
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)
    
    return arr

def partition(arr, low, high):
    # Choose the rightmost element as the pivot
    pivot = arr[high]
    
    # Index of smaller element
    i = low - 1
    
    # Compare each element with pivot
    for j in range(low, high):
        # If current element is smaller than the pivot
        if arr[j] < pivot:
            # Increment index of smaller element
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    # Place the pivot element at its correct position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    
    # Return the position where partition is done
    return i + 1`
    },
    {
      language: 'java',
      title: 'Java Implementation',
      code: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        // Partition the array and get the pivot index
        int pivotIndex = partition(arr, low, high);
        
        // Recursively sort the sub-arrays
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}

public static int partition(int[] arr, int low, int high) {
    // Choose the rightmost element as the pivot
    int pivot = arr[high];
    
    // Index of smaller element
    int i = low - 1;
    
    // Compare each element with pivot
    for (int j = low; j < high; j++) {
        // If current element is smaller than the pivot
        if (arr[j] < pivot) {
            // Increment index of smaller element
            i++;
            
            // Swap arr[i] and arr[j]
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    // Place the pivot element at its correct position
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    // Return the position where partition is done
    return i + 1;
}`
    },
    {
      language: 'cpp',
      title: 'C++ Implementation',
      code: `void quickSort(int arr[], int low, int high) {
    if (low < high) {
        // Partition the array and get the pivot index
        int pivotIndex = partition(arr, low, high);
        
        // Recursively sort the sub-arrays
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}

int partition(int arr[], int low, int high) {
    // Choose the rightmost element as the pivot
    int pivot = arr[high];
    
    // Index of smaller element
    int i = low - 1;
    
    // Compare each element with pivot
    for (int j = low; j < high; j++) {
        // If current element is smaller than the pivot
        if (arr[j] < pivot) {
            // Increment index of smaller element
            i++;
            
            // Swap arr[i] and arr[j]
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    // Place the pivot element at its correct position
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    // Return the position where partition is done
    return i + 1;
}`
    }
  ]
};

// Generate steps for quick sort visualization
const generateQuickSortSteps = (arr: number[]): AnimationStep[] => {
  const steps: AnimationStep[] = [];
  const arrayCopy = [...arr];
  
  // Helper function to record steps during the quick sort process
  const partition = (array: number[], low: number, high: number) => {
    // Choose the rightmost element as the pivot
    const pivot = array[high];
    
    steps.push({
      type: 'compare',
      indices: [high],
      description: `Choosing element at index ${high} with value ${pivot} as pivot`
    });
    
    // Index of smaller element
    let i = low - 1;
    
    // Compare each element with pivot
    for (let j = low; j < high; j++) {
      steps.push({
        type: 'compare',
        indices: [j, high],
        description: `Comparing element at index ${j} (${array[j]}) with pivot (${pivot})`
      });
      
      // If current element is smaller than the pivot
      if (array[j] < pivot) {
        // Increment index of smaller element
        i++;
        
        if (i !== j) {
          steps.push({
            type: 'swap',
            indices: [i, j],
            description: `Swapping elements at indices ${i} (${array[i]}) and ${j} (${array[j]})`
          });
          
          // Swap array[i] and array[j]
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
    }
    
    // Place the pivot element at its correct position
    const pivotIndex = i + 1;
    
    if (pivotIndex !== high) {
      steps.push({
        type: 'swap',
        indices: [pivotIndex, high],
        description: `Placing pivot at its correct position: swapping elements at indices ${pivotIndex} (${array[pivotIndex]}) and ${high} (${array[high]})`
      });
      
      // Swap array[i+1] and array[high]
      [array[pivotIndex], array[high]] = [array[high], array[pivotIndex]];
    }
    
    steps.push({
      type: 'sorted',
      indices: [pivotIndex],
      description: `Pivot element ${pivot} is now at its correct sorted position at index ${pivotIndex}`
    });
    
    // Return the position where partition is done
    return pivotIndex;
  };
  
  // Recursive quick sort function
  const quickSort = (array: number[], low: number, high: number) => {
    if (low < high) {
      steps.push({
        type: 'compare',
        indices: Array.from({ length: high - low + 1 }, (_, i) => i + low),
        description: `Processing subarray from index ${low} to ${high}`
      });
      
      // Partition the array and get the pivot index
      const pivotIndex = partition(array, low, high);
      
      // Sort elements before and after the pivot
      quickSort(array, low, pivotIndex - 1);
      quickSort(array, pivotIndex + 1, high);
    } else if (low === high) {
      steps.push({
        type: 'sorted',
        indices: [low],
        description: `Single element at index ${low} is already sorted`
      });
    }
  };
  
  // Start the quick sort process
  quickSort(arrayCopy, 0, arrayCopy.length - 1);
  
  // Mark all elements as sorted
  steps.push({
    type: 'sorted',
    indices: Array.from({ length: arrayCopy.length }, (_, i) => i),
    description: 'Array is now completely sorted'
  });
  
  return steps;
};

const QuickSortPage: React.FC = () => {
  return (
    <SortingPageTemplate
      algorithmInfo={quickSortInfo}
      generateSteps={generateQuickSortSteps}
    />
  );
};

export default QuickSortPage; 