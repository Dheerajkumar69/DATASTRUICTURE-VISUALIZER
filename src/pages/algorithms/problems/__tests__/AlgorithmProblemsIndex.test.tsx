import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import AlgorithmProblemsIndexPage from '../AlgorithmProblemsIndexPage';

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

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={defaultTheme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('AlgorithmProblemsIndexPage', () => {
  test('renders algorithm problems index page', () => {
    renderWithProviders(<AlgorithmProblemsIndexPage />);
    
    expect(screen.getByText('Algorithm Problems Visualizer')).toBeInTheDocument();
    expect(screen.getByText('Interactive Algorithm Problem Solutions')).toBeInTheDocument();
  });

  test('displays problem statistics', () => {
    renderWithProviders(<AlgorithmProblemsIndexPage />);
    
    expect(screen.getByText('Problem Statistics')).toBeInTheDocument();
    expect(screen.getByText('Total Problems')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  test('displays problem categories', () => {
    renderWithProviders(<AlgorithmProblemsIndexPage />);
    
    expect(screen.getByText('Array & Dynamic Programming')).toBeInTheDocument();
    expect(screen.getByText('String Algorithms')).toBeInTheDocument();
    expect(screen.getByText('Matrix & 2D Problems')).toBeInTheDocument();
  });

  test('displays array problems', () => {
    renderWithProviders(<AlgorithmProblemsIndexPage />);
    
    expect(screen.getByText("Maximum Subarray Sum (Kadane's)")).toBeInTheDocument();
    expect(screen.getByText('Sliding Window Maximum')).toBeInTheDocument();
    expect(screen.getByText('Trapping Rain Water')).toBeInTheDocument();
    expect(screen.getByText('Rotate Array')).toBeInTheDocument();
    expect(screen.getByText('Merge Intervals')).toBeInTheDocument();
  });

  test('displays string problems', () => {
    renderWithProviders(<AlgorithmProblemsIndexPage />);
    
    expect(screen.getByText('Longest Common Subsequence (LCS)')).toBeInTheDocument();
    expect(screen.getByText('Longest Palindromic Substring')).toBeInTheDocument();
    expect(screen.getByText('String Matching (KMP)')).toBeInTheDocument();
    expect(screen.getByText('Edit Distance')).toBeInTheDocument();
    expect(screen.getByText('Two Sum')).toBeInTheDocument();
  });

  test('problem cards have correct difficulty badges', () => {
    renderWithProviders(<AlgorithmProblemsIndexPage />);
    
    const easyBadges = screen.getAllByText('Easy');
    const mediumBadges = screen.getAllByText('Medium');
    const hardBadges = screen.getAllByText('Hard');
    
    expect(easyBadges.length).toBeGreaterThan(0);
    expect(mediumBadges.length).toBeGreaterThan(0);
    expect(hardBadges.length).toBeGreaterThan(0);
  });

  test('problem cards are clickable links', () => {
    renderWithProviders(<AlgorithmProblemsIndexPage />);
    
    const maximumSubarrayLink = screen.getByRole('link', { name: /maximum subarray/i });
    expect(maximumSubarrayLink).toHaveAttribute('href', '/algorithms/problems/maximum-subarray');
    
    const slidingWindowLink = screen.getByRole('link', { name: /sliding window maximum/i });
    expect(slidingWindowLink).toHaveAttribute('href', '/algorithms/problems/sliding-window-maximum');
  });
});
