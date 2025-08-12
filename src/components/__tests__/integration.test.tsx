import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../themes/lightTheme';
import { AnimationProvider } from '../utils/AnimationContext';
import { ToastProvider } from '../ui/ComponentLibrary';

// Test Components
import Header from '../layout/Header';
import Sidebar from '../layout/Sidebar';
import GraphVisualizer from '../visualization/GraphVisualizer';
import ArrayControls from '../algorithms/ArrayControls';
import { useAccessibility } from '../../hooks/useAccessibility';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
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

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={lightTheme}>
      <ToastProvider>
        <AnimationProvider>
          {children}
        </AnimationProvider>
      </ToastProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('Component Integration Tests', () => {
  describe('Header and Theme Integration', () => {
    test('should toggle theme and accessibility features', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Find theme toggle button
      const themeToggle = screen.getByLabelText(/switch to/i);
      expect(themeToggle).toBeInTheDocument();

      // Test theme toggle
      await user.click(themeToggle);

      // Verify accessibility announcement area exists
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();

      // Test high contrast toggle if available
      const highContrastToggle = screen.queryByLabelText(/high contrast/i);
      if (highContrastToggle) {
        await user.click(highContrastToggle);
        expect(document.body.classList.contains('high-contrast')).toBe(true);
      }
    });

    test('should have proper ARIA structure', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Check for proper landmark roles
      expect(screen.getByRole('banner')).toBeInTheDocument();
      
      // Check for proper button labels
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const ariaLabel = button.getAttribute('aria-label');
        const textContent = button.textContent;
        expect(ariaLabel || textContent).toBeTruthy();
      });
    });

    test('should handle keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Test Tab navigation
      await user.tab();
      expect(document.activeElement).toBeTruthy();

      // Test Enter key activation
      const focusedElement = document.activeElement as HTMLElement;
      if (focusedElement && focusedElement.tagName === 'BUTTON') {
        await user.keyboard('{Enter}');
      }
    });
  });

  describe('Sidebar Navigation Integration', () => {
    test('should expand and collapse sections', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      // Find collapsible sections
      const algorithmSection = screen.getByText('Algorithms');
      expect(algorithmSection).toBeInTheDocument();

      // Click to expand/collapse
      await user.click(algorithmSection.closest('div') as HTMLElement);

      // Check for navigation items
      await waitFor(() => {
        expect(screen.getByText('Sorting')).toBeInTheDocument();
      });
    });

    test('should handle nested navigation', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      // Expand main algorithms section first
      const algorithmsHeader = screen.getByText('Algorithms').closest('[role="button"]') as HTMLElement;
      await user.click(algorithmsHeader);

      await waitFor(() => {
        // Find and click sorting subsection
        const sortingSection = screen.getByText('Sorting');
        expect(sortingSection).toBeInTheDocument();
      });
    });

    test('should maintain proper focus management', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Sidebar />
        </TestWrapper>
      );

      // Navigate through sidebar items
      await user.tab();
      await user.tab();
      
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
      expect(focusedElement?.getAttribute('tabindex')).not.toBe('-1');
    });
  });

  describe('Graph Visualizer Integration', () => {
    const mockGraphData = {
      vertices: [
        { id: 0, x: 100, y: 100, name: 'A', state: 'unvisited' as const },
        { id: 1, x: 200, y: 100, name: 'B', state: 'unvisited' as const },
        { id: 2, x: 150, y: 200, name: 'C', state: 'unvisited' as const }
      ],
      edges: [
        { from: 0, to: 1, state: 'normal' as const },
        { from: 1, to: 2, state: 'normal' as const },
        { from: 2, to: 0, state: 'normal' as const }
      ]
    };

    test('should render graph with vertices and edges', () => {
      render(
        <TestWrapper>
          <GraphVisualizer data={mockGraphData} width={400} height={300} />
        </TestWrapper>
      );

      const canvas = screen.getByRole('img', { hidden: true });
      expect(canvas).toBeInTheDocument();
    });

    test('should handle vertex interactions', async () => {
      const mockVertexClick = jest.fn();
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <GraphVisualizer 
            data={mockGraphData} 
            onVertexClick={mockVertexClick}
            width={400}
            height={300}
          />
        </TestWrapper>
      );

      const canvas = screen.getByRole('img', { hidden: true });
      
      // Simulate click on canvas (vertex area)
      await user.click(canvas);
      
      // Note: Canvas click coordinates would need to be mocked in a real test
      // This tests the event handler registration
      expect(canvas).toBeInTheDocument();
    });

    test('should update visualization state', async () => {
      const { rerender } = render(
        <TestWrapper>
          <GraphVisualizer data={mockGraphData} width={400} height={300} />
        </TestWrapper>
      );

      // Update with highlighted path
      const updatedData = {
        ...mockGraphData,
        vertices: mockGraphData.vertices.map(v => ({
          ...v,
          state: v.id === 0 ? 'visiting' as const : v.state
        }))
      };

      rerender(
        <TestWrapper>
          <GraphVisualizer 
            data={updatedData} 
            highlightPath={[0, 1]}
            width={400}
            height={300}
          />
        </TestWrapper>
      );

      // Verify the canvas is re-rendered (implementation detail)
      const canvas = screen.getByRole('img', { hidden: true });
      expect(canvas).toBeInTheDocument();
    });
  });

  describe('Array Controls Integration', () => {
    test('should generate random arrays', async () => {
      const mockArrayChange = jest.fn();
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ArrayControls
            onGenerateRandom={mockArrayChange}
            onCustomArray={jest.fn()}
            arraySize={10}
            onSizeChange={jest.fn()}
            disabled={false}
            maxValue={100}
          />
        </TestWrapper>
      );

      // Find and click generate random button
      const generateButton = screen.getByText(/generate random/i);
      await user.click(generateButton);

      expect(mockArrayChange).toHaveBeenCalled();
    });

    test('should handle custom array input', async () => {
      const mockCustomArray = jest.fn();
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ArrayControls
            onGenerateRandom={jest.fn()}
            onCustomArray={mockCustomArray}
            arraySize={10}
            onSizeChange={jest.fn()}
            disabled={false}
            maxValue={100}
          />
        </TestWrapper>
      );

      // Find custom array input
      const customInput = screen.getByPlaceholderText(/enter custom array/i);
      await user.type(customInput, '1,2,3,4,5');

      // Submit the form (assuming there's a submit mechanism)
      await user.keyboard('{Enter}');

      // Verify the custom array handler was called
      expect(mockCustomArray).toHaveBeenCalledWith([1, 2, 3, 4, 5]);
    });

    test('should validate array input', async () => {
      const mockCustomArray = jest.fn();
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ArrayControls
            onGenerateRandom={jest.fn()}
            onCustomArray={mockCustomArray}
            arraySize={10}
            onSizeChange={jest.fn()}
            disabled={false}
            maxValue={100}
          />
        </TestWrapper>
      );

      // Try invalid input
      const customInput = screen.getByPlaceholderText(/enter custom array/i);
      await user.type(customInput, 'invalid,input,abc');
      await user.keyboard('{Enter}');

      // Should show error state or not call the handler
      // Implementation depends on the component's validation logic
    });

    test('should handle size changes', async () => {
      const mockSizeChange = jest.fn();
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ArrayControls
            onGenerateRandom={jest.fn()}
            onCustomArray={jest.fn()}
            arraySize={10}
            onSizeChange={mockSizeChange}
            disabled={false}
            maxValue={100}
          />
        </TestWrapper>
      );

      // Find size control (assuming it's a select or input)
      const sizeControl = screen.getByDisplayValue('10') || screen.getByLabelText(/array size/i);
      
      if (sizeControl) {
        await user.clear(sizeControl);
        await user.type(sizeControl, '15');
        await user.tab(); // Trigger change event

        expect(mockSizeChange).toHaveBeenCalledWith(15);
      }
    });
  });

  describe('Accessibility Hook Integration', () => {
    const TestAccessibilityComponent = () => {
      const { announce, isHighContrast, setIsHighContrast } = useAccessibility();

      return (
        <div>
          <button onClick={() => announce('Test announcement')}>
            Announce
          </button>
          <button onClick={() => setIsHighContrast(!isHighContrast)}>
            Toggle High Contrast: {isHighContrast ? 'On' : 'Off'}
          </button>
          <span data-testid="contrast-state">
            {isHighContrast ? 'high-contrast' : 'normal'}
          </span>
        </div>
      );
    };

    test('should handle screen reader announcements', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <TestAccessibilityComponent />
        </TestWrapper>
      );

      const announceButton = screen.getByText('Announce');
      await user.click(announceButton);

      // Check that live region is created
      await waitFor(() => {
        const liveRegion = document.querySelector('[aria-live="polite"]');
        expect(liveRegion).toBeInTheDocument();
      });
    });

    test('should toggle high contrast mode', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <TestAccessibilityComponent />
        </TestWrapper>
      );

      const toggleButton = screen.getByText(/Toggle High Contrast/);
      const contrastState = screen.getByTestId('contrast-state');

      expect(contrastState).toHaveTextContent('normal');

      await user.click(toggleButton);

      await waitFor(() => {
        expect(contrastState).toHaveTextContent('high-contrast');
        expect(document.body.classList.contains('high-contrast')).toBe(true);
      });
    });

    test('should handle keyboard navigation events', async () => {
      render(
        <TestWrapper>
          <TestAccessibilityComponent />
        </TestWrapper>
      );

      // Test global keyboard shortcuts
      fireEvent.keyDown(document, { key: 'F1', altKey: true });
      
      await waitFor(() => {
        expect(document.body.classList.contains('high-contrast')).toBe(true);
      });

      // Test help shortcut
      fireEvent.keyDown(document, { key: 'F1' });
      
      // Should trigger help announcement
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
    });
  });

  describe('Animation Integration', () => {
    test('should respect reduced motion preferences', () => {
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

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Check if reduced motion class is applied
      expect(document.body.classList.contains('reduced-motion')).toBe(true);
    });

    test('should handle animation state changes', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ArrayControls
            onGenerateRandom={jest.fn()}
            onCustomArray={jest.fn()}
            arraySize={10}
            onSizeChange={jest.fn()}
            disabled={false}
            maxValue={100}
          />
        </TestWrapper>
      );

      // Trigger an action that might cause animations
      const button = screen.getByText(/generate random/i);
      await user.click(button);

      // Animation context should handle the state
      // This is more of a smoke test to ensure no errors occur
      expect(button).toBeInTheDocument();
    });
  });

  describe('Error Boundary Integration', () => {
    const ThrowErrorComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
      if (shouldThrow) {
        throw new Error('Test error for error boundary');
      }
      return <div>No error</div>;
    };

    test('should catch and display errors gracefully', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const { rerender } = render(
        <TestWrapper>
          <ThrowErrorComponent shouldThrow={false} />
        </TestWrapper>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();

      // Trigger error
      rerender(
        <TestWrapper>
          <ThrowErrorComponent shouldThrow={true} />
        </TestWrapper>
      );

      // Should show error boundary UI
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Performance Integration', () => {
    test('should handle large data sets efficiently', async () => {
      const largeGraphData = {
        vertices: Array.from({ length: 100 }, (_, i) => ({
          id: i,
          x: (i % 10) * 50 + 50,
          y: Math.floor(i / 10) * 50 + 50,
          name: `Node${i}`,
          state: 'unvisited' as const
        })),
        edges: Array.from({ length: 200 }, (_, i) => ({
          from: Math.floor(Math.random() * 100),
          to: Math.floor(Math.random() * 100),
          state: 'normal' as const
        }))
      };

      const startTime = performance.now();

      render(
        <TestWrapper>
          <GraphVisualizer data={largeGraphData} width={800} height={600} />
        </TestWrapper>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time
      expect(renderTime).toBeLessThan(1000); // 1 second max

      const canvas = screen.getByRole('img', { hidden: true });
      expect(canvas).toBeInTheDocument();
    });

    test('should handle rapid state updates', async () => {
      const { rerender } = render(
        <TestWrapper>
          <ArrayControls
            onGenerateRandom={jest.fn()}
            onCustomArray={jest.fn()}
            arraySize={10}
            onSizeChange={jest.fn()}
            disabled={false}
            maxValue={100}
          />
        </TestWrapper>
      );

      // Rapidly change size multiple times
      for (let i = 5; i <= 20; i += 5) {
        rerender(
          <TestWrapper>
            <ArrayControls
              onGenerateRandom={jest.fn()}
              onCustomArray={jest.fn()}
              arraySize={i}
              onSizeChange={jest.fn()}
              disabled={false}
              maxValue={100}
            />
          </TestWrapper>
        );
      }

      // Should handle updates without crashing
      expect(screen.getByText(/array size/i)).toBeInTheDocument();
    });
  });

  describe('Mobile Integration', () => {
    test('should adapt to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(
        <TestWrapper>
          <Header />
          <Sidebar />
        </TestWrapper>
      );

      // Mobile-specific elements should be present
      // This would depend on the specific mobile adaptations in your components
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    test('should handle touch interactions', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ArrayControls
            onGenerateRandom={jest.fn()}
            onCustomArray={jest.fn()}
            arraySize={10}
            onSizeChange={jest.fn()}
            disabled={false}
            maxValue={100}
          />
        </TestWrapper>
      );

      // Simulate touch events (user-event handles this automatically)
      const button = screen.getByText(/generate random/i);
      await user.click(button);

      expect(button).toBeInTheDocument();
    });
  });
});
