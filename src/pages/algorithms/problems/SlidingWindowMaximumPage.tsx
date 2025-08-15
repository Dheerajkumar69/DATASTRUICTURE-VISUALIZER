import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiRotateCcw, FiSkipForward } from 'react-icons/fi';
import CodeBlock from '../../../components/common/CodeBlock';

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
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
  isInWindow?: boolean; 
  isMaximum?: boolean;
  value: number;
  windowStart?: number;
  windowEnd?: number;
  index: number;
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
  
  background: ${({ isMaximum, isInWindow, theme }) => {
    if (isMaximum) return theme.success;
    if (isInWindow) return theme.primary;
    return theme.hover;
  }};
  
  color: ${({ isMaximum, isInWindow, theme }) => {
    if (isMaximum || isInWindow) return theme.cardBackground;
    return theme.text;
  }};
  
  border: 3px solid ${({ isInWindow, theme }) => 
    isInWindow ? theme.primaryDark : 'transparent'
  };

  &::after {
    content: '${({ value }) => value}';
  }
`;

const WindowBorder = styled(motion.div)<{ left: number; width: number }>`
  position: absolute;
  top: -5px;
  bottom: -5px;
  left: ${({ left }) => left}px;
  width: ${({ width }) => width}px;
  border: 3px solid ${({ theme }) => theme.warning};
  border-radius: 8px;
  pointer-events: none;
`;

const IndexLabel = styled.div<{ isActive?: boolean }>`
  position: absolute;
  top: -25px;
  font-size: 0.8rem;
  color: ${({ isActive, theme }) => isActive ? theme.primary : theme.textLight};
  font-weight: ${({ isActive }) => isActive ? '600' : '400'};
`;

const DequeContainer = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  
  .title {
    color: ${({ theme }) => theme.text};
    font-weight: 600;
    margin-bottom: 1rem;
    text-align: center;
  }
`;

const DequeVisualization = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const DequeElement = styled(motion.div)<{ isMaximum?: boolean }>`
  width: 40px;
  height: 40px;
  background: ${({ isMaximum, theme }) => isMaximum ? theme.success : theme.primary};
  color: ${({ theme }) => theme.cardBackground};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  position: relative;
`;

const Arrow = styled.div`
  color: ${({ theme }) => theme.textLight};
  font-size: 1.2rem;
`;

const ResultsContainer = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  
  .title {
    color: ${({ theme }) => theme.text};
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .results {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    
    .result-item {
      background: ${({ theme }) => theme.success};
      color: ${({ theme }) => theme.cardBackground};
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: bold;
    }
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

interface SlidingWindowStep {
  windowStart: number;
  windowEnd: number;
  deque: number[];
  maximum: number;
  results: number[];
  description: string;
}

const SlidingWindowMaximumPage: React.FC = () => {
  const [array, setArray] = useState([1, 3, -1, -3, 5, 3, 6, 7]);
  const [windowSize, setWindowSize] = useState(3);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState<SlidingWindowStep[]>([]);

  // Generate visualization steps
  const generateSteps = useCallback((arr: number[], k: number): SlidingWindowStep[] => {
    const steps: SlidingWindowStep[] = [];
    const deque: number[] = []; // Store indices
    const results: number[] = [];

    for (let i = 0; i < arr.length; i++) {
      // Remove elements outside current window
      while (deque.length > 0 && deque[0] <= i - k) {
        deque.shift();
      }

      // Remove smaller elements from rear
      while (deque.length > 0 && arr[deque[deque.length - 1]] <= arr[i]) {
        deque.pop();
      }

      deque.push(i);

      // Add result when window is complete
      if (i >= k - 1) {
        const maximum = arr[deque[0]];
        results.push(maximum);
        
        steps.push({
          windowStart: i - k + 1,
          windowEnd: i,
          deque: [...deque],
          maximum,
          results: [...results],
          description: i === k - 1 
            ? `First window [${i - k + 1}, ${i}]: maximum = ${maximum}`
            : `Window [${i - k + 1}, ${i}]: maximum = ${maximum}`
        });
      } else {
        steps.push({
          windowStart: 0,
          windowEnd: i,
          deque: [...deque],
          maximum: arr[deque[0]],
          results: [...results],
          description: `Building window: added element at index ${i}`
        });
      }
    }

    return steps;
  }, []);

  // Initialize steps when array or window size changes
  useEffect(() => {
    if (array.length > 0 && windowSize > 0 && windowSize <= array.length) {
      const newSteps = generateSteps(array, windowSize);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [array, windowSize, generateSteps]);

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
    }, 2000);

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
  
  const slidingWindowCode = `function maxSlidingWindow(nums, k) {
    const result = [];
    const deque = []; // Store indices
    
    for (let i = 0; i < nums.length; i++) {
        // Remove elements outside current window
        while (deque.length > 0 && deque[0] <= i - k) {
            deque.shift();
        }
        
        // Remove smaller elements from rear
        while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
            deque.pop();
        }
        
        deque.push(i);
        
        // Add result when window is complete
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    
    return result;
}

// Time Complexity: O(n)
// Space Complexity: O(k)`;

  return (
    <Container>
      <Title>🪟 Sliding Window Maximum</Title>
      
      <Description>
        <h3>Problem Description</h3>
        <p>
          Given an array <code>nums</code> and a sliding window of size <code>k</code> which is moving 
          from the very left of the array to the very right, you can only see the <code>k</code> numbers 
          in the window. Return the maximum value in each window position.
        </p>
        <p>
          This problem is efficiently solved using a deque (double-ended queue) to maintain potential 
          maximum elements in decreasing order.
        </p>
        
        <div className="complexity">
          <div className="item">
            <div className="label">Time Complexity</div>
            <div className="value">O(n)</div>
          </div>
          <div className="item">
            <div className="label">Space Complexity</div>
            <div className="value">O(k)</div>
          </div>
          <div className="item">
            <div className="label">Data Structure</div>
            <div className="value">Deque</div>
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
            placeholder="1, 3, -1, -3, 5, 3, 6, 7"
            style={{ minWidth: '300px' }}
          />
        </label>
        <label>
          Window Size:
          <input
            type="number"
            value={windowSize}
            onChange={(e) => {
              const newSize = parseInt(e.target.value) || 1;
              if (newSize > 0 && newSize <= array.length) {
                setWindowSize(newSize);
              }
            }}
            min="1"
            max={array.length}
          />
        </label>
      </InputSection>

      <VisualizationArea>
        <h3 style={{ color: 'inherit', marginBottom: '1rem' }}>Array and Sliding Window</h3>
        
        <div style={{ position: 'relative' }}>
          <ArrayContainer>
            {array.map((value, index) => (
              <ArrayElement
                key={index}
                value={value}
                index={index}
                isInWindow={
                  currentStepData && 
                  index >= currentStepData.windowStart && 
                  index <= currentStepData.windowEnd
                }
                isMaximum={
                  currentStepData && 
                  currentStepData.deque.length > 0 &&
                  index === currentStepData.deque[0]
                }
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <IndexLabel isActive={currentStepData && index <= currentStepData.windowEnd}>
                  {index}
                </IndexLabel>
              </ArrayElement>
            ))}
          </ArrayContainer>
        </div>

        {currentStepData && (
          <div>
            <DequeContainer>
              <div className="title">Deque (Monotonic Decreasing)</div>
              <DequeVisualization>
                <span style={{ color: 'inherit' }}>Front</span>
                <Arrow>→</Arrow>
                {currentStepData.deque.map((index, i) => (
                  <React.Fragment key={index}>
                    <DequeElement
                      isMaximum={i === 0}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {array[index]}
                    </DequeElement>
                    {i < currentStepData.deque.length - 1 && <Arrow>→</Arrow>}
                  </React.Fragment>
                ))}
                <Arrow>→</Arrow>
                <span style={{ color: 'inherit' }}>Rear</span>
              </DequeVisualization>
            </DequeContainer>

            {currentStepData.results.length > 0 && (
              <ResultsContainer>
                <div className="title">Window Maximums</div>
                <div className="results">
                  {currentStepData.results.map((max, index) => (
                    <motion.div
                      key={index}
                      className="result-item"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {max}
                    </motion.div>
                  ))}
                </div>
              </ResultsContainer>
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
        code={slidingWindowCode}
        language="javascript"
      />
    </Container>
  );
};

export default SlidingWindowMaximumPage;
