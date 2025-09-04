import React from 'react';
import ArrayPageTemplate from '../../../components/templates/ArrayPageTemplate';
import { AlgorithmInfo } from '../../../types/algorithm';

const binarySearchInfo: AlgorithmInfo = {
  name: "Binary Search",
  description: "Binary Search is an efficient search algorithm that works on sorted arrays. It repeatedly divides the search interval in half, eliminating half of the elements with each comparison. This approach achieves logarithmic search time.",
  timeComplexity: {
    best: 'O(1)',
    average: 'O(log n)',
    worst: 'O(log n)'
  },
  spaceComplexity: 'O(1) for iterative, O(log n) for recursive',
  implementations: {
    javascript: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // Found target
    if (arr[mid] === target) {
      return mid;
    }
    
    // Search right half
    if (arr[mid] < target) {
      left = mid + 1;
    } 
    // Search left half
    else {
      right = mid - 1;
    }
  }
  
  // Target not found
  return -1;
}

// Recursive implementation
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  // Base case: element not found
  if (left > right) return -1;
  
  const mid = Math.floor((left + right) / 2);
  
  // Found target
  if (arr[mid] === target) {
    return mid;
  }
  
  // Search right half
  if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  } 
  // Search left half
  else {
    return binarySearchRecursive(arr, target, left, mid - 1);
  }
}`,
    python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        # Found target
        if arr[mid] == target:
            return mid
        
        # Search right half
        if arr[mid] < target:
            left = mid + 1
        # Search left half
        else:
            right = mid - 1
    
    # Target not found
    return -1

# Recursive implementation
def binary_search_recursive(arr, target, left=0, right=None):
    if right is None:
        right = len(arr) - 1
    
    # Base case: element not found
    if left > right:
        return -1
    
    mid = (left + right) // 2
    
    # Found target
    if arr[mid] == target:
        return mid
    
    # Search right half
    if arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    # Search left half
    else:
        return binary_search_recursive(arr, target, left, mid - 1)`,
    java: `public int binarySearch(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2; // Prevents integer overflow
        
        // Found target
        if (arr[mid] == target) {
            return mid;
        }
        
        // Search right half
        if (arr[mid] < target) {
            left = mid + 1;
        } 
        // Search left half
        else {
            right = mid - 1;
        }
    }
    
    // Target not found
    return -1;
}

// Recursive implementation
public int binarySearchRecursive(int[] arr, int target, int left, int right) {
    // Base case: element not found
    if (left > right) return -1;
    
    int mid = left + (right - left) / 2; // Prevents integer overflow
    
    // Found target
    if (arr[mid] == target) {
        return mid;
    }
    
    // Search right half
    if (arr[mid] < target) {
        return binarySearchRecursive(arr, target, mid + 1, right);
    } 
    // Search left half
    else {
        return binarySearchRecursive(arr, target, left, mid - 1);
    }
}`,
    cpp: `int binarySearch(vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2; // Prevents integer overflow
        
        // Found target
        if (arr[mid] == target) {
            return mid;
        }
        
        // Search right half
        if (arr[mid] < target) {
            left = mid + 1;
        } 
        // Search left half
        else {
            right = mid - 1;
        }
    }
    
    // Target not found
    return -1;
}

// Recursive implementation
int binarySearchRecursive(vector<int>& arr, int target, int left, int right) {
    // Base case: element not found
    if (left > right) return -1;
    
    int mid = left + (right - left) / 2; // Prevents integer overflow
    
    // Found target
    if (arr[mid] == target) {
        return mid;
    }
    
    // Search right half
    if (arr[mid] < target) {
        return binarySearchRecursive(arr, target, mid + 1, right);
    } 
    // Search left half
    else {
        return binarySearchRecursive(arr, target, left, mid - 1);
    }
}`
  }
};

const generateBinarySearchSteps = (array: number[]): Array<{
  array: number[];
  activeIndices: number[];
  comparingIndices: number[];
  stepDescription: string;
}> => {
  // Ensure array is sorted for binary search
  const sortedArray = [...array].sort((a, b) => a - b);
  
  // For demonstration, search for a value in the middle of the array
  const targetIndex = Math.floor(sortedArray.length / 2);
  const target = sortedArray[targetIndex];
  
  const steps = [];
  
  // Initial step
  steps.push({
    array: [...sortedArray],
    activeIndices: [],
    comparingIndices: [],
    stepDescription: `Starting binary search for target value ${target} in the sorted array`
  });
  
  let left = 0;
  let right = sortedArray.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // Show the current search interval
    steps.push({
      array: [...sortedArray],
      activeIndices: Array.from({ length: right - left + 1 }, (_, i) => i + left),
      comparingIndices: [mid],
      stepDescription: `Search interval: indices ${left} to ${right}. Checking middle element at index ${mid}`
    });
    
    // Compare with target
    if (sortedArray[mid] === target) {
      steps.push({
        array: [...sortedArray],
        activeIndices: [mid],
        comparingIndices: [],
        stepDescription: `Found target ${target} at index ${mid}!`
      });
      break;
    }
    
    if (sortedArray[mid] < target) {
      steps.push({
        array: [...sortedArray],
        activeIndices: Array.from({ length: right - left + 1 }, (_, i) => i + left),
        comparingIndices: [mid],
        stepDescription: `Middle element ${sortedArray[mid]} < target ${target}. Search right half.`
      });
      left = mid + 1;
    } else {
      steps.push({
        array: [...sortedArray],
        activeIndices: Array.from({ length: right - left + 1 }, (_, i) => i + left),
        comparingIndices: [mid],
        stepDescription: `Middle element ${sortedArray[mid]} > target ${target}. Search left half.`
      });
      right = mid - 1;
    }
  }
  
  // If we exited the loop without finding the target
  if (steps[steps.length - 1].stepDescription !== `Found target ${target} at index ${targetIndex}!`) {
    steps.push({
      array: [...sortedArray],
      activeIndices: [],
      comparingIndices: [],
      stepDescription: `Target ${target} not found in the array.`
    });
  }
  
  return steps;
};

const BinarySearchPage: React.FC = () => {
  return (
    <ArrayPageTemplate
      algorithmInfo={binarySearchInfo}
      generateSteps={generateBinarySearchSteps}
      defaultArray={[23, 10, 38, 64, 72, 16, 5, 90, 47, 29]}
    />
  );
};

export default BinarySearchPage; 