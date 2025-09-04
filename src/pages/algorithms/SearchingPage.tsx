import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiRefreshCw, FiPlay, FiPause, FiSkipForward, FiClock } from 'react-icons/fi';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray800};
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 800px;
  line-height: 1.6;
`;

const VisualizerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: row;
  }
`;

const VisualizerSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CodeSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ControlPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius};
  width: 80px;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.primary : 
    variant === 'secondary' ? theme.colors.secondary : 
    variant === 'danger' ? theme.colors.danger : 
    theme.colors.gray200};
  color: ${({ variant }) => variant ? 'white' : 'inherit'};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const AlgorithmSelector = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const AlgorithmButton = styled(Button)<{ isActive?: boolean }>`
  background-color: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary : theme.colors.gray200};
  color: ${({ isActive }) => isActive ? 'white' : 'inherit'};
`;

const VisualizerArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-height: 400px;
`;

const ArrayContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin: 2rem 0;
`;

const ArrayElement = styled(motion.div)<{ 
  isTarget?: boolean; 
  isCurrent?: boolean; 
  isFound?: boolean;
  isSorted?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: ${({ theme, isTarget, isCurrent, isFound, isSorted }) => 
    isFound ? theme.colors.success :
    isTarget ? theme.colors.secondary :
    isCurrent ? theme.colors.primary :
    isSorted ? theme.colors.primaryLight :
    'white'};
  color: ${({ theme, isTarget, isCurrent, isFound }) => 
    (isTarget || isCurrent || isFound) ? 'white' : theme.colors.gray800};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: 600;
  font-size: 1.25rem;
  border: 2px solid ${({ theme, isTarget, isCurrent, isFound, isSorted }) => 
    isFound ? theme.colors.success :
    isTarget ? theme.colors.secondary :
    isCurrent ? theme.colors.primary :
    isSorted ? theme.colors.primaryLight :
    theme.colors.gray300};
  position: relative;
`;

const ArrayIndex = styled.div`
  position: absolute;
  top: -20px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray500};
  font-weight: normal;
`;

const MessageContainer = styled.div`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.gray700};
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const CodeBlock = styled.div`
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

const InfoPanel = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const InfoTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.gray800};
`;

const InfoContent = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
  
  ul {
    padding-left: 1.5rem;
    margin-top: 0.5rem;
  }
  
  li {
    margin-bottom: 0.25rem;
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.card};
  font-family: ${({ theme }) => theme.fonts.sans};
  cursor: pointer;
`;

// Types
interface ArrayItemState {
  value: number;
  isCurrent: boolean;
  isTarget: boolean;
  isFound: boolean;
  isSorted: boolean;
}

type SearchAlgorithm = 'linear' | 'binary';

// SearchingPage Component
const SearchingPage: React.FC = () => {
  const [array, setArray] = useState<ArrayItemState[]>([]);
  const [targetValue, setTargetValue] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [algorithm, setAlgorithm] = useState<SearchAlgorithm>('linear');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchSpeed, setSearchSpeed] = useState<number>(500); // ms
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [searchSteps, setSearchSteps] = useState<ArrayItemState[][]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize array
  useEffect(() => {
    generateRandomArray();
  }, []);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  
  // Generate a random sorted array for binary search
  const generateRandomArray = () => {
    const size = 15;
    let newArray: ArrayItemState[] = [];
    
    if (algorithm === 'linear') {
      // For linear search, generate random unsorted array
      newArray = Array.from({ length: size }, () => ({
        value: Math.floor(Math.random() * 100),
        isCurrent: false,
        isTarget: false,
        isFound: false,
        isSorted: false
      }));
    } else {
      // For binary search, generate sorted array
      const values = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
      values.sort((a, b) => a - b);
      
      newArray = values.map(value => ({
        value,
        isCurrent: false,
        isTarget: false,
        isFound: false,
        isSorted: true
      }));
    }
    
    setArray(newArray);
    setSearchSteps([]);
    setCurrentStep(0);
    setMessage(`Generated a new ${algorithm === 'binary' ? 'sorted ' : ''}array with ${size} elements`);
  };
  
  // Handle target value change
  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetValue(e.target.value);
  };
  
  // Handle algorithm change
  const handleAlgorithmChange = (newAlgorithm: SearchAlgorithm) => {
    setAlgorithm(newAlgorithm);
    setSearchSteps([]);
    setCurrentStep(0);
    setIsSearching(false);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Generate a new array appropriate for the algorithm
    setTimeout(() => {
      generateRandomArray();
    }, 100);
  };
  
  // Handle speed change
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchSpeed(parseInt(e.target.value));
  };
  
  // Start search animation
  const startSearch = () => {
    const target = parseInt(targetValue);
    
    if (isNaN(target)) {
      setMessage('Please enter a valid number to search for');
      return;
    }
    
    // Reset any previous search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    
    // Set searching state to true
    setIsSearching(true);
    
    // Generate search steps
    const steps = algorithm === 'linear' 
      ? generateLinearSearchSteps(target) 
      : generateBinarySearchSteps(target);
    // Update state with the steps
    setSearchSteps(steps);
    setCurrentStep(0);
    
    // Force update the array with the first step
    setArray(steps[0]);
    
    // Start animation with a slight delay to ensure state updates
    setTimeout(() => {
      // Double-check that we're still in searching state
      if (steps.length > 1) {
        animateSearch(steps, 0);
      } else {
      }
    }, 100);
  };
  
  // Pause search animation
  const pauseSearch = () => {
    setIsSearching(false);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };
  
  // Resume search animation
  const resumeSearch = () => {
    setIsSearching(true);
    animateSearch(searchSteps, currentStep);
  };
  
  // Skip to next step
  const nextStep = () => {
    if (currentStep < searchSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setArray(searchSteps[currentStep + 1]);
      
      // Update message based on the step
      updateStepMessage(currentStep + 1);
    }
  };
  
  // Update message based on current step
  const updateStepMessage = (step: number) => {
    if (step === searchSteps.length - 1) {
      // Check if the target was found
      const foundItem = searchSteps[step].find(item => item.isFound);
      
      if (foundItem) {
        setMessage(`Found ${foundItem.value} using ${algorithm} search!`);
      } else {
        setMessage(`${parseInt(targetValue)} was not found in the array using ${algorithm} search.`);
      }
      
      setIsSearching(false);
    } else {
      const currentItem = searchSteps[step].find(item => item.isCurrent);
      
      if (currentItem) {
        if (algorithm === 'linear') {
          setMessage(`Checking if ${currentItem.value} equals ${targetValue}...`);
        } else {
          setMessage(`Checking middle element ${currentItem.value}...`);
        }
      }
    }
  };
  
  // Animate search steps
  const animateSearch = (steps: ArrayItemState[][], startStep: number) => {
    // Log for debugging
    // If not searching or beyond the last step, stop animation
    if (!isSearching || startStep >= steps.length) {
      return;
    }
    
    // Update the array with the current step
    setArray(steps[startStep]);
    setCurrentStep(startStep);
    
    // Update message based on the step
    updateStepMessage(startStep);
    
    // Schedule next step
    if (startStep < steps.length - 1) {
      console.log(`Scheduling next step (${startStep + 1}) in ${searchSpeed}ms`);
      
      // Clear any existing timeout to prevent multiple timers
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      // Set new timeout for next step
      searchTimeoutRef.current = setTimeout(() => {
        animateSearch(steps, startStep + 1);
      }, searchSpeed);
    } else {
      // Last step reached
      setIsSearching(false);
    }
  };
  
  // Generate linear search steps
  const generateLinearSearchSteps = (target: number): ArrayItemState[][] => {
    const steps: ArrayItemState[][] = [];
    const initialArray = array.map(item => ({
      ...item,
      isCurrent: false,
      isTarget: false,
      isFound: false
    }));
    
    steps.push([...initialArray]);
    
    let found = false;
    
    // Generate steps for each element check
    for (let i = 0; i < initialArray.length; i++) {
      const stepArray = steps[steps.length - 1].map((item, index) => {
        if (index === i) {
          // Current element being checked
          if (item.value === target) {
            // Target found
            found = true;
            return { ...item, isCurrent: true, isFound: true };
          } else {
            return { ...item, isCurrent: true };
          }
        } else if (index < i) {
          // Already checked elements
          return { ...item, isCurrent: false };
        } else {
          return { ...item };
        }
      });
      
      steps.push([...stepArray]);
      
      if (found) {
        break;
      }
    }
    
    // If not found, add a final step with all elements checked
    if (!found) {
      steps.push(steps[steps.length - 1].map(item => ({ ...item, isCurrent: false })));
    }
    
    return steps;
  };
  
  // Generate binary search steps
  const generateBinarySearchSteps = (target: number): ArrayItemState[][] => {
    const steps: ArrayItemState[][] = [];
    const initialArray = array.map(item => ({
      ...item,
      isCurrent: false,
      isTarget: false,
      isFound: false
    }));
    
    steps.push([...initialArray]);
    
    let left = 0;
    let right = initialArray.length - 1;
    let found = false;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      // Create a step showing the current range and middle element
      const stepArray = steps[steps.length - 1].map((item, index) => {
        if (index === mid) {
          // Middle element
          if (item.value === target) {
            // Target found
            found = true;
            return { ...item, isCurrent: true, isFound: true };
          } else {
            return { ...item, isCurrent: true };
          }
        } else if (index >= left && index <= right) {
          // Current search range
          return { ...item, isCurrent: false, isTarget: true };
        } else {
          // Elements outside the search range
          return { ...item, isCurrent: false, isTarget: false };
        }
      });
      
      steps.push([...stepArray]);
      
      if (found) {
        break;
      }
      
      // Update search range
      if (initialArray[mid].value < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    // If not found, add a final step
    if (!found) {
      steps.push(steps[steps.length - 1].map(item => ({ 
        ...item, 
        isCurrent: false,
        isTarget: false 
      })));
    }
    
    return steps;
  };
  
  // Code snippets
  const linearSearchCode = `
function linearSearch(arr, target) {
  // Iterate through each element in the array
  for (let i = 0; i < arr.length; i++) {
    // If the current element equals the target
    if (arr[i] === target) {
      // Return the index where the target was found
      return i;
    }
  }
  
  // If the target is not found, return -1
  return -1;
}`;

  const binarySearchCode = `
function binarySearch(arr, target) {
  // Initialize left and right pointers
  let left = 0;
  let right = arr.length - 1;
  
  // Continue searching while left pointer <= right pointer
  while (left <= right) {
    // Calculate the middle index
    const mid = Math.floor((left + right) / 2);
    
    // If the middle element is the target
    if (arr[mid] === target) {
      return mid;
    }
    
    // If the middle element is less than the target
    // search the right half
    if (arr[mid] < target) {
      left = mid + 1;
    } 
    // If the middle element is greater than the target
    // search the left half
    else {
      right = mid - 1;
    }
  }
  
  // If the target is not found, return -1
  return -1;
}`;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Searching Algorithms Visualization</PageTitle>
        <PageDescription>
          Searching algorithms are methods for finding a specific item within a data structure.
          This visualization demonstrates popular searching algorithms like Linear Search and Binary Search.
        </PageDescription>
      </PageHeader>
      
      <VisualizerContainer>
        <VisualizerSection>
          <ControlPanel>
            <AlgorithmSelector>
              <AlgorithmButton 
                isActive={algorithm === 'linear'} 
                onClick={() => handleAlgorithmChange('linear')}
              >
                Linear Search
              </AlgorithmButton>
              <AlgorithmButton 
                isActive={algorithm === 'binary'} 
                onClick={() => handleAlgorithmChange('binary')}
              >
                Binary Search
              </AlgorithmButton>
            </AlgorithmSelector>
            
            <InputGroup>
              <Input 
                type="number" 
                placeholder="Search for" 
                value={targetValue} 
                onChange={handleTargetChange}
              />
            </InputGroup>
            
            <InputGroup>
              <FiClock size={16} style={{ marginRight: '4px' }} />
              <Select value={searchSpeed} onChange={handleSpeedChange}>
                <option value="1000">Slow</option>
                <option value="500">Medium</option>
                <option value="250">Fast</option>
                <option value="100">Very Fast</option>
              </Select>
            </InputGroup>
            
            {!isSearching ? (
              <Button 
                variant="primary" 
                onClick={() => {
                  startSearch();
                }}
              >
                <FiSearch size={16} /> Search
              </Button>
            ) : (
              <Button variant="secondary" onClick={pauseSearch}>
                <FiPause size={16} /> Pause
              </Button>
            )}
            
            {!isSearching && searchSteps.length > 0 && currentStep < searchSteps.length - 1 && (
              <Button variant="primary" onClick={resumeSearch}>
                <FiPlay size={16} /> Resume
              </Button>
            )}
            
            {!isSearching && searchSteps.length > 0 && currentStep < searchSteps.length - 1 && (
              <Button onClick={nextStep}>
                <FiSkipForward size={16} /> Next Step
              </Button>
            )}
            
            <Button onClick={generateRandomArray}>
              <FiRefreshCw size={16} /> New Array
            </Button>
          </ControlPanel>
          
          <VisualizerArea>
            <ArrayContainer>
              <AnimatePresence>
                {array.map((item, index) => (
                  <ArrayElement
                    key={`${index}-${item.value}`}
                    isCurrent={item.isCurrent}
                    isTarget={item.isTarget}
                    isFound={item.isFound}
                    isSorted={item.isSorted}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ArrayIndex>{index}</ArrayIndex>
                    {item.value}
                  </ArrayElement>
                ))}
              </AnimatePresence>
            </ArrayContainer>
            
            {message && (
              <MessageContainer>
                {message}
              </MessageContainer>
            )}
          </VisualizerArea>
          
          <InfoPanel>
            <InfoTitle>About {algorithm === 'linear' ? 'Linear' : 'Binary'} Search</InfoTitle>
            <InfoContent>
              {algorithm === 'linear' ? (
                <>
                  <p>
                    Linear search is the simplest searching algorithm that checks each element in the array sequentially until the target element is found or the end of the array is reached.
                  </p>
                  <ul>
                    <li><strong>Time Complexity:</strong> O(n) - In the worst case, we need to check all n elements</li>
                    <li><strong>Space Complexity:</strong> O(1) - Only requires a constant amount of extra space</li>
                    <li><strong>Advantages:</strong> Simple to implement, works on unsorted arrays</li>
                    <li><strong>Disadvantages:</strong> Inefficient for large arrays</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>
                    Binary search is an efficient algorithm for finding an item in a sorted array. It works by repeatedly dividing the search interval in half.
                  </p>
                  <ul>
                    <li><strong>Time Complexity:</strong> O(log n) - The search space is halved in each step</li>
                    <li><strong>Space Complexity:</strong> O(1) - Only requires a constant amount of extra space</li>
                    <li><strong>Advantages:</strong> Very efficient for large sorted arrays</li>
                    <li><strong>Disadvantages:</strong> Requires the array to be sorted</li>
                  </ul>
                </>
              )}
            </InfoContent>
          </InfoPanel>
        </VisualizerSection>
        
        <CodeSection>
          <CodeBlock>
            <CodeTitle>{algorithm === 'linear' ? 'Linear' : 'Binary'} Search Implementation</CodeTitle>
            <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers>
              {algorithm === 'linear' ? linearSearchCode : binarySearchCode}
            </SyntaxHighlighter>
          </CodeBlock>
        </CodeSection>
      </VisualizerContainer>
    </PageContainer>
  );
};

export default SearchingPage; 