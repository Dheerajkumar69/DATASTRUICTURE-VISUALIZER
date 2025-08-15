import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiRotateCcw, FiSkipForward } from 'react-icons/fi';
import CodeBlock from '../../../components/common/CodeBlock';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Description = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border-left: 4px solid ${({ theme }) => theme.primary};

  h3 {
    color: ${({ theme }) => theme.text};
    margin-bottom: 1rem;
  }

  p {
    color: ${({ theme }) => theme.textLight};
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .complexity {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
    
    .item {
      display: flex;
      flex-direction: column;
      
      .label {
        font-size: 0.875rem;
        color: ${({ theme }) => theme.textLight};
        margin-bottom: 0.25rem;
      }
      
      .value {
        font-weight: 600;
        color: ${({ theme }) => theme.primary};
      }
    }
  }
`;

const VisualizationArea = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ArrayContainer = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const ArrayElement = styled(motion.div)<{ 
  isInCurrentSubarray?: boolean; 
  isMaxSubarray?: boolean;
  value: number;
  isCurrent?: boolean;
}>`
  min-width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.9rem;
  position: relative;
  margin: 2px;
  
  background: ${({ isMaxSubarray, isInCurrentSubarray, isCurrent, value, theme }) => {
    if (isMaxSubarray) return theme.success;
    if (isInCurrentSubarray) return theme.primary;
    if (isCurrent) return theme.warning;
    return value >= 0 ? theme.hover : '#ffebee';
  }};
  
  color: ${({ isMaxSubarray, isInCurrentSubarray, isCurrent, value, theme }) => {
    if (isMaxSubarray || isInCurrentSubarray || isCurrent) return theme.cardBackground;
    return value >= 0 ? theme.text : '#c62828';
  }};
  
  border: 2px solid ${({ isCurrent, theme }) => 
    isCurrent ? theme.warning : 'transparent'
  };

  &::after {
    content: '${({ value }) => value}';
  }
`;

const IndexLabel = styled.div<{ isActive?: boolean }>`
  position: absolute;
  top: -25px;
  font-size: 0.8rem;
  color: ${({ isActive, theme }) => isActive ? theme.primary : theme.textLight};
  font-weight: ${({ isActive }) => isActive ? '600' : '400'};
`;

const StatsDisplay = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ highlight?: boolean }>`
  background: ${({ highlight, theme }) => highlight ? theme.primary : theme.background};
  color: ${({ highlight, theme }) => highlight ? theme.cardBackground : theme.text};
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  
  .label {
    font-size: 0.875rem;
    opacity: 0.8;
    margin-bottom: 0.5rem;
  }
  
  .value {
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

const SubarrayDisplay = styled.div`
  background: ${({ theme }) => theme.background};
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  
  .title {
    color: ${({ theme }) => theme.text};
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .subarray {
    font-family: monospace;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.primary};
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
  
  ${({ variant, theme }) => variant === 'primary' ? `
    background: ${theme.primary};
    color: ${theme.cardBackground};
    &:hover { background: ${theme.primaryDark}; }
  ` : `
    background: ${theme.hover};
    color: ${theme.text};
    &:hover { background: ${theme.border}; }
  `}
`;

const InputSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  input {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.cardBackground};
    color: ${({ theme }) => theme.text};
    font-family: monospace;
    min-width: 300px;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.primary};
    }
  }
`;

const StepInfo = styled.div`
  background: ${({ theme }) => theme.background};
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  
  .step-title {
    color: ${({ theme }) => theme.primary};
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .step-description {
    color: ${({ theme }) => theme.text};
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

interface KadaneStep {
  index: number;
  currentSum: number;
  maxSum: number;
  startIndex: number;
  endIndex: number;
  maxStartIndex: number;
  maxEndIndex: number;
  description: string;
}

const KadaneAlgorithmPage: React.FC = () => {
  const [array, setArray] = useState([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState<KadaneStep[]>([]);

  // Generate visualization steps
  const generateSteps = useCallback((arr: number[]): KadaneStep[] => {
    const steps: KadaneStep[] = [];
    let currentSum = 0;
    let maxSum = arr[0];
    let startIndex = 0;
    let maxStartIndex = 0;
    let maxEndIndex = 0;

    for (let i = 0; i < arr.length; i++) {
      if (currentSum < 0) {
        currentSum = arr[i];
        startIndex = i;
      } else {
        currentSum += arr[i];
      }

      if (currentSum > maxSum) {
        maxSum = currentSum;
        maxStartIndex = startIndex;
        maxEndIndex = i;
      }

      steps.push({
        index: i,
        currentSum,
        maxSum,
        startIndex,
        endIndex: i,
        maxStartIndex,
        maxEndIndex,
        description: i === 0 
          ? `Initialize: currentSum = ${currentSum}, maxSum = ${maxSum}`
          : currentSum === arr[i] 
            ? `Current sum was negative, start new subarray at index ${i}: currentSum = ${currentSum}`
            : `Add arr[${i}] = ${arr[i]} to current subarray: currentSum = ${currentSum}${currentSum > maxSum ? ', new maximum found!' : ''}`
      });
    }

    return steps;
  }, []);

  // Initialize steps when array changes
  useEffect(() => {
    if (array.length > 0) {
      const newSteps = generateSteps(array);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [array, generateSteps]);

  // Animation logic
  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length) return;

    const timer = setTimeout(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= steps.length) {
          setIsPlaying(false);
        }
        return next;
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  const handleStepForward = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const currentStepData = steps[Math.min(currentStep, steps.length - 1)];
  
  const kadaneCode = `function maxSubArray(nums) {
    let currentSum = nums[0];
    let maxSum = nums[0];
    let start = 0;
    let maxStart = 0;
    let maxEnd = 0;
    
    for (let i = 1; i < nums.length; i++) {
        // If current sum becomes negative, start new subarray
        if (currentSum < 0) {
            currentSum = nums[i];
            start = i;
        } else {
            currentSum += nums[i];
        }
        
        // Update maximum sum and indices if we found a better subarray
        if (currentSum > maxSum) {
            maxSum = currentSum;
            maxStart = start;
            maxEnd = i;
        }
    }
    
    return {
        maxSum,
        subarray: nums.slice(maxStart, maxEnd + 1),
        startIndex: maxStart,
        endIndex: maxEnd
    };
}

// Time Complexity: O(n)
// Space Complexity: O(1)`;

  return (
    <Container>
      <Title>📊 Maximum Subarray Sum (Kadane's Algorithm)</Title>
      
      <Description>
        <h3>Problem Description</h3>
        <p>
          Given an integer array <code>nums</code>, find the contiguous subarray (containing at least one number) 
          which has the largest sum and return its sum.
        </p>
        <p>
          Kadane's algorithm is an efficient approach that solves this problem in linear time by maintaining 
          the maximum sum ending at each position.
        </p>
        
        <div className="complexity">
          <div className="item">
            <div className="label">Time Complexity</div>
            <div className="value">O(n)</div>
          </div>
          <div className="item">
            <div className="label">Space Complexity</div>
            <div className="value">O(1)</div>
          </div>
          <div className="item">
            <div className="label">Algorithm</div>
            <div className="value">Kadane's</div>
          </div>
        </div>
      </Description>

      <InputSection>
        <label>
          Array:
          <input
            type="text"
            value={array.join(', ')}
            onChange={(e) => {
              const newArray = e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
              if (newArray.length > 0) setArray(newArray);
            }}
            placeholder="-2, 1, -3, 4, -1, 2, 1, -5, 4"
          />
        </label>
      </InputSection>

      <VisualizationArea>
        <h3 style={{ color: 'inherit', marginBottom: '1rem' }}>Array Visualization</h3>
        
        <ArrayContainer>
          {array.map((value, index) => (
            <ArrayElement
              key={index}
              value={value}
              isCurrent={currentStepData && currentStepData.index === index}
              isInCurrentSubarray={
                currentStepData && 
                index >= currentStepData.startIndex && 
                index <= currentStepData.endIndex
              }
              isMaxSubarray={
                currentStepData && 
                index >= currentStepData.maxStartIndex && 
                index <= currentStepData.maxEndIndex &&
                currentStep === steps.length
              }
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <IndexLabel isActive={currentStepData && currentStepData.index === index}>
                {index}
              </IndexLabel>
            </ArrayElement>
          ))}
        </ArrayContainer>

        {currentStepData && (
          <div>
            <StatsDisplay>
              <StatCard>
                <div className="label">Current Position</div>
                <div className="value">{currentStepData.index}</div>
              </StatCard>
              <StatCard highlight={currentStepData.currentSum > 0}>
                <div className="label">Current Sum</div>
                <div className="value">{currentStepData.currentSum}</div>
              </StatCard>
              <StatCard highlight>
                <div className="label">Maximum Sum</div>
                <div className="value">{currentStepData.maxSum}</div>
              </StatCard>
            </StatsDisplay>

            <SubarrayDisplay>
              <div className="title">Current Subarray</div>
              <div className="subarray">
                [{array.slice(currentStepData.startIndex, currentStepData.endIndex + 1).join(', ')}]
              </div>
            </SubarrayDisplay>

            {currentStepData.maxStartIndex !== currentStepData.startIndex && (
              <SubarrayDisplay>
                <div className="title">Best Subarray So Far</div>
                <div className="subarray">
                  [{array.slice(currentStepData.maxStartIndex, currentStepData.maxEndIndex + 1).join(', ')}] = {currentStepData.maxSum}
                </div>
              </SubarrayDisplay>
            )}

            <StepInfo>
              <div className="step-title">Step {currentStep + 1}</div>
              <div className="step-description">{currentStepData.description}</div>
            </StepInfo>
          </div>
        )}

        <Controls>
          <Button onClick={handlePlay} disabled={isPlaying} variant="primary">
            <FiPlay /> Play
          </Button>
          <Button onClick={handlePause} disabled={!isPlaying}>
            <FiPause /> Pause
          </Button>
          <Button onClick={handleStepForward} disabled={isPlaying}>
            <FiSkipForward /> Step
          </Button>
          <Button onClick={handleReset}>
            <FiRotateCcw /> Reset
          </Button>
        </Controls>
      </VisualizationArea>

      <CodeBlock
        code={kadaneCode}
        language="javascript"
      />
    </Container>
  );
};

export default KadaneAlgorithmPage;
