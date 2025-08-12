import React from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaUndo, FaRandom } from 'react-icons/fa';

// Styled components
const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.primary};
  transition: all 0.3s ease;
  color: ${({ theme }) => theme.colors.card};
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SpeedControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 150px;
`;

const SpeedLabel = styled.label`
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  color: ${props => props.theme.colors.textLight};
`;

const SpeedSlider = styled.input`
  width: 100%;
`;

export interface VisualizationControlsProps {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onGenerateNew?: () => void;
  onSpeedChange: (speed: number) => void;
  isAnimating: boolean;
  isPaused: boolean;
  hasSteps: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentSpeed: number;
  showNewButton?: boolean;
}

const VisualizationControls: React.FC<VisualizationControlsProps> = ({
  onStart,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onGenerateNew,
  onSpeedChange,
  isAnimating,
  isPaused,
  hasSteps,
  isFirstStep,
  isLastStep,
  currentSpeed,
  showNewButton = false
}) => {
  // Convert speed value to ms (inverted: lower value = faster animation)
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    const speedMs = 2000 - value; // 0-1000 slider becomes 2000-1000ms (slow to fast)
    onSpeedChange(speedMs);
  };

  return (
    <ControlsContainer>
      {showNewButton && (
        <Button 
          onClick={onGenerateNew} 
          disabled={isAnimating && !isPaused}
          aria-label="Generate new graph"
        >
          <FaRandom /> New Graph
        </Button>
      )}
      
      <Button 
        onClick={onStart} 
        disabled={isAnimating && !isPaused}
        aria-label="Start animation"
      >
        <FaPlay /> Start
      </Button>
      
      <Button 
        onClick={onPause} 
        disabled={!isAnimating || isPaused}
        aria-label="Pause animation"
      >
        <FaPause /> Pause
      </Button>
      
      <Button 
        onClick={onReset} 
        disabled={!hasSteps}
        aria-label="Reset animation"
      >
        <FaUndo /> Reset
      </Button>
      
      <Button 
        onClick={onStepForward} 
        disabled={isAnimating || isLastStep}
        aria-label="Step forward"
      >
        <FaStepForward /> Next
      </Button>
      
      <Button 
        onClick={onStepBackward} 
        disabled={isAnimating || isFirstStep}
        aria-label="Step backward"
      >
        <FaStepBackward /> Prev
      </Button>
      
      <SpeedControlContainer>
        <SpeedLabel htmlFor="speed-slider">Animation Speed</SpeedLabel>
        <SpeedSlider 
          id="speed-slider"
          type="range" 
          min="0" 
          max="1000" 
          value={2000 - currentSpeed} 
          onChange={handleSpeedChange}
          aria-label="Animation speed"
        />
      </SpeedControlContainer>
    </ControlsContainer>
  );
};

export default VisualizationControls; 