import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  type?: 'spinner' | 'dots' | 'bars' | 'pulse';
  overlay?: boolean;
  progress?: number; // 0-100
}

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulseAnimation = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

const bounceAnimation = keyframes`
  0%, 80%, 100% { transform: scaleY(0.6); }
  40% { transform: scaleY(1); }
`;

const LoadingContainer = styled(motion.div)<{ $overlay?: boolean; $size: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  
  ${({ $overlay, theme }) => $overlay && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(18, 22, 32, 0.8);
  transition: all 0.3s ease;
    backdrop-filter: blur(4px);
    z-index: 1000;
  `}
  
  ${({ $overlay }) => !$overlay && `
    padding: 2rem;
  `}
`;

const SpinnerElement = styled.div<{ $size: string }>`
  width: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '24px';
      case 'md': return '32px';
      case 'lg': return '48px';
      case 'xl': return '64px';
      default: return '32px';
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '24px';
      case 'md': return '32px';
      case 'lg': return '48px';
      case 'xl': return '64px';
      default: return '32px';
    }
  }};
  border: 3px solid ${({ theme }) => theme.colors.gray200};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Dot = styled.div<{ $size: string; $index: number }>`
  width: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '8px';
      case 'md': return '12px';
      case 'lg': return '16px';
      case 'xl': return '20px';
      default: return '12px';
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '8px';
      case 'md': return '12px';
      case 'lg': return '16px';
      case 'xl': return '20px';
      default: return '12px';
    }
  }};
  background: ${({ theme }) => theme.colors.primary};
  transition: all 0.3s ease;
  border-radius: 50%;
  animation: ${pulseAnimation} 1.4s ease-in-out infinite;
  animation-delay: ${({ $index }) => $index * 0.16}s;
`;

const BarsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Bar = styled.div<{ $size: string; $index: number }>`
  width: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '3px';
      case 'md': return '4px';
      case 'lg': return '6px';
      case 'xl': return '8px';
      default: return '4px';
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '20px';
      case 'md': return '28px';
      case 'lg': return '36px';
      case 'xl': return '44px';
      default: return '28px';
    }
  }};
  background: ${({ theme }) => theme.colors.primary};
  transition: all 0.3s ease;
  border-radius: 2px;
  animation: ${bounceAnimation} 1.4s ease-in-out infinite;
  animation-delay: ${({ $index }) => $index * 0.16}s;
`;

const PulseElement = styled.div<{ $size: string }>`
  width: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '24px';
      case 'md': return '32px';
      case 'lg': return '48px';
      case 'xl': return '64px';
      default: return '32px';
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '24px';
      case 'md': return '32px';
      case 'lg': return '48px';
      case 'xl': return '64px';
      default: return '32px';
    }
  }};
  background: ${({ theme }) => theme.colors.primary};
  transition: all 0.3s ease;
  border-radius: 50%;
  animation: ${pulseAnimation} 1.5s ease-in-out infinite;
`;

const LoadingMessage = styled(motion.p)<{ $size: string }>`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '0.875rem';
      case 'md': return '1rem';
      case 'lg': return '1.125rem';
      case 'xl': return '1.25rem';
      default: return '1rem';
    }
  }};
  font-weight: 500;
  text-align: center;
  margin: 0;
`;

const ProgressBarContainer = styled.div`
  width: 200px;
  height: 4px;
  background: ${({ theme }) => theme.colors.gray200};
  transition: all 0.3s ease;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(
    90deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.primaryLight}
  );
  transition: all 0.3s ease;
  border-radius: 2px;
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  type = 'spinner',
  overlay = false,
  progress
}) => {
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <DotsContainer>
            {[0, 1, 2].map((index) => (
              <Dot key={index} $size={size} $index={index} />
            ))}
          </DotsContainer>
        );
      
      case 'bars':
        return (
          <BarsContainer>
            {[0, 1, 2, 3, 4].map((index) => (
              <Bar key={index} $size={size} $index={index} />
            ))}
          </BarsContainer>
        );
      
      case 'pulse':
        return <PulseElement $size={size} />;
      
      default:
        return <SpinnerElement $size={size} />;
    }
  };

  return (
    <LoadingContainer
      $overlay={overlay}
      $size={size}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {renderLoader()}
      
      {message && (
        <LoadingMessage
          $size={size}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {message}
        </LoadingMessage>
      )}
      
      {typeof progress === 'number' && (
        <ProgressBarContainer>
          <ProgressBar
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            transition={{ duration: 0.3 }}
          />
        </ProgressBarContainer>
      )}
    </LoadingContainer>
  );
};

export default LoadingSpinner;
