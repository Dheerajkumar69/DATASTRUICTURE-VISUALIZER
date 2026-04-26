import React from 'react';
import { screen } from '@testing-library/react';
import { render } from './test-utils';
import App from './App';

// Mock the pages to avoid rendering complex components in unit tests
jest.mock('./pages/HomePage', () => {
  return function HomePage() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock('./pages/dataStructures/ArrayPage', () => {
  return function ArrayPage() {
    return <div data-testid="array-page">Array Page</div>;
  };
});

jest.mock('./pages/algorithms/SortingPage', () => {
  return function SortingPage() {
    return <div data-testid="sorting-page">Sorting Page</div>;
  };
});

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
  });

  test('renders header with correct title', () => {
    render(<App />);
    expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
    expect(screen.getByText('by Dheeraj Kumar')).toBeInTheDocument();
  });

  test('renders sidebar navigation', () => {
    render(<App />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders footer', () => {
    render(<App />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('has theme toggle functionality', () => {
    render(<App />);
    const themeToggle = screen.getByLabelText(/switch to (light|dark) mode/i);
    expect(themeToggle).toBeInTheDocument();
  });

  test('has github link', () => {
    render(<App />);
    // aria-label is "View source code on GitHub (opens in new tab)"
    const githubLink = screen.getByLabelText(/view source code on github/i);
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Dheerajkumar69');
  });

  test('applies proper styling and layout', () => {
    render(<App />);
    // Check that main layout elements are present
    // getAllByRole because App has role=application + a role=main inside
    const mains = screen.getAllByRole('main');
    expect(mains.length).toBeGreaterThan(0);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
});
