import React from 'react';
import styled, { css } from 'styled-components';
import { fadeIn, scaleIn, pulse, highlight, ANIMATION_DURATION, ANIMATION_EASING } from './AnimationUtils';

// Base animation properties
const baseAnimation = css`
  transition: ${({ theme }) => theme.transitions.default};
`;

// Animated array element used in all visualizations
export const AnimatedArrayElement = styled.div<{
  isHighlighted?: boolean;
  isActive?: boolean;
  isVisited?: boolean;
  animationType?: string;
}>`
  ${baseAnimation}
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 40px;
  min-height: 40px;
  margin: 4px;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme, isHighlighted, isActive, isVisited }) => 
    isActive ? theme.colors.primary : 
    isHighlighted ? theme.colors.primaryLight : 
    isVisited ? theme.colors.gray300 : 
    theme.colors.gray200
  };
  color: ${({ theme, isActive, isHighlighted }) => 
    isActive || isHighlighted ? '#fff' : theme.colors.gray800
  };
  font-weight: ${({ isActive, isHighlighted }) => 
    isActive || isHighlighted ? 'bold' : 'normal'
  };
  box-shadow: ${({ theme, isHighlighted }) => 
    isHighlighted ? '0 0 8px rgba(99, 102, 241, 0.6)' : theme.shadows.sm
  };
  
  ${({ animationType }) => {
    switch(animationType) {
      case 'add':
        return css`animation: ${scaleIn} ${ANIMATION_DURATION.MEDIUM}ms ${ANIMATION_EASING.DEFAULT};`;
      case 'highlight':
        return css`animation: ${highlight} ${ANIMATION_DURATION.MEDIUM}ms ${ANIMATION_EASING.DEFAULT};`;
      case 'update':
        return css`animation: ${pulse} ${ANIMATION_DURATION.MEDIUM}ms ${ANIMATION_EASING.DEFAULT};`;
      default:
        return css`animation: ${fadeIn} ${ANIMATION_DURATION.MEDIUM}ms ${ANIMATION_EASING.DEFAULT};`;
    }
  }}
`;

// Animated node (for graphs, trees, linked lists)
export const AnimatedNode = styled(AnimatedArrayElement)`
  border-radius: 50%;
  position: relative;
`;

// Animated edge (for graphs, trees)
export const AnimatedEdge = styled.div<{
  isHighlighted?: boolean;
  isActive?: boolean;
  animationType?: string;
}>`
  ${baseAnimation}
  height: 2px;
  background-color: ${({ theme, isHighlighted, isActive }) => 
    isActive ? theme.colors.primary : 
    isHighlighted ? theme.colors.primaryLight : 
    theme.colors.gray400
  };
  position: absolute;
  transform-origin: left center;
  
  ${({ animationType }) => 
    animationType === 'highlight' && 
    css`animation: ${highlight} ${ANIMATION_DURATION.MEDIUM}ms ${ANIMATION_EASING.DEFAULT};`
  }
`;

// Animated grid cell (for grid-based problems)
export const AnimatedGridCell = styled.div<{
  isHighlighted?: boolean;
  isActive?: boolean;
  isVisited?: boolean;
  isPath?: boolean;
  isWall?: boolean;
  isStart?: boolean;
  isTarget?: boolean;
  animationType?: string;
}>`
  ${baseAnimation}
  width: 40px;
  height: 40px;
  margin: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme, isHighlighted, isActive, isVisited, isPath, isWall, isStart, isTarget }) => 
    isStart ? theme.colors.secondary : 
    isTarget ? theme.colors.danger : 
    isPath ? theme.colors.info : 
    isWall ? theme.colors.gray800 : 
    isActive ? theme.colors.primary : 
    isHighlighted ? theme.colors.primaryLight : 
    isVisited ? theme.colors.gray300 : 
    theme.colors.gray100
  };
  
  ${({ animationType }) => {
    switch(animationType) {
      case 'add':
        return css`animation: ${scaleIn} ${ANIMATION_DURATION.MEDIUM}ms ${ANIMATION_EASING.DEFAULT};`;
      case 'highlight':
        return css`animation: ${highlight} ${ANIMATION_DURATION.MEDIUM}ms ${ANIMATION_EASING.DEFAULT};`;
      case 'update':
        return css`animation: ${pulse} ${ANIMATION_DURATION.MEDIUM}ms ${ANIMATION_EASING.DEFAULT};`;
      default:
        return css`animation: ${fadeIn} ${ANIMATION_DURATION.MEDIUM}ms ${ANIMATION_EASING.DEFAULT};`;
    }
  }}
`;

// Animated bar (for sorting visualizations)
export const AnimatedBar = styled.div<{
  height: number;
  isHighlighted?: boolean;
  isActive?: boolean;
  isSorted?: boolean;
  animationType?: string;
}>`
  ${baseAnimation}
  height: ${({ height }) => `${height}px`};
  width: 30px;
  margin: 0 2px;
  background-color: ${({ theme, isHighlighted, isActive, isSorted }) => 
    isActive ? theme.colors.primary : 
    isHighlighted ? theme.colors.primaryLight : 
    isSorted ? theme.colors.secondary : 
    theme.colors.gray400
  };
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  align-self: flex-end;
  
  ${({ animationType }) => {
    switch(animationType) {
      case 'swap':
        return css`animation: ${pulse} ${ANIMATION_DURATION.MEDIUM}ms ${ANIMATION_EASING.DEFAULT};`;
      case 'highlight':
        return css`animation: ${highlight} ${ANIMATION_DURATION.MEDIUM}ms ${ANIMATION_EASING.DEFAULT};`;
      default:
        return '';
    }
  }}
`;

// Standardized control panel
export const ControlPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

// Standardized info panel
export const InfoPanel = styled.div`
  margin: 20px 0;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const InfoTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.gray800};
`;

export const InfoContent = styled.div`
  color: ${({ theme }) => theme.colors.gray700};
  line-height: 1.5;
`;

// Animation controller component
interface AnimationControlsProps {
  isAnimating: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
  currentSpeed: number;
  canStepForward: boolean;
  canStepBackward: boolean;
  className?: string;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  isAnimating,
  isPaused,
  onStart,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  currentSpeed,
  canStepForward,
  canStepBackward,
  className
}) => {
  return (
    <ControlPanel className={className}>
      {!isAnimating || isPaused ? (
        <Button onClick={onStart}>
          {isPaused ? 'Resume' : 'Start'}
        </Button>
      ) : (
        <Button onClick={onPause}>
          Pause
        </Button>
      )}
      
      <Button 
        onClick={onStepBackward} 
        disabled={!canStepBackward || (isAnimating && !isPaused)}
      >
        Back
      </Button>
      
      <Button 
        onClick={onStepForward} 
        disabled={!canStepForward || (isAnimating && !isPaused)}
      >
        Forward
      </Button>
      
      <Button onClick={onReset}>
        Reset
      </Button>
      
      <Select 
        value={currentSpeed} 
        onChange={(e) => onSpeedChange(parseInt(e.target.value, 10))}
      >
        <option value={1000}>Slow</option>
        <option value={500}>Medium</option>
        <option value={200}>Fast</option>
      </Select>
    </ControlPanel>
  );
};

// Base button component
export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' }>`
  padding: 8px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.primary :
    variant === 'secondary' ? theme.colors.secondary :
    variant === 'danger' ? theme.colors.danger :
    variant === 'warning' ? theme.colors.warning :
    variant === 'success' ? theme.colors.success :
    theme.colors.gray300
  };
  color: ${({ variant }) => 
    variant ? '#fff' : '#333'
  };
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Base select component
export const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.gray700};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`; 