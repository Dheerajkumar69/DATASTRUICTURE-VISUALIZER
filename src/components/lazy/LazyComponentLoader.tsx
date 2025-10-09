import React, { Suspense, lazy, ComponentType, LazyExoticComponent } from 'react';
import styled, { keyframes } from 'styled-components';
import ErrorBoundary from '../error/ErrorBoundary';

// Loading animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

// Loading component with multiple variants
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'pulse' | 'skeleton';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  variant = 'spinner',
  message = 'Loading...'
}) => {
  if (variant === 'skeleton') {
    return (
      <SkeletonContainer>
        <SkeletonLine width="100%" />
        <SkeletonLine width="80%" />
        <SkeletonLine width="60%" />
      </SkeletonContainer>
    );
  }

  if (variant === 'pulse') {
    return (
      <PulseContainer>
        <PulseCircle size={size} />
        <LoadingText>{message}</LoadingText>
      </PulseContainer>
    );
  }

  return (
    <SpinnerContainer>
      <Spinner size={size} />
      <LoadingText>{message}</LoadingText>
    </SpinnerContainer>
  );
};

// Lazy loading wrapper with enhanced error handling
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  loadingMessage?: string;
  variant?: 'spinner' | 'pulse' | 'skeleton';
  minLoadingTime?: number; // Minimum time to show loading (prevents flash)
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback,
  errorFallback,
  loadingMessage = 'Loading component...',
  variant = 'spinner',
  minLoadingTime = 300
}) => {
  const [shouldShowLoading, setShouldShowLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShouldShowLoading(false);
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [minLoadingTime]);

  const defaultFallback = fallback || (
    <LoadingSpinner 
      variant={variant} 
      message={loadingMessage}
      size="medium"
    />
  );

  return (
    <ErrorBoundary 
      fallback={errorFallback}
      category="rendering"
      enableRetry={true}
    >
      <Suspense fallback={shouldShowLoading ? defaultFallback : null}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// Hook for creating lazy components with enhanced loading
export const useLazyComponent = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: {
    fallback?: React.ReactNode;
    errorFallback?: React.ReactNode;
    loadingMessage?: string;
    preload?: boolean;
  } = {}
): LazyExoticComponent<ComponentType<P>> => {
  const LazyComponent = lazy(importFn);

  // Preload component if requested
  React.useEffect(() => {
    if (options.preload) {
      importFn();
    }
  }, [options.preload]);

  return LazyComponent;
};

// Higher-order component for adding lazy loading to any component
export const withLazyLoading = (importFn: () => Promise<{ default: ComponentType<any> }>) => {
  const LazyComponent = lazy(importFn);
  
  return (props: any) => (
    <LazyWrapper loadingMessage="Loading component..." variant="spinner">
      <LazyComponent {...props} />
    </LazyWrapper>
  );
};

// Preload utility for warming up components
export const preloadComponent = (importFn: () => Promise<{ default: ComponentType<any> }>) => {
  return importFn();
};

// Batch preloader for multiple components
export const preloadComponents = (
  importFns: Array<() => Promise<{ default: ComponentType<any> }>>
) => {
  return Promise.all(importFns.map(fn => fn()));
};

// Progressive loading for heavy components
export const useProgressiveLoading = (
  stages: Array<() => Promise<{ default: ComponentType<any> }>>,
  delay: number = 100
) => {
  const [currentStage, setCurrentStage] = React.useState(0);
  const [loadedComponents, setLoadedComponents] = React.useState<ComponentType<any>[]>([]);

  React.useEffect(() => {
    const loadNextStage = async () => {
      if (currentStage < stages.length) {
        try {
          const { default: Component } = await stages[currentStage]();
          setLoadedComponents(prev => [...prev, Component]);
          
          setTimeout(() => {
            setCurrentStage(prev => prev + 1);
          }, delay);
        } catch (error) {
          console.error(`Failed to load stage ${currentStage}:`, error);
        }
      }
    };

    loadNextStage();
  }, [currentStage, stages, delay]);

  return {
    currentStage,
    loadedComponents,
    isComplete: currentStage >= stages.length
  };
};

// Styled components
const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 200px;
`;

const Spinner = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
  
  ${({ size }) => {
    switch (size) {
      case 'small':
        return 'width: 20px; height: 20px;';
      case 'large':
        return 'width: 60px; height: 60px;';
      default:
        return 'width: 40px; height: 40px;';
    }
  }}
`;

const PulseContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 200px;
`;

const PulseCircle = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  border-radius: 50%;
  background-color: #3498db;
  animation: ${pulse} 1.5s ease-in-out infinite;
  margin-bottom: 1rem;
  
  ${({ size }) => {
    switch (size) {
      case 'small':
        return 'width: 20px; height: 20px;';
      case 'large':
        return 'width: 60px; height: 60px;';
      default:
        return 'width: 40px; height: 40px;';
    }
  }}
`;

const SkeletonContainer = styled.div`
  padding: 2rem;
  min-height: 200px;
`;

const SkeletonLine = styled.div<{ width: string }>`
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${pulse} 1.5s ease-in-out infinite;
  border-radius: 4px;
  margin-bottom: 1rem;
  width: ${({ width }) => width};
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
`;

export default LazyWrapper;