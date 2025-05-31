import React, { useState, useEffect, lazy, Suspense, memo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiRefreshCw, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import AlgorithmDropdown from '../../../components/algorithms/AlgorithmDropdown';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Lazy load only the syntax highlighter component
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter'));

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
  gapIndex: number | null;
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

  ${({ gapIndex, theme }) => gapIndex !== null && `
    &::before {
      content: 'gap: ${gapIndex}';
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.6rem;
      color: ${theme.colors.gray700};
      white-space: nowrap;
      
      @media (min-width: 768px) {
        font-size: 0.7rem;
      }
    }
  `}
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

const GapInfo = styled.div`
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

const GapSequenceContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  
  @media (min-width: 768px) {
    gap: 0.5rem;
  }
`;

const GapItem = styled.div<{ isActive: boolean }>`
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ isActive, theme }) => 
    isActive ? theme.colors.primary : theme.colors.gray100};
  color: ${({ isActive }) => isActive ? 'white' : 'inherit'};
  font-weight: ${({ isActive }) => isActive ? 'bold' : 'normal'};
  font-size: 0.8rem;
  
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
const MemoizedBar = memo(({ height, isActive, isComparing, isSorted, gapIndex, index }: BarProps & { index: number }) => (
  <Bar
    key={index}
    height={height}
    isActive={isActive}
    isComparing={isComparing}
    isSorted={isSorted}
    gapIndex={gapIndex}
    initial={{ scale: 1 }}
    animate={{ scale: isActive ? 1.1 : 1 }}
    transition={{ duration: 0.2 }}
  />
));

const ShellSortPage: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<number[][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [gapSequence, setGapSequence] = useState<number[]>([]);
  const [currentGap, setCurrentGap] = useState<number | null>(null);
  const [gapIndices, setGapIndices] = useState<(number | null)[]>([]);
  const [arraySize, setArraySize] = useState<number>(10);
  const [codeVisible, setCodeVisible] = useState<boolean>(false);

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
    return () => {
      // Clean up any timeouts
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

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
    
    // Calculate gap sequence for Shell sort
    // Using the sequence: N/2, N/4, ..., 1
    const gaps: number[] = [];
    for (let gap = Math.floor(newArray.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
      gaps.push(gap);
    }
    setGapSequence(gaps);
    setCurrentGap(null);
    setGapIndices(Array(newArray.length).fill(null));
  };

  const shellSort = () => {
    const arr = [...array];
    const n = arr.length;
    const steps: number[][] = [[...arr]];
    const gapIndicesTrack = Array(n).fill(null);
    
    // Use our gap sequence
    for (let g = 0; g < gapSequence.length; g++) {
      const gap = gapSequence[g];
      setCurrentGap(gap);
      
      // Mark elements that are part of the current gap sequence
      for (let i = 0; i < n; i++) {
        if (i % gap === 0) {
          gapIndicesTrack[i] = gap;
        }
      }
      setGapIndices([...gapIndicesTrack]);
      
      // Record this state
      steps.push([...arr]);
      
      // Do a gapped insertion sort for this gap size
      for (let i = gap; i < n; i++) {
        // Save arr[i] in temp and make a hole at position i
        const temp = arr[i];
        
        // Mark current element being sorted
        setCurrentIndices([i]);
        
        // Shift earlier gap-sorted elements up until the correct location for arr[i] is found
        let j;
        for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
          // Compare elements
          setComparingIndices([j, j - gap]);
          
          // Shift element
          arr[j] = arr[j - gap];
          
          // Record this state
          steps.push([...arr]);
        }
        
        // Put temp in its correct location
        arr[j] = temp;
        
        // Record this state
        steps.push([...arr]);
      }
      
      // Clear gap indices for this gap
      for (let i = 0; i < n; i++) {
        if (gapIndicesTrack[i] === gap) {
          gapIndicesTrack[i] = null;
        }
      }
      setGapIndices([...gapIndicesTrack]);
    }
    
    // Mark all elements as sorted
    for (let i = 0; i < n; i++) {
      setSortedIndices(prev => [...prev, i]);
    }
    
    // Final state with sorted array
    steps.push([...arr]);
    
    // Store all steps for visualization
    setSteps(steps);
    
    return arr;
  };

  const runShellSort = () => {
    setIsPlaying(true);
    
    // Reset visualization state
    setCurrentStep(0);
    setCurrentIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    setCurrentGap(null);
    setGapIndices(Array(array.length).fill(null));
    
    try {
      // Run the shell sort algorithm
      shellSort();
      
      // Mark sorting as complete
      timeoutId.current = setTimeout(() => {
        setIsPlaying(false);
      }, 100);
    } catch (error) {
      console.error("Error during shell sort:", error);
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
        runShellSort();
      } else {
        // Otherwise just play existing steps
        setIsPlaying(true);
      }
    }
  };

  const handleReset = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
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
    } else if (currentStep >= steps.length - 1 && isPlaying) {
      setIsPlaying(false);
    }
    
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [isPlaying, currentStep, steps, speed]);

  // Update array when currentStep changes
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      setArray(steps[currentStep]);
    }
  }, [currentStep, steps]);

  // Shell Sort implementation code
  const shellSortCode = `
function shellSort(arr) {
  const n = arr.length;
  
  // Start with a big gap, then reduce the gap
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // Do a gapped insertion sort
    for (let i = gap; i < n; i++) {
      // Save arr[i] in temp and make a hole at position i
      const temp = arr[i];
      
      // Shift earlier gap-sorted elements up until the correct location for arr[i] is found
      let j;
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];
      }
      
      // Put temp in its correct location
      arr[j] = temp;
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
        <PageTitle>Shell Sort Visualization</PageTitle>
        <PageDescription>
          Shell Sort is an in-place comparison sort algorithm that generalizes insertion sort by enabling the exchange of items that are far apart. It starts by sorting pairs of elements far apart from each other, then progressively reduces the gap between elements to be compared.
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
              gapIndex={gapIndices[index]}
            />
          ))}
        </BarsContainer>

        {currentGap !== null && (
          <GapInfo>
            Current Gap: {currentGap}
          </GapInfo>
        )}

        <GapSequenceContainer>
          {gapSequence.map((gap, index) => (
            <GapItem key={index} isActive={currentGap === gap}>
              {gap}
            </GapItem>
          ))}
        </GapSequenceContainer>

        <StepInfo>
          <div>Current Step: {currentStep + 1} / {steps.length}</div>
          {currentIndices.length > 0 && (
            <div>Active element: {array[currentIndices[0]]}</div>
          )}
          {comparingIndices.length === 2 && (
            <div>Comparing: {array[comparingIndices[0]]} and {array[comparingIndices[1]]}</div>
          )}
          {currentGap !== null && (
            <div>Processing elements with gap: {currentGap}</div>
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
          <ComplexityValue>O(n log² n)</ComplexityValue>
        </ComplexityItem>
        <ComplexityItem>
          <ComplexityLabel>Time Complexity (Worst):</ComplexityLabel>
          <ComplexityValue>O(n²)</ComplexityValue>
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
      
      <SectionTitle>
        <Button onClick={toggleCodeVisibility}>
          {codeVisible ? "Hide Code" : "Show Implementation Code"}
        </Button>
      </SectionTitle>
      
      {codeVisible && (
        <CodeBlock>
          <CodeTitle>Shell Sort Implementation</CodeTitle>
          <Suspense fallback={<LoadingPlaceholder>Loading code...</LoadingPlaceholder>}>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {shellSortCode}
            </SyntaxHighlighter>
          </Suspense>
        </CodeBlock>
      )}
    </PageContainer>
  );
};

export default ShellSortPage; 