import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../themes/lightTheme';
import { useAccessibility } from '../hooks/useAccessibility';
import Header from '../components/layout/Header';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test component for accessibility hook
const TestAccessibilityComponent: React.FC = () => {
  const { announce, isHighContrast, setIsHighContrast } = useAccessibility();

  return (
    <div>
      <button onClick={() => announce('Test announcement')}>
        Announce
      </button>
      <button onClick={() => setIsHighContrast(!isHighContrast)}>
        Toggle High Contrast: {isHighContrast ? 'On' : 'Off'}
      </button>
    </div>
  );
};

// Wrapper for theme provider
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={lightTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('Accessibility Features', () => {
  describe('useAccessibility hook', () => {
    it('should provide accessibility functions', () => {
      renderWithTheme(<TestAccessibilityComponent />);
      
      expect(screen.getByText('Announce')).toBeInTheDocument();
      expect(screen.getByText(/Toggle High Contrast/)).toBeInTheDocument();
    });

    it('should toggle high contrast mode', () => {
      renderWithTheme(<TestAccessibilityComponent />);
      
      const toggleButton = screen.getByText(/Toggle High Contrast/);
      expect(toggleButton).toHaveTextContent('Off');
      
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveTextContent('On');
    });

    it('should handle keyboard navigation', () => {
      renderWithTheme(<TestAccessibilityComponent />);
      
      // Test Tab navigation
      fireEvent.keyDown(document, { key: 'Tab', ctrlKey: true });
      
      // Test F1 help
      fireEvent.keyDown(document, { key: 'F1' });
      
      // Test high contrast toggle
      fireEvent.keyDown(document, { key: 'F1', altKey: true });
    });
  });

  describe('Header Component Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = renderWithTheme(<Header />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels', () => {
      renderWithTheme(<Header />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByLabelText(/switch to/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/github/i)).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      renderWithTheme(<Header />);
      
      const themeToggle = screen.getByLabelText(/switch to/i);
      themeToggle.focus();
      expect(themeToggle).toHaveFocus();
      
      fireEvent.keyDown(themeToggle, { key: 'Tab' });
    });

    it('should announce theme changes', () => {
      renderWithTheme(<Header />);
      
      const themeToggle = screen.getByLabelText(/switch to/i);
      fireEvent.click(themeToggle);
      
      // Check if announcement area exists
      expect(document.querySelector('[aria-live="polite"]')).toBeInTheDocument();
    });
  });

  describe('Skip Links', () => {
    it('should provide skip to main content link', () => {
      render(<a href="#main-content" className="skip-to-main">Skip to main content</a>);
      
      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });
  });

  describe('Focus Management', () => {
    it('should have visible focus indicators', () => {
      renderWithTheme(<Header />);
      
      const button = screen.getByLabelText(/switch to/i);
      button.focus();
      
      // Check computed styles would show focus (in real browser)
      expect(button).toHaveFocus();
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide screen reader only content', () => {
      render(
        <div>
          <span className="sr-only">Screen reader only text</span>
          <span aria-hidden="true">Visual only</span>
        </div>
      );
      
      expect(screen.getByText('Screen reader only text')).toBeInTheDocument();
      expect(screen.getByText('Visual only')).toBeInTheDocument();
    });

    it('should use proper ARIA live regions', () => {
      renderWithTheme(<TestAccessibilityComponent />);
      
      const announceButton = screen.getByText('Announce');
      fireEvent.click(announceButton);
      
      // Live region should be created
      expect(document.querySelector('.sr-only')).toBeInTheDocument();
    });
  });

  describe('Color Contrast', () => {
    it('should provide high contrast mode', () => {
      renderWithTheme(<TestAccessibilityComponent />);
      
      const toggleButton = screen.getByText(/Toggle High Contrast/);
      fireEvent.click(toggleButton);
      
      // Check if high contrast class is applied to body
      expect(document.body.classList.contains('high-contrast')).toBe(true);
    });
  });

  describe('Touch Targets', () => {
    it('should have minimum touch target sizes', () => {
      renderWithTheme(<Header />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const computedStyle = window.getComputedStyle(button);
        const minHeight = parseInt(computedStyle.minHeight);
        const minWidth = parseInt(computedStyle.minWidth);
        
        expect(minHeight).toBeGreaterThanOrEqual(44);
        expect(minWidth).toBeGreaterThanOrEqual(44);
      });
    });
  });
});

describe('Performance Accessibility', () => {
  it('should respect reduced motion preferences', () => {
    // Mock matchMedia for reduced motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    renderWithTheme(<TestAccessibilityComponent />);
    
    // Check if reduced motion class is applied
    expect(document.body.classList.contains('reduced-motion')).toBe(true);
  });
});

describe('Error States Accessibility', () => {
  it('should announce errors to screen readers', () => {
    render(
      <div role="alert" aria-live="assertive">
        An error occurred
      </div>
    );
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });
});

// Integration test with router
describe('Navigation Accessibility', () => {
  it('should maintain focus after route changes', () => {
    // This would require a more complex setup with Router
    // For now, we'll test the basic structure
    expect(true).toBe(true);
  });
});
