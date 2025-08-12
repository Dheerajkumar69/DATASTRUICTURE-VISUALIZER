import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../themes/ThemeContext';
import { AnimationProvider } from '../components/utils/AnimationContext';
import 'jest-styled-components';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AnimationProvider>
          {children}
        </AnimationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Mock theme for testing
export const mockTheme = {
  colors: {
    primary: '#007bff',
    primaryDark: '#0056b3',
    background: '#ffffff',
    foreground: '#000000',
    text: '#333333',
    textLight: '#666666',
    card: '#f8f9fa',
    border: '#dee2e6',
    gray200: '#e9ecef',
    gray300: '#dee2e6',
    gray600: '#6c757d',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  borderRadius: '4px',
  transitions: {
    default: 'all 0.2s ease-in-out',
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
};

// Common test data
export const testArrayData = [5, 2, 8, 1, 9];
export const testGraphData = {
  nodes: [
    { id: '1', x: 100, y: 100, label: 'A' },
    { id: '2', x: 200, y: 100, label: 'B' },
    { id: '3', x: 150, y: 200, label: 'C' },
  ],
  edges: [
    { from: '1', to: '2', weight: 5 },
    { from: '2', to: '3', weight: 3 },
    { from: '1', to: '3', weight: 7 },
  ],
};

// Helper functions for common test scenarios
export const waitForAnimation = () => 
  new Promise(resolve => setTimeout(resolve, 100));

export const mockAnimationFrame = () => {
  let callbacks: FrameRequestCallback[] = [];
  let id = 0;

  (global as any).requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
    callbacks.push(callback);
    return ++id;
  });

  (global as any).cancelAnimationFrame = jest.fn((id: number) => {
    callbacks = callbacks.filter((_, index) => index !== id - 1);
  });

  const flushAnimationFrames = () => {
    const currentCallbacks = [...callbacks];
    callbacks = [];
    currentCallbacks.forEach(callback => callback(performance.now()));
  };

  return { flushAnimationFrames };
};

// Mock intersection observer for testing
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  });
  window.IntersectionObserver = mockIntersectionObserver;
  return mockIntersectionObserver;
};
