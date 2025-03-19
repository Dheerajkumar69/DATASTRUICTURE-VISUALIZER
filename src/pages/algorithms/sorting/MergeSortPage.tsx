import React from 'react';
import SortingPageTemplate, { 
  SortingAlgorithmInfo, 
  AnimationStep
} from '../../../components/templates/SortingPageTemplate';

// Merge Sort algorithm info
const mergeSortInfo: SortingAlgorithmInfo = {
  name: 'Merge Sort',
  description: 'Merge Sort is an efficient, stable, comparison-based, divide and conquer sorting algorithm. It divides the input array into two halves, recursively sorts them, and then merges the sorted halves to produce a sorted output.',
  timeComplexityBest: 'O(n log n)',
  timeComplexityAverage: 'O(n log n)',
  timeComplexityWorst: 'O(n log n)',
  spaceComplexity: 'O(n)',
  stability: 'Stable',
  implementations: [
    {
      language: 'javascript',
      title: 'JavaScript Implementation',
      code: `function mergeSort(arr) {
  // Base case: arrays with 0 or 1 element are already sorted
  if (arr.length <= 1) {
    return arr;
  }
  
  // Divide the array into two halves
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  // Recursively sort both halves
  const sortedLeft = mergeSort(left);
  const sortedRight = mergeSort(right);
  
  // Merge the sorted halves
  return merge(sortedLeft, sortedRight);
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Compare elements from both arrays and add the smaller one to the result
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  // Add remaining elements from either array
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}`
    },
    {
      language: 'python',
      title: 'Python Implementation',
      code: `def merge_sort(arr):
    # Base case: arrays with 0 or 1 element are already sorted
    if len(arr) <= 1:
        return arr
    
    # Divide the array into two halves
    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]
    
    # Recursively sort both halves
    left = merge_sort(left)
    right = merge_sort(right)
    
    # Merge the sorted halves
    return merge(left, right)

def merge(left, right):
    result = []
    i, j = 0, 0
    
    # Compare elements from both arrays and add the smaller one to the result
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # Add remaining elements from either array
    result.extend(left[i:])
    result.extend(right[j:])
    return result`
    },
    {
      language: 'java',
      title: 'Java Implementation',
      code: `public static void mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        // Find the middle point
        int mid = left + (right - left) / 2;
        
        // Sort first and second halves
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        
        // Merge the sorted halves
        merge(arr, left, mid, right);
    }
}

public static void merge(int[] arr, int left, int mid, int right) {
    // Find sizes of two subarrays to be merged
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    // Create temp arrays
    int[] L = new int[n1];
    int[] R = new int[n2];
    
    // Copy data to temp arrays
    for (int i = 0; i < n1; ++i)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; ++j)
        R[j] = arr[mid + 1 + j];
    
    // Merge the temp arrays
    int i = 0, j = 0;
    int k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    // Copy remaining elements of L[] if any
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    // Copy remaining elements of R[] if any
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}`
    },
    {
      language: 'cpp',
      title: 'C++ Implementation',
      code: `void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    // Create temp arrays
    int* L = new int[n1];
    int* R = new int[n2];
    
    // Copy data to temp arrays
    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];
    
    // Merge the temp arrays back into arr[left..right]
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    // Copy the remaining elements of L[]
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    // Copy the remaining elements of R[]
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
    
    delete[] L;
    delete[] R;
}

void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        // Same as (left+right)/2, but avoids overflow
        int mid = left + (right - left) / 2;
        
        // Sort first and second halves
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        
        // Merge the sorted halves
        merge(arr, left, mid, right);
    }
}`
    }
  ]
};

// Generate steps for merge sort visualization
const generateMergeSortSteps = (arr: number[]): AnimationStep[] => {
  const steps: AnimationStep[] = [];
  const arrayCopy = [...arr];
  
  // Helper function to record steps during the merge sort process
  const merge = (array: number[], start: number, mid: number, end: number) => {
    // Create temporary arrays
    const leftArray = array.slice(start, mid + 1);
    const rightArray = array.slice(mid + 1, end + 1);
    
    steps.push({
      type: 'compare',
      indices: Array.from({ length: end - start + 1 }, (_, i) => i + start),
      description: `Merging subarrays from index ${start} to ${mid} and from ${mid + 1} to ${end}`
    });
    
    let i = 0;
    let j = 0;
    let k = start;
    
    // Compare elements from both subarrays and place them in the main array
    while (i < leftArray.length && j < rightArray.length) {
      steps.push({
        type: 'compare',
        indices: [start + i, mid + 1 + j],
        description: `Comparing ${leftArray[i]} and ${rightArray[j]}`
      });
      
      if (leftArray[i] <= rightArray[j]) {
        steps.push({
          type: 'compare',
          indices: [k],
          description: `Placing ${leftArray[i]} at position ${k}`
        });
        
        array[k] = leftArray[i];
        i++;
      } else {
        steps.push({
          type: 'compare',
          indices: [k],
          description: `Placing ${rightArray[j]} at position ${k}`
        });
        
        array[k] = rightArray[j];
        j++;
      }
      k++;
    }
    
    // Copy remaining elements from left subarray
    while (i < leftArray.length) {
      steps.push({
        type: 'compare',
        indices: [k],
        description: `Placing remaining element ${leftArray[i]} from left subarray at position ${k}`
      });
      
      array[k] = leftArray[i];
      i++;
      k++;
    }
    
    // Copy remaining elements from right subarray
    while (j < rightArray.length) {
      steps.push({
        type: 'compare',
        indices: [k],
        description: `Placing remaining element ${rightArray[j]} from right subarray at position ${k}`
      });
      
      array[k] = rightArray[j];
      j++;
      k++;
    }
    
    // Mark the range as sorted
    steps.push({
      type: 'sorted',
      indices: Array.from({ length: end - start + 1 }, (_, i) => i + start),
      description: `Subarray from index ${start} to ${end} is now sorted`
    });
  };
  
  // Recursive merge sort function
  const mergeSort = (array: number[], start: number, end: number) => {
    if (start < end) {
      steps.push({
        type: 'compare',
        indices: Array.from({ length: end - start + 1 }, (_, i) => i + start),
        description: `Dividing array from index ${start} to ${end}`
      });
      
      const mid = Math.floor((start + end) / 2);
      
      // Sort first and second halves
      mergeSort(array, start, mid);
      mergeSort(array, mid + 1, end);
      
      // Merge the sorted halves
      merge(array, start, mid, end);
    } else if (start === end) {
      steps.push({
        type: 'sorted',
        indices: [start],
        description: `Single element at index ${start} is already sorted`
      });
    }
  };
  
  // Start the merge sort process
  mergeSort(arrayCopy, 0, arrayCopy.length - 1);
  
  return steps;
};

const MergeSortPage: React.FC = () => {
  return (
    <SortingPageTemplate
      algorithmInfo={mergeSortInfo}
      generateSteps={generateMergeSortSteps}
    />
  );
};

export default MergeSortPage; 