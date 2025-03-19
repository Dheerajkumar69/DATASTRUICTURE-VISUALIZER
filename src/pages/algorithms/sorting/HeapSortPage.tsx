import React from 'react';
import SortingPageTemplate, { 
  SortingAlgorithmInfo, 
  AnimationStep
} from '../../../components/templates/SortingPageTemplate';

// Heap Sort algorithm info
const heapSortInfo: SortingAlgorithmInfo = {
  name: 'Heap Sort',
  description: 'Heap Sort is a comparison-based sorting technique that uses a binary heap data structure. It first builds a max heap (where the largest element is at the root), then repeatedly extracts the maximum element and rebuilds the heap until the array is sorted.',
  timeComplexityBest: 'O(n log n)',
  timeComplexityAverage: 'O(n log n)',
  timeComplexityWorst: 'O(n log n)',
  spaceComplexity: 'O(1)',
  stability: 'Not Stable',
  implementations: [
    {
      language: 'javascript',
      title: 'JavaScript Implementation',
      code: `function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root (maximum element) to end
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    // Call heapify on the reduced heap
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;         // Initialize largest as root
  const left = 2 * i + 1;  // Left child
  const right = 2 * i + 2; // Right child
  
  // If left child is larger than root
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  // If right child is larger than largest so far
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  // If largest is not root
  if (largest !== i) {
    // Swap elements
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    
    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest);
  }
}`
    },
    {
      language: 'python',
      title: 'Python Implementation',
      code: `def heap_sort(arr):
    n = len(arr)
    
    # Build a max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    
    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        # Swap the root (maximum element) with the last element
        arr[i], arr[0] = arr[0], arr[i]
        
        # Call heapify on the reduced heap
        heapify(arr, i, 0)
    
    return arr

def heapify(arr, n, i):
    largest = i      # Initialize largest as root
    left = 2 * i + 1 # Left child
    right = 2 * i + 2 # Right child
    
    # If left child is larger than root
    if left < n and arr[left] > arr[largest]:
        largest = left
    
    # If right child is larger than largest so far
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    # If largest is not root
    if largest != i:
        # Swap elements
        arr[i], arr[largest] = arr[largest], arr[i]
        
        # Recursively heapify the affected sub-tree
        heapify(arr, n, largest)`
    },
    {
      language: 'java',
      title: 'Java Implementation',
      code: `public static void heapSort(int[] arr) {
    int n = arr.length;
    
    // Build max heap
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // Extract elements from heap one by one
    for (int i = n - 1; i > 0; i--) {
        // Move current root (maximum element) to end
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        
        // Call heapify on the reduced heap
        heapify(arr, i, 0);
    }
}

private static void heapify(int[] arr, int n, int i) {
    int largest = i;      // Initialize largest as root
    int left = 2 * i + 1; // Left child
    int right = 2 * i + 2; // Right child
    
    // If left child is larger than root
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    // If right child is larger than largest so far
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    // If largest is not root
    if (largest != i) {
        // Swap elements
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        
        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest);
    }
}`
    },
    {
      language: 'cpp',
      title: 'C++ Implementation',
      code: `void heapSort(int arr[], int n) {
    // Build max heap
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // Extract elements from heap one by one
    for (int i = n - 1; i > 0; i--) {
        // Move current root (maximum element) to end
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        
        // Call heapify on the reduced heap
        heapify(arr, i, 0);
    }
}

void heapify(int arr[], int n, int i) {
    int largest = i;      // Initialize largest as root
    int left = 2 * i + 1; // Left child
    int right = 2 * i + 2; // Right child
    
    // If left child is larger than root
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    // If right child is larger than largest so far
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    // If largest is not root
    if (largest != i) {
        // Swap elements
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        
        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest);
    }
}`
    }
  ]
};

// Generate steps for heap sort visualization
const generateHeapSortSteps = (arr: number[]): AnimationStep[] => {
  const steps: AnimationStep[] = [];
  const arrayCopy = [...arr];
  const n = arrayCopy.length;
  
  // Helper function to get parent and child indices
  const getParentIndex = (i: number) => Math.floor((i - 1) / 2);
  const getLeftChildIndex = (i: number) => 2 * i + 1;
  const getRightChildIndex = (i: number) => 2 * i + 2;
  
  // Helper function to heapify a subtree rooted at index i
  const heapify = (array: number[], size: number, rootIndex: number) => {
    let largest = rootIndex;      // Initialize largest as root
    const left = getLeftChildIndex(rootIndex); // Left child
    const right = getRightChildIndex(rootIndex); // Right child
    
    steps.push({
      type: 'compare',
      indices: [rootIndex],
      description: `Heapifying subtree rooted at index ${rootIndex} with value ${array[rootIndex]}`
    });
    
    // If left child exists and is larger than root
    if (left < size) {
      steps.push({
        type: 'compare',
        indices: [largest, left],
        description: `Comparing root at index ${largest} (value ${array[largest]}) with left child at index ${left} (value ${array[left]})`
      });
      
      if (array[left] > array[largest]) {
        largest = left;
        steps.push({
          type: 'compare',
          indices: [largest],
          description: `Left child is larger, updating largest to index ${largest} with value ${array[largest]}`
        });
      }
    }
    
    // If right child exists and is larger than largest so far
    if (right < size) {
      steps.push({
        type: 'compare',
        indices: [largest, right],
        description: `Comparing current largest at index ${largest} (value ${array[largest]}) with right child at index ${right} (value ${array[right]})`
      });
      
      if (array[right] > array[largest]) {
        largest = right;
        steps.push({
          type: 'compare',
          indices: [largest],
          description: `Right child is larger, updating largest to index ${largest} with value ${array[largest]}`
        });
      }
    }
    
    // If largest is not root
    if (largest !== rootIndex) {
      steps.push({
        type: 'swap',
        indices: [rootIndex, largest],
        description: `Swapping root at index ${rootIndex} (value ${array[rootIndex]}) with largest child at index ${largest} (value ${array[largest]})`
      });
      
      // Swap elements
      [array[rootIndex], array[largest]] = [array[largest], array[rootIndex]];
      
      // Recursively heapify the affected sub-tree
      heapify(array, size, largest);
    }
  };
  
  // Build max heap
  steps.push({
    type: 'compare',
    indices: [],
    description: 'Starting to build max heap'
  });
  
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arrayCopy, n, i);
  }
  
  steps.push({
    type: 'compare',
    indices: [],
    description: 'Max heap built, starting to extract elements'
  });
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    steps.push({
      type: 'swap',
      indices: [0, i],
      description: `Moving current root (maximum element ${arrayCopy[0]}) to the end at index ${i}`
    });
    
    // Move current root (maximum element) to end
    [arrayCopy[0], arrayCopy[i]] = [arrayCopy[i], arrayCopy[0]];
    
    // Mark the element as sorted
    steps.push({
      type: 'sorted',
      indices: [i],
      description: `Element at index ${i} with value ${arrayCopy[i]} is now in its correct sorted position`
    });
    
    // Call heapify on the reduced heap
    heapify(arrayCopy, i, 0);
  }
  
  // Mark the first element as sorted (it's already in the right place)
  steps.push({
    type: 'sorted',
    indices: [0],
    description: `Element at index 0 with value ${arrayCopy[0]} is now in its correct sorted position`
  });
  
  // Mark all elements as sorted
  steps.push({
    type: 'sorted',
    indices: Array.from({ length: n }, (_, i) => i),
    description: 'Array is now completely sorted'
  });
  
  return steps;
};

const HeapSortPage: React.FC = () => {
  return (
    <SortingPageTemplate
      algorithmInfo={heapSortInfo}
      generateSteps={generateHeapSortSteps}
    />
  );
};

export default HeapSortPage;
