import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiLoader } from 'react-icons/fi';

// Animations
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

// Base skeleton component
const SkeletonBase = styled.div`
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.gray200} 25%, 
    ${({ theme }) => theme.colors.gray100} 50%, 
    ${({ theme }) => theme.colors.gray200} 75%
  );
  background-size: 400px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: ${({ theme }) => theme.borderRadius};
`;

// Skeleton components
export const SkeletonText = styled(SkeletonBase)<{ 
  width?: string; 
  height?: string; 
  lines?: number;
}>`
  width: ${({ width = '100%' }) => width};
  height: ${({ height = '1rem' }) => height};
  margin-bottom: 0.5rem;
  
  ${({ lines = 1 }) => lines > 1 && `
    &::after {
      content: '';
      display: block;
      height: ${lines - 1}rem;
      margin-top: 0.5rem;
      background: inherit;
      border-radius: inherit;
      animation: inherit;
    }
  `}
`;

export const SkeletonCard = styled(SkeletonBase)`
  width: 100%;
  height: 200px;
  margin-bottom: 1rem;
`;

export const SkeletonButton = styled(SkeletonBase)`
  width: 120px;
  height: 44px;
  margin-right: 0.5rem;
`;

export const SkeletonAvatar = styled(SkeletonBase)<{ size?: string }>`
  width: ${({ size = '40px' }) => size};
  height: ${({ size = '40px' }) => size};
  border-radius: 50%;
`;

// Loading spinner
const SpinnerContainer = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${({ size = 'medium' }) => {
    const sizes = {
      small: '20px',
      medium: '40px',
      large: '60px'
    };
    return `
      width: ${sizes[size]};
      height: ${sizes[size]};
    `;
  }}
`;

const Spinner = styled(FiLoader)<{ size?: 'small' | 'medium' | 'large' }>`
  animation: ${spin} 1s linear infinite;
  color: ${({ theme }) => theme.colors.primary};
  ${({ size = 'medium' }) => {
    const sizes = {
      small: '16px',
      medium: '24px',
      large: '32px'
    };
    return `font-size: ${sizes[size]};`;
  }}
`;

export const LoadingSpinner: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ size = 'medium' }) => (
  <SpinnerContainer size={size} role="status" aria-label="Loading">
    <Spinner size={size} />
  </SpinnerContainer>
);

// Progress bar
const ProgressContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.gray200};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ProgressBar = styled.div<{ progress: number; animated?: boolean }>`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  width: ${({ progress }) => Math.min(Math.max(progress, 0), 100)}%;
  transition: width 0.3s ease;
  border-radius: 4px;
  
  ${({ animated }) => animated && `
    position: relative;
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
      );
      animation: ${shimmer} 2s ease-in-out infinite;
    }
  `}
`;

const ProgressText = styled.div`
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

interface ProgressIndicatorProps {
  progress: number;
  showText?: boolean;
  text?: string;
  animated?: boolean;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  showText = false,
  text,
  animated = true,
  className
}) => (
  <div className={className} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
    <ProgressContainer>
      <ProgressBar progress={progress} animated={animated} />
    </ProgressContainer>
    {showText && (
      <ProgressText>
        {text || `${Math.round(progress)}%`}
      </ProgressText>
    )}
  </div>
);

// Skeleton layouts for specific components
export const SkeletonVisualization = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const SkeletonVisualizationControls = () => (
  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
    <SkeletonButton />
    <SkeletonButton />
    <SkeletonButton />
  </div>
);

export const SkeletonVisualizationCanvas = () => (
  <SkeletonBase style={{ height: '300px', width: '100%' }} />
);

export const SkeletonCodeBlock = () => (
  <div>
    <SkeletonText height="2rem" width="200px" />
    <div style={{ marginTop: '1rem' }}>
      <SkeletonText height="1rem" width="80%" />
      <SkeletonText height="1rem" width="70%" />
      <SkeletonText height="1rem" width="90%" />
      <SkeletonText height="1rem" width="60%" />
      <SkeletonText height="1rem" width="85%" />
    </div>
  </div>
);

// Pulse loading animation for interactive elements
const PulseContainer = styled.div<{ color?: string }>`
  animation: ${pulse} 2s ease-in-out infinite;
  background-color: ${({ color, theme }) => color || theme.colors.primary}20;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1rem;
`;

export const PulseLoader: React.FC<{ 
  children: React.ReactNode; 
  color?: string;
  className?: string; 
}> = ({ children, color, className }) => (
  <PulseContainer color={color} className={className}>
    {children}
  </PulseContainer>
);

// Loading overlay
const OverlayContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 9999;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
`;

const OverlayContent = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  text-align: center;
  max-width: 400px;
  width: 90%;
`;

const OverlayTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  margin: 1rem 0 0.5rem;
  font-size: 1.25rem;
`;

const OverlayMessage = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 1rem;
  line-height: 1.5;
`;

interface LoadingOverlayProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  progress?: number;
  onCancel?: () => void;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  title = "Loading...",
  message = "Please wait while we process your request.",
  progress,
  onCancel
}) => (
  <OverlayContainer 
    isVisible={isVisible}
    role="dialog"
    aria-modal="true"
    aria-label={title}
    aria-describedby="loading-message"
  >
    <OverlayContent>
      <LoadingSpinner size="large" />
      <OverlayTitle>{title}</OverlayTitle>
      <OverlayMessage id="loading-message">{message}</OverlayMessage>
      
      {typeof progress === 'number' && (
        <ProgressIndicator 
          progress={progress} 
          showText 
          style={{ marginBottom: '1rem' }} 
        />
      )}
      
      {onCancel && (
        <button 
          onClick={onCancel}
          style={{
            padding: '0.5rem 1rem',
            background: 'transparent',
            border: `1px solid currentColor`,
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      )}
    </OverlayContent>
  </OverlayContainer>
);

// Hook for managing loading states
export const useLoadingState = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [progress, setProgress] = React.useState(0);
  const [message, setMessage] = React.useState('');
  
  const startLoading = (initialMessage = 'Loading...') => {
    setIsLoading(true);
    setProgress(0);
    setMessage(initialMessage);
  };
  
  const updateProgress = (newProgress: number, newMessage?: string) => {
    setProgress(newProgress);
    if (newMessage) setMessage(newMessage);
  };
  
  const stopLoading = () => {
    setIsLoading(false);
    setProgress(100);
  };
  
  return {
    isLoading,
    progress,
    message,
    startLoading,
    updateProgress,
    stopLoading
  };
};
