import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { FiPlay, FiPause, FiRotateCcw, FiRotateCw, FiArrowRight } from 'react-icons/fi';
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
  isGroupStart?: boolean;
  isGroupEnd?: boolean;
  groupColor?: string;
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
  position: relative;
  
  background-color: ${props => 
    props.groupColor || (props.isActive ? '#3B82F6' : '#E5E7EB')};
  
  color: ${props => 
    props.groupColor || props.isActive ? 'white' : '#374151'};
  
  border-color: ${props => 
    props.groupColor ? props.groupColor : 
    props.isActive ? '#2563EB' : '#D1D5DB'};

  transform: ${props => props.isActive ? 'scale(1.05)' : 'scale(1)'};

  ${props => props.isGroupStart && `
    border-left-width: 4px;
    border-left-color: #F59E0B;
  `}

  ${props => props.isGroupEnd && `
    border-right-width: 4px;
    border-right-color: #F59E0B;
  `}

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 45px;
    height: 45px;
    font-size: 12px;
  }
`;

const MethodSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const MethodButton = styled.button<{ isSelected: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius};
  font-weight: 600;
  transition: all 0.2s ease;
  
  background-color: ${props => 
    props.isSelected ? props.theme.colors.primary : props.theme.colors.card};
  color: ${props => 
    props.isSelected ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => 
    props.isSelected ? props.theme.colors.primary : props.theme.colors.border};
  
  &:hover {
    background-color: ${props => 
      props.isSelected ? props.theme.colors.primaryDark : props.theme.colors.hover};
    transform: translateY(-1px);
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
  width: 200px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 150px;
  }
`;

const AlgorithmExplanation = styled.div`
  background-color: ${props => props.theme.colors.card};
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${props => props.theme.colors.border};
  margin: 2rem 0;
`;

const SectionTitle = styled.h4`
  color: ${props => props.theme.colors.text};
  margin: 1rem 0;
  text-align: center;
`;

type RotateMethod = 'extra-space' | 'reverse' | 'cyclic';

const RotateArrayPage: React.FC = () => {
  const [array, setArray] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const [k, setK] = useState(3);
  const [method, setMethod] = useState<RotateMethod>('reverse');
  const [currentStep, setCurrentStep] = useState(0);
  const [workingArray, setWorkingArray] = useState<number[]>([]);
  const [extraArray, setExtraArray] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [inputArray, setInputArray] = useState('');
  const [inputK, setInputK] = useState('');
  const [phase, setPhase] = useState<string>('');
  const [groupStarts, setGroupStarts] = useState<number[]>([]);
  const [groupEnds, setGroupEnds] = useState<number[]>([]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setWorkingArray([...array]);
    setExtraArray([]);
    setIsPlaying(false);
    setIsCompleted(false);
    setPhase('');
    setGroupStarts([]);
    setGroupEnds([]);
  }, [array]);

  const reverseArray = (arr: number[], start: number, end: number) => {
    const newArr = [...arr];
    while (start < end) {
      [newArr[start], newArr[end]] = [newArr[end], newArr[start]];
      start++;
      end--;
    }
    return newArr;
  };

  const step = useCallback(() => {
    const n = array.length;
    const rotateSteps = k % n;

    if (method === 'extra-space') {
      if (currentStep === 0) {
        setPhase('Creating new array with rotated elements');
        const newArr = new Array(n);
        for (let i = 0; i < n; i++) {
          newArr[(i + rotateSteps) % n] = array[i];
        }
        setExtraArray(newArr);
        setCurrentStep(1);
      } else {
        setPhase('Copying back to original array');
        setWorkingArray([...extraArray]);
        setIsCompleted(true);
        setIsPlaying(false);
      }
    } else if (method === 'reverse') {
      if (currentStep === 0) {
        setPhase('Step 1: Reverse entire array');
        setWorkingArray(reverseArray(array, 0, n - 1));
        setGroupStarts([0]);
        setGroupEnds([n - 1]);
        setCurrentStep(1);
      } else if (currentStep === 1) {
        setPhase('Step 2: Reverse first k elements');
        setWorkingArray(reverseArray(workingArray, 0, rotateSteps - 1));
        setGroupStarts([0]);
        setGroupEnds([rotateSteps - 1]);
        setCurrentStep(2);
      } else if (currentStep === 2) {
        setPhase('Step 3: Reverse remaining elements');
        setWorkingArray(reverseArray(workingArray, rotateSteps, n - 1));
        setGroupStarts([rotateSteps]);
        setGroupEnds([n - 1]);
        setIsCompleted(true);
        setIsPlaying(false);
      }
    } else if (method === 'cyclic') {
      // Simplified cyclic replacement for visualization
      if (currentStep === 0) {
        setPhase('Moving elements to their final positions');
        const newArr = new Array(n);
        for (let i = 0; i < n; i++) {
          newArr[(i + rotateSteps) % n] = array[i];
        }
        setWorkingArray(newArr);
        setIsCompleted(true);
        setIsPlaying(false);
      }
    }
  }, [array, k, method, currentStep, workingArray, extraArray]);

  const play = useCallback(() => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      step();
    }, 1500);

    const checkCompletion = setInterval(() => {
      if (isCompleted) {
        clearInterval(interval);
        clearInterval(checkCompletion);
        setIsPlaying(false);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(checkCompletion);
    };
  }, [step, isCompleted]);

  const handleArrayInput = (value: string) => {
    try {
      const newArray = value.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      if (newArray.length > 0) {
        setArray(newArray);
        setInputArray('');
      }
    } catch (error) {
      console.error('Invalid array input');
    }
  };

  const handleKInput = (value: string) => {
    const newK = parseInt(value.trim());
    if (!isNaN(newK) && newK >= 0) {
      setK(newK);
      setInputK('');
    }
  };

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 6) + 5;
    const newArray = Array.from({ length: size }, (_, i) => i + 1);
    setArray(newArray);
    setK(Math.floor(Math.random() * size) + 1);
  };

  React.useEffect(() => {
    reset();
  }, [array, k, method, reset]);

  const problemData = {
    title: "Rotate Array",
    subtitle: "Rotate array to the right by k steps",
    difficulty: "Medium",
    category: "Array Manipulation",
    description: "Given an array, rotate the array to the right by k steps, where k is non-negative.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) for reverse method, O(n) for extra space",
    approach: "Three different approaches: extra space, reverse method, and cyclic replacements"
  };

  return (
    <SimpleProblemPageTemplate 
      problemData={problemData}
    >
      <VisualizationContainer>
        <InputContainer>
          <Input
            type="text"
            placeholder="Array (e.g., 1,2,3,4,5,6,7)"
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleArrayInput(inputArray);
              }
            }}
          />
          <Input
            type="text"
            placeholder="K steps"
            value={inputK}
            onChange={(e) => setInputK(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleKInput(inputK);
              }
            }}
          />
          <ControlButton onClick={() => handleArrayInput(inputArray)}>
            Set Array
          </ControlButton>
          <ControlButton onClick={() => handleKInput(inputK)}>
            Set K
          </ControlButton>
          <ControlButton onClick={generateRandomArray}>
            Random
          </ControlButton>
        </InputContainer>

        <MethodSelector>
          <MethodButton
            isSelected={method === 'extra-space'}
            onClick={() => setMethod('extra-space')}
          >
            Extra Space O(n)
          </MethodButton>
          <MethodButton
            isSelected={method === 'reverse'}
            onClick={() => setMethod('reverse')}
          >
            Reverse Method O(1)
          </MethodButton>
          <MethodButton
            isSelected={method === 'cyclic'}
            onClick={() => setMethod('cyclic')}
          >
            Cyclic Replacement
          </MethodButton>
        </MethodSelector>

        <div>
          <SectionTitle>Original Array</SectionTitle>
          <ArrayContainer>
            {array.map((value, index) => (
              <ArrayElement
                key={`orig-${index}`}
                isActive={false}
                groupColor="#94A3B8"
              >
                {value}
              </ArrayElement>
            ))}
          </ArrayContainer>
        </div>

        {method === 'extra-space' && extraArray.length > 0 && (
          <div>
            <SectionTitle>Extra Array (Rotated Positions)</SectionTitle>
            <ArrayContainer>
              {extraArray.map((value, index) => (
                <ArrayElement
                  key={`extra-${index}`}
                  isActive={false}
                  groupColor="#F59E0B"
                >
                  {value}
                </ArrayElement>
              ))}
            </ArrayContainer>
          </div>
        )}

        <div>
          <SectionTitle>Working Array</SectionTitle>
          <ArrayContainer>
            {workingArray.map((value, index) => (
              <ArrayElement
                key={`work-${index}`}
                isActive={false}
                isGroupStart={groupStarts.includes(index)}
                isGroupEnd={groupEnds.includes(index)}
                groupColor={isCompleted ? "#10B981" : "#3B82F6"}
              >
                {value}
              </ArrayElement>
            ))}
          </ArrayContainer>
        </div>

        <StatsPanel>
          <StatCard>
            <StatLabel>Array Length</StatLabel>
            <StatValue>{array.length}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>K Steps</StatLabel>
            <StatValue>{k}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Effective Rotation</StatLabel>
            <StatValue>{k % array.length}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Current Phase</StatLabel>
            <StatValue style={{ fontSize: '1rem' }}>
              {phase || 'Ready to start'}
            </StatValue>
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
            <FiRotateCw />
            Array Rotation Methods
          </h3>
          
          <h4 style={{ marginBottom: '0.5rem' }}>1. Extra Space Approach O(n) space:</h4>
          <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
            Create a new array and place each element at its final position: <code>newPos = (i + k) % n</code>
          </p>
          
          <h4 style={{ marginBottom: '0.5rem' }}>2. Reverse Method O(1) space:</h4>
          <ol style={{ marginLeft: '2rem', marginBottom: '1rem', lineHeight: 1.8 }}>
            <li>Reverse the entire array</li>
            <li>Reverse the first k elements</li>
            <li>Reverse the remaining n-k elements</li>
          </ol>
          
          <h4 style={{ marginBottom: '0.5rem' }}>3. Cyclic Replacement O(1) space:</h4>
          <p style={{ lineHeight: 1.6 }}>
            Start from index 0, move element to its final position, then move the displaced element 
            to its position, continuing until we complete all cycles.
          </p>
        </AlgorithmExplanation>
      </VisualizationContainer>
    </SimpleProblemPageTemplate>
  );
};

export default RotateArrayPage;
