import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface FullscreenWrapperProps {
  children: React.ReactNode;
  isFullscreen: boolean;
  onFullscreenChange: (isFullscreen: boolean) => void;
  enableEscapeKey?: boolean;
  showExitButton?: boolean;
  backgroundColor?: string;
}

const FullscreenContainer = styled(motion.div)<{ $isFullscreen: boolean; $backgroundColor?: string }>`
  ${({ $isFullscreen, $backgroundColor, theme }) => $isFullscreen ? `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    background: ${$backgroundColor || theme.colors.background};
    display: flex;
    flex-direction: column;
    overflow: hidden;
  ` : `
    position: relative;
    width: 100%;
    height: 100%;
  `}
`;

const FullscreenContent = styled.div<{ $isFullscreen: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  
  ${({ $isFullscreen }) => $isFullscreen && `
    padding: 1rem;
    box-sizing: border-box;
  `}
`;

const ExitButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: rgba(0, 0, 0, 0.7);
  color: ${({ theme }) => theme.colors.card};
  font-size: 1.25rem;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const FullscreenOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 9998;
`;

const KeyboardHint = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: ${({ theme }) => theme.colors.card};
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  backdrop-filter: blur(4px);
  z-index: 10000;
  
  kbd {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: ${({ theme }) => theme.fonts.mono};
    margin: 0 0.25rem;
  }
`;

const FullscreenWrapper: React.FC<FullscreenWrapperProps> = ({
  children,
  isFullscreen,
  onFullscreenChange,
  enableEscapeKey = true,
  showExitButton = true,
  backgroundColor
}) => {
  const [showKeyboardHint, setShowKeyboardHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!enableEscapeKey) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        event.preventDefault();
        onFullscreenChange(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onFullscreenChange, enableEscapeKey]);

  // Handle browser fullscreen API
  useEffect(() => {
    if (!containerRef.current) return;

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(document.fullscreenElement);
      if (isCurrentlyFullscreen !== isFullscreen) {
        onFullscreenChange(isCurrentlyFullscreen);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isFullscreen, onFullscreenChange]);

  // Show keyboard hint when entering fullscreen
  useEffect(() => {
    if (isFullscreen && enableEscapeKey) {
      setShowKeyboardHint(true);
      const timer = setTimeout(() => {
        setShowKeyboardHint(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isFullscreen, enableEscapeKey]);

  // Request/exit fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        // Enter fullscreen
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else {
          // Fallback to custom fullscreen
          onFullscreenChange(true);
        }
      } else {
        // Exit fullscreen
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        } else {
          // Fallback to custom fullscreen
          onFullscreenChange(false);
        }
      }
    } catch (error) {
      console.warn('Fullscreen operation failed:', error);
      // Fallback to custom fullscreen
      onFullscreenChange(!isFullscreen);
    }
  }, [isFullscreen, onFullscreenChange]);

  const handleExitClick = () => {
    onFullscreenChange(false);
  };

  // Prevent body scroll when in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isFullscreen]);

  return (
    <>
      <AnimatePresence>
        {isFullscreen && (
          <FullscreenOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <FullscreenContainer
        ref={containerRef}
        $isFullscreen={isFullscreen}
        $backgroundColor={backgroundColor}
        initial={false}
        animate={{
          scale: isFullscreen ? 1 : 1,
          borderRadius: isFullscreen ? 0 : 8
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {isFullscreen && showExitButton && (
          <ExitButton
            onClick={handleExitClick}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Exit Fullscreen (Esc)"
          >
            ✕
          </ExitButton>
        )}

        <FullscreenContent $isFullscreen={isFullscreen}>
          {children}
        </FullscreenContent>

        <AnimatePresence>
          {isFullscreen && showKeyboardHint && enableEscapeKey && (
            <KeyboardHint
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              Press <kbd>Esc</kbd> or click <kbd>✕</kbd> to exit fullscreen
            </KeyboardHint>
          )}
        </AnimatePresence>
      </FullscreenContainer>
    </>
  );
};

export default FullscreenWrapper;

// Hook for fullscreen functionality
export const useFullscreen = (initialValue = false) => {
  const [isFullscreen, setIsFullscreen] = useState(initialValue);

  const enter = useCallback(() => setIsFullscreen(true), []);
  const exit = useCallback(() => setIsFullscreen(false), []);
  const toggle = useCallback(() => setIsFullscreen(prev => !prev), []);

  return {
    isFullscreen,
    enter,
    exit,
    toggle,
    set: setIsFullscreen
  };
};
