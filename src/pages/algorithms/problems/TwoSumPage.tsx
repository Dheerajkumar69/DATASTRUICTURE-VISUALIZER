import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiRotateCcw, FiSkipForward } from 'react-icons/fi';
import CodeBlock from '../../../components/common/CodeBlock';
import SimpleProblemPageTemplate from '../../../components/templates/SimpleProblemPageTemplate';

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
  gap: 8px;
  justify-content: center;
  margin-bottom: 2rem;
`;

const ArrayElement = styled(motion.div)<{ 
  isHighlighted?: boolean; 
  isTarget?: boolean; 
  isResult?: boolean;
  value: number;
}>`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  position: relative;
  
  background: ${({ isResult, isTarget, isHighlighted, theme }) => {
    if (isResult) return theme.success;
    if (isTarget) return theme.warning;
    if (isHighlighted) return theme.primary;
    return theme.hover;
  }};
  
  color: ${({ isResult, isTarget, isHighlighted, theme }) => {
    if (isResult || isTarget || isHighlighted) return theme.cardBackground;
    return theme.text;
  }};
  
  border: 2px solid ${({ isHighlighted, theme }) => 
    isHighlighted ? theme.primaryDark : 'transparent'
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

const HashMapDisplay = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  
  h4 {
    color: ${({ theme }) => theme.text};
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }
`;

const HashMapEntries = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const HashMapEntry = styled(motion.div)<{ isNew?: boolean }>`
  background: ${({ isNew, theme }) => isNew ? theme.primary : theme.hover};
  color: ${({ isNew, theme }) => isNew ? theme.cardBackground : theme.text};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-family: monospace;
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
  }
`;

interface TwoSumStep {
  index: number;
  value: number;
  complement: number;
  hashMap: Map<number, number>;
  found: boolean;
  result?: [number, number];
  description: string;
}

const TwoSumPage: React.FC = () => {
  const [array, setArray] = useState([2, 7, 11, 15]);
  const [target, setTarget] = useState(9);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState<TwoSumStep[]>([]);
  const [result, setResult] = useState<[number, number] | null>(null);

  // Generate visualization steps
  const generateSteps = useCallback((arr: number[], target: number): TwoSumStep[] => {
    const steps: TwoSumStep[] = [];
    const hashMap = new Map<number, number>();

    for (let i = 0; i < arr.length; i++) {
      const value = arr[i];
      const complement = target - value;
      
      if (hashMap.has(complement)) {
        const complementIndex = hashMap.get(complement)!;
        steps.push({
          index: i,
          value,
          complement,
          hashMap: new Map(hashMap),
          found: true,
          result: [complementIndex, i],
          description: `Found pair! nums[${complementIndex}] + nums[${i}] = ${arr[complementIndex]} + ${value} = ${target}`
        });
        break;
      } else {
        hashMap.set(value, i);
        steps.push({
          index: i,
          value,
          complement,
          hashMap: new Map(hashMap),
          found: false,
          description: `Add ${value} to hash map at index ${i}. Looking for complement: ${complement}`
        });
      }
    }

    return steps;
  }, []);

  // Initialize steps when array or target changes
  useEffect(() => {
    const newSteps = generateSteps(array, target);
    setSteps(newSteps);
    setCurrentStep(0);
    setResult(null);
    setIsPlaying(false);
  }, [array, target, generateSteps]);

  // Animation logic
  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length) return;

    const timer = setTimeout(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= steps.length) {
          setIsPlaying(false);
          const finalStep = steps[steps.length - 1];
          if (finalStep.found && finalStep.result) {
            setResult(finalStep.result);
          }
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
    setResult(null);
  };
  const handleStepForward = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
      if (currentStep + 1 >= steps.length) {
        const finalStep = steps[steps.length - 1];
        if (finalStep.found && finalStep.result) {
          setResult(finalStep.result);
        }
      }
    }
  };

  const currentStepData = steps[Math.min(currentStep, steps.length - 1)];

  const problemData = {
    title: "Two Sum Problem",
    subtitle: "Find two numbers that add up to target",
    difficulty: "Easy",
    category: "Hash Map",
    description: "Given an array of integers and a target sum, find two numbers that add up to the target.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    approach: "Hash map to store seen numbers and their indices"
  };

  const twoSumCode = `function twoSum(nums, target) {
    const hashMap = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (hashMap.has(complement)) {
            return [hashMap.get(complement), i];
        }
        
        hashMap.set(nums[i], i);
    }
    
    return []; // No solution found
}

// Time Complexity: O(n)
// Space Complexity: O(n)`;

  return (
    <SimpleProblemPageTemplate 
      problemData={problemData}
    >
      <Container>

      <InputSection>
        <label>
          Array:
          <input
            type="text"
            value={array.join(', ')}
            onChange={(e) => {
              const newArray = e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
              setArray(newArray);
            }}
            placeholder="2, 7, 11, 15"
          />
        </label>
        <label>
          Target:
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
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
              isHighlighted={currentStepData && currentStepData.index === index}
              isResult={result && (result[0] === index || result[1] === index)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <IndexLabel isActive={currentStepData && currentStepData.index === index}>
                {index}
              </IndexLabel>
            </ArrayElement>
          ))}
        </ArrayContainer>

        {currentStepData && (
          <div>
            <HashMapDisplay>
              <h4>Hash Map Contents</h4>
              <HashMapEntries>
                {Array.from(currentStepData.hashMap.entries()).map(([value, index]) => (
                  <HashMapEntry
                    key={`${value}-${index}`}
                    isNew={currentStepData.value === value}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {value} → {index}
                  </HashMapEntry>
                ))}
              </HashMapEntries>
            </HashMapDisplay>

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
        code={twoSumCode}
        language="javascript"
      />
    </Container>
    </SimpleProblemPageTemplate>
  );
};

export default TwoSumPage;
