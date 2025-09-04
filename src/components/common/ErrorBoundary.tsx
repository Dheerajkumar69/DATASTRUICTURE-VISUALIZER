import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

const ErrorContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  background: ${({ theme }) => theme.colors.card};
  border: 2px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const ErrorTitle = styled.h2`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: 1rem;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.md};
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: ${({ theme }) => theme.lineHeights.body};
`;

const ErrorDetails = styled.details`
  width: 100%;
  margin-bottom: 1.5rem;
  
  summary {
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    padding: 0.5rem;
    border-radius: ${({ theme }) => theme.borderRadius};
    
    &:hover {
      background: ${({ theme }) => theme.colors.hover};
    }
  }
`;

const ErrorStack = styled.pre`
  background: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.text};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 200px;
  overflow-y: auto;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ErrorButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &.primary {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.card};
    
    &:hover {
      background: ${({ theme }) => theme.colors.primaryDark};
    }
  }
  
  &.secondary {
    background: ${({ theme }) => theme.colors.gray200};
    color: ${({ theme }) => theme.colors.text};
    
    &:hover {
      background: ${({ theme }) => theme.colors.gray300};
    }
  }
`;

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error to console for debugging
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // In a production app, you might want to send this to an error reporting service
    // errorReportingService.captureError(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ErrorTitle>🚨 Oops! Something went wrong</ErrorTitle>
          
          <ErrorMessage>
            We encountered an unexpected error while running the visualization. 
            Don't worry - this happens sometimes with complex algorithms!
          </ErrorMessage>

          {this.state.error && (
            <ErrorDetails>
              <summary>Technical Details (for developers)</summary>
              <ErrorStack>
                <strong>Error:</strong> {this.state.error.message}
                {this.state.error.stack && (
                  <>
                    <br /><br />
                    <strong>Stack Trace:</strong>
                    <br />
                    {this.state.error.stack}
                  </>
                )}
                {this.state.errorInfo?.componentStack && (
                  <>
                    <br /><br />
                    <strong>Component Stack:</strong>
                    <br />
                    {this.state.errorInfo.componentStack}
                  </>
                )}
              </ErrorStack>
            </ErrorDetails>
          )}

          <ActionButtons>
            <ErrorButton
              className="primary"
              onClick={this.handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🔄 Try Again
            </ErrorButton>
            
            <ErrorButton
              className="secondary"
              onClick={this.handleGoHome}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🏠 Go Home
            </ErrorButton>
            
            <ErrorButton
              className="secondary"
              onClick={this.handleReload}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ↻ Reload Page
            </ErrorButton>
          </ActionButtons>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
