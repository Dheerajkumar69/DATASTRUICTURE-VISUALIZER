import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiRefreshCw, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import AlgorithmDropdown from '../../../components/algorithms/AlgorithmDropdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Styled Components
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

const Bar = styled(motion.div)<{ height: number; isActive: boolean; isComparing: boolean; isSorted: boolean }>`
  width: 30px;
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

const StepInfo = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const StepDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.gray700};
  margin: 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const ComplexityContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ComplexityTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 1rem;
`;

const ComingSoonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ComingSoonText = styled.h2`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const MergeSortPage: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<number[][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

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
  };
  
  const merge = async (arr: number[], left: number, mid: number, right: number) => {
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    const merged = [...arr];

    // Record initial state of this merge
    setSteps(prev => [...prev, [...arr]]);

    while (i < leftArray.length && j < rightArray.length) {
      setComparingIndices([left + i, mid + 1 + j]);
      
      // Record the comparison state
      setSteps(prev => [...prev, [...merged]]);

      if (leftArray[i] <= rightArray[j]) {
        merged[k] = leftArray[i];
        setCurrentIndices([k]);
        i++;
      } else {
        merged[k] = rightArray[j];
        setCurrentIndices([k]);
        j++;
      }
      k++;
      
      // Record the state after placement
      setSteps(prev => [...prev, [...merged]]);
    }

    while (i < leftArray.length) {
      merged[k] = leftArray[i];
      setCurrentIndices([k]);
      
      // Record the state after each placement
      setSteps(prev => [...prev, [...merged]]);
      
      i++;
      k++;
    }

    while (j < rightArray.length) {
      merged[k] = rightArray[j];
      setCurrentIndices([k]);
      
      // Record the state after each placement
      setSteps(prev => [...prev, [...merged]]);
      
      j++;
      k++;
    }

    // Mark the merged portion as sorted
    for (let index = left; index <= right; index++) {
      setSortedIndices(prev => [...prev, index]);
    }

    return merged;
  };
  
  const mergeSort = async (arr: number[], left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      await mergeSort(arr, left, mid);
      await mergeSort(arr, mid + 1, right);
      return await merge(arr, left, mid, right);
    }
    return arr;
  };
  
  const runMergeSort = async () => {
    setIsPlaying(true);
    const arrCopy = [...array];
    
    // Reset visualization state
    setSteps([arrCopy]);
    setCurrentStep(0);
    setCurrentIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    
    try {
      // Run the merge sort algorithm and collect all steps
      await mergeSort(arrCopy, 0, arrCopy.length - 1);
      
      // Mark sorting as complete
      setIsPlaying(false);
    } catch (error) {
      console.error("Error during merge sort:", error);
      setIsPlaying(false);
    }
  };
  
  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentStep === 0 && steps.length <= 1) {
        // If we're at the beginning and don't have steps yet, generate them
        runMergeSort();
      } else {
        // Otherwise just play existing steps
        setIsPlaying(true);
      }
    }
  };
  
  const handleReset = () => {
    generateRandomArray();
  };
  
  const handleStepForward = async () => {
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
  
  // Merge Sort implementation code
  const mergeSortCode = `
function mergeSort(arr) {
  // Base case: array with 0 or 1 element is already sorted
  if (arr.length <= 1) {
    return arr;
  }
  
  // Split the array into two halves
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  // Recursively sort both halves
  return merge(
    mergeSort(left),
    mergeSort(right)
  );
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
  
  // Add remaining elements from left array (if any)
  while (leftIndex < left.length) {
    result.push(left[leftIndex]);
    leftIndex++;
  }
  
  // Add remaining elements from right array (if any)
  while (rightIndex < right.length) {
    result.push(right[rightIndex]);
    rightIndex++;
  }
  
  return result;
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
          Merge Sort is a divide-and-conquer algorithm that recursively breaks down a problem into smaller, more manageable subproblems until they become simple enough to solve directly.
        </PageDescription>
      </PageHeader>

      <VisualizationContainer>
        <ControlsContainer>
          <Button onClick={handlePlayPause} disabled={currentStep >= steps.length - 1}>
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
              initial={{ scale: 1 }}
              animate={{ scale: currentIndices.includes(index) ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </BarsContainer>

        <StepInfo>
          <div>Current Step: {currentStep + 1} / {steps.length}</div>
          {comparingIndices.length >= 2 && (
            <div>Comparing: {array[comparingIndices[0]]} and {array[comparingIndices[1]]}</div>
          )}
          {currentIndices.length > 0 && (
            <div>Placing element at index {currentIndices[0]}: {array[currentIndices[0]]}</div>
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
      
      <CodeBlock>
        <CodeTitle>Merge Sort Implementation</CodeTitle>
        <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
          {mergeSortCode}
        </SyntaxHighlighter>
      </CodeBlock>
    </PageContainer>
  );
};

export default MergeSortPage; 