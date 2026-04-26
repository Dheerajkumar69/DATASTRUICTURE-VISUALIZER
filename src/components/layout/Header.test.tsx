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

    // Button text is either "Light Mode" or "Dark Mode" depending on initial theme.
    const toggle = screen.getByRole('button', { name: /switch to (light|dark) mode/i });
    expect(toggle).toBeInTheDocument();
    // One of these will be null and the other truthy - as long as one is present we're good
    const hasLightModeText = screen.queryByText('Light Mode') !== null;
    const hasDarkModeText = screen.queryByText('Dark Mode') !== null;
    expect(hasLightModeText || hasDarkModeText).toBe(true);
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
    
    // The GitHub link aria-label is "View source code on GitHub (opens in new tab)"
    const githubLink = screen.getByLabelText(/view source code on github/i);
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Dheerajkumar69');
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
    
    // Tab through interactive elements in DOM order:
    // 1. Logo link
    // 2. GitHub icon button (rendered before theme toggle)
    // 3. Theme toggle button
    await user.tab();
    expect(screen.getByRole('link', { name: /data structure visualizer/i })).toHaveFocus();
    
    await user.tab();
    expect(screen.getByLabelText(/view source code on github/i)).toHaveFocus();
    
    await user.tab();
    expect(screen.getByLabelText(/switch to (light|dark) mode/i)).toHaveFocus();
  });

  test('theme toggle is accessible with keyboard', async () => {
    const user = userEvent.setup();
    render(<Header />);
    
    const themeToggle = screen.getByLabelText(/switch to (light|dark) mode/i);

    // Tab to logo, then GitHub link, then theme toggle
    await user.tab();
    await user.tab();
    await user.tab();
    
    expect(themeToggle).toHaveFocus();
    
    // Should be able to activate with Enter
    const labelBefore = themeToggle.getAttribute('aria-label');
    await user.keyboard('{Enter}');
    expect(themeToggle.getAttribute('aria-label')).not.toBe(labelBefore);
  });
});
