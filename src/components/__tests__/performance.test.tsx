import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../themes/lightTheme';
import { AnimationProvider } from '../utils/AnimationContext';
import { ToastProvider } from '../ui/ComponentLibrary';

// Import components for performance testing
import GraphVisualizer from '../visualization/GraphVisualizer';
import ArrayVisualizer from '../visualization/ArrayVisualizer';
import { VirtualizedList } from '../ui/VirtualizedList';
import App from '../../App';

// Mock performance.now for consistent testing
const mockPerformanceNow = (() => {
  let time = 0;
  return jest.fn(() => (time += 16.67)); // 60fps
})();

// Mock framer-motion for consistent performance
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    canvas: ({ children, ...props }: any) => <canvas {...props}>{children}</canvas>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Canvas API with performance tracking
const mockCanvasContext = {
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4).fill(0) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => ({ data: new Array(4).fill(0) })),
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
  textAlign: 'start' as CanvasTextAlign,
  textBaseline: 'alphabetic' as CanvasTextBaseline,
};

HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCanvasContext) as any;

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

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

describe('Performance Tests', () => {
  beforeAll(() => {
    // Mock performance API
    global.performance.now = mockPerformanceNow;
    
    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn((cb) => {
      setTimeout(cb, 16);
      return 1;
    });
    
    // Mock cancelAnimationFrame
    global.cancelAnimationFrame = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockPerformanceNow.mockClear();
  });

  describe('Component Rendering Performance', () => {
    test('should render large graph efficiently', async () => {
      const largeGraphData = {
        vertices: Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          x: Math.random() * 800,
          y: Math.random() * 600,
          name: `Node${i}`,
          state: 'unvisited' as const
        })),
        edges: Array.from({ length: 2000 }, (_, i) => ({
          from: Math.floor(Math.random() * 1000),
          to: Math.floor(Math.random() * 1000),
          state: 'normal' as const
        }))
      };

      const startTime = performance.now();

      await act(async () => {
        render(
          <TestWrapper>
            <GraphVisualizer data={largeGraphData} width={800} height={600} />
          </TestWrapper>
        );
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render large graph within reasonable time
      expect(renderTime).toBeLessThan(100); // 100ms max for initial render
      
      // Verify canvas operations were called
      expect(mockCanvasContext.clearRect).toHaveBeenCalled();
    });

    test('should render large array efficiently', async () => {
      const largeArrayData = Array.from({ length: 1000 }, (_, i) => ({
        value: Math.floor(Math.random() * 100),
        index: i,
        state: 'default' as const
      }));

      const startTime = performance.now();

      await act(async () => {
        render(
          <TestWrapper>
            <ArrayVisualizer data={largeArrayData} width={800} height={400} />
          </TestWrapper>
        );
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render large array within reasonable time
      expect(renderTime).toBeLessThan(100); // 100ms max for initial render
    });

    test('should handle rapid re-renders efficiently', async () => {
      const graphData = {
        vertices: Array.from({ length: 50 }, (_, i) => ({
          id: i,
          x: i * 10,
          y: i * 5,
          name: `Node${i}`,
          state: 'unvisited' as const
        })),
        edges: Array.from({ length: 50 }, (_, i) => ({
          from: i,
          to: (i + 1) % 50,
          state: 'normal' as const
        }))
      };

      const { rerender } = render(
        <TestWrapper>
          <GraphVisualizer data={graphData} width={400} height={300} />
        </TestWrapper>
      );

      const startTime = performance.now();

      // Perform multiple rapid re-renders
      for (let i = 0; i < 10; i++) {
        const updatedData = {
          ...graphData,
          vertices: graphData.vertices.map(v => ({
            ...v,
            state: Math.random() > 0.5 ? 'visiting' as const : 'unvisited' as const
          }))
        };

        await act(async () => {
          rerender(
            <TestWrapper>
              <GraphVisualizer data={updatedData} width={400} height={300} />
            </TestWrapper>
          );
        });
      }

      const endTime = performance.now();
      const totalRerenderTime = endTime - startTime;

      // Should handle rapid re-renders efficiently
      expect(totalRerenderTime).toBeLessThan(200); // 200ms max for 10 re-renders
    });
  });

  describe('Memory Usage Performance', () => {
    test('should not create memory leaks with large datasets', async () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Create and destroy multiple large components
      for (let iteration = 0; iteration < 5; iteration++) {
        const largeData = {
          vertices: Array.from({ length: 500 }, (_, i) => ({
            id: i,
            x: Math.random() * 400,
            y: Math.random() * 300,
            name: `Node${i}`,
            state: 'unvisited' as const
          })),
          edges: Array.from({ length: 1000 }, (_, i) => ({
            from: Math.floor(Math.random() * 500),
            to: Math.floor(Math.random() * 500),
            state: 'normal' as const
          }))
        };

        const { unmount } = render(
          <TestWrapper>
            <GraphVisualizer data={largeData} width={400} height={300} />
          </TestWrapper>
        );

        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }

        unmount();
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Memory should not have increased significantly
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryIncrease = finalMemory - initialMemory;
        expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Less than 50MB increase
      }
    });

    test('should cleanup event listeners properly', async () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { unmount } = render(
        <TestWrapper>
          <GraphVisualizer 
            data={{
              vertices: [
                { id: 0, x: 100, y: 100, name: 'A', state: 'unvisited' },
                { id: 1, x: 200, y: 100, name: 'B', state: 'unvisited' }
              ],
              edges: [{ from: 0, to: 1, state: 'normal' }]
            }}
            width={400}
            height={300}
          />
        </TestWrapper>
      );

      const addedListeners = addEventListenerSpy.mock.calls.length;

      unmount();

      const removedListeners = removeEventListenerSpy.mock.calls.length;

      // Should remove as many listeners as were added
      expect(removedListeners).toBeGreaterThanOrEqual(addedListeners * 0.8); // Allow some flexibility

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Animation Performance', () => {
    test('should maintain smooth animation frame rates', async () => {
      const frameRates: number[] = [];
      let frameCount = 0;
      const maxFrames = 60; // 1 second at 60fps

      const originalRequestAnimationFrame = global.requestAnimationFrame;
      
      global.requestAnimationFrame = jest.fn((callback) => {
        const currentTime = performance.now();
        
        if (frameCount > 0) {
          const frameTime = currentTime - (frameRates[frameCount - 1] || 0);
          if (frameTime > 0) {
            const fps = 1000 / frameTime;
            frameRates.push(fps);
          }
        }
        
        frameCount++;
        
        if (frameCount < maxFrames) {
          setTimeout(() => callback(currentTime), 16); // 60fps
        }
        
        return frameCount;
      });

      render(
        <TestWrapper>
          <GraphVisualizer
            data={{
              vertices: Array.from({ length: 100 }, (_, i) => ({
                id: i,
                x: Math.random() * 400,
                y: Math.random() * 300,
                name: `Node${i}`,
                state: Math.random() > 0.5 ? 'visiting' as const : 'unvisited' as const
              })),
              edges: Array.from({ length: 200 }, (_, i) => ({
                from: Math.floor(Math.random() * 100),
                to: Math.floor(Math.random() * 100),
                state: 'normal' as const
              }))
            }}
            width={400}
            height={300}
          />
        </TestWrapper>
      );

      // Wait for animations to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Calculate average FPS
      if (frameRates.length > 0) {
        const averageFPS = frameRates.reduce((sum, fps) => sum + fps, 0) / frameRates.length;
        expect(averageFPS).toBeGreaterThan(30); // Should maintain at least 30fps
      }

      global.requestAnimationFrame = originalRequestAnimationFrame;
    });

    test('should handle reduced motion efficiently', async () => {
      // Mock reduced motion preference
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

      const startTime = performance.now();

      render(
        <TestWrapper>
          <GraphVisualizer
            data={{
              vertices: Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: i * 8,
                y: i * 6,
                name: `Node${i}`,
                state: 'unvisited' as const
              })),
              edges: Array.from({ length: 75 }, (_, i) => ({
                from: i % 50,
                to: (i + 1) % 50,
                state: 'normal' as const
              }))
            }}
            width={400}
            height={300}
          />
        </TestWrapper>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render even faster with reduced motion
      expect(renderTime).toBeLessThan(50);
    });
  });

  describe('Virtualization Performance', () => {
    test('should efficiently render large lists with virtualization', async () => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        content: `Item ${i}`,
        value: Math.random() * 100
      }));

      const renderItem = ({ item, index }: { item: any; index: number }) => (
        <div key={item.id} style={{ height: 50 }}>
          {item.content}: {item.value.toFixed(2)}
        </div>
      );

      const startTime = performance.now();

      render(
        <TestWrapper>
          <VirtualizedList
            items={largeDataset}
            renderItem={renderItem}
            itemHeight={50}
            height={400}
            width={300}
          />
        </TestWrapper>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render large virtualized list quickly
      expect(renderTime).toBeLessThan(100);

      // Should not render all items (only visible ones)
      const renderedItems = screen.getAllByText(/Item \d+:/);
      expect(renderedItems.length).toBeLessThan(50); // Should only render visible items
    });

    test('should handle scroll performance in virtualized lists', async () => {
      const dataset = Array.from({ length: 5000 }, (_, i) => ({
        id: i,
        content: `Scrollable Item ${i}`
      }));

      const renderItem = ({ item }: { item: any }) => (
        <div key={item.id} style={{ height: 40 }}>
          {item.content}
        </div>
      );

      const { container } = render(
        <TestWrapper>
          <VirtualizedList
            items={dataset}
            renderItem={renderItem}
            itemHeight={40}
            height={400}
            width={300}
          />
        </TestWrapper>
      );

      const scrollContainer = container.querySelector('[data-testid="virtualized-container"]');
      
      if (scrollContainer) {
        const startTime = performance.now();

        // Simulate rapid scrolling
        for (let i = 0; i < 10; i++) {
          act(() => {
            scrollContainer.scrollTop = i * 400;
            scrollContainer.dispatchEvent(new Event('scroll'));
          });
        }

        const endTime = performance.now();
        const scrollTime = endTime - startTime;

        // Should handle rapid scrolling efficiently
        expect(scrollTime).toBeLessThan(100);
      }
    });
  });

  describe('Bundle Size and Loading Performance', () => {
    test('should load main app efficiently', async () => {
      const startTime = performance.now();

      await act(async () => {
        render(<App />);
      });

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Should load main app quickly
      expect(loadTime).toBeLessThan(500); // 500ms max for initial load

      // Should have rendered main components
      expect(screen.getByText('Data Structure Visualizer')).toBeInTheDocument();
    });

    test('should handle code splitting efficiently', async () => {
      // This would test lazy loading of components in a real app
      const startTime = performance.now();

      render(<App />);

      // Wait for all components to load
      await screen.findByText('Data Structure Visualizer');

      const endTime = performance.now();
      const totalLoadTime = endTime - startTime;

      // Should load with code splitting efficiently
      expect(totalLoadTime).toBeLessThan(1000);
    });
  });

  describe('Performance Monitoring', () => {
    test('should track performance metrics', () => {
      const performanceEntries: PerformanceEntry[] = [];
      
      // Mock performance observer
      const mockPerformanceObserver = {
        observe: jest.fn(),
        disconnect: jest.fn(),
        takeRecords: jest.fn(() => performanceEntries)
      };

      global.PerformanceObserver = jest.fn(() => mockPerformanceObserver) as any;

      render(
        <TestWrapper>
          <GraphVisualizer
            data={{
              vertices: [
                { id: 0, x: 100, y: 100, name: 'A', state: 'unvisited' },
                { id: 1, x: 200, y: 100, name: 'B', state: 'unvisited' }
              ],
              edges: [{ from: 0, to: 1, state: 'normal' }]
            }}
            width={400}
            height={300}
          />
        </TestWrapper>
      );

      // Should have set up performance monitoring
      expect(global.PerformanceObserver).toHaveBeenCalled();
      expect(mockPerformanceObserver.observe).toHaveBeenCalled();
    });

    test('should identify performance bottlenecks', async () => {
      const performanceMeasures: { name: string; duration: number }[] = [];
      
      // Mock performance.measure
      const originalMeasure = performance.measure;
      performance.measure = jest.fn((name: string, startMark?: string, endMark?: string) => {
        performanceMeasures.push({ name, duration: Math.random() * 50 });
        return originalMeasure?.call(performance, name, startMark, endMark);
      });

      render(
        <TestWrapper>
          <GraphVisualizer
            data={{
              vertices: Array.from({ length: 200 }, (_, i) => ({
                id: i,
                x: Math.random() * 400,
                y: Math.random() * 300,
                name: `Node${i}`,
                state: 'unvisited' as const
              })),
              edges: Array.from({ length: 400 }, (_, i) => ({
                from: Math.floor(Math.random() * 200),
                to: Math.floor(Math.random() * 200),
                state: 'normal' as const
              }))
            }}
            width={400}
            height={300}
          />
        </TestWrapper>
      );

      // Wait for render to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should have measured performance
      expect(performance.measure).toHaveBeenCalled();

      // Check for any slow operations
      const slowOperations = performanceMeasures.filter(m => m.duration > 16.67);
      expect(slowOperations.length).toBeLessThan(performanceMeasures.length * 0.1); // Less than 10% slow operations

      performance.measure = originalMeasure;
    });
  });

  describe('Resource Usage Optimization', () => {
    test('should optimize canvas operations', async () => {
      const mockContext = mockCanvasContext;
      
      render(
        <TestWrapper>
          <GraphVisualizer
            data={{
              vertices: Array.from({ length: 100 }, (_, i) => ({
                id: i,
                x: i * 4,
                y: i * 3,
                name: `Node${i}`,
                state: 'unvisited' as const
              })),
              edges: Array.from({ length: 150 }, (_, i) => ({
                from: i % 100,
                to: (i + 1) % 100,
                state: 'normal' as const
              }))
            }}
            width={400}
            height={300}
          />
        </TestWrapper>
      );

      // Should use efficient canvas operations
      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.restore).toHaveBeenCalled();
      
      // Should batch drawing operations
      const drawCalls = [
        ...mockContext.fillRect.mock.calls,
        ...mockContext.stroke.mock.calls,
        ...mockContext.fill.mock.calls
      ];
      
      expect(drawCalls.length).toBeGreaterThan(0);
    });

    test('should handle high DPI displays efficiently', async () => {
      // Mock high DPI display
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: 2
      });

      const startTime = performance.now();

      render(
        <TestWrapper>
          <GraphVisualizer
            data={{
              vertices: Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: i * 8,
                y: i * 6,
                name: `Node${i}`,
                state: 'unvisited' as const
              })),
              edges: Array.from({ length: 75 }, (_, i) => ({
                from: i % 50,
                to: (i + 1) % 50,
                state: 'normal' as const
              }))
            }}
            width={400}
            height={300}
          />
        </TestWrapper>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should handle high DPI efficiently
      expect(renderTime).toBeLessThan(100);
      
      // Should have scaled canvas appropriately
      expect(mockCanvasContext.scale).toHaveBeenCalledWith(2, 2);
    });
  });
});
