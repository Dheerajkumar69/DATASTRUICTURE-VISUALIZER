import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  transition: all 0.3s ease;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  transition: all 0.3s ease;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  gap: 1.5rem;
  min-height: 60vh;
  align-items: center;
  justify-content: center;
`;

const SkeletonBox = styled.div<{ width?: string; height?: string }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '20px'};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.background} 0%,
    ${({ theme }) => theme.colors.card} 50%,
    ${({ theme }) => theme.colors.background} 100%
  );
  transition: all 0.3s ease;
  background-size: 200px 100%;
  transition: all 0.3s ease;
  background-repeat: no-repeat;
  transition: all 0.3s ease;
  border-radius: 4px;
  animation: ${shimmer} 1.5s infinite;
`;

const LoadingText = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.2rem;
  margin: 0;
  text-align: center;
`;

const SkeletonContent = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

interface LoadingFallbackProps {
  message?: string;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <Container>
      <LoadingText>{message}</LoadingText>
      <SkeletonContent>
        <SkeletonBox height="40px" width="60%" />
        <SkeletonBox height="20px" width="80%" />
        <SkeletonBox height="20px" width="70%" />
        <SkeletonBox height="200px" />
        <SkeletonBox height="20px" width="90%" />
        <SkeletonBox height="20px" width="75%" />
        <SkeletonBox height="100px" />
      </SkeletonContent>
    </Container>
  );
};

export default LoadingFallback;
