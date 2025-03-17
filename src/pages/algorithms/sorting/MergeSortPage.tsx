import React, { useState, useEffect, lazy, Suspense, memo, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiRefreshCw, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import AlgorithmDropdown from '../../../components/algorithms/AlgorithmDropdown';
// Lazy load only the syntax highlighter component
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter'));
// Import the style directly, as it's small
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Styled Components
const PageContainer = styled.div`
  padding: 1rem;
  max-width: 100%;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const NavigationRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.gray700};
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.gray900};
  }
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.gray900};
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray700};
  max-width: 100%;
  line-height: 1.5;
  font-size: 0.9rem;
  
  @media (min-width: 768px) {
    max-width: 800px;
    line-height: 1.6;
    font-size: 1rem;
  }
`;

const VisualizationContainer = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
  }
`;

const Button = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: white;
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.gray700};
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;

  svg {
    margin-right: 0.25rem;
  }

  @media (min-width: 768px) {
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    
    svg {
      margin-right: 0.5rem;
    }
  }

  &:hover {
    background-color: ${({ active, theme }) => active ? theme.colors.primaryDark : theme.colors.gray100};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SpeedControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  @media (min-width: 768px) {
    gap: 0.5rem;
  }
`;

const SpeedLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.gray700};
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

const SpeedSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: white;
  font-size: 0.8rem;
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

const BarsContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 200px;
  gap: 2px;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.gray50};
  overflow-x: auto;
  
  @media (min-width: 768px) {
    height: 300px;
    gap: 4px;
  }
`;

interface BarProps {
  height: number;
  isActive: boolean;
  isComparing: boolean;
  isSorted: boolean;
}

const Bar = styled(motion.div)<BarProps>`
  min-width: 20px;
  width: 20px;
  height: ${({ height }) => `${height}%`};
  background-color: ${({ isActive, isComparing, isSorted, theme }) => 
    isActive 
      ? theme.colors.warning
      : isComparing
        ? theme.colors.highlight
        : isSorted
          ? theme.colors.success
          : theme.colors.primary};
  border-radius: 4px 4px 0 0;
  position: relative;

  @media (min-width: 768px) {
    min-width: 30px;
    width: 30px;
  }
  
  &::after {
    content: '${({ height }) => Math.round(height)}';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.gray700};
    
    @media (min-width: 768px) {
      font-size: 0.75rem;
    }
  }
`;

const StepInfo = styled.div`
  margin-top: 1.5rem;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.8rem;
  
  @media (min-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
  }
`;

const MergeInfo = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.gray700};
  
  @media (min-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  
  @media (min-width: 768px) {
    font-size: 1.8rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
`;

const ComplexityInfo = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    margin-top: 2rem;
  }
`;

const ComplexityItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.8rem;
  
  @media (min-width: 768px) {
    padding: 0.75rem;
    font-size: 1rem;
  }
  
  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.gray100};
  }
`;

const ComplexityLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray700};
`;

const ComplexityValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  color: ${({ theme }) => theme.colors.primary};
`;

const CodeBlock = styled.div`
  margin-top: 1.5rem;
  background-color: #1E1E1E;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  
  @media (min-width: 768px) {
    margin-top: 2rem;
  }
`;

const CodeTitle = styled.div`
  padding: 0.5rem 1rem;
  background-color: #333;
  color: white;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.8rem;
  
  @media (min-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
`;

const LoadingPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: #1E1E1E;
  color: #666;
  font-size: 0.9rem;
`;

// Memoized component for bars to prevent unnecessary re-renders
const MemoizedBar = memo(({ height, isActive, isComparing, isSorted, index }: BarProps & { index: number }) => (
  <Bar
    key={index}
    height={height}
    isActive={isActive}
    isComparing={isComparing}
    isSorted={isSorted}
    initial={{ scale: 1 }}
    animate={{ scale: isActive ? 1.1 : 1 }}
    transition={{ duration: 0.2 }}
  />
));

const MergeSortPage: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<number[][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [mergePhase, setMergePhase] = useState<string>('');
  const [arraySize, setArraySize] = useState<number>(10);
  const [codeVisible, setCodeVisible] = useState<boolean>(false);
  
  // Use refs for tracking visualization state during algorithm execution
  const stepsRef = useRef<number[][]>([]);
  const currentIndicesRef = useRef<number[]>([]);
  const comparingIndicesRef = useRef<number[]>([]);
  const sortedIndicesRef = useRef<number[]>([]);
  const mergePhaseRef = useRef<string>('');

  // Sorting algorithms data for dropdown
  const algorithmOptions = [
    { name: "Bubble Sort", path: "/algorithms/sorting/bubble-sort" },
    { name: "Selection Sort", path: "/algorithms/sorting/selection-sort" },
    { name: "Insertion Sort", path: "/algorithms/sorting/insertion-sort" },
    { name: "Merge Sort", path: "/algorithms/sorting/merge-sort" },
    { name: "Quick Sort", path: "/algorithms/sorting/quick-sort" },
    { name: "Counting Sort", path: "/algorithms/sorting/counting-sort" },
    { name: "Radix Sort", path: "/algorithms/sorting/radix-sort" },
    { name: "Bucket Sort", path: "/algorithms/sorting/bucket-sort" },
    { name: "Heap Sort", path: "/algorithms/sorting/heap-sort" },
    { name: "Shell Sort", path: "/algorithms/sorting/shell-sort" }
  ];

  useEffect(() => {
    // Initialize with a random array on mount
    generateRandomArray();
    
    // Clean up function for component unmount
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
      
      // Reset all refs to prevent memory leaks
      stepsRef.current = [];
      currentIndicesRef.current = [];
      comparingIndicesRef.current = [];
      sortedIndicesRef.current = [];
    };
  }, []);  // Empty dependency array means this only runs on mount/unmount

  // Use a ref for the timeout to avoid dependency issues
  const timeoutId = React.useRef<NodeJS.Timeout | null>(null);
  
  const generateRandomArray = (size = arraySize) => {
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setSteps([newArray]);
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    setMergePhase('');
  };

  // Helper function to record a step - limiting the stored steps to prevent memory issues
  const recordStep = (arr: number[], activeIndices: number[], compareIndices: number[], phase: string) => {
    // Create a deep copy of the array for the step
    const arrCopy = [...arr];
    
    // Store state for this step
    stepsRef.current.push(arrCopy);
    
    // Limit the number of steps stored to prevent memory issues
    if (stepsRef.current.length > 1000) {
      stepsRef.current = stepsRef.current.slice(-1000);
    }
    
    currentIndicesRef.current = [...activeIndices];
    comparingIndicesRef.current = [...compareIndices];
    mergePhaseRef.current = phase;
  };

  // Helper function to merge two sorted arrays
  const merge = (arr: number[], start: number, mid: number, end: number) => {
    // Create temporary arrays
    const leftSize = mid - start + 1;
    const rightSize = end - mid;
    
    const leftArr = new Array(leftSize);
    const rightArr = new Array(rightSize);
    
    // Copy data to temporary arrays
    for (let i = 0; i < leftSize; i++) {
      leftArr[i] = arr[start + i];
    }
    for (let j = 0; j < rightSize; j++) {
      rightArr[j] = arr[mid + 1 + j];
    }
    
    // Record current state with merging phase
    recordStep([...arr], [], [], `Comparing and merging subarrays [${start}...${mid}] and [${mid+1}...${end}]`);
    
    // Initial indices of subarrays
    let i = 0;
    let j = 0; 
    let k = start; // Index for merged array
    
    // Merge the temporary arrays back into arr
    while (i < leftSize && j < rightSize) {
      // Compare elements from both subarrays
      recordStep([...arr], [], [start + i, mid + 1 + j], `Comparing ${leftArr[i]} and ${rightArr[j]}`);
      
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        // Record placing this element
        recordStep([...arr], [k], [start + i, mid + 1 + j], `Placing ${leftArr[i]} at position ${k}`);
        i++;
      } else {
        arr[k] = rightArr[j];
        // Record placing this element
        recordStep([...arr], [k], [start + i, mid + 1 + j], `Placing ${rightArr[j]} at position ${k}`);
        j++;
      }
      k++;
    }
    
    // Copy remaining elements from left subarray if any
    while (i < leftSize) {
      arr[k] = leftArr[i];
      // Record placing this element
      recordStep([...arr], [k], [], `Placing remaining element ${leftArr[i]} from left subarray`);
      i++;
      k++;
    }
    
    // Copy remaining elements from right subarray if any
    while (j < rightSize) {
      arr[k] = rightArr[j];
      // Record placing this element
      recordStep([...arr], [k], [], `Placing remaining element ${rightArr[j]} from right subarray`);
      j++;
      k++;
    }
    
    // Mark the merged section as sorted
    const sorted = [...sortedIndicesRef.current];
    for (let m = start; m <= end; m++) {
      if (!sorted.includes(m)) {
        sorted.push(m);
      }
    }
    sortedIndicesRef.current = sorted;
    
    // Record the merged array
    recordStep([...arr], [], [], `Subarray [${start}...${end}] merged`);
    
    return arr;
  };

  // Main recursive merge sort function
  const mergeSort = (arr: number[], start: number, end: number) => {
    if (start < end) {
      // Find middle point
      const mid = Math.floor((start + end) / 2);
      
      // Record the division
      recordStep([...arr], [], [], `Dividing array into subarrays [${start}...${mid}] and [${mid+1}...${end}]`);
      
      // Sort first and second halves
      mergeSort(arr, start, mid);
      mergeSort(arr, mid + 1, end);
      
      // Merge the sorted halves
      merge(arr, start, mid, end);
    }
    
    return arr;
  };

  const runMergeSort = () => {
    try {
      setIsPlaying(true);
      
      // Reset visualization state
      setCurrentStep(0);
      setCurrentIndices([]);
      setComparingIndices([]);
      setSortedIndices([]);
      setMergePhase('Starting Merge Sort');
      
      // Reset refs
      stepsRef.current = [];
      currentIndicesRef.current = [];
      comparingIndicesRef.current = [];
      sortedIndicesRef.current = [];
      mergePhaseRef.current = 'Starting Merge Sort';
      
      // Copy array to avoid modifying the original
      const arr = [...array];
      
      // Record the initial state
      stepsRef.current.push([...arr]);
      
      // Run the merge sort algorithm
      mergeSort(arr, 0, arr.length - 1);
      
      // Final state with sorted array
      recordStep([...arr], [], [], 'Array is sorted');
      
      // Update state with all the accumulated steps
      setSteps([...stepsRef.current]);
      setSortedIndices([...sortedIndicesRef.current]);
      
      // Mark sorting as complete after a delay
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      
      timeoutId.current = setTimeout(() => {
        setIsPlaying(false);
      }, 100);
    } catch (error) {
      console.error("Error during merge sort:", error);
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
    } else {
      if (currentStep === 0 && steps.length <= 1) {
        // If we're at the beginning and don't have steps yet, generate them
        runMergeSort();
      } else if (currentStep >= steps.length - 1) {
        // If we're at the end, start from beginning
        setCurrentStep(0);
        setIsPlaying(true);
      } else {
        // Otherwise just play existing steps
        setIsPlaying(true);
      }
    }
  };

  const handleReset = () => {
    // Clean up any existing timeouts
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
    
    // Reset all visualization state
    setIsPlaying(false);
    setCurrentStep(0);
    setCurrentIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    
    // Generate a new random array
    generateRandomArray();
    
    // Reset refs
    stepsRef.current = [];
    currentIndicesRef.current = [];
    comparingIndicesRef.current = [];
    sortedIndicesRef.current = [];
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleArraySizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setArraySize(newSize);
    generateRandomArray(newSize);
  };

  const toggleCodeVisibility = () => {
    setCodeVisible(!codeVisible);
  };

  useEffect(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
    
    if (isPlaying && currentStep < steps.length - 1) {
      timeoutId.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (isPlaying && currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [isPlaying, currentStep, steps, speed]);

  // Update visualization based on current step
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      setArray(steps[currentStep]);
      
      // Update the visualization state based on current step
      if (currentStep < stepsRef.current.length) {
        const stepIndex = Math.min(currentStep, stepsRef.current.length - 1);
        
        // Set the current indices for the active elements
        if (stepIndex === 0) {
          setCurrentIndices([]);
          setComparingIndices([]);
          setMergePhase('Starting Merge Sort');
        } else {
          // Get the stored visualization state for this step
          const activeIndices = currentIndicesRef.current || [];
          const compareIndices = comparingIndicesRef.current || [];
          const phase = mergePhaseRef.current || '';
          
          setCurrentIndices(activeIndices);
          setComparingIndices(compareIndices);
          setMergePhase(phase);
        }
      }
    }
  }, [currentStep, steps]);

  // Merge Sort implementation code
  const mergeSortCode = `
function mergeSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Find middle point
    const mid = Math.floor((low + high) / 2);
    
    // Sort first and second halves
    mergeSort(arr, low, mid);
    mergeSort(arr, mid + 1, high);
    
    // Merge the sorted halves
    merge(arr, low, mid, high);
  }
  
  return arr;
}

function merge(arr, low, mid, high) {
  // Create temporary arrays
  const leftSize = mid - low + 1;
  const rightSize = high - mid;
  
  const leftArr = new Array(leftSize);
  const rightArr = new Array(rightSize);
  
  // Copy data to temporary arrays
  for (let i = 0; i < leftSize; i++) {
    leftArr[i] = arr[low + i];
  }
  for (let j = 0; j < rightSize; j++) {
    rightArr[j] = arr[mid + 1 + j];
  }
  
  // Merge the temporary arrays back into arr
  let i = 0; // Initial index of first subarray
  let j = 0; // Initial index of second subarray
  let k = low; // Initial index of merged subarray
  
  while (i < leftSize && j < rightSize) {
    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      i++;
    } else {
      arr[k] = rightArr[j];
      j++;
    }
    k++;
  }
  
  // Copy remaining elements of leftArr if any
  while (i < leftSize) {
    arr[k] = leftArr[i];
    i++;
    k++;
  }
  
  // Copy remaining elements of rightArr if any
  while (j < rightSize) {
    arr[k] = rightArr[j];
    j++;
    k++;
  }
}`;

  return (
    <PageContainer>
      <PageHeader>
        <NavigationRow>
          <BackButton to="/algorithms/sorting">
            <FaArrowLeft />
            Back to Sorting Algorithms
          </BackButton>
          <AlgorithmDropdown buttonText="Switch Algorithm" options={algorithmOptions} />
        </NavigationRow>
        <PageTitle>Merge Sort Visualization</PageTitle>
        <PageDescription>
          Merge Sort is an efficient, stable, comparison-based, divide and conquer sorting algorithm. It divides the input array into two halves, recursively sorts them, and then merges the sorted halves to produce the sorted output.
        </PageDescription>
      </PageHeader>

      <VisualizationContainer>
        <ControlsContainer>
          <Button onClick={handlePlayPause} disabled={currentStep >= steps.length - 1 && steps.length > 1}>
            {isPlaying ? <FiPause /> : <FiPlay />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button onClick={handleReset}>
            <FiRefreshCw />
            Reset
          </Button>
          <Button onClick={handleStepBackward} disabled={currentStep === 0}>
            <FiChevronsLeft />
            Back
          </Button>
          <Button onClick={handleStepForward} disabled={currentStep >= steps.length - 1}>
            <FiChevronsRight />
            Forward
          </Button>
          <SpeedControl>
            <SpeedLabel>Speed:</SpeedLabel>
            <SpeedSelect value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
              <option value={1000}>Slow</option>
              <option value={500}>Medium</option>
              <option value={250}>Fast</option>
            </SpeedSelect>
          </SpeedControl>
          <SpeedControl>
            <SpeedLabel>Size:</SpeedLabel>
            <SpeedSelect value={arraySize} onChange={handleArraySizeChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </SpeedSelect>
          </SpeedControl>
        </ControlsContainer>

        <BarsContainer>
          {array.map((value, index) => (
            <MemoizedBar
              key={index}
              index={index}
              height={value}
              isActive={currentIndices.includes(index)}
              isComparing={comparingIndices.includes(index)}
              isSorted={sortedIndices.includes(index)}
            />
          ))}
        </BarsContainer>

        {mergePhase && (
          <MergeInfo>
            Current Phase: {mergePhase}
          </MergeInfo>
        )}

        <StepInfo>
          <div>Current Step: {currentStep + 1} / {steps.length}</div>
          {currentIndices.length > 0 && (
            <div>Placing element: {array[currentIndices[0]]}</div>
          )}
          {comparingIndices.length === 2 && (
            <div>Comparing: {array[comparingIndices[0]]} and {array[comparingIndices[1]]}</div>
          )}
          {sortedIndices.length > 0 && (
            <div>Sorted elements: {sortedIndices.length} of {array.length}</div>
          )}
          {currentStep > 0 && steps.length > 1 && (
            <div>Progress: {Math.round((currentStep / (steps.length - 1)) * 100)}%</div>
          )}
        </StepInfo>
      </VisualizationContainer>

      <SectionTitle>Complexity Analysis</SectionTitle>
      <ComplexityInfo>
        <ComplexityItem>
          <ComplexityLabel>Time Complexity (Best):</ComplexityLabel>
          <ComplexityValue>O(n log n)</ComplexityValue>
        </ComplexityItem>
        <ComplexityItem>
          <ComplexityLabel>Time Complexity (Average):</ComplexityLabel>
          <ComplexityValue>O(n log n)</ComplexityValue>
        </ComplexityItem>
        <ComplexityItem>
          <ComplexityLabel>Time Complexity (Worst):</ComplexityLabel>
          <ComplexityValue>O(n log n)</ComplexityValue>
        </ComplexityItem>
        <ComplexityItem>
          <ComplexityLabel>Space Complexity:</ComplexityLabel>
          <ComplexityValue>O(n)</ComplexityValue>
        </ComplexityItem>
        <ComplexityItem>
          <ComplexityLabel>Stability:</ComplexityLabel>
          <ComplexityValue>Stable</ComplexityValue>
        </ComplexityItem>
      </ComplexityInfo>
      
      <SectionTitle>
        <Button onClick={toggleCodeVisibility}>
          {codeVisible ? "Hide Code" : "Show Implementation Code"}
        </Button>
      </SectionTitle>
      
      {codeVisible && (
        <CodeBlock>
          <CodeTitle>Merge Sort Implementation</CodeTitle>
          <Suspense fallback={<LoadingPlaceholder>Loading code...</LoadingPlaceholder>}>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {mergeSortCode}
            </SyntaxHighlighter>
          </Suspense>
        </CodeBlock>
      )}
    </PageContainer>
  );
};

export default MergeSortPage; 