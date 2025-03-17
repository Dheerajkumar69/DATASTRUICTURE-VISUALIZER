import React, { useState, useEffect, useRef } from 'react';
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
  isCurrent?: boolean;
  gapIndex: number | null;
}

const Bar = styled(motion.div)<BarProps>`
  width: 30px;
  height: ${({ height }) => `${height}%`};
  background-color: ${({ isActive, isComparing, isSorted, isCurrent, theme }) => 
    isCurrent
      ? theme.colors.warning
      : isActive 
        ? theme.colors.highlight
        : isComparing
          ? theme.colors.primary
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

  ${({ gapIndex, theme }) => gapIndex !== null && `
    &::before {
      content: 'gap: ${gapIndex}';
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.7rem;
      color: ${theme.colors.gray700};
      white-space: nowrap;
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

const StepDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.gray700};
  margin: 0;
`;

const GapInfo = styled.div`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray700};
`;

const GapSequenceContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const GapItem = styled.div<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ isActive, theme }) => 
    isActive ? theme.colors.primary : theme.colors.gray100};
  color: ${({ isActive }) => isActive ? 'white' : 'inherit'};
  font-weight: ${({ isActive }) => isActive ? 'bold' : 'normal'};
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

// Types for animation steps
interface AnimationStep {
  type: 'compare' | 'shift' | 'insert' | 'sorted' | 'gap-change' | 'gap-mark';
  indices: number[];
  gapValue?: number;
  currentValue?: number;
  description: string;
}

const ShellSortPage: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [gapSequence, setGapSequence] = useState<number[]>([]);
  const [currentGap, setCurrentGap] = useState<number | null>(null);
  const [gapIndices, setGapIndices] = useState<(number | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [speed, setSpeed] = useState<number>(500); // milliseconds
  const [arraySize, setArraySize] = useState<number>(10);
  const [stepDescription, setStepDescription] = useState<string>('');
  
  const sortTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      if (sortTimeoutRef.current) {
        clearTimeout(sortTimeoutRef.current);
      }
    };
  }, []);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setCurrentIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    setCurrentIndex(null);
    setCurrentStep(0);
    setAnimationSteps([]);
    setStepDescription('');
    
    // Calculate gap sequence for Shell sort
    // Using the sequence: N/2, N/4, ..., 1
    const gaps = [];
    for (let gap = Math.floor(newArray.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
      gaps.push(gap);
    }
    setGapSequence(gaps);
    setCurrentGap(null);
    setGapIndices(Array(newArray.length).fill(null));
    
    // Reset animation
    if (sortTimeoutRef.current) {
      clearTimeout(sortTimeoutRef.current);
    }
    setIsSorting(false);
    setIsPaused(false);
  };

  const generateShellSortSteps = (arr: number[]): AnimationStep[] => {
    const steps: AnimationStep[] = [];
    const arrayCopy = [...arr];
    const n = arrayCopy.length;
    
    // Calculate gap sequence
    const gapSeq = [];
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      gapSeq.push(gap);
    }
    
    // Process each gap
    for (let g = 0; g < gapSeq.length; g++) {
      const gap = gapSeq[g];
      
      // Record gap change
      steps.push({
        type: 'gap-change',
        indices: [],
        gapValue: gap,
        description: `Setting gap size to ${gap}`
      });
      
      // Mark elements that belong to current gap sequence
      const gapIndices = [];
      for (let i = 0; i < n; i += gap) {
        gapIndices.push(i);
      }
      
      steps.push({
        type: 'gap-mark',
        indices: gapIndices,
        gapValue: gap,
        description: `Marking elements at positions divisible by ${gap}`
      });
      
      // Do a gapped insertion sort
      for (let i = gap; i < n; i++) {
        const current = arrayCopy[i];
        
        // Current element to be inserted
        steps.push({
          type: 'compare',
          indices: [i],
          currentValue: current,
          description: `Processing element at index ${i} with value ${current}`
        });
        
        // Shift sorted elements that are greater than current
        let j = i;
        while (j >= gap && arrayCopy[j - gap] > current) {
          steps.push({
            type: 'compare',
            indices: [j, j - gap],
            currentValue: current,
            description: `Comparing elements at indices ${j - gap} and ${j}: ${arrayCopy[j - gap]} > ${current}?`
          });
          
          steps.push({
            type: 'shift',
            indices: [j - gap, j],
            currentValue: current,
            description: `Shifting ${arrayCopy[j - gap]} to position ${j}`
          });
          
          arrayCopy[j] = arrayCopy[j - gap];
          j -= gap;
        }
        
        // Insert current element at the correct position
        if (j !== i) {
          steps.push({
            type: 'insert',
            indices: [j],
            currentValue: current,
            description: `Inserting ${current} at position ${j}`
          });
          
          arrayCopy[j] = current;
        } else {
          steps.push({
            type: 'insert',
            indices: [j],
            currentValue: current,
            description: `${current} is already in the correct position`
          });
        }
      }
      
      // If this is the last gap (gap = 1), mark all elements as sorted
      if (gap === 1) {
        const sortedIndices = Array.from({ length: n }, (_, i) => i);
        steps.push({
          type: 'sorted',
          indices: sortedIndices,
          description: 'All elements are now sorted'
        });
      }
    }
    
    return steps;
  };

  const startShellSort = () => {
    if (isSorting && !isPaused) return;
    
    if (!animationSteps.length) {
      // Generate all the steps first
      const steps = generateShellSortSteps([...array]);
      setAnimationSteps(steps);
    }
    
    setIsSorting(true);
    setIsPaused(false);
    
    // If we're resuming from a pause, continue from current step
    animateStep(currentStep);
  };

  const animateStep = (step: number) => {
    if (step >= animationSteps.length) {
      // Animation complete
      setIsSorting(false);
      return;
    }
    
    const currentAnimation = animationSteps[step];
    setStepDescription(currentAnimation.description);
    
    // Reset previous state
    setCurrentIndices([]);
    setComparingIndices([]);
    setCurrentIndex(null);
    
    // Update state based on the current animation step
    if (currentAnimation.type === 'compare') {
      setComparingIndices(currentAnimation.indices);
      if (currentAnimation.indices.length === 1 && currentAnimation.currentValue !== undefined) {
        setCurrentIndex(currentAnimation.indices[0]);
      }
    } else if (currentAnimation.type === 'shift') {
      setCurrentIndices(currentAnimation.indices);
      
      // Perform the actual shift in the array
      const newArray = [...array];
      const [from, to] = currentAnimation.indices;
      newArray[to] = newArray[from];
      setArray(newArray);
    } else if (currentAnimation.type === 'insert') {
      setCurrentIndices(currentAnimation.indices);
      
      // Insert the current value
      if (currentAnimation.currentValue !== undefined) {
        const newArray = [...array];
        const [position] = currentAnimation.indices;
        newArray[position] = currentAnimation.currentValue;
        setArray(newArray);
      }
    } else if (currentAnimation.type === 'sorted') {
      setSortedIndices(prev => {
        // Ensure we don't add duplicates
        const newIndices = [...prev];
        currentAnimation.indices.forEach(index => {
          if (!newIndices.includes(index)) {
            newIndices.push(index);
          }
        });
        return newIndices;
      });
    } else if (currentAnimation.type === 'gap-change') {
      if (currentAnimation.gapValue !== undefined) {
        setCurrentGap(currentAnimation.gapValue);
      }
    } else if (currentAnimation.type === 'gap-mark') {
      const newGapIndices = Array(array.length).fill(null);
      currentAnimation.indices.forEach(index => {
        newGapIndices[index] = currentAnimation.gapValue || null;
      });
      setGapIndices(newGapIndices);
    }
    
    // Schedule the next step
    setCurrentStep(step + 1);
    
    if (!isPaused) {
      sortTimeoutRef.current = setTimeout(() => {
        animateStep(step + 1);
      }, speed);
    }
  };

  const pauseAnimation = () => {
    setIsPaused(true);
    if (sortTimeoutRef.current) {
      clearTimeout(sortTimeoutRef.current);
    }
  };

  const resetAnimation = () => {
    if (sortTimeoutRef.current) {
      clearTimeout(sortTimeoutRef.current);
    }
    generateRandomArray();
  };

  const stepForward = () => {
    if (currentStep >= animationSteps.length) return;
    
    // If not started or paused, generate steps first
    if (!isSorting || isPaused) {
      if (!animationSteps.length) {
        const steps = generateShellSortSteps([...array]);
        setAnimationSteps(steps);
      }
      setIsSorting(true);
      setIsPaused(true);
    } else {
      pauseAnimation();
    }
    
    // Step forward
    animateStep(currentStep);
  };

  const stepBackward = () => {
    if (currentStep <= 1) return;
    
    const newStep = currentStep - 2; // Go back 2 steps (current-1 and then animate)
    
    if (!isSorting || isPaused) {
      if (!animationSteps.length) {
        const steps = generateShellSortSteps([...array]);
        setAnimationSteps(steps);
      }
      setIsSorting(true);
      setIsPaused(true);
    } else {
      pauseAnimation();
    }
    
    // Reset to initial state and replay up to the previous step
    const initialArray = [...animationSteps[0].indices.length > 0 
      ? array.map((_, i) => animationSteps[0].indices.includes(i) ? array[i] : 0) 
      : array];
    setArray(initialArray);
    setCurrentIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    setCurrentIndex(null);
    setGapIndices(Array(array.length).fill(null));
    setCurrentGap(null);
    
    // Replay all steps up to the new step
    const tempArray = [...initialArray];
    const newSortedIndices: number[] = [];
    const newGapIndices = Array(array.length).fill(null);
    
    for (let i = 0; i <= newStep; i++) {
      const step = animationSteps[i];
      
      if (step.type === 'shift') {
        const [from, to] = step.indices;
        tempArray[to] = tempArray[from];
      } else if (step.type === 'insert' && step.currentValue !== undefined) {
        const [position] = step.indices;
        tempArray[position] = step.currentValue;
      } else if (step.type === 'sorted') {
        step.indices.forEach(index => {
          if (!newSortedIndices.includes(index)) {
            newSortedIndices.push(index);
          }
        });
      } else if (step.type === 'gap-change' && step.gapValue !== undefined) {
        setCurrentGap(step.gapValue);
      } else if (step.type === 'gap-mark') {
        step.indices.forEach(index => {
          newGapIndices[index] = step.gapValue || null;
        });
      }
    }
    
    setArray(tempArray);
    setSortedIndices(newSortedIndices);
    setGapIndices(newGapIndices);
    setCurrentStep(newStep + 1);
    
    // Set the description and visual state for the current step
    const currentAnimation = animationSteps[newStep];
    setStepDescription(currentAnimation.description);
    
    if (currentAnimation.type === 'compare') {
      setComparingIndices(currentAnimation.indices);
      setCurrentIndices([]);
      if (currentAnimation.indices.length === 1 && currentAnimation.currentValue !== undefined) {
        setCurrentIndex(currentAnimation.indices[0]);
      }
    } else if (currentAnimation.type === 'shift' || currentAnimation.type === 'insert') {
      setCurrentIndices(currentAnimation.indices);
      setComparingIndices([]);
    } else {
      setCurrentIndices([]);
      setComparingIndices([]);
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpeed(Number(e.target.value));
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setArraySize(Number(e.target.value));
    generateRandomArray();
  };

  const handlePlayPause = () => {
    if (isSorting) {
      if (isPaused) {
        // Resume
        setIsPaused(false);
        animateStep(currentStep);
      } else {
        // Pause
        pauseAnimation();
      }
    } else {
      // Start
      startShellSort();
    }
  };

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
          Shell Sort is an in-place comparison sort algorithm that generalizes insertion sort by enabling the exchange of items that are far apart. It starts by sorting pairs of elements far apart from each other, then progressively reduces the gap between elements to be compared, ending with a standard insertion sort.
        </PageDescription>
      </PageHeader>

      <VisualizationContainer>
        <ControlsContainer>
          <Button onClick={handlePlayPause}>
            {isSorting && !isPaused ? <FiPause /> : <FiPlay />}
            {isSorting && !isPaused ? 'Pause' : 'Play'}
          </Button>
          <Button onClick={resetAnimation}>
            <FiRefreshCw />
            Reset
          </Button>
          <Button onClick={stepBackward} disabled={currentStep <= 1}>
            <FiChevronsLeft />
            Step Back
          </Button>
          <Button onClick={stepForward} disabled={currentStep >= animationSteps.length}>
            <FiChevronsRight />
            Step Forward
          </Button>
          <SpeedControl>
            <SpeedLabel>Speed:</SpeedLabel>
            <SpeedSelect value={speed} onChange={handleSpeedChange}>
              <option value={1000}>Slow</option>
              <option value={500}>Medium</option>
              <option value={250}>Fast</option>
            </SpeedSelect>
          </SpeedControl>
          <SpeedControl>
            <SpeedLabel>Array Size:</SpeedLabel>
            <SpeedSelect value={arraySize} onChange={handleSizeChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
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
              isCurrent={currentIndex === index}
              gapIndex={gapIndices[index]}
              initial={{ scale: 1 }}
              animate={{ scale: currentIndices.includes(index) ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
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

        {stepDescription && (
          <StepInfo>
            <StepDescription>
              {stepDescription}
            </StepDescription>
          </StepInfo>
        )}

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
      
        <CodeBlock>
          <CodeTitle>Shell Sort Implementation</CodeTitle>
          <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
            {shellSortCode}
          </SyntaxHighlighter>
        </CodeBlock>
      </VisualizationContainer>
    </PageContainer>
  );
};

export default ShellSortPage; 