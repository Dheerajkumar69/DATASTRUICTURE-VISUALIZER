import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlay, FiPause, FiRefreshCw, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import AlgorithmDropdown from '../../../components/algorithms/AlgorithmDropdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { motion } from 'framer-motion';

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
  background-color: ${({ theme }) => theme.colors.card};
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
  background-color: ${({ theme }) => theme.colors.card};
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
  background-color: ${({ theme }) => theme.colors.card};
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
  bucketIndex?: number | null;
}

const Bar = styled(motion.div)<BarProps>`
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

  ${({ bucketIndex }) => bucketIndex !== undefined && bucketIndex !== null && `
    &::before {
      content: 'B${bucketIndex}';
      position: absolute;
      top: 5px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.75rem;
      color: ${({ theme }) => theme.colors.card};
      background-color: rgba(0, 0, 0, 0.5);
      padding: 2px 4px;
      border-radius: 4px;
    }
  `}
`;

const StepInfo = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const BucketsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.gray50};
`;

const Bucket = styled.div<{ isActive: boolean }>`
  min-width: 80px;
  padding: 0.5rem;
  border: 1px solid ${({ theme, isActive }) => 
    isActive ? theme.colors.primary : theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme, isActive }) => 
    isActive ? theme.colors.primaryLight : 'white'};
`;

const BucketLabel = styled.div`
  text-align: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray700};
`;

const BucketItem = styled.div<{ value: number }>`
  padding: 0.25rem 0.5rem;
  margin: 0.25rem 0;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.8rem;
`;

const PhaseInfo = styled.div`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray700};
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
  background-color: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.card};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.875rem;
`;

const BucketSortPage: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<number[][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [buckets, setBuckets] = useState<number[][]>([]);
  const [activeBucket, setActiveBucket] = useState<number | null>(null);
  const [phase, setPhase] = useState<string>(''); // 'distribution', 'sorting', 'concatenation'
  const [bucketIndices, setBucketIndices] = useState<(number | null)[]>([]);

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
    // Generate values between 0 and 1 for bucket sort
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) / 100);
    setArray(newArray);
    setSteps([newArray]);
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    setBuckets(Array(5).fill([]).map(() => []));
    setActiveBucket(null);
    setPhase('');
    setBucketIndices(Array(newArray.length).fill(null));
  };

  // Helper function to implement insertion sort on a bucket
  const insertionSort = (arr: number[]): number[] => {
    const result = [...arr];
    for (let i = 1; i < result.length; i++) {
      const key = result[i];
      let j = i - 1;
      while (j >= 0 && result[j] > key) {
        result[j + 1] = result[j];
        j--;
      }
      result[j + 1] = key;
    }
    return result;
  };

  const bucketSort = () => {
    const arr = [...array];
    const n = arr.length;
    const steps: number[][] = [[...arr]];
    const numBuckets = 5; // Using 5 buckets
    
    // Create empty buckets
    const buckets: number[][] = Array(numBuckets).fill(null).map(() => []);
    setBuckets(buckets);
    
    // Track which bucket each element goes into
    const bucketMap: (number | null)[] = Array(n).fill(null);
    setBucketIndices(bucketMap);
    
    // Set phase to distribution
    setPhase('distribution');
    
    // 1. Distribution - Put array elements into buckets
    for (let i = 0; i < n; i++) {
      // Determine bucket index (0 to numBuckets-1)
      const bucketIndex = Math.min(Math.floor(arr[i] * numBuckets), numBuckets - 1);
      bucketMap[i] = bucketIndex;
      
      // Update visualization state
      setCurrentIndices([i]);
      setActiveBucket(bucketIndex);
      
      // Add element to its bucket
      buckets[bucketIndex].push(arr[i]);
      
      // Record step
      steps.push([...arr]);
    }
    
    // Set phase to sorting
    setPhase('sorting');
    
    // 2. Sorting - Sort individual buckets
    for (let i = 0; i < numBuckets; i++) {
      setActiveBucket(i);
      
      if (buckets[i].length > 0) {
        // Sort bucket using insertion sort
        buckets[i] = insertionSort(buckets[i]);
        
        // Record step after sorting each bucket
        steps.push([...arr]);
      }
    }
    
    // Set phase to concatenation
    setPhase('concatenation');
    
    // 3. Concatenation - Combine all buckets back into original array
    let index = 0;
    for (let i = 0; i < numBuckets; i++) {
      setActiveBucket(i);
      
      for (let j = 0; j < buckets[i].length; j++) {
        // Update original array
        arr[index] = buckets[i][j];
        
        // Update visualization state
        setCurrentIndices([index]);
        setSortedIndices(prev => [...prev, index]);
        
        // Record step
        steps.push([...arr]);
        
        index++;
      }
    }
    
    // Final state with sorted array
    steps.push([...arr]);
    
    // Store all steps for visualization
    setSteps(steps);
    
    return arr;
  };

  const runBucketSort = () => {
    setIsPlaying(true);
    
    // Reset visualization state
    setCurrentStep(0);
    setCurrentIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    setBuckets(Array(5).fill([]).map(() => []));
    setActiveBucket(null);
    setPhase('');
    setBucketIndices(Array(array.length).fill(null));
    
    try {
      // Run the bucket sort algorithm
      bucketSort();
      
      // Mark sorting as complete
      setTimeout(() => {
        setIsPlaying(false);
      }, 100);
    } catch (error) {
      console.error("Error during bucket sort:", error);
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentStep === 0 && steps.length <= 1) {
        // If we're at the beginning and don't have steps yet, generate them
        runBucketSort();
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

  // Bucket Sort implementation code
  const bucketSortCode = `
function bucketSort(arr) {
  if (arr.length === 0) {
    return arr;
  }

  // Create buckets
  const n = arr.length;
  const buckets = [];
  for (let i = 0; i < n; i++) {
    buckets[i] = [];
  }

  // Put array elements into buckets
  for (let i = 0; i < n; i++) {
    const index = Math.floor(arr[i] * n);
    buckets[index].push(arr[i]);
  }

  // Sort individual buckets
  for (let i = 0; i < n; i++) {
    buckets[i].sort((a, b) => a - b);
  }

  // Concatenate all buckets back into array
  let index = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < buckets[i].length; j++) {
      arr[index++] = buckets[i][j];
    }
  }
  
  return arr;
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
        <PageTitle>Bucket Sort Visualization</PageTitle>
        <PageDescription>
          Bucket Sort is a distribution-based sorting algorithm that distributes elements into buckets and then sorts these buckets individually. It works well when the input is uniformly distributed over a range.
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
              height={value * 100} // Scale for better visibility
              isActive={currentIndices.includes(index)}
              isComparing={comparingIndices.includes(index)}
              isSorted={sortedIndices.includes(index)}
              bucketIndex={bucketIndices[index]}
              initial={{ scale: 1 }}
              animate={{ scale: currentIndices.includes(index) ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </BarsContainer>

        {phase && (
          <PhaseInfo>
            Current Phase: {phase === 'distribution' ? 'Distributing elements into buckets' : 
                          phase === 'sorting' ? 'Sorting individual buckets' : 
                          'Concatenating buckets back into array'}
          </PhaseInfo>
        )}

        <BucketsContainer>
          {buckets.map((bucket, index) => (
            <Bucket key={index} isActive={activeBucket === index}>
              <BucketLabel>Bucket {index}</BucketLabel>
              {bucket.map((value, i) => (
                <BucketItem key={i} value={value}>
                  {value.toFixed(2)}
                </BucketItem>
              ))}
            </Bucket>
          ))}
        </BucketsContainer>

        <StepInfo>
          <div>Current Step: {currentStep + 1} / {steps.length}</div>
          {currentIndices.length > 0 && (
            <div>Processing element: {array[currentIndices[0]].toFixed(2)}</div>
          )}
          {activeBucket !== null && (
            <div>Active bucket: {activeBucket}</div>
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
          <ComplexityValue>O(n+k)</ComplexityValue>
        </ComplexityItem>
        <ComplexityItem>
          <ComplexityLabel>Time Complexity (Average):</ComplexityLabel>
          <ComplexityValue>O(n+k)</ComplexityValue>
        </ComplexityItem>
        <ComplexityItem>
          <ComplexityLabel>Time Complexity (Worst):</ComplexityLabel>
          <ComplexityValue>O(n²)</ComplexityValue>
        </ComplexityItem>
        <ComplexityItem>
          <ComplexityLabel>Space Complexity:</ComplexityLabel>
          <ComplexityValue>O(n+k)</ComplexityValue>
        </ComplexityItem>
        <ComplexityItem>
          <ComplexityLabel>Stability:</ComplexityLabel>
          <ComplexityValue>Stable</ComplexityValue>
        </ComplexityItem>
      </ComplexityInfo>
      
      <CodeBlock>
        <CodeTitle>Bucket Sort Implementation</CodeTitle>
        <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
          {bucketSortCode}
        </SyntaxHighlighter>
      </CodeBlock>
    </PageContainer>
  );
};

export default BucketSortPage; 