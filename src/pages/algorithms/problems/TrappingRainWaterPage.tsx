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

const ElevationContainer = styled.div`
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 2px;
  margin-bottom: 2rem;
  height: 300px;
  position: relative;
`;

const ElevationBar = styled(motion.div)<{ 
  height: number; 
  maxHeight: number;
  isActive?: boolean;
  leftMax?: number;
  rightMax?: number;
  waterLevel?: number;
}>`
  width: 40px;
  background: ${({ theme, isActive }) => isActive ? theme.warning : theme.primary};
  border-radius: 4px 4px 0 0;
  position: relative;
  height: ${({ height, maxHeight }) => (height / maxHeight) * 250}px;
  
  display: flex;
  align-items: end;
  justify-content: center;
  color: ${({ theme }) => theme.cardBackground};
  font-weight: bold;
  font-size: 0.9rem;
  padding-bottom: 0.25rem;
  
  &::after {
    content: '${({ height }) => height}';
  }
`;

const WaterOverlay = styled(motion.div)<{ 
  height: number; 
  maxHeight: number;
  barHeight: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(59, 130, 246, 0.6);
  border-radius: 4px 4px 0 0;
  height: ${({ height, maxHeight }) => (height / maxHeight) * 250}px;
  margin-top: ${({ height, barHeight, maxHeight }) => 250 - (barHeight / maxHeight) * 250 - (height / maxHeight) * 250}px;
  
  &::after {
    content: '💧';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.8rem;
  }
`;

const PointerContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 2rem;
  
  .pointer-info {
    background: ${({ theme }) => theme.background};
    padding: 1rem;
    border-radius: 6px;
    text-align: center;
    
    .label {
      color: ${({ theme }) => theme.textLight};
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
    
    .value {
      color: ${({ theme }) => theme.primary};
      font-weight: bold;
      font-size: 1.2rem;
    }
  }
`;

const StatsDisplay = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ highlight?: boolean }>`
  background: ${({ highlight, theme }) => highlight ? theme.success : theme.background};
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
    font-size: 1.3rem;
    font-weight: bold;
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
    min-width: 400px;
    
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

interface TrapStep {
  leftPointer: number;
  rightPointer: number;
  leftMax: number;
  rightMax: number;
  totalWater: number;
  description: string;
}

const TrappingRainWaterPage: React.FC = () => {
  const [heights, setHeights] = useState([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState<TrapStep[]>([]);
  const [waterLevels, setWaterLevels] = useState<number[]>([]);

  // Calculate water that can be trapped
  const calculateWater = useCallback((heights: number[]): { steps: TrapStep[], waterLevels: number[], totalWater: number } => {
    const steps: TrapStep[] = [];
    const n = heights.length;
    let left = 0, right = n - 1;
    let leftMax = 0, rightMax = 0;
    let totalWater = 0;
    const waterLevels = new Array(n).fill(0);

    while (left < right) {
      if (heights[left] < heights[right]) {
        if (heights[left] >= leftMax) {
          leftMax = heights[left];
        } else {
          const water = leftMax - heights[left];
          waterLevels[left] = water;
          totalWater += water;
        }
        
        steps.push({
          leftPointer: left,
          rightPointer: right,
          leftMax,
          rightMax,
          totalWater,
          description: `Left pointer at ${left}, height=${heights[left]}, leftMax=${leftMax}. ${
            heights[left] >= leftMax 
              ? 'Update leftMax' 
              : `Add ${leftMax - heights[left]} units of water`
          }`
        });
        
        left++;
      } else {
        if (heights[right] >= rightMax) {
          rightMax = heights[right];
        } else {
          const water = rightMax - heights[right];
          waterLevels[right] = water;
          totalWater += water;
        }
        
        steps.push({
          leftPointer: left,
          rightPointer: right,
          leftMax,
          rightMax,
          totalWater,
          description: `Right pointer at ${right}, height=${heights[right]}, rightMax=${rightMax}. ${
            heights[right] >= rightMax 
              ? 'Update rightMax' 
              : `Add ${rightMax - heights[right]} units of water`
          }`
        });
        
        right--;
      }
    }

    return { steps, waterLevels, totalWater };
  }, []);

  // Initialize steps when heights change
  useEffect(() => {
    if (heights.length > 0) {
      const { steps: newSteps, waterLevels: newWaterLevels } = calculateWater(heights);
      setSteps(newSteps);
      setWaterLevels(newWaterLevels);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [heights, calculateWater]);

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
  const maxHeight = Math.max(...heights);
  const finalWaterLevels = currentStep === steps.length ? waterLevels : new Array(heights.length).fill(0);
  
  const trappingRainWaterCode = `function trap(height) {
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0;
    let totalWater = 0;
    
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                totalWater += leftMax - height[left];
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                totalWater += rightMax - height[right];
            }
            right--;
        }
    }
    
    return totalWater;
}

// Time Complexity: O(n)
// Space Complexity: O(1)`;

  return (
    <Container>
      <Title>🌧️ Trapping Rain Water</Title>
      
      <Description>
        <h3>Problem Description</h3>
        <p>
          Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is 1, 
          compute how much water it can trap after raining.
        </p>
        <p>
          This problem is solved using two pointers approach, maintaining the maximum heights seen from both ends 
          and calculating trapped water at each position.
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
            <div className="label">Approach</div>
            <div className="value">Two Pointers</div>
          </div>
        </div>
      </Description>

      <InputSection>
        <label>
          Heights:
          <input
            type="text"
            value={heights.join(', ')}
            onChange={(e) => {
              const newHeights = e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n >= 0);
              if (newHeights.length > 0) setHeights(newHeights);
            }}
            placeholder="0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1"
          />
        </label>
      </InputSection>

      <VisualizationArea>
        <h3 style={{ color: 'inherit', marginBottom: '1rem' }}>Elevation Map with Trapped Water</h3>
        
        <ElevationContainer>
          {heights.map((height, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <ElevationBar
                height={height}
                maxHeight={maxHeight}
                isActive={
                  currentStepData && 
                  (currentStepData.leftPointer === index || currentStepData.rightPointer === index)
                }
                initial={{ height: 0 }}
                animate={{ height: (height / maxHeight) * 250 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              />
              {finalWaterLevels[index] > 0 && (
                <WaterOverlay
                  height={finalWaterLevels[index]}
                  maxHeight={maxHeight}
                  barHeight={height}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                />
              )}
            </div>
          ))}
        </ElevationContainer>

        {currentStepData && (
          <div>
            <PointerContainer>
              <div className="pointer-info">
                <div className="label">Left Pointer</div>
                <div className="value">Index {currentStepData.leftPointer}</div>
              </div>
              <div className="pointer-info">
                <div className="label">Right Pointer</div>
                <div className="value">Index {currentStepData.rightPointer}</div>
              </div>
            </PointerContainer>

            <StatsDisplay>
              <StatCard>
                <div className="label">Left Max</div>
                <div className="value">{currentStepData.leftMax}</div>
              </StatCard>
              <StatCard>
                <div className="label">Right Max</div>
                <div className="value">{currentStepData.rightMax}</div>
              </StatCard>
              <StatCard highlight>
                <div className="label">Total Water</div>
                <div className="value">{currentStepData.totalWater}</div>
              </StatCard>
            </StatsDisplay>

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
        code={trappingRainWaterCode}
        language="javascript"
      />
    </Container>
  );
};

export default TrappingRainWaterPage;
