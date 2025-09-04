import React, { useEffect, useRef, ReactElement } from 'react';

interface FocusManagerProps {
  children: ReactElement;
  trapFocus?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  preventScroll?: boolean;
}

interface FocusableElement extends HTMLElement {
  focus(options?: FocusOptions): void;
}

// Selectors for focusable elements
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])',
  'audio[controls]',
  'video[controls]',
  'summary'
].join(', ');

// Utility functions
const getFocusableElements = (container: HTMLElement): FocusableElement[] => {
  return Array.from(
    container.querySelectorAll(FOCUSABLE_SELECTORS)
  ) as FocusableElement[];
};

const getFirstFocusableElement = (container: HTMLElement): FocusableElement | null => {
  const focusables = getFocusableElements(container);
  return focusables.length > 0 ? focusables[0] : null;
};

const getLastFocusableElement = (container: HTMLElement): FocusableElement | null => {
  const focusables = getFocusableElements(container);
  return focusables.length > 0 ? focusables[focusables.length - 1] : null;
};

const isElementVisible = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};

export const FocusManager: React.FC<FocusManagerProps> = ({
  children,
  trapFocus = false,
  autoFocus = false,
  restoreFocus = true,
  preventScroll = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Store the currently focused element when component mounts
    if (restoreFocus) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
    }

    // Auto focus the first focusable element if requested
    if (autoFocus) {
      const firstFocusable = getFirstFocusableElement(container);
      if (firstFocusable && isElementVisible(firstFocusable)) {
        firstFocusable.focus({ preventScroll });
      }
    }

    // Focus trap handler
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!trapFocus || event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(container);
      const visibleFocusables = focusableElements.filter(isElementVisible);
      
      if (visibleFocusables.length === 0) return;

      const firstFocusable = visibleFocusables[0];
      const lastFocusable = visibleFocusables[visibleFocusables.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (event.shiftKey) {
        // Shift + Tab: moving backward
        if (activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus({ preventScroll });
        }
      } else {
        // Tab: moving forward
        if (activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus({ preventScroll });
        }
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to previously focused element when component unmounts
      if (restoreFocus && previousActiveElementRef.current) {
        try {
          previousActiveElementRef.current.focus({ preventScroll });
        } catch (error) {
          // Element might no longer exist or be focusable
          console.warn('Could not restore focus:', error);
        }
      }
    };
  }, [trapFocus, autoFocus, restoreFocus, preventScroll]);

  return (
    <div ref={containerRef} style={{ outline: 'none' }}>
      {children}
    </div>
  );
};

// Hook for programmatic focus management
export const useFocusManager = () => {
  const focusElement = (
    selector: string | HTMLElement, 
    options?: FocusOptions & { container?: HTMLElement }
  ) => {
    const { container = document.body, ...focusOptions } = options || {};
    
    let element: HTMLElement | null = null;
    
    if (typeof selector === 'string') {
      element = container.querySelector(selector);
    } else {
      element = selector;
    }
    
    if (element && isElementVisible(element)) {
      element.focus(focusOptions);
    }
  };

  const focusFirst = (container: HTMLElement = document.body, preventScroll = false) => {
    const first = getFirstFocusableElement(container);
    if (first) {
      first.focus({ preventScroll });
    }
  };

  const focusLast = (container: HTMLElement = document.body, preventScroll = false) => {
    const last = getLastFocusableElement(container);
    if (last) {
      last.focus({ preventScroll });
    }
  };

  const moveFocus = (
    direction: 'next' | 'previous',
    container: HTMLElement = document.body,
    wrap: boolean = true
  ) => {
    const focusables = getFocusableElements(container).filter(isElementVisible);
    const currentIndex = focusables.indexOf(document.activeElement as FocusableElement);
    
    if (currentIndex === -1) {
      // No element currently focused, focus the first one
      if (focusables.length > 0) {
        focusables[0].focus();
      }
      return;
    }

    let nextIndex: number;
    
    if (direction === 'next') {
      nextIndex = currentIndex + 1;
      if (nextIndex >= focusables.length) {
        nextIndex = wrap ? 0 : focusables.length - 1;
      }
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        nextIndex = wrap ? focusables.length - 1 : 0;
      }
    }

    focusables[nextIndex].focus();
  };

  const isFocusable = (element: HTMLElement): boolean => {
    return element.matches(FOCUSABLE_SELECTORS) && isElementVisible(element);
  };

  return {
    focusElement,
    focusFirst,
    focusLast,
    moveFocus,
    isFocusable,
    getFocusableElements: (container: HTMLElement) => 
      getFocusableElements(container).filter(isElementVisible)
  };
};

// Component for creating focus boundaries
export const FocusBoundary: React.FC<{
  children: React.ReactNode;
  onFocusEnter?: () => void;
  onFocusLeave?: () => void;
}> = ({ children, onFocusEnter, onFocusLeave }) => {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const isInsideBoundaryRef = useRef(false);

  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      const boundary = boundaryRef.current;
      if (!boundary) return;

      const isInsideBoundary = boundary.contains(event.target as Node);
      
      if (isInsideBoundary && !isInsideBoundaryRef.current) {
        isInsideBoundaryRef.current = true;
        onFocusEnter?.();
      } else if (!isInsideBoundary && isInsideBoundaryRef.current) {
        isInsideBoundaryRef.current = false;
        onFocusLeave?.();
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, [onFocusEnter, onFocusLeave]);

  return (
    <div ref={boundaryRef} style={{ outline: 'none' }}>
      {children}
    </div>
  );
};

// Skip link component
export const SkipLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ href, children, className, style }) => {
  const defaultStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-40px',
    left: '6px',
    background: '#000',
    color: '#fff',
    padding: '8px',
    zIndex: 9999,
    textDecoration: 'none',
    borderRadius: '4px',
    transform: 'translateY(-100%)',
    transition: 'transform 0.3s'
  };

  const focusStyle: React.CSSProperties = {
    transform: 'translateY(0)'
  };

  return (
    <a
      href={href}
      className={className}
      style={{ ...defaultStyle, ...style }}
      onFocus={(e) => {
        Object.assign(e.target.style, focusStyle);
      }}
      onBlur={(e) => {
        Object.assign(e.target.style, { transform: 'translateY(-100%)' });
      }}
    >
      {children}
    </a>
  );
};

export default FocusManager;
