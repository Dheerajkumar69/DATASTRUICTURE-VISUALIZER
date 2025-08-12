import React, { useEffect, useRef, useState, useCallback } from 'react';

interface UseAccessibilityOptions {
  announceChanges?: boolean;
  enableKeyboardNavigation?: boolean;
  focusManagement?: boolean;
}

export const useAccessibility = (options: UseAccessibilityOptions = {}) => {
  const {
    announceChanges = true,
    enableKeyboardNavigation = true,
    focusManagement = true
  } = options;

  const [isHighContrast, setIsHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const announceRef = useRef<HTMLDivElement>(null);
  const focusableElements = useRef<HTMLElement[]>([]);

  // Screen reader announcements
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announceChanges || !announceRef.current) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    announceRef.current.appendChild(announcement);

    // Clean up after announcement
    setTimeout(() => {
      if (announceRef.current?.contains(announcement)) {
        announceRef.current.removeChild(announcement);
      }
    }, 1000);
  }, [announceChanges]);

  // Keyboard navigation
  const handleKeyNavigation = useCallback((event: KeyboardEvent) => {
    if (!enableKeyboardNavigation) return;

    const { key, shiftKey, ctrlKey, altKey } = event;
    
    // Skip navigation
    if (key === 'Tab' && ctrlKey) {
      event.preventDefault();
      const main = document.querySelector('main');
      if (main) {
        (main as HTMLElement).focus();
        announce('Skipped to main content');
      }
    }

    // High contrast toggle
    if (key === 'F1' && altKey) {
      event.preventDefault();
      setIsHighContrast(prev => {
        const newValue = !prev;
        announce(`High contrast mode ${newValue ? 'enabled' : 'disabled'}`);
        return newValue;
      });
    }

    // Help dialog
    if (key === 'F1' && !altKey && !ctrlKey) {
      event.preventDefault();
      announce('Help: Use Tab to navigate, Space or Enter to activate, Escape to close dialogs, Alt+F1 for high contrast mode');
    }
  }, [enableKeyboardNavigation, announce]);

  // Focus management
  const trapFocus = useCallback((container: HTMLElement) => {
    if (!focusManagement) return;

    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    const focusableElements = Array.from(
      container.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [focusManagement]);

  // Restore focus
  const restoreFocus = useCallback((element?: HTMLElement | null) => {
    if (!focusManagement) return;
    
    if (element && element.focus) {
      element.focus();
    } else {
      // Fallback to main content
      const main = document.querySelector('main');
      if (main) {
        (main as HTMLElement).focus();
      }
    }
  }, [focusManagement]);

  // Check for user preferences
  useEffect(() => {
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      return mediaQuery;
    };

    const mediaQuery = checkReducedMotion();
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Set up keyboard listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyNavigation);
    return () => document.removeEventListener('keydown', handleKeyNavigation);
  }, [handleKeyNavigation]);

  // Apply high contrast styles
  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  // Apply reduced motion styles
  useEffect(() => {
    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  return {
    announce,
    trapFocus,
    restoreFocus,
    isHighContrast,
    setIsHighContrast,
    reducedMotion,
    announceRef
  };
};

// Accessible button component
export interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  announce?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  announce,
  disabled,
  onClick,
  ...props
}) => {
  const { announce: announceChange } = useAccessibility();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;
    
    if (announce) {
      announceChange(announce);
    }
    
    onClick?.(e);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      style={{
        minHeight: '44px',
        minWidth: '44px',
        ...props.style
      }}
    >
      {loading ? (
        <>
          <span aria-hidden="true">⏳</span>
          <span className="sr-only">Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
