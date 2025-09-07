import React, { createContext, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  focusVisible: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void;
  announceToScreenReader: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

const ScreenReaderAnnouncer = styled.div`
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
`;

const FocusSkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 6px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.card};
  padding: 8px;
  z-index: 9999;
  text-decoration: none;
  border-radius: 4px;
  
  &:focus {
    top: 6px;
  }
`;

const HighContrastStyles = styled.div<{ highContrast: boolean }>`
  ${props => props.highContrast && `
    filter: contrast(150%) brightness(110%);
    
    * {
      text-shadow: 0 0 1px currentColor !important;
    }
    
    button, a, input, select, textarea {
      border: 2px solid currentColor !important;
    }
  `}
`;

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reduceMotion: false,
    highContrast: false,
    focusVisible: true,
    screenReaderMode: false,
    keyboardNavigation: true
  });

  const [announcements, setAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    // Check for user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    setSettings(prev => ({
      ...prev,
      reduceMotion: prefersReducedMotion,
      highContrast: prefersHighContrast
    }));

    // Load saved settings
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.warn('Failed to parse accessibility settings');
      }
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Apply CSS classes based on settings
    const body = document.body;
    body.classList.toggle('reduce-motion', settings.reduceMotion);
    body.classList.toggle('high-contrast', settings.highContrast);
    body.classList.toggle('screen-reader-mode', settings.screenReaderMode);
    body.classList.toggle('keyboard-navigation', settings.keyboardNavigation);
  }, [settings]);

  useEffect(() => {
    // Add global CSS for accessibility
    const style = document.createElement('style');
    style.textContent = `
      .reduce-motion *, .reduce-motion *::before, .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      
      .keyboard-navigation *:focus {
        outline: 3px solid #4F46E5 !important;
        outline-offset: 2px !important;
      }
      
      .screen-reader-mode .sr-only {
        position: static !important;
        width: auto !important;
        height: auto !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: visible !important;
        clip: auto !important;
        white-space: normal !important;
      }
      
      @media (forced-colors: active) {
        * {
          forced-color-adjust: none;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const announceToScreenReader = (message: string) => {
    setAnnouncements(prev => [...prev, message]);
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 1000);
  };

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!settings.keyboardNavigation) return;
      
      // Tab trapping for modals
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('[role="dialog"]');
        if (activeModal) {
          const closeButton = activeModal.querySelector('[aria-label="Close"]') as HTMLElement;
          closeButton?.click();
        }
      }
      
      // Skip links
      if (e.key === 'Tab' && !e.shiftKey) {
        const skipLink = document.querySelector('.skip-link') as HTMLElement;
        if (document.activeElement === document.body && skipLink) {
          e.preventDefault();
          skipLink.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation]);

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, announceToScreenReader }}>
      <HighContrastStyles highContrast={settings.highContrast}>
        <FocusSkipLink href="#main-content" className="skip-link">
          Skip to main content
        </FocusSkipLink>
        
        {/* Screen reader announcements */}
        <ScreenReaderAnnouncer aria-live="polite" aria-atomic="true">
          {announcements.map((announcement, index) => (
            <div key={index}>{announcement}</div>
          ))}
        </ScreenReaderAnnouncer>
        
        <div id="main-content">
          {children}
        </div>
      </HighContrastStyles>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

// Accessibility settings panel component
const SettingsPanel = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 80px;
  right: ${props => props.isOpen ? '20px' : '-320px'};
  width: 300px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 1000;
  transition: right 0.3s ease;
  padding: 1rem;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.label`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

const ToggleSwitch = styled.input`
  appearance: none;
  width: 40px;
  height: 20px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:checked {
    background: ${({ theme }) => theme.colors.primary};
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }
  
  &:checked::after {
    transform: translateX(20px);
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.card};
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSetting } = useAccessibility();

  return (
    <>
      <ToggleButton 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle accessibility settings"
        aria-expanded={isOpen}
      >
        ♿
      </ToggleButton>
      
      <SettingsPanel isOpen={isOpen} role="dialog" aria-label="Accessibility Settings">
        <h3>Accessibility Settings</h3>
        
        <SettingItem>
          <SettingLabel htmlFor="reduce-motion">Reduce Motion</SettingLabel>
          <ToggleSwitch
            id="reduce-motion"
            type="checkbox"
            checked={settings.reduceMotion}
            onChange={(e) => updateSetting('reduceMotion', e.target.checked)}
          />
        </SettingItem>
        
        <SettingItem>
          <SettingLabel htmlFor="high-contrast">High Contrast</SettingLabel>
          <ToggleSwitch
            id="high-contrast"
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => updateSetting('highContrast', e.target.checked)}
          />
        </SettingItem>
        
        <SettingItem>
          <SettingLabel htmlFor="screen-reader">Screen Reader Mode</SettingLabel>
          <ToggleSwitch
            id="screen-reader"
            type="checkbox"
            checked={settings.screenReaderMode}
            onChange={(e) => updateSetting('screenReaderMode', e.target.checked)}
          />
        </SettingItem>
        
        <SettingItem>
          <SettingLabel htmlFor="keyboard-nav">Keyboard Navigation</SettingLabel>
          <ToggleSwitch
            id="keyboard-nav"
            type="checkbox"
            checked={settings.keyboardNavigation}
            onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
          />
        </SettingItem>
      </SettingsPanel>
    </>
  );
};
