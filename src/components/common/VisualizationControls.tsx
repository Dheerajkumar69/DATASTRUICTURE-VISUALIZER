import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationContext } from '../utils/AnimationContext';

interface VisualizationControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onFullscreen?: () => void;
  isFullscreen?: boolean;
  showSpeedControl?: boolean;
  showStepControls?: boolean;
  showFullscreenControl?: boolean;
  className?: string;
}

const ControlsContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  backdrop-filter: blur(8px);
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 0.5rem;
    padding: 0.75rem;
    justify-content: center;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 0.25rem;
  }
`;

const ControlButton = styled(motion.button)<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  min-width: 44px;
  height: 44px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  position: relative;
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: ${({ theme }) => theme.colors.card};
          &:hover:not(:disabled) {
            background: ${theme.colors.primaryDark};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error};
          color: ${({ theme }) => theme.colors.card};
          &:hover:not(:disabled) {
            background: ${theme.colors.error}dd;
          }
        `;
      default:
        return `
          background: ${theme.colors.gray200};
          color: ${theme.colors.text};
          &:hover:not(:disabled) {
            background: ${theme.colors.gray300};
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.5rem;
    min-width: 36px;
    height: 36px;
    font-size: ${({ theme }) => theme.fontSizes.xs};
  }
`;

const SpeedControlContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.5rem;
`;

const SpeedLabel = styled.label`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  white-space: nowrap;
`;

const SpeedSlider = styled.input`
  width: 100px;
  height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.gray200};
  outline: none;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 80px;
  }
`;

const SpeedValue = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  min-width: 3ch;
  text-align: center;
`;

const Separator = styled.div`
  width: 1px;
  height: 24px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 0.25rem;
`;

const KeyboardHint = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.gray900};
  color: ${({ theme }) => theme.colors.background};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  white-space: nowrap;
  margin-bottom: 0.5rem;
  z-index: 100;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.gray900};
  }
`;

const VisualizationControls: React.FC<VisualizationControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onNext,
  onPrevious,
  speed,
  onSpeedChange,
  onFullscreen,
  isFullscreen = false,
  showSpeedControl = true,
  showStepControls = true,
  showFullscreenControl = true,
  className
}) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const { globalAnimationRunning } = useAnimationContext();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          if (isPlaying) {
            onPause();
          } else {
            onPlay();
          }
          break;
        case 'KeyR':
          if (event.ctrlKey || event.metaKey) return; // Don't interfere with browser refresh
          event.preventDefault();
          onReset();
          break;
        case 'ArrowRight':
          if (onNext) {
            event.preventDefault();
            onNext();
          }
          break;
        case 'ArrowLeft':
          if (onPrevious) {
            event.preventDefault();
            onPrevious();
          }
          break;
        case 'KeyF':
          if (onFullscreen) {
            event.preventDefault();
            onFullscreen();
          }
          break;
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
          event.preventDefault();
          const speedValue = parseInt(event.code.slice(-1));
          onSpeedChange(speedValue);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, onPlay, onPause, onReset, onNext, onPrevious, onFullscreen, onSpeedChange]);

  const handleSpeedChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onSpeedChange(parseFloat(event.target.value));
  }, [onSpeedChange]);

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <ControlsContainer
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main playback controls */}
      <ControlGroup>
        <ControlButton
          $variant="primary"
          onClick={isPlaying ? onPause : onPlay}
          onMouseEnter={() => setHoveredButton('play')}
          onMouseLeave={() => setHoveredButton(null)}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          disabled={globalAnimationRunning && !isPlaying}
        >
          {isPlaying ? '⏸️' : '▶️'}
          <AnimatePresence>
            {hoveredButton === 'play' && (
              <KeyboardHint
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                Space
              </KeyboardHint>
            )}
          </AnimatePresence>
        </ControlButton>

        <ControlButton
          $variant="danger"
          onClick={onReset}
          onMouseEnter={() => setHoveredButton('reset')}
          onMouseLeave={() => setHoveredButton(null)}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          🔄
          <AnimatePresence>
            {hoveredButton === 'reset' && (
              <KeyboardHint
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                R
              </KeyboardHint>
            )}
          </AnimatePresence>
        </ControlButton>
      </ControlGroup>

      {/* Step controls */}
      {showStepControls && (onPrevious || onNext) && (
        <>
          <Separator />
          <ControlGroup>
            {onPrevious && (
              <ControlButton
                onClick={onPrevious}
                onMouseEnter={() => setHoveredButton('previous')}
                onMouseLeave={() => setHoveredButton(null)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                ⏮️
                <AnimatePresence>
                  {hoveredButton === 'previous' && (
                    <KeyboardHint
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      ←
                    </KeyboardHint>
                  )}
                </AnimatePresence>
              </ControlButton>
            )}

            {onNext && (
              <ControlButton
                onClick={onNext}
                onMouseEnter={() => setHoveredButton('next')}
                onMouseLeave={() => setHoveredButton(null)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                ⏭️
                <AnimatePresence>
                  {hoveredButton === 'next' && (
                    <KeyboardHint
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      →
                    </KeyboardHint>
                  )}
                </AnimatePresence>
              </ControlButton>
            )}
          </ControlGroup>
        </>
      )}

      {/* Speed controls */}
      {showSpeedControl && (
        <>
          <Separator />
          <SpeedControlContainer>
            <SpeedLabel htmlFor="speed-control">Speed:</SpeedLabel>
            <SpeedSlider
              id="speed-control"
              type="range"
              min="0.25"
              max="5"
              step="0.25"
              value={speed}
              onChange={handleSpeedChange}
            />
            <SpeedValue>{speed.toFixed(1)}x</SpeedValue>
          </SpeedControlContainer>
        </>
      )}

      {/* Fullscreen control */}
      {showFullscreenControl && onFullscreen && (
        <>
          <Separator />
          <ControlButton
            onClick={onFullscreen}
            onMouseEnter={() => setHoveredButton('fullscreen')}
            onMouseLeave={() => setHoveredButton(null)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {isFullscreen ? '🗗' : '🗖'}
            <AnimatePresence>
              {hoveredButton === 'fullscreen' && (
                <KeyboardHint
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  F
                </KeyboardHint>
              )}
            </AnimatePresence>
          </ControlButton>
        </>
      )}
    </ControlsContainer>
  );
};

export default VisualizationControls;
