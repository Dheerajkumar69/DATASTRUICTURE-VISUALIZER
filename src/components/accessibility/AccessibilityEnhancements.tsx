import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import styled, { css } from 'styled-components';

// Accessibility preferences
export interface A11yPreferences {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  focusVisible: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
}

// Accessibility context
interface A11yContextType {
  preferences: A11yPreferences;
  updatePreference: <K extends keyof A11yPreferences>(key: K, value: A11yPreferences[K]) => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  focusManagement: {
    trapFocus: (container: HTMLElement) => () => void;
    restoreFocus: (element: HTMLElement | null) => void;
    getFocusableElements: (container: HTMLElement) => HTMLElement[];
  };
}

const A11yContext = createContext<A11yContextType | null>(null);

// Hook for accessibility features
export const useA11y = (): A11yContextType => {
  const context = useContext(A11yContext);
  if (!context) {
    throw new Error('useA11y must be used within an AccessibilityProvider');
  }
  return context;
};

// Detect user preferences from system
const getSystemPreferences = (): Partial<A11yPreferences> => {
  const preferences: Partial<A11yPreferences> = {};

  // Detect prefers-reduced-motion
  if (window.matchMedia) {
    preferences.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    preferences.highContrast = window.matchMedia('(prefers-contrast: high)').matches;
  }

  return preferences;
};

// Screen reader announcer component
const ScreenReaderAnnouncer: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Array<{ id: string; message: string; priority: 'polite' | 'assertive' }>>([]);

  const addAnnouncement = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const id = `announcement-${Date.now()}-${Math.random()}`;
    setAnnouncements(prev => [...prev, { id, message, priority }]);

    // Remove announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
    }, 3000);
  };

  // Make announcer available globally
  useEffect(() => {
    (window as any).__a11yAnnounce = addAnnouncement;
  }, []);

  return (
    <>
      <SROnly aria-live="polite" aria-atomic="true">
        {announcements.filter(ann => ann.priority === 'polite').map(ann => (
          <div key={ann.id}>{ann.message}</div>
        ))}
      </SROnly>
      <SROnly aria-live="assertive" aria-atomic="true">
        {announcements.filter(ann => ann.priority === 'assertive').map(ann => (
          <div key={ann.id}>{ann.message}</div>
        ))}
      </SROnly>
    </>
  );
};

// Accessibility Provider
interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<A11yPreferences>(() => {
    const stored = localStorage.getItem('a11y-preferences');
    const systemPrefs = getSystemPreferences();
    
    return {
      reduceMotion: false,
      highContrast: false,
      largeText: false,
      focusVisible: true,
      screenReaderMode: false,
      keyboardNavigation: true,
      ...systemPrefs,
      ...(stored ? JSON.parse(stored) : {})
    };
  });

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('a11y-preferences', JSON.stringify(preferences));
    
    // Apply CSS custom properties for accessibility
    const root = document.documentElement;
    root.style.setProperty('--motion-reduce', preferences.reduceMotion ? '1' : '0');
    root.style.setProperty('--high-contrast', preferences.highContrast ? '1' : '0');
    root.style.setProperty('--large-text', preferences.largeText ? '1.2' : '1');
    
    // Add/remove classes for global styling
    document.body.classList.toggle('reduce-motion', preferences.reduceMotion);
    document.body.classList.toggle('high-contrast', preferences.highContrast);
    document.body.classList.toggle('large-text', preferences.largeText);
    document.body.classList.toggle('screen-reader-mode', preferences.screenReaderMode);
  }, [preferences]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQueries = [
      { query: '(prefers-reduced-motion: reduce)', key: 'reduceMotion' as const },
      { query: '(prefers-contrast: high)', key: 'highContrast' as const }
    ];

    const listeners = mediaQueries.map(({ query, key }) => {
      const mediaQuery = window.matchMedia(query);
      const listener = (e: MediaQueryListEvent) => {
        setPreferences(prev => ({ ...prev, [key]: e.matches }));
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    });

    return () => listeners.forEach(cleanup => cleanup());
  }, []);

  const updatePreference = <K extends keyof A11yPreferences>(key: K, value: A11yPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if ((window as any).__a11yAnnounce) {
      (window as any).__a11yAnnounce(message, priority);
    }
  };

  // Focus management utilities
  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors));
  };

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
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
    
    // Focus first element initially
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  };

  const restoreFocus = (element: HTMLElement | null) => {
    if (element && element.focus) {
      element.focus();
    }
  };

  const contextValue: A11yContextType = {
    preferences,
    updatePreference,
    announceToScreenReader,
    focusManagement: {
      trapFocus,
      restoreFocus,
      getFocusableElements
    }
  };

  return (
    <A11yContext.Provider value={contextValue}>
      <ScreenReaderAnnouncer />
      {children}
    </A11yContext.Provider>
  );
};

// Accessible components

// Skip to content link
export const SkipToContent: React.FC<{ targetId: string }> = ({ targetId }) => {
  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SkipLink href={`#${targetId}`} onClick={handleSkip}>
      Skip to main content
    </SkipLink>
  );
};

// Accessible button with proper focus management
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  children: ReactNode;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  children,
  disabled,
  ...props
}) => {
  const { preferences } = useA11y();

  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      reduceMotion={preferences.reduceMotion}
      {...props}
    >
      {isLoading && <span aria-hidden="true">⏳ </span>}
      {children}
      {isLoading && <SROnly>Loading...</SROnly>}
    </StyledButton>
  );
};

// Accessible modal with focus trap
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { focusManagement, announceToScreenReader } = useA11y();
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      announceToScreenReader(`${title} dialog opened`, 'assertive');
      
      if (modalRef.current) {
        const cleanup = focusManagement.trapFocus(modalRef.current);
        return cleanup;
      }
    } else if (previousFocus.current) {
      focusManagement.restoreFocus(previousFocus.current);
      announceToScreenReader('Dialog closed', 'polite');
    }
  }, [isOpen, title, focusManagement, announceToScreenReader]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={e => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle id="modal-title">{title}</ModalTitle>
          <CloseButton
            onClick={onClose}
            aria-label="Close dialog"
            type="button"
          >
            ✕
          </CloseButton>
        </ModalHeader>
        <ModalContent>
          {children}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

// Accessibility preferences panel
export const AccessibilityPanel: React.FC = () => {
  const { preferences, updatePreference } = useA11y();

  return (
    <PreferencesPanel role="region" aria-labelledby="a11y-settings-title">
      <PanelTitle id="a11y-settings-title">Accessibility Settings</PanelTitle>
      
      <PreferenceItem>
        <label>
          <input
            type="checkbox"
            checked={preferences.reduceMotion}
            onChange={e => updatePreference('reduceMotion', e.target.checked)}
          />
          Reduce motion and animations
        </label>
      </PreferenceItem>

      <PreferenceItem>
        <label>
          <input
            type="checkbox"
            checked={preferences.highContrast}
            onChange={e => updatePreference('highContrast', e.target.checked)}
          />
          High contrast mode
        </label>
      </PreferenceItem>

      <PreferenceItem>
        <label>
          <input
            type="checkbox"
            checked={preferences.largeText}
            onChange={e => updatePreference('largeText', e.target.checked)}
          />
          Large text
        </label>
      </PreferenceItem>

      <PreferenceItem>
        <label>
          <input
            type="checkbox"
            checked={preferences.screenReaderMode}
            onChange={e => updatePreference('screenReaderMode', e.target.checked)}
          />
          Screen reader optimizations
        </label>
      </PreferenceItem>
    </PreferencesPanel>
  );
};

// Styled components
const SROnly = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const SkipLink = styled.a`
  position: absolute;
  top: -100px;
  left: 10px;
  z-index: 10000;
  padding: 0.5rem 1rem;
  background: #000;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  
  &:focus {
    top: 10px;
  }
`;

const StyledButton = styled.button<{
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  reduceMotion: boolean;
}>`
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: ${({ reduceMotion }) => reduceMotion ? 'none' : 'all 0.2s ease'};
  position: relative;
  
  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          min-height: 32px;
        `;
      case 'large':
        return css`
          padding: 0.75rem 1.5rem;
          font-size: 1.125rem;
          min-height: 48px;
        `;
      default:
        return css`
          padding: 0.5rem 1rem;
          font-size: 1rem;
          min-height: 40px;
        `;
    }
  }}
  
  ${({ variant }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background: #6c757d;
          color: white;
          &:hover:not(:disabled) { background: #545b62; }
        `;
      case 'danger':
        return css`
          background: #dc3545;
          color: white;
          &:hover:not(:disabled) { background: #c82333; }
        `;
      default:
        return css`
          background: #007bff;
          color: white;
          &:hover:not(:disabled) { background: #0056b3; }
        `;
    }
  }}
  
  &:focus {
    outline: 3px solid #80bdff;
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  // High contrast mode
  @media (prefers-contrast: high) {
    border: 2px solid;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  
  &:focus {
    outline: 2px solid #007bff;
  }
`;

const ModalContent = styled.div`
  padding: 1rem;
`;

const PreferencesPanel = styled.div`
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
`;

const PanelTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
`;

const PreferenceItem = styled.div`
  margin: 0.75rem 0;
  
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
  }
`;

export default AccessibilityProvider;