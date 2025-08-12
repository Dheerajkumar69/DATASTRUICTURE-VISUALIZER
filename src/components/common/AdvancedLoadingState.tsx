import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 200px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.9rem;
  margin: 0;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.border} 25%,
    ${({ theme }) => theme.colors.hover} 50%,
    ${({ theme }) => theme.colors.border} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const SkeletonTitle = styled(SkeletonBase)`
  height: 2rem;
  width: 60%;
  margin-bottom: 1rem;
`;

const SkeletonText = styled(SkeletonBase)`
  height: 1rem;
  width: 100%;
  margin-bottom: 0.5rem;
  
  &:nth-child(3) { width: 80%; }
  &:nth-child(4) { width: 90%; }
  &:last-child { width: 70%; }
`;

const SkeletonCard = styled(SkeletonBase)`
  height: 200px;
  width: 100%;
  margin-bottom: 1rem;
`;

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
`;

const SkeletonButton = styled(SkeletonBase)`
  height: 2.5rem;
  width: 120px;
  margin: 0.5rem;
`;

const SkeletonControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

interface AdvancedLoadingStateProps {
  type?: 'spinner' | 'skeleton-page' | 'skeleton-cards' | 'skeleton-visualization';
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

const ProgressBar = styled.div<{ progress: number }>`
  width: 200px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  overflow: hidden;
  margin-top: 1rem;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background-color: ${({ theme }) => theme.colors.primary};
    transition: width 0.3s ease;
    border-radius: 2px;
  }
`;

const AdvancedLoadingState: React.FC<AdvancedLoadingStateProps> = ({
  type = 'spinner',
  message = 'Loading...',
  showProgress = false,
  progress = 0
}) => {
  const renderSkeletonPage = () => (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '800px' }}>
      <SkeletonTitle />
      <SkeletonText />
      <SkeletonText />
      <SkeletonText />
      <SkeletonText />
      <SkeletonCard />
    </div>
  );

  const renderSkeletonCards = () => (
    <div style={{ padding: '2rem', width: '100%' }}>
      <SkeletonTitle />
      <SkeletonGrid>
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </SkeletonGrid>
    </div>
  );

  const renderSkeletonVisualization = () => (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '800px' }}>
      <SkeletonTitle />
      <SkeletonControls>
        {[...Array(5)].map((_, i) => (
          <SkeletonButton key={i} />
        ))}
      </SkeletonControls>
      <SkeletonCard style={{ height: '400px' }} />
      <SkeletonText />
      <SkeletonText />
    </div>
  );

  const renderSpinner = () => (
    <LoadingContainer>
      <Spinner />
      <LoadingText>{message}</LoadingText>
      {showProgress && (
        <ProgressBar progress={progress} />
      )}
    </LoadingContainer>
  );

  switch (type) {
    case 'skeleton-page':
      return renderSkeletonPage();
    case 'skeleton-cards':
      return renderSkeletonCards();
    case 'skeleton-visualization':
      return renderSkeletonVisualization();
    default:
      return renderSpinner();
  }
};

export default AdvancedLoadingState;
