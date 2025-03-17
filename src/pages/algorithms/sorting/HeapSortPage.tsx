import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiRefreshCw, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import AlgorithmDropdown from '../../../components/algorithms/AlgorithmDropdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const NavigationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.gray700};
  text-decoration: none;
  font-size: 1rem;

  &:hover {
    color: ${({ theme }) => theme.colors.gray900};
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.gray900};
  margin: 0;
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray700};
  max-width: 800px;
  line-height: 1.6;
`;

const VisualizationContainer = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2rem;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Button = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: white;
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.gray700};
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;

  svg {
    margin-right: 0.5rem;
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
  gap: 0.5rem;
`;

const SpeedLabel = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray700};
`;

const SpeedSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: white;
  font-size: 0.9rem;
`;

const BarsContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 300px;
  gap: 4px;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.gray50};
`;

interface BarProps {
  height: number;
  isActive: boolean;
  isComparing: boolean;
  isSorted: boolean;
  isHeapified: boolean;
  isRoot: boolean;
}

const Bar = styled(motion.div)<BarProps>`
  width: 30px;
  height: ${({ height }) => `${height}%`};
  background-color: ${({ isActive, isComparing, isSorted, isHeapified, isRoot, theme }) => 
    isRoot
      ? theme.colors.warning
      : isActive 
        ? theme.colors.highlight
        : isComparing
          ? theme.colors.primary
          : isHeapified
            ? theme.colors.primaryLight
            : isSorted
              ? theme.colors.success
              : theme.colors.gray400};
  border-radius: 4px 4px 0 0;
  position: relative;
  
  &::after {
    content: '${({ height }) => Math.round(height)}';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.gray700};
  }
`;

const StepInfo = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const HeapInfo = styled.div`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray700};
`;

const HeapTreeContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TreeLevel = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1rem;
`;

interface NodeProps {
  isRoot: boolean;
  isActiveNode: boolean;
  isComparing: boolean;
  isHeapified: boolean;
  isSorted: boolean;
}

const TreeNode = styled.div<NodeProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ isRoot, isActiveNode, isComparing, isHeapified, isSorted, theme }) => 
    isRoot
      ? theme.colors.warning
      : isActiveNode 
        ? theme.colors.highlight
        : isComparing
          ? theme.colors.primary
          : isHeapified
            ? theme.colors.primaryLight
            : isSorted
              ? theme.colors.success
              : theme.colors.gray400};
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  position: relative;
`;

const TreeEdge = styled.div`
  position: absolute;
  width: 2px;
  height: 20px;
  background-color: ${({ theme }) => theme.colors.gray400};
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const ComplexityInfo = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ComplexityItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius};
  
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
  margin-top: 2rem;
  background-color: #1E1E1E;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;

const CodeTitle = styled.div`
  padding: 0.75rem 1rem;
  background-color: #333;
  color: white;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.875rem;
`;

const PhaseInfo = styled.div`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray700};
`;

const HeapSortPage: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<number[][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [heapifiedIndices, setHeapifiedIndices] = useState<number[]>([]);
  const [rootIndex, setRootIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<string>(''); // 'heapify', 'extract'
  const [isMaxHeap, setIsMaxHeap] = useState<boolean>(true);

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
    generateRandomArray();
  }, []);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setSteps([newArray]);
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    setHeapifiedIndices([]);
    setRootIndex(null);
    setPhase('');
  };

  // Helper functions for heap operations
  const getParentIndex = (index: number): number => {
    return Math.floor((index - 1) / 2);
  };

  const getLeftChildIndex = (index: number): number => {
    return 2 * index + 1;
  };

  const getRightChildIndex = (index: number): number => {
    return 2 * index + 2;
  };

  // Heapify function
  const heapify = (arr: number[], n: number, i: number, steps: number[][], heapified: number[]) => {
    let largest = i; // Initialize largest as root
    const left = getLeftChildIndex(i);
    const right = getRightChildIndex(i);
    
    // Compare with left child
    if (left < n) {
      setComparingIndices([largest, left]);
      steps.push([...arr]);
      
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }
    
    // Compare with right child
    if (right < n) {
      setComparingIndices([largest, right]);
      steps.push([...arr]);
      
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }
    
    // If largest is not the root
    if (largest !== i) {
      setCurrentIndices([i, largest]);
      
      // Swap elements
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      
      // Record this state
      steps.push([...arr]);
      
      // Recursively heapify the affected subtree
      heapify(arr, n, largest, steps, heapified);
    }
    
    // Mark as heapified
    if (!heapified.includes(i)) {
      heapified.push(i);
      setHeapifiedIndices([...heapified]);
    }
  };

  const heapSort = () => {
    const arr = [...array];
    const n = arr.length;
    const steps: number[][] = [[...arr]];
    const heapified: number[] = [];
    
    setPhase('heapify');
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      setRootIndex(i);
      heapify(arr, n, i, steps, heapified);
    }
    
    // Record the fully heapified array
    steps.push([...arr]);
    
    setPhase('extract');
    
    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      // Move current root to end
      setCurrentIndices([0, i]);
      
      // Swap elements
      [arr[0], arr[i]] = [arr[i], arr[0]];
      
      // Mark as sorted
      setSortedIndices(prev => [...prev, i]);
      
      // Record this state
      steps.push([...arr]);
      
      // Call heapify on reduced heap
      setRootIndex(0);
      heapify(arr, i, 0, steps, heapified);
    }
    
    // Mark the last element as sorted
    setSortedIndices(prev => [...prev, 0]);
    
    // Final state with sorted array
    steps.push([...arr]);
    
    // Store all steps for visualization
    setSteps(steps);
    
    return arr;
  };

  const runHeapSort = () => {
    setIsPlaying(true);
    
    // Reset visualization state
    setCurrentStep(0);
    setCurrentIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    setHeapifiedIndices([]);
    setRootIndex(null);
    setPhase('');
    
    try {
      // Run the heap sort algorithm
      heapSort();
      
      // Mark sorting as complete
      setTimeout(() => {
        setIsPlaying(false);
      }, 100);
    } catch (error) {
      console.error("Error during heap sort:", error);
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentStep === 0 && steps.length <= 1) {
        // If we're at the beginning and don't have steps yet, generate them
        runHeapSort();
      } else {
        // Otherwise just play existing steps
        setIsPlaying(true);
      }
    }
  };

  const handleReset = () => {
    generateRandomArray();
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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      timeoutId = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    }
    return () => clearTimeout(timeoutId);
  }, [isPlaying, currentStep, steps, speed]);

  // Update array when currentStep changes
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      setArray(steps[currentStep]);
    }
  }, [currentStep, steps]);

  // Render heap as a tree for visualization
  const renderHeapTree = () => {
    if (array.length === 0) return null;
    
    // Calculate how many levels the tree has
    const height = Math.floor(Math.log2(array.length)) + 1;
    
    // Create an array for each level
    const levels = Array.from({ length: height }, (_, i) => {
      const startIndex = Math.pow(2, i) - 1;
      const endIndex = Math.min(Math.pow(2, i + 1) - 1, array.length);
      return array.slice(startIndex, endIndex);
    });
    
    return (
      <HeapTreeContainer>
        {levels.map((level, levelIndex) => (
          <TreeLevel key={levelIndex}>
            {level.map((value, index) => {
              const globalIndex = Math.pow(2, levelIndex) - 1 + index;
              return (
                <TreeNode 
                  key={index}
                  isRoot={rootIndex === globalIndex}
                  isActiveNode={currentIndices.includes(globalIndex)}
                  isComparing={comparingIndices.includes(globalIndex)}
                  isHeapified={heapifiedIndices.includes(globalIndex)}
                  isSorted={sortedIndices.includes(globalIndex)}
                >
                  {value}
                  {/* Add edges to children if they exist */}
                  {getLeftChildIndex(globalIndex) < array.length && <TreeEdge />}
                </TreeNode>
              );
            })}
          </TreeLevel>
        ))}
      </HeapTreeContainer>
    );
  };

  // Heap Sort implementation code
  const heapSortCode = `
function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    // Call heapify on reduced heap
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i; // Initialize largest as root
  const left = 2 * i + 1; // Left child
  const right = 2 * i + 2; // Right child
  
  // Compare with left child
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  // Compare with right child
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  // If largest is not the root
  if (largest !== i) {
    // Swap elements
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    
    // Recursively heapify the affected subtree
    heapify(arr, n, largest);
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
        <PageTitle>Heap Sort Visualization</PageTitle>
        <PageDescription>
          Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It divides the input into a sorted and an unsorted region, and iteratively shrinks the unsorted region by extracting the largest element and moving it to the sorted region.
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
            Step Back
          </Button>
          <Button onClick={handleStepForward} disabled={currentStep >= steps.length - 1}>
            <FiChevronsRight />
            Step Forward
          </Button>
          <SpeedControl>
            <SpeedLabel>Speed:</SpeedLabel>
            <SpeedSelect value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
              <option value={1000}>Slow</option>
              <option value={500}>Medium</option>
              <option value={250}>Fast</option>
            </SpeedSelect>
          </SpeedControl>
        </ControlsContainer>

        <BarsContainer>
          {array.map((value, index) => (
            <Bar
              key={index}
              height={value}
              isActive={currentIndices.includes(index)}
              isComparing={comparingIndices.includes(index)}
              isSorted={sortedIndices.includes(index)}
              isHeapified={heapifiedIndices.includes(index)}
              isRoot={rootIndex === index}
              initial={{ scale: 1 }}
              animate={{ scale: currentIndices.includes(index) ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </BarsContainer>

        {phase && (
          <PhaseInfo>
            Current Phase: {phase === 'heapify' ? 'Building Max Heap' : 'Extracting Elements from Heap'}
          </PhaseInfo>
        )}

        {renderHeapTree()}

        <StepInfo>
          <div>Current Step: {currentStep + 1} / {steps.length}</div>
          {currentIndices.length > 0 && (
            <div>Active elements: {currentIndices.map(i => array[i]).join(', ')}</div>
          )}
          {comparingIndices.length > 0 && (
            <div>Comparing elements: {comparingIndices.map(i => array[i]).join(', ')}</div>
          )}
          {rootIndex !== null && (
            <div>Current root: {array[rootIndex]}</div>
          )}
          {heapifiedIndices.length > 0 && (
            <div>Heapified elements: {heapifiedIndices.length}</div>
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
          <ComplexityValue>O(1)</ComplexityValue>
        </ComplexityItem>
        <ComplexityItem>
          <ComplexityLabel>Stability:</ComplexityLabel>
          <ComplexityValue>Not Stable</ComplexityValue>
        </ComplexityItem>
      </ComplexityInfo>
      
      <CodeBlock>
        <CodeTitle>Heap Sort Implementation</CodeTitle>
        <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
          {heapSortCode}
        </SyntaxHighlighter>
      </CodeBlock>
    </PageContainer>
  );
};

export default HeapSortPage;
