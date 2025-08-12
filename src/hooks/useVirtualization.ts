import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  getItemHeight?: (index: number) => number;
}

export const useVirtualization = <T>(
  items: T[],
  options: VirtualizationOptions
) => {
  const { itemHeight, containerHeight, overscan = 5, getItemHeight } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number>();

  // Calculate which items should be visible
  const visibleRange = useMemo(() => {
    const itemCount = items.length;
    const visibleHeight = containerHeight;

    if (getItemHeight) {
      // Variable height calculation
      let accumulatedHeight = 0;
      let startIndex = 0;
      let endIndex = 0;

      // Find start index
      for (let i = 0; i < itemCount; i++) {
        const height = getItemHeight(i);
        if (accumulatedHeight + height >= scrollTop) {
          startIndex = Math.max(0, i - overscan);
          break;
        }
        accumulatedHeight += height;
      }

      // Find end index
      let remainingHeight = visibleHeight;
      for (let i = startIndex; i < itemCount; i++) {
        const height = getItemHeight(i);
        remainingHeight -= height;
        if (remainingHeight <= 0) {
          endIndex = Math.min(itemCount - 1, i + overscan);
          break;
        }
      }

      return { startIndex, endIndex };
    } else {
      // Fixed height calculation
      const startIndex = Math.max(
        0,
        Math.floor(scrollTop / itemHeight) - overscan
      );
      const endIndex = Math.min(
        itemCount - 1,
        Math.ceil((scrollTop + visibleHeight) / itemHeight) + overscan
      );

      return { startIndex, endIndex };
    }
  }, [scrollTop, containerHeight, itemHeight, items.length, overscan, getItemHeight]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  // Calculate total height and offset
  const totalHeight = useMemo(() => {
    if (getItemHeight) {
      return items.reduce((acc, _, index) => acc + getItemHeight(index), 0);
    }
    return items.length * itemHeight;
  }, [items.length, itemHeight, getItemHeight]);

  const offsetY = useMemo(() => {
    if (getItemHeight) {
      let offset = 0;
      for (let i = 0; i < visibleRange.startIndex; i++) {
        offset += getItemHeight(i);
      }
      return offset;
    }
    return visibleRange.startIndex * itemHeight;
  }, [visibleRange.startIndex, itemHeight, getItemHeight]);

  // Handle scroll events
  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    const { scrollTop } = event.currentTarget;
    setScrollTop(scrollTop);
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    // Set new timeout to detect when scrolling stops
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    visibleItems,
    visibleRange,
    totalHeight,
    offsetY,
    handleScroll,
    isScrolling
  };
};

// React component for virtualized list
export interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  width?: string | number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  getItemHeight?: (index: number) => number;
  onScroll?: (scrollTop: number) => void;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  height,
  width = '100%',
  renderItem,
  className,
  overscan = 5,
  getItemHeight,
  onScroll
}: VirtualizedListProps<T>) {
  const {
    visibleItems,
    visibleRange,
    totalHeight,
    offsetY,
    handleScroll,
    isScrolling
  } = useVirtualization(items, {
    itemHeight,
    containerHeight: height,
    overscan,
    getItemHeight
  });

  const handleScrollEvent = useCallback((event: React.UIEvent<HTMLElement>) => {
    handleScroll(event);
    onScroll?.(event.currentTarget.scrollTop);
  }, [handleScroll, onScroll]);

  return (
    <div
      className={className}
      style={{
        height,
        width,
        overflow: 'auto',
        position: 'relative'
      }}
      onScroll={handleScrollEvent}
      role="list"
      aria-label={`List with ${items.length} items`}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, virtualIndex) => {
            const actualIndex = visibleRange.startIndex + virtualIndex;
            return (
              <div
                key={actualIndex}
                style={{
                  height: getItemHeight ? getItemHeight(actualIndex) : itemHeight,
                  position: 'relative'
                }}
                role="listitem"
                aria-setsize={items.length}
                aria-posinset={actualIndex + 1}
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Scroll indicator for accessibility */}
      {isScrolling && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.875rem',
            pointerEvents: 'none',
            zIndex: 1000
          }}
          aria-live="polite"
        >
          {Math.round((visibleRange.startIndex / items.length) * 100)}%
        </div>
      )}
    </div>
  );
}

// Hook for infinite scrolling
interface InfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useInfiniteScroll = (
  callback: () => void,
  options: InfiniteScrollOptions = {}
) => {
  const { threshold = 0.1, rootMargin = '0px' } = options;
  const [isFetching, setIsFetching] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetching) {
          setIsFetching(true);
          callback();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [callback, threshold, rootMargin, isFetching]);

  const resetFetching = useCallback(() => {
    setIsFetching(false);
  }, []);

  return { loadMoreRef, isFetching, resetFetching };
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    frameRate: 0
  });

  const measureRender = useCallback((name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    
    setMetrics(prev => ({
      ...prev,
      renderTime: end - start
    }));

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name} render time: ${(end - start).toFixed(2)}ms`);
    }
  }, []);

  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize / 1048576 // Convert to MB
      }));
    }
  }, []);

  const measureFrameRate = useCallback(() => {
    let frames = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setMetrics(prev => ({
          ...prev,
          frameRate: frames
        }));
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    measureFPS();
  }, []);

  return {
    metrics,
    measureRender,
    measureMemory,
    measureFrameRate
  };
};
