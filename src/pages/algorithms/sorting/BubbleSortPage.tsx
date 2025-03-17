import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiRefreshCw, FiSkipForward, FiSkipBack, FiClock } from 'react-icons/fi';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
  type: 'compare' | 'swap' | 'sorted';
  indices: number[];
  description: string;
}

const BubbleSortPage: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [speed, setSpeed] = useState<number>(500); // milliseconds
  const [arraySize, setArraySize] = useState<number>(10);
  const [stepDescription, setStepDescription] = useState<string>('');
  
  const animationRef = useRef<number | null>(null);
  const sortTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
  
  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setActiveIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
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
  
  const generateBubbleSortSteps = (arr: number[]): AnimationStep[] => {
    const steps: AnimationStep[] = [];
    const arrayCopy = [...arr];
    const n = arrayCopy.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Compare adjacent elements
        steps.push({
          type: 'compare',
          indices: [j, j + 1],
          description: `Comparing elements at indices ${j} and ${j + 1}: ${arrayCopy[j]} and ${arrayCopy[j + 1]}`
        });
        
        // If elements are in wrong order, swap them
        if (arrayCopy[j] > arrayCopy[j + 1]) {
          steps.push({
            type: 'swap',
            indices: [j, j + 1],
            description: `Swapping elements at indices ${j} and ${j + 1}: ${arrayCopy[j]} and ${arrayCopy[j + 1]}`
          });
          
          // Perform the swap in our copy
          [arrayCopy[j], arrayCopy[j + 1]] = [arrayCopy[j + 1], arrayCopy[j]];
        }
      }
      
      // Mark the last element of this pass as sorted
      steps.push({
        type: 'sorted',
        indices: [n - i - 1],
        description: `Element at index ${n - i - 1} is now in its correct sorted position`
      });
    }
    
    // Mark the first element as sorted (it's already in the right place)
    steps.push({
      type: 'sorted',
      indices: [0],
      description: 'First element is now in its correct sorted position'
    });
    
    return steps;
  };
  
  const startBubbleSort = () => {
    if (isSorting && !isPaused) return;
    
    if (!animationSteps.length) {
      // Generate all the steps first
      const steps = generateBubbleSortSteps([...array]);
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
    
    // Update state based on the current animation step
    if (currentAnimation.type === 'compare') {
      setComparingIndices(currentAnimation.indices);
    } else if (currentAnimation.type === 'swap') {
      setActiveIndices(currentAnimation.indices);
      
      // Perform the actual swap in the array
      const newArray = [...array];
      const [i, j] = currentAnimation.indices;
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      setArray(newArray);
    } else if (currentAnimation.type === 'sorted') {
      setSortedIndices(prev => [...prev, ...currentAnimation.indices]);
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
      generateRandomArray();
      
      // Then replay all steps up to the new step
      let tempArray = [...array];
      const newSortedIndices: number[] = [];
      
      for (let i = 0; i <= newStep; i++) {
        const step = animationSteps[i];
        
        if (step.type === 'swap') {
          const [j, k] = step.indices;
          [tempArray[j], tempArray[k]] = [tempArray[k], tempArray[j]];
        } else if (step.type === 'sorted') {
          newSortedIndices.push(...step.indices);
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
      } else if (currentAnimation.type === 'swap') {
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
  
  // Bubble Sort implementation code
  const bubbleSortCode = `
function bubbleSort(arr) {
  const n = arr.length;
  
  // Outer loop for passes
  for (let i = 0; i < n - 1; i++) {
    // Inner loop for comparisons in each pass
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap if they are in the wrong order
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
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
      </NavigationRow>
      
      <PageHeader>
        <PageTitle>Bubble Sort</PageTitle>
        <PageDescription>
          Bubble Sort is a simple comparison-based sorting algorithm that repeatedly steps through the list, 
          compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list 
          is repeated until the list is sorted.
        </PageDescription>
      </PageHeader>
      
      <VisualizationContainer>
        <ControlsContainer>
          <ControlButton 
            onClick={generateRandomArray} 
            disabled={isSorting && !isPaused}
          >
            <FiRefreshCw size={16} />
            New Array
          </ControlButton>
          
          {!isSorting || isPaused ? (
            <ControlButton 
              onClick={startBubbleSort} 
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
          
          <SpeedControl>
            <SpeedLabel>Array Size:</SpeedLabel>
            <SpeedSelect value={arraySize} onChange={handleSizeChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
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
          <CodeTitle>Bubble Sort Implementation</CodeTitle>
          <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
            {bubbleSortCode}
          </SyntaxHighlighter>
        </CodeBlock>
      </VisualizationContainer>
    </PageContainer>
  );
};

export default BubbleSortPage; 