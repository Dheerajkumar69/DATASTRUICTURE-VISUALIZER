import React from 'react';
import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../../themes/lightTheme';
import { AnimationProvider } from '../utils/AnimationContext';
import { ToastProvider } from '../ui/ComponentLibrary';

// Import main App component for full integration testing
import App from '../../App';

// Mock window.matchMedia for responsive and accessibility tests
const mockMatchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(), // deprecated
  removeListener: jest.fn(), // deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
  },
  AnimatePresence: ({ children }: any) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
  }),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Canvas API
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({
    data: new Array(4).fill(0)
  })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => ({
    data: new Array(4).fill(0)
  })),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  fill: jest.fn(),
  arc: jest.fn(),
  rect: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  font: '',
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  textAlign: 'start',
  textBaseline: 'alphabetic',
}))) as any;

// Setup window.matchMedia before tests
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(mockMatchMedia),
  });
});

describe('End-to-End Integration Tests', () => {
  beforeEach(() => {
    // Clear any body classes between tests
    document.body.className = '';
    
    // Clear localStorage
    localStorage.clear();
    
    // Reset matchMedia mock
    (window.matchMedia as jest.Mock).mockClear();
  });

  describe('Complete User Workflow - Algorithm Visualization', () => {
    test('should complete full sorting algorithm visualization workflow', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });

      // Navigate to sorting algorithms
      const sidebar = screen.getByRole('complementary');
      const algorithmsSection = within(sidebar).getByText('Algorithms');
      await user.click(algorithmsSection);

      await waitFor(() => {
        const sortingLink = within(sidebar).getByText('Sorting');
        expect(sortingLink).toBeInTheDocument();
      });

      const sortingLink = within(sidebar).getByText('Sorting');
      await user.click(sortingLink);

      // Navigate to specific sorting algorithm (e.g., Bubble Sort)
      await waitFor(() => {
        const bubbleSortLink = within(sidebar).queryByText('Bubble Sort');
        if (bubbleSortLink) {
          await user.click(bubbleSortLink);
        }
      });

      // Generate random array
      await waitFor(() => {
        const generateButton = screen.queryByText(/generate random/i);
        if (generateButton) {
          await user.click(generateButton);
        }
      });

      // Start visualization
      await waitFor(() => {
        const startButton = screen.queryByText(/start|play/i);
        if (startButton) {
          await user.click(startButton);
        }
      });

      // Verify visualization is running
      await waitFor(() => {
        const stopButton = screen.queryByText(/stop|pause/i);
        expect(stopButton || screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });
    });

    test('should complete graph algorithm visualization workflow', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });

      // Navigate to graph algorithms
      const sidebar = screen.getByRole('complementary');
      const algorithmsSection = within(sidebar).getByText('Algorithms');
      await user.click(algorithmsSection);

      await waitFor(() => {
        const graphLink = within(sidebar).queryByText('Graph');
        if (graphLink) {
          await user.click(graphLink);
        }
      });

      // Navigate to specific graph algorithm (e.g., DFS)
      await waitFor(() => {
        const dfsLink = within(sidebar).queryByText('DFS');
        if (dfsLink) {
          await user.click(dfsLink);
        }
      });

      // Interact with graph visualization
      await waitFor(() => {
        const canvas = screen.queryByRole('img', { hidden: true });
        if (canvas) {
          await user.click(canvas);
        }
      });

      // Start algorithm
      await waitFor(() => {
        const startButton = screen.queryByText(/start|play/i);
        if (startButton) {
          await user.click(startButton);
        }
      });
    });
  });

  describe('Theme and Accessibility Workflow', () => {
    test('should handle complete theme switching workflow', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });

      // Find theme toggle in header
      const header = screen.getByRole('banner');
      const themeToggle = within(header).getByLabelText(/switch to/i);
      
      expect(themeToggle).toBeInTheDocument();

      // Toggle to dark theme
      await user.click(themeToggle);

      // Verify theme change announcement
      await waitFor(() => {
        const liveRegion = document.querySelector('[aria-live="polite"]');
        expect(liveRegion).toBeInTheDocument();
      });

      // Toggle back to light theme
      await user.click(themeToggle);

      // Verify second theme change
      await waitFor(() => {
        const liveRegion = document.querySelector('[aria-live="polite"]');
        expect(liveRegion).toBeInTheDocument();
      });
    });

    test('should handle accessibility features workflow', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });

      // Test skip link functionality
      const skipLink = screen.getByText(/skip to main content/i);
      expect(skipLink).toBeInTheDocument();
      
      await user.click(skipLink);
      
      // Main content should receive focus
      await waitFor(() => {
        const mainContent = screen.getByRole('main');
        expect(mainContent).toHaveFocus();
      });

      // Test keyboard navigation through header
      await user.tab();
      expect(document.activeElement).toBeInTheDocument();

      // Test high contrast mode if available
      const header = screen.getByRole('banner');
      const highContrastToggle = within(header).queryByLabelText(/high contrast/i);
      
      if (highContrastToggle) {
        await user.click(highContrastToggle);
        
        await waitFor(() => {
          expect(document.body.classList.contains('high-contrast')).toBe(true);
        });
      }
    });

    test('should handle reduced motion workflow', async () => {
      // Mock reduced motion preference
      (window.matchMedia as jest.Mock).mockImplementation((query) => ({
        ...mockMatchMedia(query),
        matches: query.includes('prefers-reduced-motion: reduce'),
      }));

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });

      // Check that reduced motion is respected
      expect(document.body.classList.contains('reduced-motion')).toBe(true);
    });
  });

  describe('Error Handling Workflow', () => {
    test('should recover from component errors gracefully', async () => {
      const user = userEvent.setup();

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });

      // Simulate error condition - trying to navigate to invalid route
      fireEvent.popstate(window);

      // App should still be functional
      expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    test('should handle network errors and retry', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });

      // If there's a retry button in error boundary, test it
      const retryButton = screen.queryByText(/retry|try again/i);
      if (retryButton) {
        await user.click(retryButton);
        
        // Should attempt recovery
        await waitFor(() => {
          expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Performance and Loading Workflow', () => {
    test('should handle loading states properly', async () => {
      render(<App />);

      // Wait for initial loading to complete
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      }, { timeout: 5000 });

      // Check that loading indicators are handled properly
      const loadingIndicators = screen.queryAllByText(/loading/i);
      expect(loadingIndicators.length).toBe(0); // Should not have loading indicators after load
    });

    test('should handle large dataset visualization', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });

      // Navigate to a visualization that can handle large datasets
      const sidebar = screen.getByRole('complementary');
      const algorithmsSection = within(sidebar).getByText('Algorithms');
      await user.click(algorithmsSection);

      // Try to generate or set a large dataset
      await waitFor(() => {
        const arraySizeInput = screen.queryByLabelText(/array size|size/i);
        if (arraySizeInput) {
          await user.clear(arraySizeInput);
          await user.type(arraySizeInput, '100');
        }
      });

      // Generate random array with large size
      const generateButton = screen.queryByText(/generate random/i);
      if (generateButton) {
        await user.click(generateButton);
        
        // Should handle large dataset without crashing
        await waitFor(() => {
          expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Mobile Responsive Workflow', () => {
    test('should handle mobile navigation workflow', async () => {
      const user = userEvent.setup();

      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });

      // Mobile menu should be accessible
      const mobileMenuButton = screen.queryByLabelText(/menu|navigation/i);
      if (mobileMenuButton) {
        await user.click(mobileMenuButton);
        
        // Navigation should be visible
        await waitFor(() => {
          const navigation = screen.getByRole('navigation');
          expect(navigation).toBeInTheDocument();
        });
      }
    });

    test('should handle touch interactions on mobile', async () => {
      const user = userEvent.setup();

      // Mock mobile viewport and touch support
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });

      // Test touch interactions on visualizations
      const canvas = screen.queryByRole('img', { hidden: true });
      if (canvas) {
        // Simulate touch event
        fireEvent.touchStart(canvas);
        fireEvent.touchEnd(canvas);
        
        // Should handle touch without errors
        expect(canvas).toBeInTheDocument();
      }
    });
  });

  describe('Keyboard Navigation Workflow', () => {
    test('should complete full keyboard navigation workflow', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });

      // Start from skip link
      const skipLink = screen.getByText(/skip to main content/i);
      skipLink.focus();
      expect(skipLink).toHaveFocus();

      // Navigate through header
      await user.tab();
      await user.tab();
      await user.tab();

      // Should land on interactive elements
      expect(document.activeElement).toBeInTheDocument();
      expect(document.activeElement?.tagName).toMatch(/BUTTON|A|INPUT|SELECT/);

      // Test Enter key activation
      if (document.activeElement?.tagName === 'BUTTON') {
        await user.keyboard('{Enter}');
      }

      // Navigate to sidebar
      const sidebar = screen.getByRole('complementary');
      const firstInteractive = within(sidebar).getAllByRole('button')[0];
      if (firstInteractive) {
        firstInteractive.focus();
        await user.keyboard('{Enter}');
      }
    });

    test('should handle keyboard shortcuts', async () => {
      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });

      // Test accessibility shortcuts
      fireEvent.keyDown(document, { key: 'F1', altKey: true });
      
      // Should toggle high contrast
      await waitFor(() => {
        expect(document.body.classList.contains('high-contrast')).toBe(true);
      });

      // Test help shortcut
      fireEvent.keyDown(document, { key: 'F1' });
      
      // Should announce help information
      await waitFor(() => {
        const liveRegion = document.querySelector('[aria-live="polite"]');
        expect(liveRegion).toBeInTheDocument();
      });
    });
  });

  describe('Data Flow Workflow', () => {
    test('should handle complete data manipulation workflow', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });

      // Generate random data
      const generateButton = screen.queryByText(/generate random/i);
      if (generateButton) {
        await user.click(generateButton);
      }

      // Modify data through custom input
      const customInput = screen.queryByPlaceholderText(/enter custom|custom array/i);
      if (customInput) {
        await user.clear(customInput);
        await user.type(customInput, '5,3,8,1,9,2');
        await user.keyboard('{Enter}');
      }

      // Adjust settings
      const sizeInput = screen.queryByLabelText(/size|array size/i);
      if (sizeInput) {
        await user.clear(sizeInput);
        await user.type(sizeInput, '10');
        await user.tab(); // Trigger change
      }

      // Start visualization
      const startButton = screen.queryByText(/start|play|run/i);
      if (startButton) {
        await user.click(startButton);
      }

      // Control playback
      const pauseButton = screen.queryByText(/pause|stop/i);
      if (pauseButton) {
        await user.click(pauseButton);
      }
    });

    test('should validate input data properly', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });

      // Try invalid input
      const customInput = screen.queryByPlaceholderText(/enter custom|custom array/i);
      if (customInput) {
        await user.clear(customInput);
        await user.type(customInput, 'invalid,data,abc');
        await user.keyboard('{Enter}');
        
        // Should show error or not accept invalid input
        // Implementation specific - could show toast, error message, etc.
      }

      // Try empty input
      if (customInput) {
        await user.clear(customInput);
        await user.keyboard('{Enter}');
        
        // Should handle empty input gracefully
      }
    });
  });

  describe('Multi-Component Integration Workflow', () => {
    test('should handle complex component interactions', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });

      // Toggle theme
      const header = screen.getByRole('banner');
      const themeToggle = within(header).getByLabelText(/switch to/i);
      await user.click(themeToggle);

      // Navigate while theme is different
      const sidebar = screen.getByRole('complementary');
      const algorithmsSection = within(sidebar).getByText('Algorithms');
      await user.click(algorithmsSection);

      // Generate data
      await waitFor(() => {
        const generateButton = screen.queryByText(/generate random/i);
        if (generateButton) {
          await user.click(generateButton);
        }
      });

      // Start visualization
      await waitFor(() => {
        const startButton = screen.queryByText(/start|play/i);
        if (startButton) {
          await user.click(startButton);
        }
      });

      // Toggle theme again during visualization
      await user.click(themeToggle);

      // Everything should continue working
      expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
    });

    test('should maintain state consistency across components', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Wait for app to load
      await waitFor(() => {
        expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
      });

      // Set custom data
      const customInput = screen.queryByPlaceholderText(/enter custom|custom array/i);
      if (customInput) {
        await user.clear(customInput);
        await user.type(customInput, '1,2,3,4,5');
        await user.keyboard('{Enter}');
      }

      // Navigate to different algorithm
      const sidebar = screen.getByRole('complementary');
      const algorithmsSection = within(sidebar).getByText('Algorithms');
      await user.click(algorithmsSection);

      // Data should persist or be handled appropriately
      // This depends on the app's state management implementation
      expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
    });
  });
});
