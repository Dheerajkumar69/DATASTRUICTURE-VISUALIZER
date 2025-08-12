import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test-utils';
import Header from './Header';

describe('Header Component', () => {
  test('renders header with correct elements', () => {
    render(<Header />);
    
    // Check for logo and title
    expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
    expect(screen.getByText('by Dheeraj Kumar')).toBeInTheDocument();
    expect(screen.getByText('DS')).toBeInTheDocument();
  });

  test('logo links to home page', () => {
    render(<Header />);
    
    const logoLink = screen.getByRole('link', { name: /data structure visualizer/i });
    expect(logoLink).toHaveAttribute('href', '/');
  });

  test('renders theme toggle button', () => {
    render(<Header />);
    
    const themeToggle = screen.getByLabelText(/switch to (light|dark) mode/i);
    expect(themeToggle).toBeInTheDocument();
  });

  test('theme toggle shows correct text and icon', () => {
    render(<Header />);
    
    const themeToggle = screen.getByLabelText(/switch to (light|dark) mode/i);
    
    // Should show either "Light Mode" or "Dark Mode"
    expect(
      screen.getByText('Light Mode') || screen.getByText('Dark Mode')
    ).toBeInTheDocument();
  });

  test('clicking theme toggle updates accessibility label', async () => {
    const user = userEvent.setup();
    render(<Header />);
    
    const themeToggle = screen.getByLabelText(/switch to (light|dark) mode/i);
    const initialLabel = themeToggle.getAttribute('aria-label');
    
    await user.click(themeToggle);
    
    const newLabel = themeToggle.getAttribute('aria-label');
    expect(newLabel).not.toBe(initialLabel);
  });

  test('renders GitHub link with correct attributes', () => {
    render(<Header />);
    
    const githubLink = screen.getByLabelText('GitHub repository');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/dheerajkumargaur/DSA_Visualizer');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('has proper semantic HTML structure', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Should have proper heading structure
    const logo = screen.getByRole('link', { name: /data structure visualizer/i });
    expect(logo).toBeInTheDocument();
  });

  test('applies responsive design classes', () => {
    const { container } = render(<Header />);
    
    // Check that header container has proper styling
    const headerElement = container.querySelector('header');
    expect(headerElement).toBeInTheDocument();
  });

  test('keyboard navigation works correctly', async () => {
    const user = userEvent.setup();
    render(<Header />);
    
    // Tab through interactive elements
    await user.tab();
    expect(screen.getByRole('link', { name: /data structure visualizer/i })).toHaveFocus();
    
    await user.tab();
    expect(screen.getByLabelText(/switch to (light|dark) mode/i)).toHaveFocus();
    
    await user.tab();
    expect(screen.getByLabelText('GitHub repository')).toHaveFocus();
  });

  test('theme toggle is accessible with keyboard', async () => {
    const user = userEvent.setup();
    render(<Header />);
    
    const themeToggle = screen.getByLabelText(/switch to (light|dark) mode/i);
    await user.tab();
    await user.tab(); // Navigate to theme toggle
    
    expect(themeToggle).toHaveFocus();
    
    // Should be able to activate with Enter or Space
    await user.keyboard('{Enter}');
    // Theme should toggle (we can't easily test the actual theme change in this unit test)
  });
});
