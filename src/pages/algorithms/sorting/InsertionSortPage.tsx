import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiRefreshCw, FiSkipForward, FiSkipBack, FiClock } from 'react-icons/fi';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import AlgorithmDropdown from '../../../components/algorithms/AlgorithmDropdown';
import ArrayControls from '../../../components/algorithms/ArrayControls';

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavigationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-size: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray800};
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  max-width: 800px;
  line-height: 1.6;
`;

const VisualizationContainer = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ControlButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: ${({ active, theme }) => active ? theme.colors.primary : 'white'};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.gray700};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.9rem;
  cursor: pointer;
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

const BarContainer = styled.div`
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

const Bar = styled(motion.div)<{ height: number; isActive: boolean; isComparing: boolean; isSorted: boolean; isCurrent?: boolean }>`
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

const StepDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.gray700};
  margin: 0;
`;

const CodeHighlight = styled.span`
  font-family: 'Fira Code', monospace;
  background-color: ${({ theme }) => theme.colors.gray200};
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
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
  type: 'compare' | 'insert' | 'shift' | 'sorted' | 'current';
  indices: number[];
  currentValue?: number;
  description: string;
}

const InsertionSortPage: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [speed, setSpeed] = useState<number>(500); // milliseconds
  const [arraySize, setArraySize] = useState<number>(10);
  const [stepDescription, setStepDescription] = useState<string>('');
  
  const animationRef = useRef<number | null>(null);
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  const generateRandomArray = (size: number = arraySize) => {
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    resetArrayState(newArray);
  };
  
  const handleCustomArray = (customArray: number[]) => {
    resetArrayState(customArray);
  };
  
  const resetArrayState = (newArray: number[]) => {
    setArray(newArray);
    setActiveIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    setCurrentIndex(null);
    setCurrentStep(0);
    setAnimationSteps([]);
    setStepDescription('');
    
    // Reset animation
    if (sortTimeoutRef.current) {
      clearTimeout(sortTimeoutRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsSorting(false);
    setIsPaused(false);
  };
  
  const generateInsertionSortSteps = (arr: number[]): AnimationStep[] => {
    const steps: AnimationStep[] = [];
    const arrayCopy = [...arr];
    const n = arrayCopy.length;
    
    // Mark the first element as sorted
    steps.push({
      type: 'sorted',
      indices: [0],
      description: 'First element is already sorted by default'
    });
    
    for (let i = 1; i < n; i++) {
      // Current element to be inserted
      const current = arrayCopy[i];
      
      steps.push({
        type: 'current',
        indices: [i],
        currentValue: current,
        description: `Starting to insert element at index ${i} with value ${current}`
      });
      
      // Compare with elements in the sorted portion
      let j = i - 1;
      
      while (j >= 0 && arrayCopy[j] > current) {
        steps.push({
          type: 'compare',
          indices: [j, j + 1],
          currentValue: current,
          description: `Comparing ${arrayCopy[j]} with current value ${current}`
        });
        
        // Shift elements that are greater than current
        steps.push({
          type: 'shift',
          indices: [j, j + 1],
          currentValue: current,
          description: `Shifting ${arrayCopy[j]} to the right`
        });
        
        arrayCopy[j + 1] = arrayCopy[j];
        j--;
      }
      
      // Place current element at its correct position
      steps.push({
        type: 'insert',
        indices: [j + 1],
        currentValue: current,
        description: `Inserting ${current} at position ${j + 1}`
      });
      
      arrayCopy[j + 1] = current;
      
      // Mark the element as sorted
      steps.push({
        type: 'sorted',
        indices: [j + 1],
        description: `Element ${current} is now in its correct sorted position`
      });
    }
    
    return steps;
  };
  
  const startInsertionSort = () => {
    if (isSorting && !isPaused) return;
    
    if (!animationSteps.length) {
      // Generate all the steps first
      const steps = generateInsertionSortSteps([...array]);
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
    setActiveIndices([]);
    setComparingIndices([]);
    setCurrentIndex(null);
    
    // Update state based on the current animation step
    if (currentAnimation.type === 'compare') {
      setComparingIndices(currentAnimation.indices);
      if (currentAnimation.currentValue !== undefined) {
        setCurrentIndex(currentAnimation.indices[1]);
      }
    } else if (currentAnimation.type === 'current') {
      setCurrentIndex(currentAnimation.indices[0]);
    } else if (currentAnimation.type === 'shift') {
      setActiveIndices(currentAnimation.indices);
      
      // Perform the actual shift in the array
      const newArray = [...array];
      const [from, to] = currentAnimation.indices;
      newArray[to] = newArray[from];
      setArray(newArray);
    } else if (currentAnimation.type === 'insert') {
      setActiveIndices(currentAnimation.indices);
      
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
    
    setIsSorting(false);
    setIsPaused(false);
    setCurrentStep(0);
    setActiveIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    setCurrentIndex(null);
    setStepDescription('');
    
    // Reset array to initial state
    generateRandomArray();
  };
  
  const stepForward = () => {
    if (currentStep < animationSteps.length) {
      if (sortTimeoutRef.current) {
        clearTimeout(sortTimeoutRef.current);
      }
      
      setIsPaused(true);
      animateStep(currentStep);
    }
  };
  
  const stepBackward = () => {
    if (currentStep > 1) {
      if (sortTimeoutRef.current) {
        clearTimeout(sortTimeoutRef.current);
      }
      
      // Go back two steps and then animate forward one step
      // This effectively goes back one step
      const newStep = currentStep - 2;
      setIsPaused(true);
      
      // Reset the array and sorted indices to their initial state
      const originalArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 90) + 10);
      setArray(originalArray);
      setSortedIndices([]);
      setCurrentIndex(null);
      
      // Then replay all steps up to the new step
      let tempArray = [...originalArray];
      const newSortedIndices: number[] = [];
      
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
        }
      }
      
      setArray(tempArray);
      setSortedIndices(newSortedIndices);
      setCurrentStep(newStep + 1);
      
      // Set the description and visual state for the current step
      const currentAnimation = animationSteps[newStep];
      setStepDescription(currentAnimation.description);
      
      if (currentAnimation.type === 'compare') {
        setComparingIndices(currentAnimation.indices);
        setActiveIndices([]);
        if (currentAnimation.currentValue !== undefined) {
          setCurrentIndex(currentAnimation.indices[1]);
        }
      } else if (currentAnimation.type === 'current') {
        setCurrentIndex(currentAnimation.indices[0]);
        setActiveIndices([]);
        setComparingIndices([]);
      } else if (currentAnimation.type === 'shift' || currentAnimation.type === 'insert') {
        setActiveIndices(currentAnimation.indices);
        setComparingIndices([]);
      } else {
        setActiveIndices([]);
        setComparingIndices([]);
      }
    }
  };
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpeed(Number(e.target.value));
  };
  
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setArraySize(Number(e.target.value));
    generateRandomArray();
  };
  
  // Insertion Sort implementation code
  const insertionSortCode = `
function insertionSort(arr) {
  const n = arr.length;
  
  // Start from the second element (index 1)
  for (let i = 1; i < n; i++) {
    // Element to be inserted
    const current = arr[i];
    
    // Find position where current should be inserted
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      // Shift elements to the right
      arr[j + 1] = arr[j];
      j--;
    }
    
    // Insert current at the correct position
    arr[j + 1] = current;
  }
  
  return arr;
}`;
  
  return (
    <PageContainer>
      <NavigationRow>
        <BackButton to="/algorithms/sorting">
          <FaArrowLeft />
          <span style={{ marginLeft: '0.5rem' }}>Back to Sorting Algorithms</span>
        </BackButton>
        
        <AlgorithmDropdown 
          buttonText="Switch Algorithm" 
          options={algorithmOptions} 
        />
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Insertion Sort</PageTitle>
        <PageDescription>
          Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time. 
          It is much less efficient on large lists than more advanced algorithms, but it has advantages such as 
          simple implementation, efficiency for small data sets, and more efficiency in practice than other 
          simple quadratic algorithms like selection sort or bubble sort.
        </PageDescription>
      </PageHeader>
      
      <VisualizationContainer>
        <ArrayControls
          onGenerateRandom={generateRandomArray}
          onCustomArray={handleCustomArray}
          arraySize={arraySize}
          onSizeChange={setArraySize}
          disabled={isSorting && !isPaused}
          maxValue={100}
        />
        
        <ControlsContainer>
          {!isSorting || isPaused ? (
            <ControlButton 
              onClick={startInsertionSort} 
              active={true}
            >
              <FiPlay size={16} />
              {isPaused ? 'Resume' : 'Start Sorting'}
            </ControlButton>
          ) : (
            <ControlButton 
              onClick={pauseAnimation}
            >
              <FiPause size={16} />
              Pause
            </ControlButton>
          )}
          
          <ControlButton 
            onClick={stepBackward} 
            disabled={currentStep <= 1 || (!isSorting && !isPaused)}
          >
            <FiSkipBack size={16} />
            Step Back
          </ControlButton>
          
          <ControlButton 
            onClick={stepForward} 
            disabled={currentStep >= animationSteps.length || (!isSorting && !isPaused)}
          >
            <FiSkipForward size={16} />
            Step Forward
          </ControlButton>
          
          <SpeedControl>
            <FiClock size={16} />
            <SpeedLabel>Speed:</SpeedLabel>
            <SpeedSelect value={speed} onChange={handleSpeedChange}>
              <option value="1000">Slow</option>
              <option value="500">Medium</option>
              <option value="200">Fast</option>
              <option value="50">Very Fast</option>
            </SpeedSelect>
          </SpeedControl>
        </ControlsContainer>
        
        <BarContainer>
          {array.map((value, index) => (
            <Bar
              key={index}
              height={value}
              isActive={activeIndices.includes(index)}
              isComparing={comparingIndices.includes(index)}
              isSorted={sortedIndices.includes(index)}
              isCurrent={currentIndex === index}
              initial={{ height: 0 }}
              animate={{ height: `${value}%` }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </BarContainer>
        
        {stepDescription && (
          <StepInfo>
            <StepDescription>
              {stepDescription}
            </StepDescription>
          </StepInfo>
        )}
        
        <ComplexityInfo>
          <ComplexityItem>
            <ComplexityLabel>Time Complexity (Best):</ComplexityLabel>
            <ComplexityValue>O(n)</ComplexityValue>
          </ComplexityItem>
          <ComplexityItem>
            <ComplexityLabel>Time Complexity (Average):</ComplexityLabel>
            <ComplexityValue>O(n²)</ComplexityValue>
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
            <ComplexityValue>Stable</ComplexityValue>
          </ComplexityItem>
        </ComplexityInfo>
        
        <CodeBlock>
          <CodeTitle>Insertion Sort Implementation</CodeTitle>
          <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
            {insertionSortCode}
          </SyntaxHighlighter>
        </CodeBlock>
      </VisualizationContainer>
    </PageContainer>
  );
};

export default InsertionSortPage; 