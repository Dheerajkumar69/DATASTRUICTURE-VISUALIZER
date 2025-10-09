import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

// Error types for categorization
export type ErrorCategory = 
  | 'rendering' 
  | 'data' 
  | 'network' 
  | 'animation' 
  | 'performance' 
  | 'user-input' 
  | 'unknown';

export interface ErrorDetails {
  error: Error;
  errorInfo: ErrorInfo;
  category: ErrorCategory;
  timestamp: number;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId: string;
  componentStack: string;
  actionTaken: 'retry' | 'fallback' | 'reload' | 'none';
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  category: ErrorCategory;
  retryCount: number;
  isRetrying: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (errorDetails: ErrorDetails) => void;
  enableRetry?: boolean;
  maxRetries?: number;
  category?: ErrorCategory;
  isolateErrors?: boolean;
  showErrorDetails?: boolean;
}

// Global error tracking
class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorDetails[] = [];
  private maxErrors = 50;

  public static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  public addError(errorDetails: ErrorDetails): void {
    this.errors.unshift(errorDetails);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Boundary Caught Error [${errorDetails.category}]`);
      console.error('Error:', errorDetails.error);
      console.error('Component Stack:', errorDetails.errorInfo.componentStack);
      console.error('Error Info:', errorDetails.errorInfo);
      console.groupEnd();
    }

    // Send to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(errorDetails);
    }
  }

  public getErrors(): ErrorDetails[] {
    return [...this.errors];
  }

  public getErrorsByCategory(category: ErrorCategory): ErrorDetails[] {
    return this.errors.filter(error => error.category === category);
  }

  public clearErrors(): void {
    this.errors = [];
  }

  private reportError(errorDetails: ErrorDetails): void {
    // In a real app, send to error reporting service like Sentry, Bugsnag, etc.
    try {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorDetails),
      }).catch(err => {
        console.error('Failed to report error:', err);
      });
    } catch (reportingError) {
      console.error('Error reporting failed:', reportingError);
    }
  }
}

// Enhanced Error Boundary Component
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;
  private errorTracker = ErrorTracker.getInstance();

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      category: props.category || 'unknown',
      retryCount: 0,
      isRetrying: false,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
      category: ErrorBoundary.categorizeError(error),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, category = 'unknown' } = this.props;

    const errorDetails: ErrorDetails = {
      error,
      errorInfo,
      category: this.state.category,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.getSessionId(),
      componentStack: errorInfo.componentStack,
      actionTaken: 'none',
    };

    // Add to error tracker
    this.errorTracker.addError(errorDetails);

    // Call custom error handler
    if (onError) {
      onError(errorDetails);
    }

    this.setState({
      errorInfo,
    });
  }

  public componentWillUnmount(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private static categorizeError(error: Error): ErrorCategory {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    if (message.includes('network') || message.includes('fetch') || message.includes('xhr')) {
      return 'network';
    }
    
    if (message.includes('cannot read prop') || message.includes('undefined')) {
      return 'data';
    }
    
    if (message.includes('animation') || stack.includes('requestanimationframe')) {
      return 'animation';
    }
    
    if (message.includes('memory') || message.includes('performance')) {
      return 'performance';
    }
    
    if (message.includes('user') || message.includes('input') || message.includes('click')) {
      return 'user-input';
    }
    
    if (stack.includes('render') || message.includes('render')) {
      return 'rendering';
    }

    return 'unknown';
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('errorBoundarySessionId');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('errorBoundarySessionId', sessionId);
    }
    return sessionId;
  }

  private handleRetry = (): void => {
    const { maxRetries = 3 } = this.props;
    
    if (this.state.retryCount >= maxRetries) {
      return;
    }

    this.setState({
      isRetrying: true,
      retryCount: this.state.retryCount + 1,
    });

    // Add delay before retry to prevent rapid error loops
    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false,
      });
    }, 1000);
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleReport = (): void => {
    if (this.state.error && this.state.errorInfo) {
      const errorDetails: ErrorDetails = {
        error: this.state.error,
        errorInfo: this.state.errorInfo,
        category: this.state.category,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: this.getSessionId(),
        componentStack: this.state.errorInfo.componentStack,
        actionTaken: 'retry',
      };

      // Force report this error
      this.errorTracker.addError(errorDetails);
      alert('Error report sent. Thank you for helping us improve!');
    }
  };

  public render(): ReactNode {
    const { hasError, error, errorInfo, category, retryCount, isRetrying } = this.state;
    const { 
      children, 
      fallback, 
      enableRetry = true, 
      maxRetries = 3,
      showErrorDetails = process.env.NODE_ENV === 'development'
    } = this.props;

    if (hasError && error) {
      // If custom fallback is provided, use it
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorIcon>⚠️</ErrorIcon>
            
            <ErrorTitle>
              {category === 'network' ? 'Connection Error' :
               category === 'data' ? 'Data Error' :
               category === 'animation' ? 'Animation Error' :
               category === 'performance' ? 'Performance Error' :
               'Something Went Wrong'}
            </ErrorTitle>
            
            <ErrorMessage>
              {category === 'network' ? 
                'Unable to connect to the server. Please check your internet connection.' :
               category === 'data' ? 
                'There was a problem with the data. The page may not display correctly.' :
               category === 'animation' ? 
                'An animation error occurred. Some visual effects may not work.' :
               category === 'performance' ? 
                'Performance issues detected. The page may be slow to respond.' :
                'An unexpected error occurred. We apologize for the inconvenience.'}
            </ErrorMessage>

            {showErrorDetails && (
              <ErrorDetails>
                <strong>Error:</strong> {error.message}
                <br />
                <strong>Component:</strong> {errorInfo?.componentStack.split('\n')[1]?.trim()}
              </ErrorDetails>
            )}

            <ErrorActions>
              {enableRetry && retryCount < maxRetries && (
                <ActionButton 
                  onClick={this.handleRetry} 
                  disabled={isRetrying}
                  primary
                >
                  {isRetrying ? 'Retrying...' : `Try Again ${retryCount > 0 ? `(${retryCount}/${maxRetries})` : ''}`}
                </ActionButton>
              )}
              
              <ActionButton onClick={this.handleReload}>
                Reload Page
              </ActionButton>
              
              <ActionButton onClick={this.handleReport}>
                Report Issue
              </ActionButton>
            </ErrorActions>

            {retryCount >= maxRetries && (
              <MaxRetriesMessage>
                Maximum retry attempts reached. Please reload the page or contact support.
              </MaxRetriesMessage>
            )}
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return children;
  }
}

// Hook for accessing error tracker
export const useErrorTracker = () => {
  return ErrorTracker.getInstance();
};

// Styled Components
const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem;
  background-color: ${({ theme }) => theme?.colors?.background || '#f8f9fa'};
`;

const ErrorCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
  border: 1px solid #e3e8ee;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h2`
  color: #1a202c;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  color: #4a5568;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ErrorDetails = styled.div`
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
  font-family: monospace;
  font-size: 0.875rem;
  color: #2d3748;
  overflow-wrap: break-word;
`;

const ErrorActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  background: ${props => props.primary ? '#3182ce' : '#e2e8f0'};
  color: ${props => props.primary ? 'white' : '#2d3748'};
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: ${props => props.primary ? '#2c5aa0' : '#cbd5e0'};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const MaxRetriesMessage = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fed7d7;
  color: #9b2c2c;
  border-radius: 6px;
  font-size: 0.875rem;
`;

export default ErrorBoundary;