import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { FiPlay, FiPause, FiRotateCcw, FiBarChart2 } from 'react-icons/fi';
import SimpleProblemPageTemplate from '../../../components/templates/SimpleProblemPageTemplate';

const VisualizationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadows.md};
`;

const ArrayContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const ArrayElement = styled.div<{ 
  isActive: boolean; 
  isCurrent: boolean; 
  isMaxSum: boolean; 
  value: number;
}>`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius};
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  border: 2px solid;
  
  background-color: ${props => 
    props.isMaxSum ? '#10B981' :
    props.isCurrent ? '#F59E0B' :
    props.isActive ? '#3B82F6' :
    props.value < 0 ? '#EF4444' : 
    '#E5E7EB'};
  
  color: ${props => 
    props.isMaxSum || props.isCurrent || props.isActive ? 'white' :
    props.value < 0 ? 'white' : '#374151'};
  
  border-color: ${props => 
    props.isMaxSum ? '#059669' :
    props.isCurrent ? '#D97706' :
    props.isActive ? '#2563EB' :
    props.value < 0 ? '#DC2626' : 
    '#D1D5DB'};

  transform: ${props => 
    props.isMaxSum ? 'scale(1.1)' :
    props.isCurrent ? 'scale(1.05)' : 'scale(1)'};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 45px;
    height: 45px;
    font-size: 12px;
  }
`;

const StatsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.card};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const ControlButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius};
  font-weight: 600;
  transition: all 0.2s ease;
  
  background-color: ${props => 
    props.variant === 'primary' ? props.theme.colors.primary : props.theme.colors.card};
  color: ${props => 
    props.variant === 'primary' ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => 
    props.variant === 'primary' ? props.theme.colors.primary : props.theme.colors.border};
  
  &:hover {
    background-color: ${props => 
      props.variant === 'primary' ? props.theme.colors.primaryDark : props.theme.colors.hover};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  width: 300px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 250px;
  }
`;

const AlgorithmExplanation = styled.div`
  background-color: ${props => props.theme.colors.card};
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${props => props.theme.colors.border};
  margin: 2rem 0;
`;

const MaximumSubarrayPage: React.FC = () => {
  const [array, setArray] = useState<number[]>([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSum, setCurrentSum] = useState(0);
  const [maxSum, setMaxSum] = useState(-Infinity);
  const [maxStart, setMaxStart] = useState(0);
  const [maxEnd, setMaxEnd] = useState(0);
  const [currentStart, setCurrentStart] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setCurrentSum(0);
    setMaxSum(array.length > 0 ? array[0] : -Infinity);
    setMaxStart(0);
    setMaxEnd(0);
    setCurrentStart(0);
    setIsPlaying(false);
    setIsCompleted(false);
  }, [array]);

  const step = useCallback(() => {
    if (currentIndex >= array.length) {
      setIsPlaying(false);
      setIsCompleted(true);
      return;
    }

    const currentElement = array[currentIndex];
    let newCurrentSum = currentSum + currentElement;
    let newMaxSum = maxSum;
    let newMaxStart = maxStart;
    let newMaxEnd = maxEnd;
    let newCurrentStart = currentStart;

    // If current sum becomes negative, start fresh from current position
    if (newCurrentSum < currentElement) {
      newCurrentSum = currentElement;
      newCurrentStart = currentIndex;
    }

    // Update maximum sum if we found a better one
    if (newCurrentSum > newMaxSum) {
      newMaxSum = newCurrentSum;
      newMaxStart = newCurrentStart;
      newMaxEnd = currentIndex;
    }

    setCurrentSum(newCurrentSum);
    setMaxSum(newMaxSum);
    setMaxStart(newMaxStart);
    setMaxEnd(newMaxEnd);
    setCurrentStart(newCurrentStart);
    setCurrentIndex(currentIndex + 1);
  }, [currentIndex, currentSum, maxSum, maxStart, maxEnd, currentStart, array]);

  const play = useCallback(() => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      step();
    }, 1000);

    const checkCompletion = setInterval(() => {
      if (currentIndex >= array.length - 1) {
        clearInterval(interval);
        clearInterval(checkCompletion);
        setIsPlaying(false);
        setIsCompleted(true);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(checkCompletion);
    };
  }, [step, currentIndex, array.length]);

  const handleArrayInput = (value: string) => {
    try {
      const newArray = value.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      if (newArray.length > 0) {
        setArray(newArray);
        setInputValue('');
      }
    } catch (error) {
      console.error('Invalid array input');
    }
  };

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 8) + 5;
    const newArray = Array.from({ length: size }, () => 
      Math.floor(Math.random() * 21) - 10
    );
    setArray(newArray);
  };

  React.useEffect(() => {
    reset();
  }, [array, reset]);

  const problemData = {
    title: "Maximum Subarray Sum",
    subtitle: "Kadane's Algorithm",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Find the contiguous subarray within a one-dimensional array of numbers that has the largest sum.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    approach: "Dynamic Programming - keep track of maximum sum ending at current position"
  };

  return (
    <SimpleProblemPageTemplate problemData={problemData}>
      <VisualizationContainer>
        <InputContainer>
          <Input
            type="text"
            placeholder="Enter array (e.g., -2,1,-3,4,-1,2,1,-5,4)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleArrayInput(inputValue);
              }
            }}
          />
          <ControlButton onClick={() => handleArrayInput(inputValue)}>
            Set Array
          </ControlButton>
          <ControlButton onClick={generateRandomArray}>
            Random Array
          </ControlButton>
        </InputContainer>

        <ArrayContainer>
          {array.map((value, index) => (
            <ArrayElement
              key={index}
              value={value}
              isActive={index >= maxStart && index <= maxEnd && isCompleted}
              isCurrent={index === currentIndex - 1}
              isMaxSum={index >= maxStart && index <= maxEnd && isCompleted}
            >
              {value}
            </ArrayElement>
          ))}
        </ArrayContainer>

        <StatsPanel>
          <StatCard>
            <StatLabel>Current Index</StatLabel>
            <StatValue>{currentIndex}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Current Sum</StatLabel>
            <StatValue>{currentSum}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Maximum Sum</StatLabel>
            <StatValue style={{ color: '#10B981' }}>{maxSum}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Subarray Range</StatLabel>
            <StatValue>{`[${maxStart}, ${maxEnd}]`}</StatValue>
          </StatCard>
        </StatsPanel>

        <ControlsContainer>
          <ControlButton
            variant="primary"
            onClick={isPlaying ? () => setIsPlaying(false) : play}
            disabled={isCompleted}
          >
            {isPlaying ? <FiPause /> : <FiPlay />}
            {isPlaying ? 'Pause' : 'Play'}
          </ControlButton>
          <ControlButton onClick={step} disabled={isPlaying || isCompleted}>
            Step
          </ControlButton>
          <ControlButton onClick={reset}>
            <FiRotateCcw />
            Reset
          </ControlButton>
        </ControlsContainer>

        <AlgorithmExplanation>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiBarChart2 />
            Kadane's Algorithm Explanation
          </h3>
          <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
            Kadane's algorithm efficiently finds the maximum sum of any contiguous subarray in O(n) time.
            The key insight is that at each position, we decide whether to:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem', lineHeight: 1.8 }}>
            <li><strong>Continue the current subarray</strong>: Add current element to existing sum</li>
            <li><strong>Start a new subarray</strong>: Begin fresh from current element</li>
          </ul>
          <p style={{ lineHeight: 1.6 }}>
            We make this decision by comparing <code>currentSum + element</code> with just <code>element</code>.
            If the element alone is greater, we start fresh. We keep track of the maximum sum seen so far.
          </p>
        </AlgorithmExplanation>
      </VisualizationContainer>
    </SimpleProblemPageTemplate>
  );
};

export default MaximumSubarrayPage;
