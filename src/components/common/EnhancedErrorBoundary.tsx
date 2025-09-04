import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { FiAlertTriangle, FiRefreshCw, FiHome, FiFlag } from 'react-icons/fi';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRecovery?: boolean;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  margin: 2rem;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
`;

const ErrorActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ErrorButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  min-height: 44px;
  
  background-color: ${({ variant, theme }) => 
    variant === 'secondary' ? theme.colors.gray200 : theme.colors.primary};
  color: ${({ variant, theme }) => 
    variant === 'secondary' ? theme.colors.text : theme.colors.card};
  
  &:hover {
    background-color: ${({ variant, theme }) => 
      variant === 'secondary' ? theme.colors.gray300 : theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;

const ErrorDetails = styled.details`
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius};
  max-width: 800px;
  text-align: left;
`;

const ErrorDetailsSummary = styled.summary`
  cursor: pointer;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.5rem 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ErrorStack = styled.pre`
  background-color: ${({ theme }) => theme.colors.gray50};
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-wrap;
  word-break: break-word;
`;

const RetryInfo = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.warning}20;
  border: 1px solid ${({ theme }) => theme.colors.warning};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.text};
`;

export class EnhancedErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error to monitoring service
    this.logErrorToService(error, errorInfo);
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Error info:', errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      window.clearTimeout(this.retryTimeoutId);
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId
    };

    // In a real app, you'd send this to your error tracking service
    console.error('Error logged:', errorData);
    
    // Store in localStorage for debugging
    try {
      const errors = JSON.parse(localStorage.getItem('app-errors') || '[]');
      errors.push(errorData);
      localStorage.setItem('app-errors', JSON.stringify(errors.slice(-10))); // Keep last 10 errors
    } catch (e) {
      console.warn('Could not store error in localStorage:', e);
    }
  };

  private handleRetry = () => {
    const { retryCount } = this.state;
    const maxRetries = 3;
    
    if (retryCount >= maxRetries) {
      alert('Maximum retry attempts reached. Please refresh the page or contact support.');
      return;
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: retryCount + 1
    });

    // Add a small delay to prevent immediate re-error
    this.retryTimeoutId = window.setTimeout(() => {
      // Force a re-render of children
      this.forceUpdate();
    }, 100);
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportBug = () => {
    const { error, errorInfo, errorId } = this.state;
    const subject = encodeURIComponent(`Bug Report - Error ID: ${errorId}`);
    const body = encodeURIComponent(`
Error Details:
- Error ID: ${errorId}
- Message: ${error?.message}
- URL: ${window.location.href}
- Browser: ${navigator.userAgent}
- Timestamp: ${new Date().toISOString()}

Stack Trace:
${error?.stack}

Component Stack:
${errorInfo?.componentStack}

Additional Information:
[Please describe what you were doing when this error occurred]
    `);
    
    const mailtoUrl = `mailto:support@datavisualizer.com?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error, errorInfo, errorId, retryCount } = this.state;
    const { children, fallback, enableRecovery = true, showDetails = false } = this.props;

    if (hasError) {
      // Custom fallback
      if (fallback) {
        return fallback;
      }

      const maxRetries = 3;
      const canRetry = enableRecovery && retryCount < maxRetries;

      return (
        <ErrorContainer role="alert" aria-live="assertive">
          <ErrorIcon aria-hidden="true">
            <FiAlertTriangle />
          </ErrorIcon>
          
          <ErrorTitle>Something went wrong</ErrorTitle>
          
          <ErrorMessage>
            We apologize for the inconvenience. An unexpected error has occurred while
            displaying this content. Our team has been notified and is working to fix this issue.
          </ErrorMessage>

          {retryCount > 0 && (
            <RetryInfo>
              <strong>Retry attempt:</strong> {retryCount} of {maxRetries}
            </RetryInfo>
          )}

          <ErrorActions>
            {canRetry && (
              <ErrorButton onClick={this.handleRetry} aria-label="Retry loading this content">
                <FiRefreshCw />
                Try Again
              </ErrorButton>
            )}
            
            <ErrorButton variant="secondary" onClick={this.handleGoHome} aria-label="Go to home page">
              <FiHome />
              Go Home
            </ErrorButton>
            
            <ErrorButton variant="secondary" onClick={this.handleReportBug} aria-label="Report this bug">
              <FiFlag />
              Report Bug
            </ErrorButton>
          </ErrorActions>

          {(showDetails || process.env.NODE_ENV === 'development') && error && (
            <ErrorDetails>
              <ErrorDetailsSummary>Technical Details (Error ID: {errorId})</ErrorDetailsSummary>
              <div>
                <strong>Error Message:</strong>
                <ErrorStack>{error.message}</ErrorStack>
                
                {error.stack && (
                  <>
                    <strong>Stack Trace:</strong>
                    <ErrorStack>{error.stack}</ErrorStack>
                  </>
                )}
                
                {errorInfo?.componentStack && (
                  <>
                    <strong>Component Stack:</strong>
                    <ErrorStack>{errorInfo.componentStack}</ErrorStack>
                  </>
                )}
              </div>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return children;
  }
}

export default EnhancedErrorBoundary;
