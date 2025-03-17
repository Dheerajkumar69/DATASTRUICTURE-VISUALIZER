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

const CountingArrayContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const CountingArrayTitle = styled.h3`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.gray800};
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

const CountingArrayRow = styled.div`
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const CountingArrayCell = styled.div<{ isActive: boolean }>`
  width: 30px;
  height: 30px;
  background-color: ${({ isActive, theme }) => isActive ? theme.colors.highlight : 'white'};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const CountingArrayLabel = styled.div`
  display: flex;
  gap: 4px;
  overflow-x: auto;
`;

const CountingArrayLabelCell = styled.div`
  width: 30px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.gray600};
`;

const CountingSortPage: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<number[][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [countArray, setCountArray] = useState<number[]>([]);
  const [activeCountIndices, setActiveCountIndices] = useState<number[]>([]);
  const [currentPhase, setCurrentPhase] = useState<string>('');

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
    // For counting sort, we keep numbers in a more limited range
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 30) + 1);
    setArray(newArray);
    setSteps([newArray]);
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    setCountArray([]);
    setActiveCountIndices([]);
    setCurrentPhase('');
  };

  const countingSort = () => {
    const arr = [...array];
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(arr.length);
    const steps: number[][] = [[...arr]];
    const countSteps: number[][] = [];
    
    // Set initial phase
    setCurrentPhase('Counting elements');
    
    // Count occurrences of each element
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      const countIndex = element - min;
      
      // Highlight current element we're counting
      setCurrentIndices([i]);
      setActiveCountIndices([countIndex]);
      
      count[countIndex]++;
      countSteps.push([...count]);
      steps.push([...arr]);
    }
    
    // Modify count array to store position of each element
    setCurrentPhase('Computing positions');
    for (let i = 1; i < count.length; i++) {
      setActiveCountIndices([i - 1, i]);
      count[i] += count[i - 1];
      countSteps.push([...count]);
      steps.push([...arr]);
    }
    
    // Build the output array
    setCurrentPhase('Building sorted array');
    for (let i = arr.length - 1; i >= 0; i--) {
      const element = arr[i];
      const countIndex = element - min;
      
      setCurrentIndices([i]);
      setActiveCountIndices([countIndex]);
      
      // Decrement count for this element and place it
      count[countIndex]--;
      const outputIndex = count[countIndex];
      output[outputIndex] = element;
      
      // Update count array visualization
      countSteps.push([...count]);
      
      // Create a copy of arr for visualization
      const stepArr = [...arr];
      
      // Mark elements that have been placed in their final position
      for (let j = 0; j <= outputIndex; j++) {
        if (output[j] !== undefined) {
          stepArr[j] = output[j];
          setSortedIndices(prev => [...prev, j]);
        }
      }
      
      steps.push([...stepArr]);
    }
    
    // Final step with sorted array
    setCurrentPhase('Sorted');
    steps.push([...output]);
    
    // Store steps and count array for visualization
    setSteps(steps);
    setCountArray(count);
    
    return output;
  };

  const runCountingSort = () => {
    setIsPlaying(true);
    
    // Reset visualization state
    setCurrentStep(0);
    setCurrentIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    setCountArray([]);
    setActiveCountIndices([]);
    
    try {
      // Run the counting sort algorithm
      countingSort();
      
      // Mark sorting as complete
      setTimeout(() => {
        setIsPlaying(false);
      }, 100);
    } catch (error) {
      console.error("Error during counting sort:", error);
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentStep === 0 && steps.length <= 1) {
        // If we're at the beginning and don't have steps yet, generate them
        runCountingSort();
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

  // Counting Sort implementation code
  const countingSortCode = `
function countingSort(arr) {
  // Find the maximum value in the array
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  
  // Create count array (initialized with 0s)
  const count = new Array(range).fill(0);
  
  // Count occurrences of each element
  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;
  }
  
  // Modify count array to store the position of each element
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }
  
  // Create output array
  const output = new Array(arr.length);
  
  // Build the output array
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
  }
  
  return output;
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
        <PageTitle>Counting Sort Visualization</PageTitle>
        <PageDescription>
          Counting Sort is a non-comparison-based sorting algorithm that works well for integers with a limited range. It counts the occurrences of each element and uses that information to place elements in their correct sorted positions.
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
              height={value * 3} // Scale up for better visibility
              isActive={currentIndices.includes(index)}
              isComparing={comparingIndices.includes(index)}
              isSorted={sortedIndices.includes(index)}
              initial={{ scale: 1 }}
              animate={{ scale: currentIndices.includes(index) ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </BarsContainer>

        {countArray.length > 0 && (
          <CountingArrayContainer>
            <CountingArrayTitle>Count Array</CountingArrayTitle>
            <CountingArrayRow>
              {countArray.map((count, index) => (
                <CountingArrayCell 
                  key={index} 
                  isActive={activeCountIndices.includes(index)}
                >
                  {count}
                </CountingArrayCell>
              ))}
            </CountingArrayRow>
            <CountingArrayLabel>
              {countArray.map((_, index) => (
                <CountingArrayLabelCell key={index}>
                  {index + Math.min(...array)}
                </CountingArrayLabelCell>
              ))}
            </CountingArrayLabel>
          </CountingArrayContainer>
        )}

        <StepInfo>
          <div>Current Step: {currentStep + 1} / {steps.length}</div>
          {currentPhase && (
            <div>Phase: {currentPhase}</div>
          )}
          {currentIndices.length > 0 && (
            <div>Processing element: {array[currentIndices[0]]}</div>
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
          <ComplexityValue>O(n+k)</ComplexityValue>
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
        <CodeTitle>Counting Sort Implementation</CodeTitle>
        <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
          {countingSortCode}
        </SyntaxHighlighter>
      </CodeBlock>
    </PageContainer>
  );
};

export default CountingSortPage; 