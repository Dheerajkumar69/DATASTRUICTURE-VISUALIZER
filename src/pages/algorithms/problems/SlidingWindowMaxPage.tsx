import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { FiPlay, FiPause, FiRotateCcw, FiMaximize2, FiArrowRight } from 'react-icons/fi';
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
  position: relative;
`;

const ArrayElement = styled.div<{ 
  isInWindow: boolean; 
  isMaxInWindow: boolean; 
  value: number;
  index: number;
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
    props.isMaxInWindow ? '#10B981' :
    props.isInWindow ? '#3B82F6' :
    '#E5E7EB'};
  
  color: ${props => 
    props.isMaxInWindow || props.isInWindow ? 'white' : '#374151'};
  
  border-color: ${props => 
    props.isMaxInWindow ? '#059669' :
    props.isInWindow ? '#2563EB' :
    '#D1D5DB'};

  transform: ${props => 
    props.isMaxInWindow ? 'scale(1.1)' :
    props.isInWindow ? 'scale(1.05)' : 'scale(1)'};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 45px;
    height: 45px;
    font-size: 12px;
  }
`;

const WindowIndicator = styled.div<{ left: number; windowSize: number }>`
  position: absolute;
  top: -10px;
  left: ${props => props.left}px;
  width: ${props => props.windowSize * 64}px;
  height: 80px;
  border: 3px dashed #F59E0B;
  border-radius: ${props => props.theme.borderRadius};
  background: rgba(245, 158, 11, 0.1);
  transition: all 0.3s ease;
  pointer-events: none;

  &::before {
    content: 'Window';
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background: #F59E0B;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: ${props => props.windowSize * 49}px;
  }
`;

const ResultContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const ResultElement = styled.div<{ isActive: boolean }>`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius};
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  border: 2px solid;
  
  background-color: ${props => props.isActive ? '#10B981' : '#F3F4F6'};
  color: ${props => props.isActive ? 'white' : '#374151'};
  border-color: ${props => props.isActive ? '#059669' : '#D1D5DB'};
  transform: ${props => props.isActive ? 'scale(1.05)' : 'scale(1)'};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 40px;
    height: 40px;
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
  width: 200px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 150px;
  }
`;

const ArrowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  color: ${props => props.theme.colors.primary};
`;

const AlgorithmExplanation = styled.div`
  background-color: ${props => props.theme.colors.card};
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${props => props.theme.colors.border};
  margin: 2rem 0;
`;

const SlidingWindowMaxPage: React.FC = () => {
  const [array, setArray] = useState<number[]>([1, 3, -1, -3, 5, 3, 6, 7]);
  const [windowSize, setWindowSize] = useState(3);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [result, setResult] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [inputArray, setInputArray] = useState('');
  const [inputWindow, setInputWindow] = useState('');

  const reset = useCallback(() => {
    setCurrentPosition(0);
    setResult([]);
    setIsPlaying(false);
    setIsCompleted(false);
  }, []);

  const findMaxInWindow = (arr: number[], start: number, size: number) => {
    let max = arr[start];
    let maxIndex = start;
    for (let i = start; i < start + size && i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i];
        maxIndex = i;
      }
    }
    return { max, maxIndex };
  };

  const step = useCallback(() => {
    if (currentPosition > array.length - windowSize) {
      setIsPlaying(false);
      setIsCompleted(true);
      return;
    }

    const windowMax = findMaxInWindow(array, currentPosition, windowSize);
    setResult(prev => [...prev, windowMax.max]);
    setCurrentPosition(prev => prev + 1);
  }, [currentPosition, array, windowSize]);

  const play = useCallback(() => {
    if (isCompleted) return;
    
    setIsPlaying(true);
    const interval = setInterval(() => {
      if (currentPosition >= array.length - windowSize) {
        clearInterval(interval);
        setIsPlaying(false);
        setIsCompleted(true);
        return;
      }
      step();
    }, 1200);

    return () => clearInterval(interval);
  }, [step, currentPosition, array.length, windowSize, isCompleted]);

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

  const handleWindowSizeInput = (value: string) => {
    const size = parseInt(value.trim());
    if (!isNaN(size) && size > 0 && size <= array.length) {
      setWindowSize(size);
      setInputWindow('');
    }
  };

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 6) + 6;
    const newArray = Array.from({ length: size }, () => 
      Math.floor(Math.random() * 20) - 5
    );
    setArray(newArray);
    setWindowSize(Math.min(3, size));
  };

  React.useEffect(() => {
    reset();
  }, [array, windowSize, reset]);

  // Get current window elements
  const getCurrentWindow = () => {
    const start = currentPosition;
    const end = Math.min(start + windowSize, array.length);
    return array.slice(start, end);
  };

  const getCurrentMax = () => {
    if (currentPosition >= array.length - windowSize + 1) return null;
    return findMaxInWindow(array, currentPosition, windowSize);
  };

  const currentMax = getCurrentMax();

  const problemData = {
    title: "Sliding Window Maximum",
    subtitle: "Find maximum in each window",
    difficulty: "Hard",
    category: "Sliding Window",
    description: "Given an array and window size k, find the maximum element in each sliding window of size k.",
    timeComplexity: "O(n) with deque, O(nk) brute force",
    spaceComplexity: "O(k) for deque",
    approach: "Use deque to maintain potential maximums in decreasing order"
  };

  return (
    <SimpleProblemPageTemplate 
      problemData={problemData}
    >
      <VisualizationContainer>
        <InputContainer>
          <Input
            type="text"
            placeholder="Array (e.g., 1,3,-1,-3,5,3,6,7)"
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
            placeholder="Window size"
            value={inputWindow}
            onChange={(e) => setInputWindow(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleWindowSizeInput(inputWindow);
              }
            }}
          />
          <ControlButton onClick={() => handleArrayInput(inputArray)}>
            Set Array
          </ControlButton>
          <ControlButton onClick={() => handleWindowSizeInput(inputWindow)}>
            Set Window
          </ControlButton>
          <ControlButton onClick={generateRandomArray}>
            Random
          </ControlButton>
        </InputContainer>

        <div>
          <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>Input Array</h4>
          <ArrayContainer>
            <WindowIndicator 
              left={currentPosition * 64} 
              windowSize={windowSize}
            />
            {array.map((value, index) => (
              <ArrayElement
                key={index}
                value={value}
                index={index}
                isInWindow={index >= currentPosition && index < currentPosition + windowSize}
                isMaxInWindow={currentMax?.maxIndex === index}
              >
                {value}
              </ArrayElement>
            ))}
          </ArrayContainer>
        </div>

        <ArrowContainer>
          <FiArrowRight size={32} />
        </ArrowContainer>

        <div>
          <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>Window Maximums</h4>
          <ResultContainer>
            {result.map((value, index) => (
              <ResultElement
                key={index}
                isActive={index === result.length - 1}
              >
                {value}
              </ResultElement>
            ))}
            {!isCompleted && result.length < array.length - windowSize + 1 && (
              <ResultElement isActive={false}>
                ?
              </ResultElement>
            )}
          </ResultContainer>
        </div>

        <StatsPanel>
          <StatCard>
            <StatLabel>Window Position</StatLabel>
            <StatValue>{currentPosition}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Window Size</StatLabel>
            <StatValue>{windowSize}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Current Max</StatLabel>
            <StatValue style={{ color: '#10B981' }}>
              {currentMax ? currentMax.max : '-'}
            </StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Progress</StatLabel>
            <StatValue>{result.length} / {Math.max(0, array.length - windowSize + 1)}</StatValue>
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
            <FiMaximize2 />
            Sliding Window Maximum Explanation
          </h3>
          <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
            The sliding window maximum problem asks us to find the maximum element in every window of size k 
            as we slide the window from left to right across the array.
          </p>
          
          <h4 style={{ marginBottom: '0.5rem' }}>Approaches:</h4>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem', lineHeight: 1.8 }}>
            <li><strong>Brute Force (O(nk))</strong>: For each window, iterate through all elements to find max</li>
            <li><strong>Deque (O(n))</strong>: Use deque to maintain potential maximums in decreasing order</li>
            <li><strong>Segment Tree (O(n log k))</strong>: Build segment tree for range maximum queries</li>
          </ul>
          
          <p style={{ lineHeight: 1.6 }}>
            The optimal deque approach maintains indices of elements in decreasing order of their values. 
            The front of the deque always contains the index of the maximum element in the current window.
          </p>
        </AlgorithmExplanation>
      </VisualizationContainer>
    </SimpleProblemPageTemplate>
  );
};

export default SlidingWindowMaxPage;
