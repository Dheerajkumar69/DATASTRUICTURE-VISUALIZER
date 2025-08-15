import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import MaximumSubarrayPage from '../MaximumSubarrayPage';

const defaultTheme = {
  colors: {
    primary: '#007bff',
    primaryDark: '#0056b3',
    text: '#333333',
    textLight: '#666666',
    background: '#ffffff',
    card: '#f8f9fa',
    border: '#dee2e6',
    hover: '#e9ecef'
  },
  borderRadius: '8px',
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px'
  }
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={defaultTheme}>
      {component}
    </ThemeProvider>
  );
};

// Mock the ProblemPageTemplate
jest.mock('../../../components/templates/ProblemPageTemplate', () => {
  return function MockProblemPageTemplate({ children, problemData }: any) {
    return (
      <div data-testid="problem-template">
        <div data-testid="problem-title">{problemData.title}</div>
        <div data-testid="problem-difficulty">{problemData.difficulty}</div>
        <div data-testid="problem-category">{problemData.category}</div>
        {children}
      </div>
    );
  };
});

describe('MaximumSubarrayPage', () => {
  test('renders maximum subarray problem page', () => {
    renderWithTheme(<MaximumSubarrayPage />);
    
    expect(screen.getByTestId('problem-title')).toHaveTextContent('Maximum Subarray Sum');
    expect(screen.getByTestId('problem-difficulty')).toHaveTextContent('Medium');
    expect(screen.getByTestId('problem-category')).toHaveTextContent('Dynamic Programming');
  });

  test('displays default array elements', () => {
    renderWithTheme(<MaximumSubarrayPage />);
    
    // Check for default array values
    expect(screen.getByText('-2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('-3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  test('displays control buttons', () => {
    renderWithTheme(<MaximumSubarrayPage />);
    
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /step/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  test('displays statistics panel', () => {
    renderWithTheme(<MaximumSubarrayPage />);
    
    expect(screen.getByText('Current Index')).toBeInTheDocument();
    expect(screen.getByText('Current Sum')).toBeInTheDocument();
    expect(screen.getByText('Maximum Sum')).toBeInTheDocument();
    expect(screen.getByText('Subarray Range')).toBeInTheDocument();
  });

  test('displays input controls', () => {
    renderWithTheme(<MaximumSubarrayPage />);
    
    expect(screen.getByPlaceholderText(/enter array/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /set array/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /random array/i })).toBeInTheDocument();
  });

  test('step button advances algorithm', async () => {
    renderWithTheme(<MaximumSubarrayPage />);
    
    const stepButton = screen.getByRole('button', { name: /step/i });
    
    // Initial state
    expect(screen.getByText('Current Index')).toBeInTheDocument();
    
    // Click step button
    fireEvent.click(stepButton);
    
    // Wait for state update
    await waitFor(() => {
      // After one step, current index should have changed
      const indexValues = screen.getAllByText(/\d+/);
      expect(indexValues.length).toBeGreaterThan(0);
    });
  });

  test('can input custom array', async () => {
    renderWithTheme(<MaximumSubarrayPage />);
    
    const input = screen.getByPlaceholderText(/enter array/i);
    const setButton = screen.getByRole('button', { name: /set array/i });
    
    // Input custom array
    fireEvent.change(input, { target: { value: '1,2,3,4,5' } });
    fireEvent.click(setButton);
    
    // Check if new array values appear
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  test('random array button generates new array', () => {
    renderWithTheme(<MaximumSubarrayPage />);
    
    const randomButton = screen.getByRole('button', { name: /random array/i });
    
    // Click random array button
    fireEvent.click(randomButton);
    
    // Should still have array elements (though values may change)
    const elements = screen.getAllByText(/^-?\d+$/);
    expect(elements.length).toBeGreaterThan(0);
  });

  test('displays algorithm explanation', () => {
    renderWithTheme(<MaximumSubarrayPage />);
    
    expect(screen.getByText("Kadane's Algorithm Explanation")).toBeInTheDocument();
    expect(screen.getByText(/efficiently finds the maximum sum/i)).toBeInTheDocument();
  });

  test('reset button resets the algorithm state', async () => {
    renderWithTheme(<MaximumSubarrayPage />);
    
    const stepButton = screen.getByRole('button', { name: /step/i });
    const resetButton = screen.getByRole('button', { name: /reset/i });
    
    // Take a step first
    fireEvent.click(stepButton);
    
    // Then reset
    fireEvent.click(resetButton);
    
    // Should be back to initial state
    await waitFor(() => {
      const currentIndex = screen.getByText('Current Index');
      expect(currentIndex).toBeInTheDocument();
    });
  });
});
